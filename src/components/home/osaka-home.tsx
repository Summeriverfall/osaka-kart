"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HeroTrust } from "@/components/landing/hero-trust";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HomeFaq } from "@/components/home/home-faq";
import { HomeFloat } from "@/components/home/home-float";
import { HomePlans } from "@/components/home/home-plans";
import { HomeReviews } from "@/components/home/home-reviews";
import { HomeVideos } from "@/components/home/home-videos";
import { LicenseModal } from "@/components/home/license-modal";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { localeText, localizedList, useLiveCms } from "@/lib/live-cms";
import { homeCopy } from "@/lib/home-storefront";
import { appPageHref } from "@/lib/file-href";
import { withSlash } from "@/lib/paths";
import type { PlanWithTranslation } from "@/lib/plans/types";

type OsakaHomeProps = {
  plans: PlanWithTranslation[];
  locale: string;
};

export function OsakaHome({ plans, locale }: OsakaHomeProps) {
  const hero = useTranslations("Hero");
  const nav = useTranslations("Nav");
  const cta = useTranslations("CtaBand");
  const safety = useTranslations("Safety");
  const reviewsT = useTranslations("ReviewsHome");
  const cms = useLiveCms();
  const reviews = localizedList(cms.reviews);
  const reviewTitle = localeText(cms.labels.reviewsTitle, locale, reviewsT("title"));
  const copy = homeCopy(locale);
  const [licenseOpen, setLicenseOpen] = useState(false);

  return (
    <div className="ok-page" id="home">
      <SiteNav />
      <section className="ok-hero">
        <div className="ok-hero-media">
          <HeroCarousel />
        </div>
        <div className="ok-hero-veil" />
        <div className="ok-hero-copy">
          <h1>
            <span className="ok-hero-line">{hero("title")}</span>
            <span className="ok-hero-line">{hero("titleRest")}</span>
          </h1>
          <HeroTrust />
          <div className="ok-hero-stats">
            <span className="ok-hero-stars">★★★★★</span>
            <span>
              <strong>{hero("ratingScore")}</strong>
            </span>
          </div>
          <div className="ok-hero-actions">
            <a className="ok-btn" href="#packages">
              {copy.cta}
            </a>
          </div>
          <p className="ok-hero-need">
            {copy.needBefore}
            <button type="button" className="ok-license-link" onClick={() => setLicenseOpen(true)}>
              {copy.needLink}
            </button>
          </p>
        </div>
        <a className="hero-scroll" href="#packages" aria-label={hero("scroll")}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      <HomePlans plans={plans} locale={locale} sectionId="packages" kicker={nav("plans")} />
      <HomeVideos kicker={nav("videos")} limit={4} />

      <HomeReviews reviews={reviews} kicker={nav("reviews")} title={reviewTitle} />

      <section id="safety" className="ok-sec">
        <div className="ok-sec-wide">
          <header className="ok-sec-head">
            <p className="ok-kicker">{copy.safetyKicker}</p>
            <h2>{safety("title")}</h2>
          </header>
          <div className="ok-safety">
            {[1, 2, 3].map((n) => (
              <article key={n}>
                <span className="ok-idx">{String(n).padStart(2, "0")}</span>
                <h3>{safety(`s${n}Title` as "s1Title")}</h3>
                <p>{safety(`s${n}Body` as "s1Body")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HomeFaq kicker={nav("faq")} />

      <section className="ok-cta">
        <div className="ok-cta-inner">
          <h2>{cta("title")}</h2>
          <p>{cta("subtitle")}</p>
          <a className="ok-btn" href={appPageHref(withSlash("/booking"), locale)}>
            {cta("button")}
          </a>
        </div>
      </section>

      <SiteFooter />
      <HomeFloat locale={locale} />
      <LicenseModal locale={locale} open={licenseOpen} onClose={() => setLicenseOpen(false)} />
    </div>
  );
}
