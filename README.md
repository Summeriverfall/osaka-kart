# Furture Kart Osaka

大阪公道卡丁车独立站。四语：English / 日本語 / 繁體中文 / 한국어。

线上：https://summeriverfall.github.io/osaka-kart/

## 怎么打开

- 本地开发：`npm install` 后 `npm run dev`，打开 http://localhost:3000/zh-TW/
- 双击看静态站：先 `npm run build`，再打开 **`打开网站.html`**

## 根目录怎么看

给人看的只有这几样：

| 位置 | 是什么 |
|---|---|
| `打开网站.html` | 双击打开前台 / 后台 |
| `src/` | **网站源码，改这里** |
| `public/` | 图片和视频 |
| `notes/` | 备忘（不进 git） |
| `out/` | `npm run build` 生成的网页，不要手改 |
| `scripts/` | 构建脚本 |
| `supabase/` | 数据库 |

`node_modules/`、`.next/` 和各种 `.json` / `.ts` 配置是给电脑用的，一般不用点。
