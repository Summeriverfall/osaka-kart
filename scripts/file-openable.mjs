import fs from "node:fs";
import path from "node:path";

const out = path.resolve("out");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function depthFromOut(file) {
  const rel = path.relative(out, path.dirname(file));
  if (!rel || rel === ".") return 0;
  return rel.split(path.sep).filter(Boolean).length;
}

function prefixFor(file) {
  const depth = depthFromOut(file);
  return depth === 0 ? "./" : "../".repeat(depth);
}

function rewriteHtml(content, prefix) {
  return content
    .replace(/(["'(])\/_next\//g, `$1${prefix}_next/`)
    .replace(/(["'(])\/favicon\.ico/g, `$1${prefix}favicon.ico`)
    .replace(/(\s(?:src|poster|href)=["'])\/(images|videos)\//g, `$1${prefix}$2/`)
    .replace(
      /(\shref=["'])\/(en|ja|zh-TW|ko)(\/[^"'?#]*)?(\?[^"'#]*)?(#[^"']*)?(["'])/g,
      (_, start, loc, rest = "/", query = "", hash = "", end) => {
        const page = `${loc}${rest || "/"}`.replace(/\/?$/, "/");
        return `${start}${prefix}${page}index.html${query}${hash}${end}`;
      },
    );
}

function rewriteCss(content) {
  return content.replace(/\/_next\/static\//g, "../");
}

const webpackPublicPath = `r.p=(function(){try{var s=document.currentScript&&document.currentScript.src;if(!s){var n=document.querySelectorAll("script[src]");for(var i=n.length-1;i>=0;i--){if(n[i].src&&n[i].src.indexOf("static/chunks/")!==-1){s=n[i].src;break}}}if(!s)return"./";return s.replace(/static\\/chunks\\/[^/]+$/,"")}catch(e){return"./"}})()`;

function writeLauncher(file, title, href) {
  const html = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=${href}" />
    <title>${title}</title>
  </head>
  <body style="font-family:sans-serif;padding:2rem;background:#0A0A0F;color:#F1F1F5">
    <p><a href="${href}" style="color:#FF2D95">${title}</a></p>
  </body>
</html>
`;
  fs.writeFileSync(file, html);
}

if (!fs.existsSync(out)) {
  console.error("out/ 不存在，请先 npm run build");
  process.exit(1);
}

const files = walk(out);
let htmlCount = 0;
let cssCount = 0;
let jsCount = 0;

for (const file of files) {
  const ext = path.extname(file);
  if (ext === ".html") {
    const before = fs.readFileSync(file, "utf8");
    const after = rewriteHtml(before, prefixFor(file));
    if (after !== before) {
      fs.writeFileSync(file, after);
      htmlCount += 1;
    }
  } else if (ext === ".css") {
    const before = fs.readFileSync(file, "utf8");
    const after = rewriteCss(before);
    if (after !== before) {
      fs.writeFileSync(file, after);
      cssCount += 1;
    }
  } else if (ext === ".js" && file.includes(`${path.sep}chunks${path.sep}`)) {
    const before = fs.readFileSync(file, "utf8");
    if (before.includes('r.p="/_next/"')) {
      fs.writeFileSync(file, before.replace('r.p="/_next/"', webpackPublicPath));
      jsCount += 1;
    }
  }
}

writeLauncher(path.join(out, "打开后台.html"), "打开 Furture Kart 后台", "zh-TW/admin/login/index.html");
writeLauncher(path.join(out, "打开前台.html"), "打开 Furture Kart 前台", "zh-TW/index.html");
writeLauncher(path.resolve("打开后台.html"), "打开 Furture Kart 后台", "out/zh-TW/admin/login/index.html");
writeLauncher(path.resolve("打开前台.html"), "打开 Furture Kart 前台", "out/zh-TW/index.html");

const portal = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8" />
    <title>Furture Kart Osaka</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0A0A0F;color:#F1F1F5;font-family:sans-serif}
      .box{display:grid;gap:1rem;text-align:center}
      a{display:block;padding:.9rem 1.4rem;border-radius:999px;text-decoration:none;font-weight:600}
      .front{background:#FF2D95;color:#fff}
      .admin{border:1px solid #ffffff33;color:#F1F1F5}
    </style>
  </head>
  <body>
    <div class="box">
      <p>Furture Kart Osaka</p>
      <a class="front" href="out/zh-TW/index.html">打开前台</a>
      <a class="admin" href="out/zh-TW/admin/login/index.html">打开后台</a>
    </div>
  </body>
</html>
`;
fs.writeFileSync(path.resolve("打开网站.html"), portal);

console.log(`已改成可双击打开：HTML ${htmlCount}，CSS ${cssCount}，JS ${jsCount}`);
console.log("入口：打开前台.html / 打开后台.html / 打开网站.html");
