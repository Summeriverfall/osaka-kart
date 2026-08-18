import type { SiteTheme } from "@/lib/visual-theme";

/** Static export + trailingSlash: /neon 404s; /neon/ is the real page. */
export function withSlash(path: string) {
  if (!path || path === "/") return "/";
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const noHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const qIndex = noHash.indexOf("?");
  const query = qIndex >= 0 ? noHash.slice(qIndex) : "";
  const base = qIndex >= 0 ? noHash.slice(0, qIndex) : noHash;
  const slashed = base.endsWith("/") ? base : `${base}/`;
  return `${slashed}${query}${hash}`;
}

export function siteHome(look: SiteTheme, hash?: string) {
  const path = withSlash(`/${look}`);
  return hash ? `${path}#${hash}` : path;
}
