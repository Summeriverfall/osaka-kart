"use client";

import { useEffect } from "react";

export function HtmlTheme({ theme }: { theme: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    return () => {
      document.documentElement.setAttribute("data-theme", "portal");
    };
  }, [theme]);

  return null;
}
