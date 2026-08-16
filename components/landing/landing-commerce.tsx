"use client";

import { Mail, MapPin, Phone, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { MonthCalendar } from "@/components/booking/month-calendar";
import type { LandingCopy } from "@/components/landing/copy";
import { PRESS_CARDS, SITE_CONTACT, SOCIAL_CARDS } from "@/lib/contact";
import { asset } from "@/lib/asset";
import { formatJpy } from "@/lib/format";
import { parseIsoDate } from "@/lib/calendar";
import { useBookingStore } from "@/stores/booking-store";
import type { PlanWithTranslation } from "@/lib/plans/types";
import type { SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

type CommerceProps = {
  plans: PlanWithTranslation[];
  locale: string;
  theme: SiteTheme;
  copy: LandingCopy;
};

export function LandingCommerce({ plans, locale, copy }: CommerceProps) {
  return (
    <>
      <LandingBook plans={plans} locale={locale} copy={copy} />
      <LandingFlow copy={copy} />
      <LandingGallery copy={copy} />
      <LandingReviews copy={copy} />
      <LandingFaq copy={copy} />
      <LandingNotes />
      <LandingVisit copy={copy} />
    </>
  );
}

function LandingBook({
  plans,
  locale,
  copy,
}: Omit<CommerceProps, "theme">) {
  const cal = useTranslations("Calendar");
  const shop = useTranslations("Shop");
  const router = useRouter();
  const store = useBookingStore();
  const plan = plans.find((item) => item.slug === store.planSlug) ?? plans[0];

  function goBook() {
    if (!store.date || !plan) return;
    store.patch({ planSlug: plan.slug, date: store.date });
    router.push(`/booking?plan=${plan.slug}`);
  }

  const picked = store.date
    ? new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(parseIsoDate(store.date))
    : "";

  return (
    <section id="book" className="shop-book">
      <div className="shop-wrap shop-book-grid">
        <div className="shop-book-copy">
          <p className="shop-kicker">02</p>
          <h2>{cal("title")}</h2>
          <p className="shop-lead">{shop("nextDate")}</p>
          <p className="shop-lead">{cal("noteBody")}</p>
          <div className="shop-plan-pills" role="list">
            {plans.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn("shop-pill", item.slug === plan?.slug && "is-on")}
                onClick={() => store.patch({ planSlug: item.slug })}
              >
                {item.translation.name}
              </button>
            ))}
          </div>
          {plan ? (
            <article className="shop-plan-chip">
              <p>{cal("planLabel")}</p>
              <h3>{plan.translation.name}</h3>
              <p className="shop-price">{formatJpy(plan.base_price_jpy, locale)}</p>
              {picked ? <p className="shop-picked">{cal("picked", { date: picked })}</p> : null}
            </article>
          ) : null}
        </div>
        <div className="shop-cal-card">
          <MonthCalendar
            locale={locale}
            priceJpy={plan?.base_price_jpy ?? 0}
            value={store.date}
            onChange={(iso) => store.patch({ date: iso, time: "" })}
          />
          <button type="button" className="cta-btn cta-btn-solid cal-go" disabled={!store.date} onClick={goBook}>
            {store.date ? cal("select") : cal("needDate")}
          </button>
        </div>
      </div>
    </section>
  );
}

function LandingFlow({ copy }: { copy: LandingCopy }) {
  return (
    <section className="shop-block">
      <div className="shop-wrap">
        <p className="shop-kicker">03</p>
        <h2>{copy.plan.flowTitle}</h2>
        <ol className="shop-flow">
          {copy.plan.flow.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function LandingGallery({ copy }: { copy: LandingCopy }) {
  return (
    <section id="videos" className="shop-block shop-gallery-band">
      <div className="shop-wrap">
        <p className="shop-kicker">04</p>
        <h2>{copy.videosTitle}</h2>
        <p className="shop-lead">{copy.videosLead}</p>
        <div className="shop-gallery">
          <figure className="shop-gallery-video">
            <video
              src={asset("/videos/street-run.mp4")}
              poster={asset("/images/videos/cover-1.jpg")}
              controls
              playsInline
              preload="metadata"
            />
            <figcaption>{copy.videos[0]?.title}</figcaption>
          </figure>
          <div className="shop-gallery-grid">
            {SOCIAL_CARDS.slice(0, 4).map((card, index) => (
              <figure key={card.nameKey}>
                <img src={asset(card.img)} alt="" />
                <figcaption>{copy.videos[index + 1]?.title ?? ""}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingReviews({ copy }: { copy: LandingCopy }) {
  const shop = useTranslations("Shop");

  return (
    <section id="reviews" className="shop-block">
      <div className="shop-wrap">
        <p className="shop-kicker">05</p>
        <h2>{copy.reviewsTitle}</h2>
        <p className="shop-lead">{shop("reviewLead")}</p>
        <div className="shop-reviews">
          {copy.reviews.map((item) => (
            <article key={item.name} className="shop-review">
              <p className="shop-stars" aria-hidden>
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} className="size-4 fill-current" />
                ))}
              </p>
              <blockquote>“{item.quote}”</blockquote>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.meta}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFaq({ copy }: { copy: LandingCopy }) {
  const shop = useTranslations("Shop");

  return (
    <section id="faq" className="shop-block shop-faq-band">
      <div className="shop-wrap shop-faq-grid">
        <div>
          <p className="shop-kicker">FAQ</p>
          <h2>{copy.faqTitle}</h2>
          <p className="shop-lead">{shop("faqLead")}</p>
          <Link href="/faq" className="shop-text-link">
            {shop("moreHelp")}
          </Link>
        </div>
        <div className="shop-faq">
          {copy.faqs.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingNotes() {
  const press = useTranslations("Press");

  return (
    <section id="press" className="shop-block">
      <div className="shop-wrap">
        <p className="shop-kicker">Notes</p>
        <h2>{press("title")}</h2>
        <div className="shop-news">
          {PRESS_CARDS.slice(0, 3).map((item) => (
            <article key={item.titleKey}>
              <img src={asset(item.img)} alt="" />
              <h3>{press(item.titleKey)}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingVisit({ copy }: { copy: LandingCopy }) {
  const contact = useTranslations("Contact");
  const shop = useTranslations("Shop");

  return (
    <section id="access" className="shop-visit">
      <div className="shop-wrap shop-visit-grid">
        <div>
          <p className="shop-kicker">Access</p>
          <h2>{copy.access.title}</h2>
          <p className="shop-lead">{shop("visitLead")}</p>
          <p className="shop-walk">
            <MapPin className="size-5" />
            {copy.access.walk}
          </p>
          <p className="shop-addr">{copy.access.address}</p>
          <p className="shop-hours">{contact("hours", { hours: SITE_CONTACT.hours })}</p>
        </div>
        <div className="shop-contact">
          <h3>{contact("title")}</h3>
          <Link href="/booking" className="cta-btn cta-btn-solid">
            {contact("online")}
          </Link>
          <a href={SITE_CONTACT.whatsapp} className="cta-btn" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <p className="shop-hint">{contact("whatsappHint")}</p>
          <div className="shop-contact-lines">
            <a href={SITE_CONTACT.tel}>
              <Phone className="size-4" />
              {SITE_CONTACT.phone}
            </a>
            <a href={SITE_CONTACT.mailto}>
              <Mail className="size-4" />
              {SITE_CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
