"use client";

import { HeroVideo } from "@/components/home/hero-video";
import { asset } from "@/lib/asset";
import { LOOK_VIDEO, type SiteTheme } from "@/lib/visual-theme";

type HeroMediaProps = {
  theme: SiteTheme;
};

export function HeroMedia({ theme }: HeroMediaProps) {
  const clip = LOOK_VIDEO[theme];

  return (
    <div className="hero-media" aria-hidden>
      <HeroVideo
        src={asset(clip.src)}
        startAt={clip.startAt}
        className="absolute inset-0 z-0 h-full w-full object-cover"
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

      {theme === "glitch" && (
        <>
          <div className="absolute inset-0 z-[1] bg-[#05010a]/55 mix-blend-multiply" />
          <div className="hero-glitch-scan" />
          <div className="hero-glitch-rgb" />
        </>
      )}
    </div>
  );
}
