const HOSTED_STRIPE_API = "https://osaka-kart-stripe.pickle-dirt.workers.dev";

function bases() {
  const fromEnv = (process.env.NEXT_PUBLIC_STRIPE_API_BASE || "").replace(/\/$/, "");
  const list: string[] = [];
  if (fromEnv) list.push(fromEnv);
  if (typeof window !== "undefined") {
    if (/\.github\.io$/i.test(window.location.hostname)) {
      list.push(HOSTED_STRIPE_API);
    } else if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      list.push("");
    }
    list.push("http://127.0.0.1:8788");
  }
  return [...new Set(list)];
}

async function firstOk<T>(path: string, init: RequestInit): Promise<T> {
  let last = "offline";
  for (const base of bases()) {
    try {
      const res = await fetch(`${base}${path}`, init);
      const data = (await res.json()) as T & { error?: string };
      if (!res.ok) {
        last = data.error || `http-${res.status}`;
        continue;
      }
      return data;
    } catch {
      last = "offline";
    }
  }
  throw new Error(last);
}

export type StripeCheckoutInput = {
  origin: string;
  locale: string;
  successUrl: string;
  cancelUrl: string;
  ref: string;
  planSlug: string;
  planName: string;
  riders: number;
  date: string;
  time: string;
  email: string;
  addonSlugs: string[];
  addons: { slug: string; qty: number; name: string }[];
};

export function isStripeTestMode() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  if (key) return key.startsWith("pk_test_");
  return true;
}

export async function createStripeCheckout(input: StripeCheckoutInput) {
  const data = await firstOk<{ url?: string }>(
    "/api/stripe/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
  if (!data.url) throw new Error("no-url");
  return data.url;
}

export async function readStripeSession(id: string) {
  const q = new URLSearchParams({ id });
  return firstOk<{ paid?: boolean; ref?: string }>(`/api/stripe/session?${q}`, { method: "GET" });
}
