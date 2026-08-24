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
