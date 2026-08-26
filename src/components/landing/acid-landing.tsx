import { AcidBar } from "@/components/landing/acid-bar";
import { AcidDock } from "@/components/landing/acid-dock";
import { AcidGallery } from "@/components/landing/acid-gallery";
import { AcidMasthead } from "@/components/landing/acid-masthead";
import { AcidRaceBook } from "@/components/landing/acid-race-book";
import {
  LandingExperience,
  LandingFaq,
  LandingFeatures,
  LandingFlow,
  LandingNotes,
  LandingReviews,
  LandingVisit,
} from "@/components/landing/landing-commerce";
import { HtmlTheme } from "@/components/layout/html-theme";
import { SiteFooter } from "@/components/site/site-footer";
import type { LandingCopy } from "@/components/landing/copy";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";
import { ACID_PALETTE } from "@/lib/acid-palette";

type Props = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

export function AcidLanding({ plans, addons, locale, copy }: Props) {
  return (
    <div className="landing-root acid-root" data-theme="acid" data-acid-palette={ACID_PALETTE}>
      <HtmlTheme theme="acid" acidPalette={ACID_PALETTE} />
      <span className="acid-rail" aria-hidden />
      <AcidBar
        access={copy.access.title}
        book={copy.nav.calendar}
        plans={copy.nav.plans}
        faq={copy.nav.faq}
      />
      <AcidMasthead copy={copy} />
      <LandingVisit copy={copy} theme="acid" />
      <LandingFlow copy={copy} theme="acid" />
      <AcidRaceBook mode="embed" plans={plans} addons={addons} locale={locale} />
      <LandingFeatures copy={copy} theme="acid" />
      <LandingReviews copy={copy} theme="acid" />
      <LandingFaq copy={copy} theme="acid" />
      <LandingExperience theme="acid" />
      <LandingNotes theme="acid" />
      <AcidGallery copy={copy} />
      <div className="acid-checker" aria-hidden />
      <div className="acid-foot">
        <SiteFooter />
      </div>
      <AcidDock label={copy.nav.booking} />
    </div>
  );
}
