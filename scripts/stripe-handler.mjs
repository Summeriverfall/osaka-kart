import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Stripe from "stripe";

const PLAN_JPY = {
  sunset: 5000,
  standard: 12800,
  "night-run": 15800,
  "grand-tour": 18800,
  "vip-night": 15000,
};

const ADDON_JPY = {
  gopro: 2500,
  costume: 1000,
  photos: 3000,
  insurance: 500,
};

function loadLocalEnv() {
  const file = resolve(".env.local");
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadLocalEnv();

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!/^(sk|rk)_(test|live)_/.test(key)) {
    throw new Error("missing-secret");
  }
  return new Stripe(key);
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function send(res, status, body) {
  cors(res);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 200_000) {
        reject(new Error("too-large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8") || "{}";
        resolveBody(JSON.parse(raw));
      } catch {
        reject(new Error("bad-json"));
      }
    });
    req.on("error", reject);
  });
}

function moneyOf(planSlug, riders, addons) {
  const base = PLAN_JPY[planSlug];
  if (!base) return 0;
  const count = Math.min(8, Math.max(1, Math.floor(Number(riders) || 1)));
  let total = base * count;
  const lines = [
    {
      price_data: {
        currency: "jpy",
        product_data: { name: `Kart plan ${planSlug}` },
        unit_amount: base,
      },
      quantity: count,
    },
  ];
  for (const item of addons) {
    const price = ADDON_JPY[item.slug];
    const qty = Math.min(8, Math.max(0, Math.floor(Number(item.qty) || 0)));
    if (!price || qty <= 0) continue;
    total += price * qty;
    lines.push({
      price_data: {
        currency: "jpy",
        product_data: { name: item.name || item.slug },
        unit_amount: price,
      },
      quantity: qty,
    });
  }
  return { total, lines };
}

function addonsFrom(body) {
  if (Array.isArray(body.addons) && body.addons.length) {
    return body.addons.map((item) => ({
      slug: String(item.slug || ""),
      qty: item.qty,
      name: String(item.name || item.slug || ""),
    }));
  }
  const slugs = Array.isArray(body.addonSlugs) ? body.addonSlugs : [];
  const qty = new Map();
  for (const slug of slugs) {
    const key = String(slug || "");
    if (!key) continue;
    qty.set(key, (qty.get(key) || 0) + 1);
  }
  return [...qty.entries()].map(([slug, count]) => ({ slug, qty: count, name: slug }));
}

async function createCheckout(body) {
  const origin = String(body.origin || "");
  if (!/^https?:\/\//i.test(origin)) {
    return { status: 400, body: { error: "need-http", message: "Open the site via http://localhost, not a local file." } };
  }
  const planSlug = String(body.planSlug || "");
  const riders = body.riders;
  const addons = addonsFrom(body);
  const priced = moneyOf(planSlug, riders, addons);
  if (!priced.total) {
    return { status: 400, body: { error: "bad-plan" } };
  }
  const ref = String(body.ref || "").slice(0, 40);
  const locale = String(body.locale || "zh-TW");
  const successUrl = String(body.successUrl || `${origin.replace(/\/$/, "")}/${locale}/success/?session_id={CHECKOUT_SESSION_ID}`);
  const cancelUrl = String(body.cancelUrl || `${origin.replace(/\/$/, "")}/${locale}/pay/`);
  if (!successUrl.includes("{CHECKOUT_SESSION_ID}")) {
    return { status: 400, body: { error: "bad-success-url" } };
  }
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: body.email ? String(body.email).slice(0, 200) : undefined,
    client_reference_id: ref || undefined,
    metadata: {
      ref,
      planSlug,
      date: String(body.date || ""),
      time: String(body.time || ""),
      riders: String(Math.min(8, Math.max(1, Math.floor(Number(riders) || 1)))),
    },
    line_items: priced.lines,
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_types: ["card"],
  });
  return { status: 200, body: { url: session.url, id: session.id, amount: priced.total } };
}

async function readSession(id) {
  if (!id || !id.startsWith("cs_")) {
    return { status: 400, body: { error: "bad-id" } };
  }
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.retrieve(id);
  return {
    status: 200,
    body: {
      id: session.id,
      paid: session.payment_status === "paid",
      ref: session.metadata?.ref || session.client_reference_id || "",
      amount: session.amount_total,
    },
  };
}

function routeOf(req) {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  return { pathname: url.pathname.replace(/\/+$/, "") || "/", search: url.searchParams };
}

export async function handleStripe(req, res) {
  const { pathname, search } = routeOf(req);
  if (!pathname.startsWith("/api/stripe")) return false;
  cors(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }
  try {
    if (pathname === "/api/stripe/checkout" && req.method === "POST") {
      const body = await readJson(req);
      const result = await createCheckout(body);
      send(res, result.status, result.body);
      return true;
    }
    if (pathname === "/api/stripe/session" && req.method === "GET") {
      const result = await readSession(search.get("id") || "");
      send(res, result.status, result.body);
      return true;
    }
    send(res, 404, { error: "not-found" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "stripe-error";
    const code = message === "missing-secret" ? "missing-secret" : "stripe-error";
    send(res, 500, { error: code, detail: message.slice(0, 240) });
  }
  return true;
}
