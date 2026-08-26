import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();
const out = [
  join(cwd, "out"),
  join(cwd, "out", "osaka-kart"),
  join(cwd, ".next-pages"),
].find((dir) => existsSync(dir) && existsSync(join(dir, "en")));

if (!out) {
  throw new Error("Static export folder not found (out or .next-pages)");
}

const portal = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Furture Kart Osaka</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0A0A0F;color:#F1F1F5;font-family:sans-serif}
      .box{display:grid;gap:1rem;text-align:center;padding:1.5rem}
      p{margin:0;letter-spacing:.12em;text-transform:uppercase;font-size:.8rem;color:#9CA3AF}
      a{display:block;padding:.9rem 1.4rem;border-radius:999px;text-decoration:none;font-weight:600}
      .front{background:#FF2D95;color:#fff}
      .admin{border:1px solid #ffffff33;color:#F1F1F5}
    </style>
  </head>
  <body>
    <div class="box">
      <p>Furture Kart Osaka</p>
      <a class="front" href="./zh-TW/index.html">打开前台</a>
      <a class="admin" href="./zh-TW/admin/login/index.html">打开后台</a>
    </div>
  </body>
</html>
`;

const adminRedirect = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=../zh-TW/admin/login/index.html" />
    <link rel="canonical" href="../zh-TW/admin/login/index.html" />
    <title>Furture Kart Admin</title>
  </head>
  <body>
    <a href="../zh-TW/admin/login/index.html">打开后台</a>
  </body>
</html>
`;

const zhHansRedirect = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=../zh-TW/index.html" />
    <link rel="canonical" href="../zh-TW/index.html" />
    <title>Furture Kart Osaka</title>
  </head>
  <body>
    <a href="../zh-TW/index.html">繁體中文</a>
  </body>
</html>
`;

writeFileSync(join(out, "index.html"), portal);
writeFileSync(join(out, "404.html"), portal);
writeFileSync(join(out, ".nojekyll"), "");
mkdirSync(join(out, "admin"), { recursive: true });
writeFileSync(join(out, "admin", "index.html"), adminRedirect);
mkdirSync(join(out, "zh-CN"), { recursive: true });
writeFileSync(join(out, "zh-CN", "index.html"), zhHansRedirect);
console.log("GitHub Pages fallback files written (front + admin)");
