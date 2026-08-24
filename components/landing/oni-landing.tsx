import { SiteNav } from "@/components/landing/site-nav";
import { PlanShowcase } from "@/components/landing/plan-showcase";
import { FloatBook } from "@/components/landing/float-book";
import { LandingCommerce, LandingGallery } from "@/components/landing/landing-commerce";
import { OniStreet } from "@/components/landing/oni-street";
import { HtmlTheme } from "@/components/layout/html-theme";
import { SiteFooter } from "@/components/site/site-footer";
import type { LandingCopy } from "@/components/landing/copy";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

type Props = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

export function OniLanding({ plans, addons, locale, copy }: Props) {
  return (
    <div className="landing-root oni-root" data-theme="oni" id="top">
      <HtmlTheme theme="oni" />
      <SiteNav
        theme="oni"
        experience={copy.nav.experience}
        plans={copy.nav.plans}
        faq={copy.nav.faq}
        calendar={copy.nav.calendar}
      />
      <OniStreet copy={copy} />
      <LandingGallery copy={copy} />
      <section id="plans" className="oni-section">
        <div className="oni-wrap">
          <p className="shop-kicker">02</p>
          <h2>{copy.plan.title}</h2>
          <p className="oni-lead">{copy.plan.lead}</p>
          <PlanShowcase plans={plans} locale={locale} labels={copy.labels} />
        </div>
      </section>
      <LandingCommerce plans={plans} addons={addons} locale={locale} theme="oni" copy={copy} />
      <SiteFooter />
      <FloatBook theme="oni" label={copy.nav.booking} />
    </div>
  );
}
