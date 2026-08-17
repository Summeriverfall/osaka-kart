import { SiteNav } from "@/components/landing/site-nav";
import { PlanShowcase } from "@/components/landing/plan-showcase";
import { HeroMedia } from "@/components/landing/hero-media";
import { HeroScroll } from "@/components/landing/hero-scroll";
import { HeroTitle } from "@/components/landing/hero-title";
import { HeroTrust } from "@/components/landing/hero-trust";
import { FloatBook } from "@/components/landing/float-book";
import { LandingCommerce, LandingGallery } from "@/components/landing/landing-commerce";
import { PageRails } from "@/components/landing/page-rails";
import { HtmlTheme } from "@/components/layout/html-theme";
import { SiteFooter } from "@/components/site/site-footer";
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
      <PageRails theme="oni" />
      <div className="oni-ink" aria-hidden />
      <SiteNav
        theme="oni"
        plans={copy.nav.plans}
        faq={copy.nav.faq}
        calendar={copy.nav.calendar}
      />

      <section className="oni-hero">
        <HeroMedia theme="oni" />
        <div className="oni-torii" aria-hidden />
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

      <LandingGallery copy={copy} />

      <section id="plans" className="oni-section">
        <div className="oni-wrap">
          <p className="shop-kicker">02</p>
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
