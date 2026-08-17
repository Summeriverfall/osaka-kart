"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { isSiteTheme, type SiteTheme } from "@/lib/visual-theme";

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

export function siteHome(look: SiteTheme) {
  return `/${look}`;
}

export function useSiteLook(explicit?: SiteTheme): SiteTheme {
  const pathname = usePathname();
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
