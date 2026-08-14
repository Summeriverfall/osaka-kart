"use client";

import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { PRESS_CARDS, PRESS_OUTLETS, SITE_CONTACT, SOCIAL_CARDS } from "@/lib/contact";
import { formatJpy } from "@/lib/format";
import { bookingHref } from "@/lib/booking/path";
import { useBookingStore } from "@/stores/booking-store";
import type { PlanWithTranslation } from "@/lib/plans/types";
import type { SiteTheme } from "@/lib/visual-theme";

type LandingMoreProps = {
  plans: PlanWithTranslation[];
  locale: string;
  theme: SiteTheme;
};

export function LandingMore({ plans, locale, theme }: LandingMoreProps) {
  const press = useTranslations("Press");
  const social = useTranslations("Social");
  const cal = useTranslations("Calendar");
  const contact = useTranslations("Contact");
  const router = useRouter();
  const store = useBookingStore();
  const plan = plans.find((item) => item.slug === store.planSlug) ?? plans[0];

  function goBook() {
    if (!store.date || !plan) return;
    store.patch({ planSlug: plan.slug, date: store.date });
    router.push(bookingHref(theme, plan.slug));
  }

  return (
    <>
      <section id="press" className="press-block">
        <h2>{press("title")}</h2>
        <p className="press-outlets" aria-hidden>
          <span>
            {Array.from({ length: 4 })
              .flatMap(() => PRESS_OUTLETS)
              .join("  ·  ")}
          </span>
        </p>
        <div className="press-viewport">
          <div className="press-track">
            {[...PRESS_CARDS, ...PRESS_CARDS].map((item, index) => (
              <article key={`${item.img}-${index}`}>
                <img src={item.img} alt="" />
                <p>{press(item.sourceKey)}</p>
                <h3>{press(item.titleKey)}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="social" className="social-block">
        <div className="social-sign">
          <h2>{social("title")}</h2>
        </div>
        <div className="social-grid">
          {SOCIAL_CARDS.map((card) => (
            <figure key={card.nameKey}>
              <img src={card.img} alt="" />
              <figcaption>
                <b>OSAKA</b>
                <span>KART</span>
                <em>{social(card.nameKey)}</em>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="book" className="book-split">
        <div className="book-notes">
          <article className="book-note">
            <h3>{cal("noteTitle")}</h3>
            <p>{cal("noteBody")}</p>
          </article>
          <article className="book-course">
            <h3>{plan?.translation.name}</h3>
            <p>{plan?.translation.description}</p>
            {plan ? <p className="book-price">{formatJpy(plan.base_price_jpy, locale)}</p> : null}
          </article>
        </div>
        <div className="book-cal-wrap">
          <h2>{cal("title")}</h2>
          <MonthCalendar
            locale={locale}
            priceJpy={plan?.base_price_jpy ?? 0}
            value={store.date}
            onChange={(iso) => store.patch({ date: iso, time: "" })}
          />
          <button type="button" className="cta-btn cal-go" disabled={!store.date} onClick={goBook}>
            {store.date ? cal("select") : cal("needDate")}
          </button>
        </div>
      </section>

      <section id="contact" className="contact-band">
        <div>
          <h2>{contact("title")}</h2>
          <p>{contact("hours", { hours: SITE_CONTACT.hours })}</p>
        </div>
        <div className="contact-actions">
          <a href={SITE_CONTACT.tel} className="cta-btn">
            <Phone className="size-4" />
            {SITE_CONTACT.phone}
          </a>
          <a href={SITE_CONTACT.mailto} className="cta-btn">
            <Mail className="size-4" />
            {SITE_CONTACT.email}
          </a>
          <a href={SITE_CONTACT.whatsapp} className="cta-btn" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <Link href="/booking" className="cta-btn">
            {contact("online")}
          </Link>
        </div>
      </section>
    </>
  );
}
