import { withSlash } from "@/lib/paths";

const LOCALES = ["en", "ja", "zh-TW", "ko"] as const;

function isLocaleSeg(value: string) {
  return (LOCALES as readonly string[]).includes(value);
}

/** 前台 `/{locale}/...`，后台 `/admin/{locale}/...`。已带语言前缀的路径原样返回。 */
export function withAppLocale(appPath: string, locale: string) {
  const normalized = withSlash(appPath.startsWith("/") ? appPath : `/${appPath}`);
  if (LOCALES.some((item) => normalized === `/${item}/` || normalized.startsWith(`/${item}/`))) {
    return normalized;
  }
  if (normalized === "/admin/" || normalized.startsWith("/admin/")) {
    const after = normalized.slice("/admin/".length);
    const first = after.split("/")[0];
    if (first && isLocaleSeg(first)) return normalized;
    return withSlash(`/admin/${locale}/${after}`);
  }
  return withSlash(`/${locale}${normalized === "/" ? "/" : normalized}`);
}

export function isFileProtocol() {
  return typeof window !== "undefined" && window.location.protocol === "file:";
}

export function fileSiteRoot() {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  let path = decodeURIComponent(url.pathname).replace(/\\/g, "/");
  if (/\/index\.html$/i.test(path)) path = path.replace(/\/index\.html$/i, "/");
  const adminLocale = path.match(/\/admin\/(en|ja|zh-TW|ko)\//);
  if (adminLocale) {
    const index = path.lastIndexOf("/admin/");
    url.pathname = `${path.slice(0, index)}/`;
    url.search = "";
    url.hash = "";
    return url.href;
  }
  for (const locale of LOCALES) {
    const needle = `/${locale}/`;
    const index = path.lastIndexOf(needle);
    if (index >= 0) {
      url.pathname = `${path.slice(0, index)}/`;
      url.search = "";
      url.hash = "";
      return url.href;
    }
  }
  for (const section of ["/admin/", "/agent/"] as const) {
    const sectionIndex = path.lastIndexOf(section);
    if (sectionIndex >= 0) {
      url.pathname = `${path.slice(0, sectionIndex)}/`;
      url.search = "";
      url.hash = "";
      return url.href;
    }
  }
  url.pathname = path.endsWith("/") ? path : `${path.replace(/\/[^/]+$/, "")}/`;
  url.search = "";
  url.hash = "";
  return url.href;
}

function localeOf(explicit?: string) {
  return explicit || (typeof document !== "undefined" ? document.documentElement.lang : "") || "zh-TW";
}

export function toFileHref(href: string, locale?: string) {
  const lang = localeOf(locale);
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return trimmed;
  }
  if (/^(https?:|file:|javascript:)/i.test(trimmed)) return trimmed;

  const hashIndex = trimmed.indexOf("#");
  const hash = hashIndex >= 0 ? trimmed.slice(hashIndex) : "";
  const noHash = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed;
  const qIndex = noHash.indexOf("?");
  const query = qIndex >= 0 ? noHash.slice(qIndex) : "";
  let path = (qIndex >= 0 ? noHash.slice(0, qIndex) : noHash)
    .replace(/index\.html$/i, "")
    .replace(/index\.txt$/i, "");
  if (!path.startsWith("/")) path = `/${path}`;
  path = withAppLocale(path, lang);

  return `${fileSiteRoot()}${path.replace(/^\//, "")}index.html${query}${hash}`;
}

export function appPageHref(appPath: string, locale = "zh-TW") {
  if (typeof window !== "undefined" && isFileProtocol()) {
    return toFileHref(appPath, locale);
  }
  const normalized = withSlash(appPath.startsWith("/") ? appPath : `/${appPath}`);
  const locPath = withAppLocale(normalized, locale);
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${locPath}`;
}

export function goToAppPath(appPath: string, locale?: string) {
  window.location.href = appPageHref(appPath, localeOf(locale));
}

function adminHash(appPath: string) {
  const tab = (appPath.startsWith("/") ? appPath : `/${appPath}`).replace(/\/+$/, "");
  return tab.replace(/^\//, "");
}

/** 绕过 file-boot 对 history.pushState 的劫持，避免本地双击打开时整页刷新。 */
function nativePushState(url: string) {
  try {
    History.prototype.pushState.call(window.history, { adminTab: true }, "", url);
  } catch {
    /* file:// 不允许改路径时只改视图 */
  }
}

/** 后台标签切换：只改地址栏，不整页刷新。file:// 用 hash，避免再载入另一份 html。 */
export function pushAppPath(appPath: string, locale?: string) {
  if (typeof window === "undefined") return;
  if (isFileProtocol()) {
    const hash = adminHash(appPath);
    const here = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
    if (here === hash || here === `${hash}/`) return;
    const next = new URL(window.location.href);
    next.hash = hash;
    nativePushState(next.href);
    return;
  }
  const href = appPageHref(appPath, localeOf(locale));
  const next = new URL(href, window.location.href);
  const dest = `${next.pathname}${next.search}${next.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (dest === current) return;
  nativePushState(dest);
}

export function navigateToHref(href: string, locale?: string) {
  if (typeof window === "undefined") return;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return;
  }
  if (/^javascript:/i.test(trimmed)) return;
  if (/^(https?:|file:)/i.test(trimmed) || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    window.location.href = new URL(trimmed, window.location.href).href;
    return;
  }
  if (trimmed.startsWith("/")) {
    window.location.href = toFileHref(trimmed, locale);
    return;
  }
  window.location.href = new URL(trimmed, window.location.href).href;
}

/** Next pathname without locale, e.g. /neon or /plan/standard. file:// 下 usePathname 不可靠. */
export function fileAppPathname() {
  if (typeof window === "undefined" || !isFileProtocol()) return null;
  const path = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");
  const admin = path.match(/\/admin\/(en|ja|zh-TW|ko)\/(.*)$/);
  if (admin) {
    const rest = admin[2].replace(/index\.html$/i, "").replace(/\/+$/, "");
    return rest ? `/admin/${rest}` : "/admin";
  }
  for (const locale of LOCALES) {
    const needle = `/${locale}/`;
    const index = path.lastIndexOf(needle);
    if (index >= 0) {
      const rest = path
        .slice(index + needle.length)
        .replace(/index\.html$/i, "")
        .replace(/\/+$/, "");
      return rest ? `/${rest}` : "/";
    }
  }
  return null;
}
