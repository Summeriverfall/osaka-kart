"use client";

import { useLocale, useTranslations } from "next-intl";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { BookingChannels } from "@/components/site/booking-channels";
import { PRESS_CARDS, PRESS_OUTLETS, SOCIAL_CARDS } from "@/lib/contact";
import { asset } from "@/lib/asset";
import { formatJpy } from "@/lib/format";
import { useLivePlans } from "@/lib/live-catalog";
import { cmsMediaSrc, localeText, localizedList, useBookingContact, useLiveCms } from "@/lib/live-cms";
import { bookingHref } from "@/lib/booking/path";
import { withSlash } from "@/lib/paths";
import { useBookingStore } from "@/stores/booking-store";
import type { PlanWithTranslation } from "@/lib/plans/types";
import type { SiteTheme } from "@/lib/visual-theme";

type LandingMoreProps = {
  plans: PlanWithTranslation[];
  locale: string;
  theme: SiteTheme;
};

export function LandingMore({ plans: seedPlans, locale, theme }: LandingMoreProps) {
  const press = useTranslations("Press");
  const social = useTranslations("Social");
  const cal = useTranslations("Calendar");
  const contact = useTranslations("Contact");
  const router = useRouter();
  const store = useBookingStore();
  const plans = useLivePlans(seedPlans, locale);
  const cms = useLiveCms();
  const book = useBookingContact();
  const plan = plans.find((item) => item.slug === store.planSlug) ?? plans[0];
  const pressTitle = localeText(cms.labels.pressTitle, locale, press("title"));
  const pressItems = localizedList(cms.press);
  const cards = pressItems.length
    ? pressItems.map((item) => ({
        img: item.image ? cmsMediaSrc(item.image) : asset("/images/news/n1.webp"),
        source: localeText(item.source, locale),
        title: localeText(item.title, locale),
        key: item.id,
      }))
    : PRESS_CARDS.map((item) => ({
        img: asset(item.img),
        source: press(item.sourceKey),
        title: press(item.titleKey),
        key: item.titleKey,
      }));
  const howTitle = localeText(book.title, locale, contact("title"));

  function goBook() {
    if (!store.date || !store.time || !plan) return;
    store.patch({ planSlug: plan.slug, date: store.date, time: store.time });
    router.push(bookingHref(theme, plan.slug));
  }

  return (
    <>
      <section id="press" className="press-block">
        <h2>{pressTitle}</h2>
        <p className="press-outlets" aria-hidden>
          <span>
            {Array.from({ length: 4 })
              .flatMap(() => PRESS_OUTLETS)
              .join("  ·  ")}
          </span>
        </p>
        <div className="press-viewport">
          <div className="press-track">
            {[...cards, ...cards].map((item, index) => (
              <article key={`${item.key}-${index}`}>
                <img src={item.img} alt="" loading="lazy" decoding="async" />
                <p>{item.source}</p>
                <h3>{item.title}</h3>
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
              <img src={asset(card.img)} alt="" loading="lazy" decoding="async" />
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
            time={store.time}
            onChange={(iso) => store.patch({ date: iso })}
          />
          <button type="button" className="cta-btn cal-go" disabled={!store.date || !store.time} onClick={goBook}>
            {store.date && store.time ? cal("select") : cal("needDate")}
          </button>
        </div>
      </section>

      <section id="contact" className="contact-band">
        <div>
          <h2>{howTitle}</h2>
          <p>{contact("hours", { hours: book.hours })}</p>
        </div>
        <BookingChannels stacked={false} className="contact-actions" onlineHref={withSlash("/booking")} />
      </section>
    </>
  );
}
