import { SiteNav } from "@/components/landing/site-nav";
import { PlanShowcase } from "@/components/landing/plan-showcase";
import { HeroMedia } from "@/components/landing/hero-media";
import { HeroScroll } from "@/components/landing/hero-scroll";
import { HeroTrust } from "@/components/landing/hero-trust";
import { FloatBook } from "@/components/landing/float-book";
import { LandingCommerce } from "@/components/landing/landing-commerce";
import { HtmlTheme } from "@/components/layout/html-theme";
import type { LandingCopy } from "@/components/landing/copy";
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
        changeLook={copy.changeLook}
        plans={copy.nav.plans}
        videos={copy.nav.videos}
        faq={copy.nav.faq}
        booking={copy.nav.booking}
        calendar={copy.nav.calendar}
      />

      <section className="oni-hero">
        <HeroMedia theme="oni" />
        <div className="oni-hero-panel">
          <p className="oni-kicker">{copy.look.oni}</p>
          <h1>
            {copy.hero.title}
            <span>{copy.hero.titleRest}</span>
          </h1>
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
            {copy.features.map((item) => (
              <article key={item.id}>
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
      <footer className="oni-foot">{copy.footer}</footer>
      <FloatBook theme="oni" label={copy.nav.booking} />
    </div>
  );
}
