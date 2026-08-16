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

export function GlitchLanding({ plans, locale, copy }: Props) {
  return (
    <div className="glitch-shell" data-theme="glitch" id="top">
      <HtmlTheme theme="glitch" />
      <SiteNav
        theme="glitch"
        changeLook={copy.changeLook}
        plans={copy.nav.plans}
        videos={copy.nav.videos}
        faq={copy.nav.faq}
        booking={copy.nav.booking}
        calendar={copy.nav.calendar}
      />

      <section className="glitch-hero">
        <HeroMedia theme="glitch" />
        <div className="glitch-hero-type">
          <p className="glitch-kicker">{copy.look.glitch}</p>
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
        <HeroScroll theme="glitch" label={copy.nav.plans} />
      </section>

      <section className="glitch-split">
        {copy.features.map((item) => (
          <article key={item.id}>
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
      <footer className="glitch-foot">{copy.footer}</footer>
      <FloatBook theme="glitch" label={copy.nav.booking} />
    </div>
  );
}
