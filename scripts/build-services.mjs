import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { readdirSync } from "node:fs";

const cwd = process.cwd();
const base = "/services/osaka-kart";
const out = join(cwd, "out");
const dist = join(cwd, "deploy-services");

function run(command, args, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      cwd,
      env: { ...process.env, ...extraEnv },
    });
    child.on("exit", (code) => {
      if (code) reject(new Error(`${command} exited ${code}`));
      else resolve();
    });
  });
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function rmNamed(root, names) {
  for (const name of names) {
    const target = join(root, name);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  }
}

function rmDeepNamed(root, names) {
  const set = new Set(names);
  function visit(dir) {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, name.name);
      if (set.has(name.name)) {
        rmSync(full, { recursive: true, force: true });
        continue;
      }
      if (name.isDirectory()) visit(full);
    }
  }
  visit(root);
}

const portal = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Future Kart Osaka</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; background: #09090c; color: #f1f1f5; font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; }
      .wrap { max-width: 720px; margin: 0 auto; padding: 2.2rem 1.2rem 3rem; }
      .kicker { margin: 0; font-size: .72rem; letter-spacing: .18em; color: #9aa0b3; }
      h1 { margin: .35rem 0 0; font-size: 1.55rem; font-weight: 650; }
      .lead { margin: .55rem 0 0; color: #b7bccd; font-size: .92rem; line-height: 1.55; }
      .row { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.2rem; }
      .btn { display: inline-flex; align-items: center; justify-content: center; padding: .72rem 1.15rem; border-radius: 999px; text-decoration: none; font-weight: 650; font-size: .92rem; }
      .front { background: #ff2d95; color: #fff; }
      .admin { border: 1px solid #ffffff33; color: #f1f1f5; }
      .doc { border: 1px solid #ff2d9555; color: #ffd0e6; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <p class="kicker">Future Kart Osaka</p>
      <h1>选一个入口</h1>
      <p class="lead">演示站。前台给客人看，后台给店员练手。操作说明请先打开手册。</p>
      <p class="lead"><a href="https://maps.app.goo.gl/wLwUcA8YABaQCB6p8" style="color:#ffd0e6">〒542-0072 大阪府大阪市中央区高津2丁目4-21 おおきに道頓堀ビル</a></p>
      <div class="row">
        <a class="btn front" href="./zh-TW/">打开前台</a>
        <a class="btn admin" href="./admin/zh-TW/login/">打开后台</a>
        <a class="btn doc" href="./manual.html">操作手册</a>
      </div>
    </div>
  </body>
</html>
`;

const adminRedirect = `<!doctype html>
<html lang="zh-TW"><head><meta charset="utf-8" /><meta http-equiv="refresh" content="0;url=zh-TW/login/" /><title>Admin</title></head>
<body><a href="zh-TW/login/">打开后台</a></body></html>
`;

await run("npx", ["next", "build"], {
  SITE_BASE: base,
  NEXT_PUBLIC_BASE_PATH: base,
  GITHUB_PAGES: "",
});

rmDeepNamed(out, ["neon", "oni", "acid", "glitch", "looks", "plan-ideas"]);
rmNamed(join(out, "videos"), ["hero-bg.mp4", "street-run.mp4"]);
for (const file of walk(out)) {
  if (file.endsWith(".txt") || file.endsWith(".map")) rmSync(file, { force: true });
}
for (const file of walk(join(out, "admin"))) {
  const name = file.split(/[/\\]/).slice(-2, -1)[0] || "";
  if (/^(FK|SK|UM)-/.test(name) || /^af-/.test(name)) {
    const dir = file.replace(/[/\\][^/\\]+$/, "");
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  }
}

writeFileSync(join(out, "index.html"), portal);
writeFileSync(join(out, "404.html"), portal);
mkdirSync(join(out, "admin"), { recursive: true });
writeFileSync(join(out, "admin", "index.html"), adminRedirect);

const manual = readFileSync(join(cwd, "操作手册.txt"), "utf8");
const manualHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Future Kart · 操作手册</title>
  <style>
    body { margin: 0; background: #111214; color: #f3f3f6; font: 16px/1.65 "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; }
    .wrap { max-width: 720px; margin: 0 auto; padding: 2rem 1.1rem 3rem; }
    a { color: #ff7ab8; }
    pre { white-space: pre-wrap; word-break: break-word; margin: 0; font: inherit; }
    .back { display: inline-block; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <a class="back" href="./">返回入口</a>
    <pre>${manual.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre>
  </div>
</body>
</html>
`;
writeFileSync(join(out, "manual.html"), manualHtml);
writeFileSync(join(out, "操作手册.txt"), manual);

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(out, dist, { recursive: true });

const files = walk(dist);
let bytes = 0;
for (const file of files) bytes += statSync(file).size;
console.log(`services export ready: ${files.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB → ${relative(cwd, dist)}`);
