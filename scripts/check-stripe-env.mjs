import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const text = readFileSync(resolve(".env.local"), "utf8");
const rows = [];
for (const raw of text.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  if (i < 0) continue;
  const key = line.slice(0, i).trim();
  const value = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
  rows.push({ key, value });
}

function check(key, re, optional = false) {
  const row = rows.find((item) => item.key === key);
  if (!row || !row.value) {
    console.log(`${key}: ${optional ? "empty (ok for now)" : "MISSING"}`);
    return;
  }
  const ok = re.test(row.value);
  console.log(`${key}: ${ok ? "ok" : "bad-prefix"} len=${row.value.length} prefix=${row.value.slice(0, 8)}`);
}

check("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", /^pk_(test|live)_/);
check("STRIPE_SECRET_KEY", /^(sk|rk)_(test|live)_/);
check("STRIPE_WEBHOOK_SECRET", /^whsec_/, true);
