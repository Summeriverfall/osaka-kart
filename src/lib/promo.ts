import { withSlash } from "@/lib/paths";

export const PROMO_STORAGE_KEY = "osaka-kart-promo-code";

export function readPromoQuery(search = "") {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return (params.get("ref") || params.get("code") || "").trim().toUpperCase();
}

export function rememberPromoCode(code: string) {
  const next = code.trim().toUpperCase();
  if (!next || typeof window === "undefined") return;
  try {
    localStorage.setItem(PROMO_STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
}

export function readStoredPromoCode() {
  if (typeof window === "undefined") return "";
  try {
    return (localStorage.getItem(PROMO_STORAGE_KEY) || "").trim().toUpperCase();
  } catch {
    return "";
  }
}

export function promoPath(code: string, locale = "zh-TW") {
  const safe = encodeURIComponent(code.trim().toUpperCase());
  return withSlash(`/${locale}/?ref=${safe}`);
}

export function promoHref(code: string, locale = "zh-TW") {
  const path = promoPath(code, locale);
  if (typeof window === "undefined") {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    return `${base}${path}`;
  }
  return `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

export function qrImageSrc(data: string, size = 280) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(data)}`;
}
