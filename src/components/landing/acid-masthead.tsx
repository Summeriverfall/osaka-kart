"use client";

import { useTranslations } from "next-intl";
import { HeroMedia } from "@/components/landing/hero-media";
import { HeroTitle } from "@/components/landing/hero-title";
import type { LandingCopy } from "@/components/landing/copy";
import { PRESS_OUTLETS } from "@/lib/contact";

type AcidMastheadProps = {
  copy: LandingCopy;
};

export function AcidMasthead({ copy }: AcidMastheadProps) {
  const shop = useTranslations("Shop");
  const tape = [...PRESS_OUTLETS, ...PRESS_OUTLETS];

  return (
    <>
      <section className="acid-masthead" id="top">
        <HeroMedia theme="acid" />
        <span className="acid-chevron" aria-hidden />
        <span className="acid-pace-num" aria-hidden>
          GO
        </span>
        <div className="acid-masthead-copy">
          <HeroTitle
            className="acid-mega"
            title={copy.hero.title}
            titleRest={copy.hero.titleRest}
          />
          <p className="acid-sub">{copy.hero.subtitle}</p>
          <ul className="acid-trust">
            <li>
              <i aria-hidden />
              {shop("legal")}
            </li>
            <li>
              <i aria-hidden />
              {shop("tax")}
            </li>
            <li>
              <i aria-hidden />
              {shop("license")}
            </li>
            <li>
              <i aria-hidden />
              {shop("media")}
            </li>
          </ul>
          <div className="acid-masthead-actions">
            <a href="#plans" className="cta-btn cta-btn-solid">
              {copy.hero.cta}
            </a>
            <a href="#access" className="acid-ghost-link">
              {copy.access.title}
            </a>
          </div>
        </div>
      </section>
      <div className="acid-checker" aria-hidden />
      <div className="acid-marquee" aria-hidden>
        <div className="acid-marquee-track">
          {tape.map((name, index) => (
            <span key={`${name}-${index}`}>{name}</span>
          ))}
        </div>
      </div>
    </>
  );
}
