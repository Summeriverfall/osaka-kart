"use client";

import { ChevronDown } from "lucide-react";
import type { SiteTheme } from "@/lib/visual-theme";

type HeroScrollProps = {
  theme: SiteTheme;
  label: string;
};

export function HeroScroll({ theme, label }: HeroScrollProps) {
  function go() {
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button
      type="button"
      className={`hero-scroll hero-scroll-${theme}`}
      onClick={go}
      aria-label={label}
    >
      <span>{label}</span>
      <ChevronDown className="size-7" />
    </button>
  );
}
