"use client";

import { useTranslations } from "next-intl";
import { HeroMedia } from "@/components/landing/hero-media";
import { HeroTrust } from "@/components/landing/hero-trust";
import { HomeFaq } from "@/components/home/home-faq";
import { HomePlans } from "@/components/home/home-plans";
import { HomeReviews } from "@/components/home/home-reviews";
import { HomeVideos } from "@/components/home/home-videos";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { localeText, localizedList, useLiveCms } from "@/lib/live-cms";
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
  const gateway = useTranslations("Gateway");
  const cta = useTranslations("CtaBand");
  const safety = useTranslations("Safety");
  const reviewsT = useTranslations("ReviewsHome");
  const cms = useLiveCms();
  const reviews = localizedList(cms.reviews);
  const reviewTitle = localeText(cms.labels.reviewsTitle, locale, reviewsT("title"));

  return (
    <div className="ok-page" id="home">
      <SiteNav />
      <section className="ok-hero">
        <div className="ok-hero-media">
          <HeroMedia theme="neon" plain />
        </div>
        <div className="ok-hero-veil" />
        <div className="ok-hero-copy">
          <p className="ok-badge">🏎️ {gateway("kicker")}</p>
          <h1>
            <span className="ok-hero-line">{hero("title")}</span>
            <span className="ok-hero-line">{hero("titleRest")}</span>
          </h1>
          <p className="ok-hero-sub">{hero("subtitle")}</p>
          <HeroTrust />
          <div className="ok-hero-stats">
            <span className="ok-hero-stars">★★★★★</span>
            <span>
              <strong>{hero("ratingScore")}</strong> {hero("ratingLabel")}
            </span>
          </div>
          <div className="ok-hero-actions">
            <a className="ok-btn" href="#packages">
              {hero("seeTimesAndPlans")}
            </a>
          </div>
          <p className="ok-hero-need">{hero("need")}</p>
        </div>
      </section>

      <HomePlans plans={plans} locale={locale} sectionId="packages" kicker={nav("plans")} />
      <HomeVideos kicker={nav("videos")} limit={4} />

      <HomeReviews reviews={reviews} kicker={nav("reviews")} title={reviewTitle} />

      <section id="safety" className="ok-sec">
        <div className="ok-sec-wide">
          <header className="ok-sec-head">
            <p className="ok-kicker">Safety</p>
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
    </div>
  );
}
