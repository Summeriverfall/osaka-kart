import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingForm } from "@/components/booking/booking-form";
import { BookingPageCallNote, BookingPageContact } from "@/components/booking/booking-page-contact";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import type { AppLocale } from "@/i18n/routing";
import { getAddons, getPlans } from "@/lib/plans/queries";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [plans, addons, t, cal] = await Promise.all([
    getPlans(locale),
    getAddons(locale),
    getTranslations("Booking"),
    getTranslations("Calendar"),
  ]);

  const initialPlan = plans[0]?.slug ?? "";

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
          <BookingForm
            plans={plans}
            addons={addons}
            locale={locale}
            initialPlan={initialPlan}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
