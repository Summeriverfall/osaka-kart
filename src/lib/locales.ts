import type { AppLocale } from "@/i18n/routing";

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  ja: "日本語",
  "zh-TW": "繁體中文",
  ko: "한국어",
};

export const LANG_PICKED_KEY = "ok-lang-picked";
export const LANG_PICKED_QUERY = "langpicked";

export function markLangPicked(code: string) {
  try {
    localStorage.setItem(LANG_PICKED_KEY, code);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${LANG_PICKED_KEY}=${encodeURIComponent(code)}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";").map((item) => item.trim());
  const hit = parts.find((item) => item.startsWith(`${name}=`));
  if (!hit) return null;
  try {
    return decodeURIComponent(hit.slice(name.length + 1));
  } catch {
    return hit.slice(name.length + 1);
  }
}

export function readLangPicked() {
  try {
    const stored = localStorage.getItem(LANG_PICKED_KEY);
    if (stored) return stored;
  } catch {
    /* ignore */
  }
  return readCookie(LANG_PICKED_KEY);
}

export function withLangPickedQuery(href: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const base = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  if (new RegExp(`[?&]${LANG_PICKED_QUERY}=`).test(base)) return href;
  return `${base}${base.includes("?") ? "&" : "?"}${LANG_PICKED_QUERY}=1${hash}`;
}

export function consumeLangPicked(locale: string) {
  if (typeof window === "undefined") return true;
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get(LANG_PICKED_QUERY);
  const existing = readLangPicked();
  if (!fromQuery && !existing) return false;
  markLangPicked(existing || fromQuery || locale);
  if (fromQuery) {
    params.delete(LANG_PICKED_QUERY);
    const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
    try {
      window.history.replaceState(window.history.state, "", next);
    } catch {
      /* file:// 有的环境不能改地址 */
    }
  }
  return true;
}
