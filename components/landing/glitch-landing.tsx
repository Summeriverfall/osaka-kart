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

export function GlitchLanding({ plans, locale, copy }: Props) {
  return (
    <div className="glitch-shell" data-theme="glitch" id="top">
      <HtmlTheme theme="glitch" />
      <SiteNav
        theme="glitch"
        plans={copy.nav.plans}
        faq={copy.nav.faq}
        calendar={copy.nav.calendar}
      />

      <section className="glitch-hero">
        <HeroMedia theme="glitch" />
        <div className="glitch-hero-type">
          <p className="glitch-kicker">{copy.look.glitch}</p>
          <HeroTitle
            title={copy.hero.title}
            titleRest={copy.hero.titleRest}
            restClassName="glitch-title-rest"
          />
          <p>{copy.hero.subtitle}</p>
          <HeroTrust />
          <a href="#plans" className="cta-btn cta-btn-solid">
            {copy.hero.cta}
          </a>
        </div>
        <HeroScroll theme="glitch" label={copy.nav.plans} />
      </section>

      <section className="glitch-split">
        {copy.features.map((item, index) => (
          <article key={item.id}>
            <img src={FEATURE_IMAGES[index]} alt="" className="feature-shot" />
            <span>{item.id}</span>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section id="plans" className="glitch-stack">
        <p className="shop-kicker">01</p>
        <h2>{copy.plan.title}</h2>
        <p className="shop-lead">{copy.plan.lead}</p>
        <PlanShowcase plans={plans} locale={locale} labels={copy.labels} />
      </section>

      <LandingCommerce plans={plans} locale={locale} theme="glitch" copy={copy} />
      <SiteFooter />
      <FloatBook theme="glitch" label={copy.nav.booking} />
    </div>
  );
}
