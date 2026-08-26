"use client";

import { useEffect, useState } from "react";
import { useAppPathname } from "@/lib/use-app-pathname";
import { isSiteTheme, type SiteTheme } from "@/lib/visual-theme";

export { siteHome } from "@/lib/paths";

const LOOK_KEY = "furture-kart-look";
const FALLBACK: SiteTheme = "neon";

export function rememberSiteLook(look: SiteTheme) {
  try {
    localStorage.setItem(LOOK_KEY, look);
  } catch {
    /* ignore quota / private mode */
  }
}

export function readSiteLook(): SiteTheme {
  try {
    const raw = localStorage.getItem(LOOK_KEY);
    if (isSiteTheme(raw)) return raw;
  } catch {
    /* ignore */
  }
  return FALLBACK;
}

export function useSiteLook(explicit?: SiteTheme): SiteTheme {
  const pathname = useAppPathname();
  const segment = pathname.split("/").filter(Boolean)[0];
  const fromPath = isSiteTheme(segment) ? segment : undefined;
  const [look, setLook] = useState<SiteTheme>(explicit ?? fromPath ?? FALLBACK);

  useEffect(() => {
    const next = explicit ?? fromPath ?? readSiteLook();
    rememberSiteLook(next);
    setLook(next);
  }, [explicit, fromPath]);

  return look;
}
