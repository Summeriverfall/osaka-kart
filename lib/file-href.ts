const LOCALES = ["en", "ja", "zh-TW", "ko"] as const;

export function isFileProtocol() {
  return typeof window !== "undefined" && window.location.protocol === "file:";
}

export function fileSiteRoot() {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  const path = decodeURIComponent(url.pathname).replace(/\\/g, "/");
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
  let path = (qIndex >= 0 ? noHash.slice(0, qIndex) : noHash).replace(/index\.html$/i, "");
  if (!path.startsWith("/")) path = `/${path}`;
  if (path === "/") path = `/${lang}/`;

  const hasLocale = LOCALES.some((item) => path === `/${item}` || path.startsWith(`/${item}/`));
  if (!hasLocale) path = `/${lang}${path}`;
  if (!path.endsWith("/")) path = `${path}/`;

  return `${fileSiteRoot()}${path.replace(/^\//, "")}index.html${query}${hash}`;
}

export function appPageHref(appPath: string, locale = "zh-TW") {
  if (typeof window !== "undefined" && isFileProtocol()) {
    return toFileHref(appPath, locale);
  }
  const tab = appPath.startsWith("/") ? appPath : `/${appPath}`;
  const withSlash = tab.endsWith("/") ? tab : `${tab}/`;
  const locPath = withSlash.startsWith(`/${locale}/`) || LOCALES.some((item) => withSlash.startsWith(`/${item}/`))
    ? withSlash
    : `/${locale}${withSlash}`;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${locPath}`;
}

export function goToAppPath(appPath: string, locale?: string) {
  window.location.href = appPageHref(appPath, localeOf(locale));
}

export function navigateToHref(href: string, locale?: string) {
  if (typeof window === "undefined") return;
  if (isFileProtocol()) {
    window.location.href = toFileHref(href, locale);
    return;
  }
  window.location.href = href;
}

/** Next pathname without locale, e.g. /neon or /plan/standard. file:// 下 usePathname 不可靠. */
export function fileAppPathname() {
  if (typeof window === "undefined" || !isFileProtocol()) return null;
  const path = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");
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
