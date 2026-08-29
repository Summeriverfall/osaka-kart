import { PlanShowcase } from "@/components/landing/plan-showcase";
import { HeroMedia } from "@/components/landing/hero-media";
import { HeroScroll } from "@/components/landing/hero-scroll";
import { HeroTitle } from "@/components/landing/hero-title";
import { HeroTrust } from "@/components/landing/hero-trust";
import { LandingCommerce, LandingGallery } from "@/components/landing/landing-commerce";
import { PageRails } from "@/components/landing/page-rails";
import { HtmlTheme } from "@/components/layout/html-theme";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import type { LandingCopy } from "@/components/landing/copy";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

type Props = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

export function NeonLanding({ plans, addons, locale, copy }: Props) {
  return (
    <div className="landing-root neon-root" data-theme="neon" id="top">
      <HtmlTheme theme="neon" />
      <PageRails theme="neon" />
      <div className="neon-grain" aria-hidden />
      <SiteNav look="neon" />

      <section className="neon-hero">
        <HeroMedia theme="neon" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <p className="neon-badge">{copy.hero.rating}</p>
          <HeroTitle
            className="hero-title"
            title={copy.hero.title}
            titleRest={copy.hero.titleRest}
          />
          <p className="hero-sub">{copy.hero.subtitle}</p>
          <HeroTrust />
          <div className="neon-hero-actions">
            <a href="#book" className="cta-btn cta-btn-solid">
              {copy.nav.booking}
            </a>
            <a href="#plans" className="cta-btn cta-btn-ghost">
              {copy.hero.cta}
            </a>
          </div>
        </div>
        <HeroScroll theme="neon" label={copy.nav.plans} />
      </section>

      <LandingGallery copy={copy} />

      <section id="plans" className="neon-section">
        <div className="neon-wrap">
          <p className="shop-kicker">02</p>
          <h2 className="neon-h2">{copy.plan.title}</h2>
          <p className="neon-lead">{copy.plan.lead}</p>
          <PlanShowcase plans={plans} locale={locale} labels={copy.labels} />
        </div>
      </section>

      <LandingCommerce plans={plans} addons={addons} locale={locale} theme="neon" copy={copy} />
      <SiteFooter />
    </div>
  );
}
