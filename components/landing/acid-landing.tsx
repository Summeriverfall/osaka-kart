import { SiteNav } from "@/components/landing/site-nav";
import { PlanShowcase } from "@/components/landing/plan-showcase";
import { HeroMedia } from "@/components/landing/hero-media";
import { HeroScroll } from "@/components/landing/hero-scroll";
import { HeroTitle } from "@/components/landing/hero-title";
import { HeroTrust } from "@/components/landing/hero-trust";
import { FloatBook } from "@/components/landing/float-book";
import { LandingCommerce } from "@/components/landing/landing-commerce";
import { HtmlTheme } from "@/components/layout/html-theme";
import { SiteFooter } from "@/components/site/site-footer";
import type { LandingCopy } from "@/components/landing/copy";
import { FEATURE_IMAGES } from "@/lib/media";
import type { PlanWithTranslation } from "@/lib/plans/types";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

export function AcidLanding({ plans, locale, copy }: Props) {
  return (
    <div className="landing-root acid-root" data-theme="acid" id="top">
      <HtmlTheme theme="acid" />
      <SiteNav
        theme="acid"
        plans={copy.nav.plans}
        faq={copy.nav.faq}
        calendar={copy.nav.calendar}
      />

      <section className="acid-hero">
        <HeroMedia theme="acid" />
        <div className="acid-hero-copy">
          <p className="acid-eyebrow">{copy.look.acid}</p>
          <HeroTitle
            className="acid-mega"
            title={copy.hero.title}
            titleRest={copy.hero.titleRest}
          />
          <p className="acid-sub">{copy.hero.subtitle}</p>
          <HeroTrust />
          <a href="#plans" className="cta-btn cta-btn-solid">
            {copy.hero.cta}
          </a>
        </div>
        <HeroScroll theme="acid" label={copy.nav.plans} />
      </section>

      <section className="acid-section">
        <h2 className="acid-h2">{copy.featuresTitle}</h2>
        <div className="acid-posters">
          {copy.features.map((item, index) => (
            <article key={item.id} className={index === 1 ? "acid-poster alt" : "acid-poster"}>
              <img src={FEATURE_IMAGES[index]} alt="" className="feature-shot" />
              <span>{item.id}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="plans" className="acid-section">
        <p className="shop-kicker">01</p>
        <h2 className="acid-h2">{copy.plan.title}</h2>
        <p className="acid-lead">{copy.plan.lead}</p>
        <PlanShowcase plans={plans} locale={locale} labels={copy.labels} />
      </section>

      <LandingCommerce plans={plans} locale={locale} theme="acid" copy={copy} />
      <SiteFooter />
      <FloatBook theme="acid" label={copy.nav.booking} />
    </div>
  );
}
