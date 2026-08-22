import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const port = Number(process.env.PORT || 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

if (!fs.existsSync(path.join(root, "index.html")) && !fs.existsSync(path.join(root, "en"))) {
  console.error("还没有静态页。请先运行：npm run build");
  process.exit(1);
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0].split("#")[0]);
  const rel = decoded.replace(/^\/+/, "");
  const full = path.normalize(path.join(root, rel));
  if (!full.startsWith(root)) return null;

  const candidates = [];
  if (!path.extname(full)) {
    candidates.push(path.join(full, "index.html"));
    candidates.push(`${full}.html`);
  }
  candidates.push(full);
  return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) ?? null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url);
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const ext = path.extname(file);
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`静态页已就绪：http://localhost:${port}/zh-TW/admin/login/`);
});
