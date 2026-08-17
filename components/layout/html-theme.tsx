"use client";

import { useEffect } from "react";
import { rememberSiteLook } from "@/lib/site-look";
import { isSiteTheme } from "@/lib/visual-theme";

export function HtmlTheme({ theme }: { theme: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (isSiteTheme(theme)) rememberSiteLook(theme);
    return () => {
      document.documentElement.setAttribute("data-theme", "portal");
    };
  }, [theme]);

  return null;
}
