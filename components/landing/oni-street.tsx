"use client";

import { HeroVideo } from "@/components/home/hero-video";
import { HeroTitle } from "@/components/landing/hero-title";
import type { LandingCopy } from "@/components/landing/copy";
import { CmsVideoMedia } from "@/components/site/cms-video-media";
import { asset } from "@/lib/asset";
import { heroMediaOf, useLiveCms } from "@/lib/live-cms";
import { LOOK_VIDEO } from "@/lib/visual-theme";

type OniStreetProps = {
  copy: LandingCopy;
};

export function OniStreet({ copy }: OniStreetProps) {
  const cms = useLiveCms();
  const clip = LOOK_VIDEO.oni;
  const hero = heroMediaOf(cms, "oni");
  const youtube = hero.resolved?.kind === "youtube";

  return (
    <div className="oni-street">
      <aside className="oni-rail" aria-hidden>
        <span>FURTURE KART OSAKA</span>
        <span>NAMBA · DOTONBORI</span>
      </aside>
      <div className="oni-street-main">
        <section className="oni-split">
          <div className="oni-split-copy">
            <p className="oni-hash">{copy.hero.rating}</p>
            <HeroTitle
              title={copy.hero.title}
              titleRest={copy.hero.titleRest}
            />
            <p className="oni-split-lead">{copy.hero.subtitle}</p>
            <a href="#plans" className="cta-btn cta-btn-solid">
              {copy.hero.cta}
            </a>
          </div>
          <div className="oni-split-screen">
            {youtube ? (
              <CmsVideoMedia video={hero.video} fallback={clip.src} autoPlay className="h-full w-full object-cover" />
            ) : (
              <HeroVideo
                src={hero.resolved?.kind === "file" ? hero.resolved.src : asset(clip.src)}
                startAt={hero.startAt}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
