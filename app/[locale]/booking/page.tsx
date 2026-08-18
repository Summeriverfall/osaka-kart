import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { BookingForm } from "@/components/booking/booking-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import type { AppLocale } from "@/i18n/routing";
import { SITE_CONTACT } from "@/lib/contact";
import { getAddons, getPlans } from "@/lib/plans/queries";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [plans, addons, t, cal, contact] = await Promise.all([
    getPlans(locale),
    getAddons(locale),
    getTranslations("Booking"),
    getTranslations("Calendar"),
    getTranslations("Contact"),
  ]);

  const initialPlan = plans[0]?.slug ?? "";

  return (
    <div className="min-h-dvh bg-[#0A0A0F] pt-16">
      <SiteNav />
      <main className="book-main mx-auto max-w-5xl px-4 py-16">
        <p className="book-kicker">{t("kicker")}</p>
        <h1 className="mt-2 text-4xl font-black">{t("title")}</h1>
        <p className="book-lead mt-3">{t("lead")}</p>

        <div className="book-contact-row">
          <a href={SITE_CONTACT.tel} className="cta-phone">
            <span className="cta-phone-line">
              <Phone className="size-4" />
              {SITE_CONTACT.phone}
            </span>
          </a>
          <a href={SITE_CONTACT.mailto}>
            <Mail className="size-4" />
            {SITE_CONTACT.email}
          </a>
          <a
            href={SITE_CONTACT.whatsapp}
            className="has-tip"
            data-tip={contact("whatsappHint")}
            title={contact("whatsappHint")}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <span>{contact("hours", { hours: SITE_CONTACT.hours })}</span>
        </div>

        <div className="book-page-grid">
          <aside className="book-aside">
            <article className="book-note">
              <h2>{cal("noteTitle")}</h2>
              <p>{cal("noteBody")}</p>
            </article>
            <article className="book-course">
              <h2>{t("call")}</h2>
              <p>
                {SITE_CONTACT.phone} / {SITE_CONTACT.email}
              </p>
            </article>
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
