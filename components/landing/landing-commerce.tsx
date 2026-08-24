"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { ChevronLeft, Mail, MapPin, Phone, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { RideNoteChecks, allNotesChecked, emptyNoteChecks, type NoteKey } from "@/components/notes/ride-notes";
import { BookingExtras, bookingTotal } from "@/components/booking/booking-extras";
import { MonthCalendar } from "@/components/booking/month-calendar";
import type { LandingCopy } from "@/components/landing/copy";
import { PRESS_CARDS, SITE_CONTACT, SOCIAL_CARDS } from "@/lib/contact";
import { FEATURE_IMAGES } from "@/lib/media";
import { asset } from "@/lib/asset";
import { formatJpy } from "@/lib/format";
import { parseIsoDate } from "@/lib/calendar";
import { useLiveCatalog, useLiveInventory, useLiveStoreContact } from "@/lib/live-catalog";
import { BOOKING_SLOTS } from "@/lib/booking/slots";
import { DEFAULT_STORE_ID } from "@/lib/store-id";
import { withSlash } from "@/lib/paths";
import {
  BOOKING_RESULT_KEY,
  useBookingStore,
  type BookingResult,
} from "@/stores/booking-store";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";
import type { SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

type CommerceProps = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  theme: SiteTheme;
  copy: LandingCopy;
};

function LazyLoopVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      controls
      autoPlay
      preload="none"
    >
      {on ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}

export function LandingCommerce({ plans, addons, locale, theme, copy }: CommerceProps) {
  return (
    <>
      <LandingBook plans={plans} addons={addons} locale={locale} />
      <LandingFlow copy={copy} theme={theme} />
      <LandingReviews copy={copy} theme={theme} />
      <LandingFaq copy={copy} theme={theme} />
      <LandingNotes theme={theme} />
      <LandingFeatures copy={copy} theme={theme} />
      <LandingVisit copy={copy} theme={theme} />
    </>
  );
}

export function LandingGallery({ copy }: { copy: LandingCopy }) {
  return (
    <section id="videos" className="shop-block shop-gallery-band">
      <div className="shop-wrap">
        <p className="shop-kicker">01</p>
        <h2>{copy.videosTitle}</h2>
        <p className="shop-lead">{copy.videosLead}</p>
        <div className="shop-gallery shop-gallery-stack">
          <figure className="shop-gallery-video">
            <LazyLoopVideo
              src={asset("/videos/street-run.mp4")}
              poster={asset("/images/hero/poster.jpg")}
            />
            <figcaption>{copy.videos[0]?.title}</figcaption>
          </figure>
          <div className="shop-gallery-grid">
            {SOCIAL_CARDS.slice(0, 4).map((card, index) => (
              <figure key={card.nameKey}>
                <img src={asset(card.img)} alt="" loading="lazy" decoding="async" />
                <figcaption>{copy.videos[index + 1]?.title ?? ""}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingBook({
  plans: seedPlans,
  addons: seedAddons,
  locale,
}: Omit<CommerceProps, "theme" | "copy">) {
  const cal = useTranslations("Calendar");
  const shop = useTranslations("Shop");
  const book = useTranslations("Booking");
  const router = useRouter();
  const store = useBookingStore();
  const live = useLiveInventory();
  const { plans, addons, plan } = useLiveCatalog(seedPlans, seedAddons, locale, store.planSlug);
  const [step, setStep] = useState<1 | 2>(1);
  const [notes, setNotes] = useState(emptyNoteChecks);
  const lockY = useRef<number | null>(null);
  const notesOk = allNotesChecked(notes);

  useLayoutEffect(() => {
    if (lockY.current == null) return;
    window.scrollTo(0, lockY.current);
    lockY.current = null;
  }, [step]);

  function goDetails() {
    if (!store.date || !store.time || !plan) return;
    lockY.current = window.scrollY;
    store.patch({
      planSlug: plan.slug,
      date: store.date,
      time: store.time,
      riders: live.clampRiders(store.riders, store.date, store.time),
    });
    setStep(2);
  }

  function goCalendar() {
    lockY.current = window.scrollY;
    setStep(1);
  }

  function toggleNote(key: NoteKey, on: boolean) {
    setNotes((prev) => {
      const next = { ...prev, [key]: on };
      store.patch({ licenseOk: allNotesChecked(next) });
      return next;
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!plan || !store.date || !store.time || !notesOk) return;

    const result: BookingResult = {
      planSlug: plan.slug,
      riders: store.riders,
      date: store.date,
      time: store.time,
      addonSlugs: store.addonSlugs,
      name: store.name,
      email: store.email,
      phone: store.phone,
      licenseOk: true,
      ref: `OK-${Date.now().toString(36).toUpperCase()}`,
      planName: plan.translation.name,
      totalJpy: bookingTotal(plan, addons, store.riders, store.addonSlugs),
      storeId: DEFAULT_STORE_ID,
    };

    sessionStorage.setItem(BOOKING_RESULT_KEY, JSON.stringify(result));
    router.push(withSlash("/pay"));
  }

  const picked = store.date
    ? new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(parseIsoDate(store.date))
    : "";

  const copyCol = (
    <div className="shop-book-copy">
      <p className="shop-kicker">03</p>
      <h2>{step === 1 ? cal("title") : cal("detailsTitle")}</h2>
      <p className="shop-lead">{step === 1 ? shop("nextDate") : cal("detailsLead")}</p>
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
          {picked ? (
            step === 2 ? (
              <button type="button" className="shop-picked shop-picked-edit" onClick={goCalendar}>
                <span>
                  {cal("picked", { date: picked })}
                  {store.time ? ` · ${store.time}` : ""}
                </span>
                <small>{cal("changeDate")}</small>
              </button>
            ) : (
              <p className="shop-picked">
                {cal("picked", { date: picked })}
                {store.time ? ` · ${store.time}` : ""}
              </p>
            )
          ) : null}
        </article>
      ) : null}
      {step === 2 ? (
        <RideNoteChecks checked={notes} onToggle={toggleNote} />
      ) : null}
    </div>
  );

  return (
    <section id="book" className="shop-book">
      {step === 1 ? (
        <div className="shop-wrap shop-book-grid">
          {copyCol}
          <div className="shop-cal-card">
            <div key="cal" className="shop-step">
              <MonthCalendar
                locale={locale}
                priceJpy={plan?.base_price_jpy ?? 0}
                value={store.date}
                time={store.time}
                onChange={(iso) =>
                  store.patch({
                    date: iso,
                    riders: live.clampRiders(store.riders, iso, store.time),
                  })
                }
              />
              <fieldset className="book-field shop-slot-field">
                <legend>{book("time")}</legend>
                <div className="book-slots">
                  {BOOKING_SLOTS.map((slot) => {
                    const left = store.date ? live.remaining(store.date, slot) : 0;
                    const full = Boolean(store.date) && left <= 0;
                    return (
                      <label key={slot} className={cn(store.time === slot && "is-on", full && "is-full")}>
                        <input
                          type="radio"
                          name="landing-time"
                          value={slot}
                          checked={store.time === slot}
                          disabled={full}
                          onChange={() =>
                            store.patch({
                              time: slot,
                              riders: live.clampRiders(store.riders, store.date, slot),
                            })
                          }
                        />
                        <span>{slot}</span>
                        {store.date ? <small>{cal("spots", { n: left })}</small> : null}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <button
                type="button"
                className="cta-btn cta-btn-solid cal-go"
                disabled={!store.date || !store.time}
                onClick={goDetails}
              >
                {store.date && store.time ? cal("select") : cal("needDate")}
              </button>
            </div>
          </div>
        </div>
      ) : plan ? (
        <form className="shop-wrap shop-book-grid" onSubmit={onSubmit}>
          {copyCol}
          <div className="shop-cal-card">
            <div className="shop-step book-form shop-step-form">
              <button type="button" className="shop-back" onClick={goCalendar}>
                <ChevronLeft className="size-4 shrink-0" aria-hidden />
                {cal("changeDate")}
              </button>
              <BookingExtras plan={plan} addons={addons} locale={locale} />
              <button type="submit" className="cta-btn cta-btn-solid cal-go" disabled={!notesOk}>
                {book("submit")}
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </section>
  );
}

function LandingFlow({ copy, theme }: { copy: LandingCopy; theme: SiteTheme }) {
  if (theme === "oni") {
    return (
      <section className="oni-way">
        <div className="oni-wrap">
          <p className="shop-kicker">04</p>
          <h2>{copy.plan.flowTitle}</h2>
          <ol>
            {copy.plan.flow.map((step) => (
              <li key={step.n}>
                <b>{step.n}</b>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="shop-block">
      <div className="shop-wrap">
        <p className="shop-kicker">04</p>
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

function LandingReviews({ copy, theme }: { copy: LandingCopy; theme: SiteTheme }) {
  const shop = useTranslations("Shop");

  if (theme === "oni") {
    return (
      <section id="reviews" className="oni-ema">
        <div className="oni-wrap">
          <p className="shop-kicker">05</p>
          <h2>{copy.reviewsTitle}</h2>
          <p className="oni-lead">{shop("reviewLead")}</p>
          <div className="oni-ema-hang">
            {copy.reviews.map((item, index) => (
              <blockquote key={item.name} className={`tilt-${index}`}>
                <div className="oni-ema-stars" aria-hidden>
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p>{item.quote}</p>
                <footer>
                  {item.name}
                  <span>{item.meta}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    );
  }

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

function LandingFaq({ copy, theme }: { copy: LandingCopy; theme: SiteTheme }) {
  const shop = useTranslations("Shop");

  if (theme === "oni") {
    return (
      <section id="faq" className="oni-fold">
        <div className="oni-fold-head">
          <p className="shop-kicker">FAQ</p>
          <h2>{copy.faqTitle}</h2>
          <p>{shop("faqLead")}</p>
          <Link href={withSlash("/faq")} className="shop-text-link">
            {shop("moreHelp")}
          </Link>
        </div>
        <div className="oni-fold-list">
          {copy.faqs.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="shop-block shop-faq-band">
      <div className="shop-wrap shop-faq-grid">
        <div>
          <p className="shop-kicker">FAQ</p>
          <h2>{copy.faqTitle}</h2>
          <p className="shop-lead">{shop("faqLead")}</p>
          <Link href={withSlash("/faq")} className="shop-text-link">
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

function LandingNotes({ theme }: { theme: SiteTheme }) {
  const press = useTranslations("Press");

  if (theme === "oni") {
    return (
      <section id="press" className="oni-papers">
        <div className="oni-wrap">
          <p className="shop-kicker">Press</p>
          <h2>{press("title")}</h2>
          <div className="oni-clip">
            {PRESS_CARDS.slice(0, 3).map((item) => (
              <article key={item.titleKey}>
                <img src={asset(item.img)} alt="" />
                <p>{press(item.sourceKey)}</p>
                <h3>{press(item.titleKey)}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="press" className="shop-block shop-news-band">
      <div className="shop-wrap">
        <p className="shop-kicker">Press</p>
        <h2>{press("title")}</h2>
        <div className="shop-news">
          {PRESS_CARDS.slice(0, 3).map((item) => (
            <article key={item.titleKey}>
              <img src={asset(item.img)} alt="" />
              <p>{press(item.sourceKey)}</p>
              <h3>{press(item.titleKey)}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFeatures({ copy, theme }: { copy: LandingCopy; theme: SiteTheme }) {
  if (theme === "acid") {
    return (
      <section className="acid-section">
        <h2 className="acid-h2">{copy.featuresTitle}</h2>
        <div className="acid-posters">
          {copy.features.map((item, index) => (
            <article key={item.id} className={index === 1 ? "acid-poster alt" : "acid-poster"}>
              <img src={FEATURE_IMAGES[index]} alt="" className="feature-shot" loading="lazy" decoding="async" />
              <span>{item.id}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (theme === "oni") {
    return (
      <section className="oni-charms">
        <div className="oni-wrap">
          <h2>{copy.featuresTitle}</h2>
          <div className="oni-charm-row">
            {copy.features.map((item, index) => (
              <article key={item.id}>
                <img src={FEATURE_IMAGES[index]} alt="" loading="lazy" decoding="async" />
                <h3>
                  <span>{item.id}</span>
                  {item.title}
                </h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="neon-section">
      <div className="neon-wrap">
        <h2 className="neon-h2">{copy.featuresTitle}</h2>
        <div className="neon-features">
          {copy.features.map((item, index) => (
            <article key={item.id} className="neon-glass">
              <img src={FEATURE_IMAGES[index]} alt="" className="feature-shot" loading="lazy" decoding="async" />
              <p className="neon-index">{item.id}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingVisit({ copy, theme }: { copy: LandingCopy; theme: SiteTheme }) {
  const contact = useTranslations("Contact");
  const shop = useTranslations("Shop");
  const store = useLiveStoreContact();
  const hours = store.hours || SITE_CONTACT.hours;
  const phone = store.phone || SITE_CONTACT.phone;

  return (
    <section id="access" className={cn("shop-visit", theme === "oni" && "oni-visit")}>
      <div className="shop-wrap shop-visit-grid">
        {theme === "oni" ? (
          <div className="oni-visit-copy">
            <p className="shop-kicker">Access</p>
            <h2>{copy.access.title}</h2>
            <p className="shop-lead">{shop("visitLead")}</p>
            <ol>
              <li>
                <MapPin className="size-4" />
                <span>{copy.access.walk}</span>
              </li>
              <li>
                <span>{copy.access.address}</span>
              </li>
              <li>
                <span>{contact("hours", { hours })}</span>
              </li>
            </ol>
          </div>
        ) : (
          <div>
            <p className="shop-kicker">Access</p>
            <h2>{copy.access.title}</h2>
            <p className="shop-lead">{shop("visitLead")}</p>
            <p className="shop-walk">
              <MapPin className="size-5" />
              {copy.access.walk}
            </p>
            <p className="shop-addr">{copy.access.address}</p>
            <p className="shop-hours">{contact("hours", { hours })}</p>
          </div>
        )}
        <div className="shop-contact">
          <h3>{contact("title")}</h3>
          <a href="#book" className="cta-btn cta-btn-solid">
            {contact("online")}
          </a>
          <a
            href={SITE_CONTACT.whatsapp}
            className="cta-btn has-tip"
            data-tip={contact("whatsappHint")}
            title={contact("whatsappHint")}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <a href={SITE_CONTACT.tel} className="cta-btn cta-btn-ghost">
            <Phone className="size-4 shrink-0" aria-hidden />
            {phone}
          </a>
          <a href={SITE_CONTACT.mailto} className="cta-btn cta-btn-ghost">
            <Mail className="size-4 shrink-0" aria-hidden />
            {SITE_CONTACT.email}
          </a>
        </div>
      </div>
    </section>
  );
}
