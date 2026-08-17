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

export function OniLanding({ plans, locale, copy }: Props) {
  return (
    <div className="landing-root oni-root" data-theme="oni" id="top">
      <HtmlTheme theme="oni" />
      <SiteNav
        theme="oni"
        plans={copy.nav.plans}
        faq={copy.nav.faq}
        calendar={copy.nav.calendar}
      />

      <section className="oni-hero">
        <HeroMedia theme="oni" />
        <div className="oni-hero-panel">
          <p className="oni-kicker">{copy.look.oni}</p>
          <HeroTitle
            title={copy.hero.title}
            titleRest={copy.hero.titleRest}
            restClassName="oni-title-rest"
          />
          <p>{copy.hero.subtitle}</p>
          <HeroTrust />
          <a href="#plans" className="cta-btn cta-btn-solid">
            {copy.hero.cta}
          </a>
        </div>
        <HeroScroll theme="oni" label={copy.nav.plans} />
      </section>

      <section className="oni-section">
        <div className="oni-wrap">
          <h2>{copy.featuresTitle}</h2>
          <div className="oni-features">
            {copy.features.map((item, index) => (
              <article key={item.id}>
                <img src={FEATURE_IMAGES[index]} alt="" className="feature-shot" />
                <span>{item.id}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="oni-section">
        <div className="oni-wrap">
          <p className="shop-kicker">01</p>
          <h2>{copy.plan.title}</h2>
          <p className="oni-lead">{copy.plan.lead}</p>
          <PlanShowcase plans={plans} locale={locale} labels={copy.labels} />
        </div>
      </section>

      <LandingCommerce plans={plans} locale={locale} theme="oni" copy={copy} />
      <SiteFooter />
      <FloatBook theme="oni" label={copy.nav.booking} />
    </div>
  );
}
