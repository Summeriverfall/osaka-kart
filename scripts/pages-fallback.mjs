import { writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "out");
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=./en/" />
    <link rel="canonical" href="./en/" />
    <title>OSAKA KART</title>
  </head>
  <body>
    <a href="./en/">Enter OSAKA KART</a>
  </body>
</html>
`;

writeFileSync(join(out, "index.html"), html);
writeFileSync(join(out, "404.html"), html);
writeFileSync(join(out, ".nojekyll"), "");
console.log("GitHub Pages fallback files written");
