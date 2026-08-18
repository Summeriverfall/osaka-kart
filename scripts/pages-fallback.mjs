import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();
const out = [join(cwd, "out"), join(cwd, ".next-pages")].find(
  (dir) => existsSync(dir) && existsSync(join(dir, "en")),
);

if (!out) {
  throw new Error("Static export folder not found (out or .next-pages)");
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=./en/" />
    <link rel="canonical" href="./en/" />
    <title>Furture Kart Osaka</title>
  </head>
  <body>
    <a href="./en/">Enter Furture Kart Osaka</a>
  </body>
</html>
`;

const zhHansRedirect = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=../zh-TW/" />
    <link rel="canonical" href="../zh-TW/" />
    <title>Furture Kart Osaka</title>
  </head>
  <body>
    <a href="../zh-TW/">繁體中文</a>
  </body>
</html>
`;

writeFileSync(join(out, "index.html"), html);
writeFileSync(join(out, "404.html"), html);
writeFileSync(join(out, ".nojekyll"), "");
mkdirSync(join(out, "zh-CN"), { recursive: true });
writeFileSync(join(out, "zh-CN", "index.html"), zhHansRedirect);
console.log("GitHub Pages fallback files written");
