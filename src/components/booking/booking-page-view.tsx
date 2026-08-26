"use client";

import { useTranslations } from "next-intl";
import { AcidRaceBook } from "@/components/landing/acid-race-book";
import { AcidBar } from "@/components/landing/acid-bar";
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
  const nav = useTranslations("Nav");
  const meet = useTranslations("Meet");

  if (look === "acid") {
    return (
      <div className="acid-root acid-book-page" data-theme="acid" data-acid-palette={ACID_PALETTE}>
        <HtmlTheme theme="acid" acidPalette={ACID_PALETTE} />
        <span className="acid-rail" aria-hidden />
        <AcidBar
          access={meet("title")}
          book={nav("calendar")}
          plans={nav("plans")}
          faq={nav("faq")}
          home={nav("home")}
          away
        />
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
    <div className="min-h-dvh bg-[#0A0A0F] pt-16">
      <SiteNav />
      <main className="book-main mx-auto max-w-5xl px-4 py-16">
        <p className="book-kicker">{t("kicker")}</p>
        <h1 className="mt-2 text-4xl font-black">{t("title")}</h1>
        <p className="book-lead mt-3">{t("lead")}</p>
        <BookingPageContact />
        <div className="book-page-grid">
          <aside className="book-aside">
            <article className="book-note">
              <h2>{cal("noteTitle")}</h2>
              <p>{cal("noteBody")}</p>
            </article>
            <BookingPageCallNote />
          </aside>
          <BookingForm plans={plans} addons={addons} locale={locale} initialPlan={initialPlan} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
