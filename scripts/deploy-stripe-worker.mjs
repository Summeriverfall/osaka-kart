import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

function loadLocalEnv() {
  const file = resolve(".env.local");
  if (!existsSync(file)) throw new Error("missing .env.local");
  const map = {};
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    map[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return map;
}

const env = loadLocalEnv();
const secret = env.STRIPE_SECRET_KEY || "";
if (!/^(sk|rk)_(test|live)_/.test(secret)) throw new Error("bad stripe secret");

const localConfig = resolve("wrangler.local.toml");
writeFileSync(
  localConfig,
  `name = "osaka-kart-stripe"
main = "workers/stripe.js"
compatibility_date = "2026-09-15"
workers_dev = true

[vars]
STRIPE_SECRET_KEY = ${JSON.stringify(secret)}
`,
);

function run() {
  return new Promise((ok, fail) => {
    const child = spawn("npx", ["wrangler", "deploy", "--temporary", "--config", "wrangler.local.toml"], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });
    let out = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      out += text;
      process.stdout.write(text.replaceAll(secret, "sk_***"));
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      out += text;
      process.stderr.write(text.replaceAll(secret, "sk_***"));
    });
    child.on("exit", (code) => {
      try {
        unlinkSync(localConfig);
      } catch {
        /* ignore */
      }
      if (code) fail(new Error(`wrangler exited ${code}`));
      else ok(out);
    });
  });
}

const log = await run();
const live = log.match(/https:\/\/[a-z0-9.-]+\.workers\.dev/i);
const claim = log.match(/https:\/\/dash\.cloudflare\.com\/claim-preview[^\s]+/i);
if (live) console.log(`LIVE_URL=${live[0]}`);
if (claim) console.log(`CLAIM_URL=${claim[0]}`);
