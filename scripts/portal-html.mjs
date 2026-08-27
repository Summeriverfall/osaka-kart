/** Shared look-picker used by local 打开网站.html and GitHub Pages out/index.html. */
export function portalHtml({ prefix = "out/", local = true } = {}) {
  const p = prefix.endsWith("/") ? prefix : `${prefix}/`;
  const kicker = local ? "Local preview" : "Choose a look";
  const title = local ? "Future Kart · 本地入口" : "Future Kart Osaka";
  const lead = local
    ? "双击这一页选入口。三套外观：霓虹、街道、竞速。竞速配色已定稿为「节奏」，从预约 / 语言切回去也还是这一套。"
    : "选一个入口进站。三套外观：霓虹、街道、竞速。竞速配色已定稿为「节奏」。";
  const href = (path, query = "") =>
    local ? `${p}${path}/index.html${query}` : `${p}${path}/${query}`;

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
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
      <p class="kicker">${kicker}</p>
      <h1>Future Kart Osaka</h1>
      <p class="lead">${lead}</p>
      <div class="row">
        <a class="btn front" href="${href("zh-TW")}">打开前台</a>
        <a class="btn admin" href="${href("zh-TW/admin/login")}">打开后台</a>
      </div>
      <h2>外观</h2>
      <div class="looks">
        <a class="look ln" href="${href("zh-TW/neon")}"><strong>霓虹</strong><small>粉紫夜街</small></a>
        <a class="look la" href="${href("zh-TW/acid", "?palette=pace")}"><strong>竞速</strong><small>发车格 · 节奏</small></a>
        <a class="look lo" href="${href("zh-TW/oni")}"><strong>街道</strong><small>难波街头</small></a>
      </div>
    </div>
  </body>
</html>
`;
}
