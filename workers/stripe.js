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

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
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

function moneyOf(planSlug, riders, addons) {
  const base = PLAN_JPY[planSlug];
  if (!base) return { total: 0, lines: [] };
  const count = Math.min(8, Math.max(1, Math.floor(Number(riders) || 1)));
  let total = base * count;
  const lines = [{ name: `Kart plan ${planSlug}`, unit_amount: base, quantity: count }];
  for (const item of addons) {
    const price = ADDON_JPY[item.slug];
    const qty = Math.min(8, Math.max(0, Math.floor(Number(item.qty) || 0)));
    if (!price || qty <= 0) continue;
    total += price * qty;
    lines.push({ name: item.name || item.slug, unit_amount: price, quantity: qty });
  }
  return { total, lines };
}

function stripeForm(lines, body, priced) {
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.append("payment_method_types[0]", "card");
  params.set("success_url", String(body.successUrl || ""));
  params.set("cancel_url", String(body.cancelUrl || ""));
  const ref = String(body.ref || "").slice(0, 40);
  if (ref) params.set("client_reference_id", ref);
  if (body.email) params.set("customer_email", String(body.email).slice(0, 200));
  params.set("metadata[ref]", ref);
  params.set("metadata[planSlug]", String(body.planSlug || ""));
  params.set("metadata[date]", String(body.date || ""));
  params.set("metadata[time]", String(body.time || ""));
  params.set("metadata[riders]", String(Math.min(8, Math.max(1, Math.floor(Number(body.riders) || 1)))));
  priced.lines.forEach((line, index) => {
    params.set(`line_items[${index}][price_data][currency]`, "jpy");
    params.set(`line_items[${index}][price_data][unit_amount]`, String(line.unit_amount));
    params.set(`line_items[${index}][price_data][product_data][name]`, line.name);
    params.set(`line_items[${index}][quantity]`, String(line.quantity));
  });
  return params;
}

async function stripeRequest(secret, path, init) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || "stripe-error";
    throw new Error(message);
  }
  return data;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    const secret = env.STRIPE_SECRET_KEY || "";
    if (!/^(sk|rk)_(test|live)_/.test(secret)) {
      return json({ error: "missing-secret" }, 500);
    }
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (pathname === "/api/stripe/checkout" && request.method === "POST") {
        const body = await request.json();
        const origin = String(body.origin || "");
        if (!/^https?:\/\//i.test(origin)) {
          return json({ error: "need-http" }, 400);
        }
        const priced = moneyOf(String(body.planSlug || ""), body.riders, addonsFrom(body));
        if (!priced.total) return json({ error: "bad-plan" }, 400);
        const successUrl = String(body.successUrl || "");
        if (!successUrl.includes("{CHECKOUT_SESSION_ID}")) {
          return json({ error: "bad-success-url" }, 400);
        }
        const session = await stripeRequest(secret, "/checkout/sessions", {
          method: "POST",
          body: stripeForm(priced.lines, body, priced),
        });
        return json({ url: session.url, id: session.id, amount: priced.total });
      }
      if (pathname === "/api/stripe/session" && request.method === "GET") {
        const id = url.searchParams.get("id") || "";
        if (!id.startsWith("cs_")) return json({ error: "bad-id" }, 400);
        const session = await stripeRequest(secret, `/checkout/sessions/${id}`, { method: "GET" });
        return json({
          id: session.id,
          paid: session.payment_status === "paid",
          ref: session.metadata?.ref || session.client_reference_id || "",
          amount: session.amount_total,
        });
      }
      return json({ error: "not-found" }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "stripe-error";
      return json({ error: "stripe-error", detail: message.slice(0, 240) }, 500);
    }
  },
};
