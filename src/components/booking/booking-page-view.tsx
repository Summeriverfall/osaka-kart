"use client";

import { useTranslations } from "next-intl";
import { AcidRaceBook } from "@/components/landing/acid-race-book";
import { HtmlTheme } from "@/components/layout/html-theme";
import { SiteFooter } from "@/components/site/site-footer";
import { BookingForm } from "@/components/booking/booking-form";
import { BookingPageCallNote, BookingPageContact } from "@/components/booking/booking-page-contact";
import { SiteNav } from "@/components/site/site-nav";
import { ACID_PALETTE } from "@/lib/acid-palette";
import { useSiteLook } from "@/lib/site-look";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

type BookingPageViewProps = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  initialPlan: string;
};

export function BookingPageView({ plans, addons, locale, initialPlan }: BookingPageViewProps) {
  const look = useSiteLook();
  const t = useTranslations("Booking");
  const cal = useTranslations("Calendar");

  if (look === "acid") {
    return (
      <div className="acid-root acid-book-page ok-page-pad" data-theme="acid" data-acid-palette={ACID_PALETTE}>
        <HtmlTheme theme="acid" acidPalette={ACID_PALETTE} />
        <span className="acid-rail" aria-hidden />
        <SiteNav look="acid" />
        <main className="acid-book-main">
          <AcidRaceBook
            mode="page"
            plans={plans}
            addons={addons}
            locale={locale}
            initialPlan={initialPlan}
          />
        </main>
        <div className="acid-checker" aria-hidden />
        <div className="acid-foot">
          <SiteFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="ok-page ok-page-pad">
      <SiteNav />
      <main className="ok-shell">
        <header className="ok-page-head">
          <p className="ok-kicker">{t("kicker")}</p>
          <h1>{t("title")}</h1>
          <p className="ok-page-lead">{t("lead")}</p>
          <BookingPageContact />
        </header>
        <div className="ok-book-layout">
          <BookingForm plans={plans} addons={addons} locale={locale} initialPlan={initialPlan} />
          <aside className="ok-book-aside">
            <article className="ok-panel">
              <h2>{cal("noteTitle")}</h2>
              <p>{cal("noteBody")}</p>
            </article>
            <BookingPageCallNote />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
