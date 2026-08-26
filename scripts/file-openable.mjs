import fs from "node:fs";
import path from "node:path";

const out = path.resolve("out");

function paletteBootScript() {
  return `<script data-palette-boot>(function(){var k="fk-acid-palette-v2";var d="pace";try{localStorage.setItem(k,d)}catch(e){}var path=location.pathname.replace(/\\\\/g,"/");var onAcid=/\\/acid(\\/|$)/.test(path)||/\\/acid\\/index\\.html$/i.test(path);if(!onAcid){try{onAcid=localStorage.getItem("furture-kart-look")==="acid"}catch(e){}}if(!onAcid)return;document.documentElement.setAttribute("data-acid-palette",d)})();</script>`;
}

function writePortal() {
  const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Furture Kart · 本地入口</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        background: #09090c;
        color: #f1f1f5;
        font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      }
      .wrap { max-width: 920px; margin: 0 auto; padding: 2.2rem 1.2rem 3rem; }
      .kicker { margin: 0; font-size: .72rem; letter-spacing: .18em; color: #9aa0b3; text-transform: uppercase; }
      h1 { margin: .35rem 0 0; font-size: 1.55rem; font-weight: 650; letter-spacing: .04em; }
      .lead { margin: .55rem 0 0; color: #b7bccd; font-size: .92rem; line-height: 1.55; }
      .row { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.2rem; }
      .btn {
        display: inline-flex; align-items: center; justify-content: center;
        padding: .72rem 1.15rem; border-radius: 999px; text-decoration: none; font-weight: 650; font-size: .92rem;
      }
      .front { background: #ff2d95; color: #fff; }
      .admin { border: 1px solid #ffffff33; color: #f1f1f5; }
      h2 { margin: 2rem 0 .7rem; font-size: .8rem; letter-spacing: .16em; text-transform: uppercase; color: #9aa0b3; font-weight: 650; }
      .looks { display: grid; gap: .75rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .look {
        display: grid; gap: .45rem; padding: .9rem .95rem 1rem;
        border-radius: 16px; text-decoration: none; color: inherit;
        border: 1px solid #ffffff18; min-height: 96px;
      }
      .look:hover { border-color: #ffffff44; transform: translateY(-1px); }
      .look small { font-style: normal; font-size: .78rem; line-height: 1.4; opacity: .78; }
      .look strong { font-size: 1.02rem; }
      .ln { background: linear-gradient(160deg, #1a0b16, #0d0d14); }
      .la { background: linear-gradient(160deg, #0c0f14, #161010); }
      .lo { background: linear-gradient(160deg, #140e0a, #1a1210); }
      @media (max-width: 640px) {
        .looks { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <p class="kicker">Local preview</p>
      <h1>Furture Kart Osaka</h1>
      <p class="lead">双击这一页选入口。酸街已定稿为「节奏」配色，从预约 / 语言切回去也还是这一套，不会跳到旧的酒红或青苔。</p>
      <div class="row">
        <a class="btn front" href="out/zh-TW/index.html">打开前台</a>
        <a class="btn admin" href="out/zh-TW/admin/login/index.html">打开后台</a>
      </div>
      <h2>外观</h2>
      <div class="looks">
        <a class="look ln" href="out/zh-TW/neon/index.html"><strong>霓虹</strong><small>粉紫夜街</small></a>
        <a class="look la" href="out/zh-TW/acid/index.html?palette=pace"><strong>酸街</strong><small>发车格 · 节奏</small></a>
        <a class="look lo" href="out/zh-TW/oni/index.html"><strong>鬼街</strong><small>裂帛和风</small></a>
      </div>
    </div>
  </body>
</html>
`;
  fs.writeFileSync(path.resolve("打开网站.html"), html);
}

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

const FILE_BOOT = `<script data-file-boot>(function(){
  if (location.protocol !== "file:") return;
  var LOCALES = ["en","ja","zh-TW","ko"];
  function root(){
    var href = location.href.split("#")[0].split("?")[0].replace(/\\\\/g,"/");
    for (var i=0;i<LOCALES.length;i++){
      var n = "/" + LOCALES[i] + "/";
      var idx = href.lastIndexOf(n);
      if (idx >= 0) return href.slice(0, idx + 1);
    }
    return href.replace(/\\/[^/]*$/, "/");
  }
  function toHtml(url){
    if (url == null || url === "") return url;
    var s = String(url);
    if (s.charAt(0) === "#" || /^(mailto:|tel:|javascript:|https?:)/i.test(s)) return s;
    s = s.replace(/index\\.txt/gi, "index.html");
    var loc = s.match(/\\/(en|ja|zh-TW|ko)\\/[^\\s]*/);
    var lang = document.documentElement.lang || "zh-TW";
    var rel;
    if (s.charAt(0) === "/" || /^[A-Za-z]:\\//.test(s) || /^file:\\/\\/\\/[A-Za-z]:\\/(en|ja|zh-TW|ko)\\//i.test(s)) {
      if (loc) rel = loc[0].replace(/^\\//, "");
      else {
        rel = s.replace(/^[A-Za-z]:\\//, "").replace(/^file:\\/\\/\\/[A-Za-z]:\\//i, "").replace(/^\\//, "");
        if (!LOCALES.some(function(item){ return rel === item || rel.indexOf(item + "/") === 0; })) {
          rel = lang.replace(/^\\//, "") + "/" + rel;
        }
      }
      rel = rel.replace(/^\\/+/, "");
      if (!/\\.[a-z0-9]+([?#]|$)/i.test(rel)) rel = rel.replace(/\\/?$/, "/") + "index.html";
      rel = rel.replace(/index\\.txt/gi, "index.html");
      return root() + rel;
    }
    return s;
  }
  var hrefDesc = Object.getOwnPropertyDescriptor(Location.prototype, "href");
  var assign = Location.prototype.assign.bind(location);
  var replace = Location.prototype.replace.bind(location);
  function go(url){ assign(toHtml(url)); }
  try {
    Object.defineProperty(location, "href", {
      configurable: true,
      get: function(){ return hrefDesc.get.call(location); },
      set: function(v){ hrefDesc.set.call(location, toHtml(v)); }
    });
  } catch (e) {}
  location.assign = function(v){ go(v); };
  location.replace = function(v){ replace(toHtml(v)); };
  var push = history.pushState.bind(history);
  var repl = history.replaceState.bind(history);
  history.pushState = function(s, t, u){ if (u) { go(u); return; } return push(s, t, u); };
  history.replaceState = function(s, t, u){ if (u) { go(u); return; } return repl(s, t, u); };
  document.addEventListener("click", function(e){
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest && e.target.closest("a");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|javascript:|https?:)/i.test(href)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    go(href);
  }, true);
})();</script>`;

function rewriteHtml(content, prefix) {
  let html = content
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
  if (!html.includes("data-palette-boot")) {
    html = html.replace(/<head[^>]*>/i, (m) => `${m}${paletteBootScript()}`);
  }
  if (!html.includes("data-file-boot")) {
    html = html.replace(/<head[^>]*>/i, (m) => `${m}${FILE_BOOT}`);
  }
  return html;
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
    fs.writeFileSync(file, after);
    if (after !== before) htmlCount += 1;
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

function copyReadableStyles() {
  const frontSrc = path.resolve("src/styles/front");
  const adminSrc = path.resolve("src/styles/admin");
  const frontDest = path.join(out, "styles", "front");
  const adminDest = path.join(out, "styles", "admin");
  fs.mkdirSync(frontDest, { recursive: true });
  fs.mkdirSync(adminDest, { recursive: true });
  for (const name of ["shared.css", "neon.css", "acid.css", "oni.css", "legacy.css", "index.css"]) {
    fs.copyFileSync(path.join(frontSrc, name), path.join(frontDest, name));
  }
  fs.copyFileSync(path.join(adminSrc, "admin.css"), path.join(adminDest, "admin.css"));
  fs.copyFileSync(path.join(adminSrc, "inventory.css"), path.join(adminDest, "inventory.css"));
  fs.writeFileSync(
    path.join(out, "说明.txt"),
    `这个 out 是生成好的网站。不要手改 html / _next。

前台（给客人看）
  zh-TW / en / ja / ko
  外观文件夹：neon 霓虹、acid 酸街、oni 鬼街
  快捷入口：打开前台.html
  可读样式：styles/front/
    shared.css  三套外观共用
    neon.css    霓虹
    acid.css    酸街
    oni.css     鬼街

后台（给店员用）
  zh-TW/admin/ （登录在 admin/login）
  快捷入口：打开后台.html
  可读样式：styles/admin/
    admin.css       操作台
    inventory.css   库存表

页面真正加载的打包样式在 _next/static/css，改外观请改 src/styles 再 npm run build。
`,
  );
}

copyReadableStyles();

writePortal();

console.log(`已改成可双击打开：HTML ${htmlCount}，CSS ${cssCount}，JS ${jsCount}`);
console.log("入口：打开网站.html");
