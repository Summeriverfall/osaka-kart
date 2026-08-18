"use client";

import { HeroVideo } from "@/components/home/hero-video";
import { HeroTitle } from "@/components/landing/hero-title";
import type { LandingCopy } from "@/components/landing/copy";
import { asset } from "@/lib/asset";
import { LOOK_VIDEO } from "@/lib/visual-theme";

type OniStreetProps = {
  copy: LandingCopy;
};

export function OniStreet({ copy }: OniStreetProps) {
  const clip = LOOK_VIDEO.oni;

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
            <HeroVideo
              src={asset(clip.src)}
              startAt={clip.startAt}
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
