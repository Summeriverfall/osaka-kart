"use client";

import { HeroVideo } from "@/components/home/hero-video";
import { CmsVideoMedia } from "@/components/site/cms-video-media";
import { asset } from "@/lib/asset";
import { heroMediaOf, useLiveCms } from "@/lib/live-cms";
import { LOOK_VIDEO, type SiteTheme } from "@/lib/visual-theme";

type HeroMediaProps = {
  theme: SiteTheme;
};

export function HeroMedia({ theme }: HeroMediaProps) {
  const cms = useLiveCms();
  const clip = LOOK_VIDEO[theme];
  const hero = heroMediaOf(cms, theme);
  const youtube = hero.resolved?.kind === "youtube";

  return (
    <div className="hero-media" aria-hidden>
      {youtube ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <CmsVideoMedia
            video={hero.video}
            fallback={clip.src}
            autoPlay
            className="absolute inset-0 h-[140%] w-[140%] -translate-x-[14%] -translate-y-[14%] object-cover"
          />
        </div>
      ) : (
        <HeroVideo
          src={hero.resolved?.kind === "file" ? hero.resolved.src : asset(clip.src)}
          startAt={hero.startAt}
          poster={hero.resolved?.poster ?? asset("/images/hero/poster.webp")}
          preload="none"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      )}

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
