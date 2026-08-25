import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve("public/images");
const MAX_BYTES = 100 * 1024;
const MAX_EDGE = 1280;
const SKIP_DIRS = new Set(["docs"]);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full, acc);
      continue;
    }
    acc.push(full);
  }
  return acc;
}

function stemOf(file) {
  return path.basename(file, path.extname(file)).toLowerCase();
}

function scoreSource(meta) {
  const edge = Math.max(meta.width || 0, meta.height || 0);
  if (edge < 400) return edge / 10;
  if (edge >= 600 && edge <= 1600) return 4000 + edge;
  if (edge <= 2100) return 2000 + edge;
  return 1000;
}

async function pickSource(files) {
  const ranked = [];
  for (const file of files) {
    try {
      const meta = await sharp(fs.readFileSync(file), { failOn: "none" }).metadata();
      ranked.push({ file, meta, score: scoreSource(meta) });
    } catch {
      /* skip unreadable */
    }
  }
  ranked.sort((a, b) => b.score - a.score || (b.meta.width || 0) * (b.meta.height || 0) - (a.meta.width || 0) * (a.meta.height || 0));
  return ranked[0];
}

async function encode(buffer, { maxEdge, quality, flatten }) {
  let image = sharp(buffer, { failOn: "none" }).rotate();
  const meta = await image.metadata();
  if (flatten && meta.hasAlpha) {
    image = image.flatten({ background: "#111111" });
  }
  return image
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toBuffer();
}

async function compressToLimit(sourceBuf) {
  const edges = [MAX_EDGE, 1080, 960, 800, 640];
  const flattenModes = [false, true];
  let best = null;
  for (const flatten of flattenModes) {
    for (const maxEdge of edges) {
      for (let quality = 82; quality >= 42; quality -= 6) {
        const out = await encode(sourceBuf, { maxEdge, quality, flatten });
        if (!best || out.length < best.length) best = out;
        if (out.length <= MAX_BYTES) return out;
      }
    }
  }
  return best;
}

const files = walk(ROOT);
const groups = new Map();
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;
  const key = path.join(path.dirname(file), stemOf(file));
  const list = groups.get(key) ?? [];
  list.push(file);
  groups.set(key, list);
}

let failed = 0;
for (const [key, list] of groups) {
  const picked = await pickSource(list);
  if (!picked) {
    console.error("skip", key);
    failed += 1;
    continue;
  }
  const dest = `${key}.webp`;
  const out = await compressToLimit(fs.readFileSync(picked.file));
  const meta = await sharp(out).metadata();
  fs.writeFileSync(dest, out);
  const kb = (out.length / 1024).toFixed(1);
  const mark = out.length <= MAX_BYTES ? "ok" : "OVER";
  console.log(
    `${mark}\t${kb}KB\t${meta.width}x${meta.height}\t${path.relative(ROOT, dest)}\tfrom ${path.relative(ROOT, picked.file)}`,
  );
  if (out.length > MAX_BYTES) failed += 1;
}

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
  fs.unlinkSync(file);
  console.log("removed\t" + path.relative(ROOT, file));
}

if (failed) {
  console.error(`done with ${failed} over-limit or skipped files`);
  process.exit(1);
}
console.log("done");
