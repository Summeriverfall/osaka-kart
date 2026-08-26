"use client";

import { HeroTitle } from "@/components/landing/hero-title";
import type { LandingCopy } from "@/components/landing/copy";
import { asset } from "@/lib/asset";
import { heroMediaOf, useLiveCms } from "@/lib/live-cms";

type OniStreetProps = {
  copy: LandingCopy;
};

export function OniStreet({ copy }: OniStreetProps) {
  const cms = useLiveCms();
  const hero = heroMediaOf(cms, "oni");
  const poster = hero.resolved?.poster ?? asset("/images/hero/poster.webp");

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
            <img
              src={poster}
              alt=""
              className="h-full w-full object-cover"
              width={1280}
              height={720}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
