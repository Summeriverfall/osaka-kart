"use client";

import { asset } from "@/lib/asset";
import { heroMediaOf, useLiveCms } from "@/lib/live-cms";
import type { SiteTheme } from "@/lib/visual-theme";

type HeroMediaProps = {
  theme: SiteTheme;
};

export function HeroMedia({ theme }: HeroMediaProps) {
  const cms = useLiveCms();
  const hero = heroMediaOf(cms, theme);
  const poster = hero.resolved?.poster ?? asset("/images/hero/poster.webp");

  return (
    <div className="hero-media" aria-hidden>
      <img
        src={poster}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
      />

      {theme === "neon" && (
        <>
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0A0A0F]/70 via-[#0A0A0F]/30 to-[#0A0A0F]/90" />
          <div className="pointer-events-none absolute -top-24 left-[-4rem] z-[1] h-96 w-96 rounded-full bg-neon-pink/20 blur-[128px]" />
        </>
      )}

      {theme === "acid" && (
        <>
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#12080e]/92 via-[#12080e]/55 to-[#12080e]/35" />
          <div className="hero-acid-slash" />
        </>
      )}

      {theme === "oni" && (
        <>
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-[#3a0000]/45 to-black/90" />
          <div className="hero-oni-frame" />
        </>
      )}
    </div>
  );
}
