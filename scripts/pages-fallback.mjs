import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { portalHtml } from "./portal-html.mjs";

const cwd = process.cwd();
const out = [
  join(cwd, "out"),
  join(cwd, "out", "osaka-kart"),
  join(cwd, ".next-pages"),
].find((dir) => existsSync(dir) && existsSync(join(dir, "en")));

if (!out) {
  throw new Error("Static export folder not found (out or .next-pages)");
}

const pages = process.env.GITHUB_PAGES === "true";
const portal = portalHtml({
  prefix: pages ? "/osaka-kart/" : "./",
  local: false,
});

const adminRedirect = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=zh-TW/login/index.html" />
    <link rel="canonical" href="zh-TW/login/index.html" />
    <title>Future Kart Admin</title>
  </head>
  <body>
    <a href="zh-TW/login/index.html">打开后台</a>
  </body>
</html>
`;

const zhHansRedirect = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=../zh-TW/index.html" />
    <link rel="canonical" href="../zh-TW/index.html" />
    <title>Future Kart Osaka</title>
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
