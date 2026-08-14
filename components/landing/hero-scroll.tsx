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

  if (theme === "hud") {
    return (
      <button type="button" className="hero-scroll hero-scroll-hud" onClick={go}>
        {label}
        <span aria-hidden>▾</span>
      </button>
    );
  }

  if (theme === "oni") {
    return (
      <button type="button" className="hero-scroll text-[#f5c518]" onClick={go}>
        {label}
        <ChevronDown className="size-8" />
      </button>
    );
  }

  if (theme === "glitch") {
    return (
      <button type="button" className="hero-scroll -skew-x-6 font-mono text-[#00ff9c]" onClick={go}>
        {label}_
      </button>
    );
  }

  if (theme === "acid") {
    return (
      <button type="button" className="hero-scroll hero-scroll-acid" onClick={go} aria-label={label}>
        <ChevronDown className="size-10" strokeWidth={3} />
      </button>
    );
  }

  return (
    <button
      type="button"
      className="hero-scroll hero-scroll-neon text-gray-400 transition-colors hover:text-neon-pink"
      onClick={go}
      aria-label={label}
    >
      <ChevronDown className="bounce-slow size-8" />
    </button>
  );
}
