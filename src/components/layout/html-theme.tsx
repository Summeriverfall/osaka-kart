"use client";

import { useEffect } from "react";
import { rememberSiteLook } from "@/lib/site-look";
import { isSiteTheme } from "@/lib/visual-theme";
import { resolveAcidPalette, type AcidPalette } from "@/lib/acid-palette";

export function HtmlTheme({
  theme,
  acidPalette,
}: {
  theme: string;
  acidPalette?: AcidPalette;
}) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "acid") {
      document.documentElement.setAttribute("data-acid-palette", resolveAcidPalette());
    } else {
      document.documentElement.removeAttribute("data-acid-palette");
    }
    if (isSiteTheme(theme)) rememberSiteLook(theme);
    return () => {
      document.documentElement.setAttribute("data-theme", "portal");
      document.documentElement.removeAttribute("data-acid-palette");
    };
  }, [theme, acidPalette]);

  return null;
}
