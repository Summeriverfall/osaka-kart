import fs from "node:fs";
import path from "node:path";
import { portalHtml } from "./portal-html.mjs";

const out = path.resolve("out");

function paletteBootScript() {
  return `<script data-palette-boot>(function(){var k="fk-acid-palette-v2";var d="pace";try{localStorage.setItem(k,d)}catch(e){}var path=location.pathname.replace(/\\\\/g,"/");var onAcid=/\\/acid(\\/|$)/.test(path)||/\\/acid\\/index\\.html$/i.test(path);if(!onAcid){try{onAcid=localStorage.getItem("furture-kart-look")==="acid"}catch(e){}}if(!onAcid)return;document.documentElement.setAttribute("data-acid-palette",d)})();</script>`;
}

function writePortal() {
  fs.writeFileSync(path.resolve("打开网站.html"), portalHtml({ prefix: "out/", local: true }));
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
  function hasLocalePrefix(rel){
    return LOCALES.some(function(item){ return rel === item || rel.indexOf(item + "/") === 0; });
  }
  function root(){
    var href = location.href.split("#")[0].split("?")[0].replace(/\\\\/g,"/");
    var adminIdx = href.search(/\\/admin\\/(en|ja|zh-TW|ko)\\//);
    if (adminIdx >= 0) return href.slice(0, adminIdx + 1);
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
    var adminLoc = s.match(/\\/admin\\/(en|ja|zh-TW|ko)\\/[^\\s]*/);
    var loc = s.match(/\\/(en|ja|zh-TW|ko)\\/[^\\s]*/);
    var lang = document.documentElement.lang || "zh-TW";
    var rel;
    if (s.charAt(0) === "/" || /^[A-Za-z]:\\//.test(s) || /^file:\\/\\/\\/[A-Za-z]:\\/(en|ja|zh-TW|ko)\\//i.test(s)) {
      if (adminLoc) rel = adminLoc[0].replace(/^\\//, "");
      else if (loc) rel = loc[0].replace(/^\\//, "");
      else {
        rel = s.replace(/^[A-Za-z]:\\//, "").replace(/^file:\\/\\/\\/[A-Za-z]:\\//i, "").replace(/^\\//, "");
        if (rel === "admin" || rel.indexOf("admin/") === 0) {
          var rest = rel === "admin" ? "" : rel.slice(6);
          if (!hasLocalePrefix(rest)) rel = "admin/" + lang.replace(/^\\//, "") + (rest ? "/" + rest : "");
        } else if (!hasLocalePrefix(rel)) {
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
  history.pushState = function(s, t, u){
    if (!u) return push(s, t, u);
    try { return push(s, t, toHtml(u)); } catch (err) {
      try { return push(s, t, u); } catch (err2) { return; }
    }
  };
  history.replaceState = function(s, t, u){
    if (!u) return repl(s, t, u);
    try { return repl(s, t, toHtml(u)); } catch (err) {
      try { return repl(s, t, u); } catch (err2) { return; }
    }
  };
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
      /(\shref=["'])\/admin\/(en|ja|zh-TW|ko)(\/[^"'?#]*)?(\?[^"'#]*)?(#[^"']*)?(["'])/g,
      (_, start, loc, rest = "/", query = "", hash = "", end) => {
        const page = `admin/${loc}${rest || "/"}`.replace(/\/?$/, "/");
        return `${start}${prefix}${page}index.html${query}${hash}${end}`;
      },
    )
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

writeLauncher(path.join(out, "打开后台.html"), "打开 Future Kart 后台", "admin/zh-TW/login/index.html");
writeLauncher(path.join(out, "打开前台.html"), "打开 Future Kart 前台", "zh-TW/index.html");

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
  外观文件夹：neon 霓虹、acid 竞速、oni 街道
  快捷入口：打开前台.html
  可读样式：styles/front/
    shared.css  三套外观共用
    neon.css    霓虹
    acid.css    竞速
    oni.css     街道

后台（给店员用）
  admin/zh-TW/ （登录在 admin/zh-TW/login）
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
