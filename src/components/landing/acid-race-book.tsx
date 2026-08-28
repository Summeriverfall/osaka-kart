"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { BookingExtras, bookingTotal } from "@/components/booking/booking-extras";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { RideNoteChecks, allNotesChecked, emptyNoteChecks, type NoteKey } from "@/components/notes/ride-notes";
import { formatJpy } from "@/lib/format";
import { coverOf, routeOf } from "@/lib/media";
import { BOOKING_SLOTS } from "@/lib/booking/slots";
import { useLiveCatalog, useLiveInventory } from "@/lib/live-catalog";
import { DEFAULT_STORE_ID } from "@/lib/store-id";
import { withSlash } from "@/lib/paths";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import {
  BOOKING_RESULT_KEY,
  useBookingStore,
  type BookingResult,
} from "@/stores/booking-store";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";
import { cn } from "@/lib/utils";

type Stage = "plan" | "session" | "signon";

type AcidRaceBookProps = {
  mode: "embed" | "page";
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  initialPlan?: string;
};

export function AcidRaceBook({
  mode,
  plans: seedPlans,
  addons: seedAddons,
  locale,
  initialPlan = "",
}: AcidRaceBookProps) {
  const cal = useTranslations("Calendar");
  const book = useTranslations("Booking");
  const planT = useTranslations("Plan");
  const router = useRouter();
  const store = useBookingStore();
  const live = useLiveInventory();
  const { plans, addons, plan } = useLiveCatalog(seedPlans, seedAddons, locale, store.planSlug);
  const [stage, setStage] = useState<Stage>("plan");
  const [notes, setNotes] = useState(emptyNoteChecks);
  const [passport, setPassport] = useState("");
  const notesOk = allNotesChecked(notes);
  const minutes = (n: number) => planT("minutes", { n });
  const km = (n: number) => planT("km", { n });

  useEffect(() => {
    const queryPlan = new URLSearchParams(window.location.search).get("plan") || "";
    const fromUrl = seedPlans.some((item) => item.slug === queryPlan) ? queryPlan : "";
    const fallback = fromUrl || initialPlan || seedPlans[0]?.slug || "";
    if (fromUrl || !store.planSlug) {
      store.patch({ planSlug: fromUrl || fallback });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed plan once from URL / first ticket
  }, []);

  const canSubmit =
    Boolean(plan && store.date && store.time && notesOk) &&
    (mode !== "page" || Boolean(store.name && store.email && store.phone && passport));

  function go(next: Stage) {
    if (next === "signon" && (!store.date || !store.time)) return;
    setStage(next);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    if (stage !== "signon") return;
    if (!plan || !store.date || !store.time || !notesOk) return;
    if (mode === "page" && (!store.name || !store.email || !store.phone || !passport)) return;

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
      affiliateCode: store.affiliateCode,
      ref: `OK-${Date.now().toString(36).toUpperCase()}`,
      planName: plan.translation.name,
      totalJpy: bookingTotal(plan, addons, store.riders, store.addonSlugs),
      storeId: DEFAULT_STORE_ID,
      ...(mode === "page" ? { passport } : {}),
    };

    sessionStorage.setItem(BOOKING_RESULT_KEY, JSON.stringify(result));
    router.push(withSlash("/pay"));
  }

  const steps: { id: Stage; n: string; label: string }[] = [
    { id: "plan", n: "01", label: cal("planLabel") },
    { id: "session", n: "02", label: cal("title") },
    { id: "signon", n: "03", label: cal("detailsTitle") },
  ];
  const Title = mode === "page" ? "h1" : "h2";
  const head =
    stage === "plan"
      ? { title: planT("title"), lead: planT("lead") }
      : stage === "session"
        ? { title: cal("title"), lead: cal("noteBody") }
        : { title: cal("detailsTitle"), lead: cal("detailsLead") };
  const order: Stage[] = ["plan", "session", "signon"];
  const currentIndex = order.indexOf(stage);

  return (
    <section id="book" className="acid-race">
      <div id="plans" className="acid-race-head">
        <p className="acid-pace-tag">{book("kicker")}</p>
        <Title className="acid-h2">{head.title}</Title>
        <p className="acid-lead">{head.lead}</p>
      </div>

      <div className="acid-race-mod">
        <ol className="acid-race-nav" aria-label={book("title")}>
          {steps.map((item, index) => {
            const on = item.id === stage;
            const done = index < currentIndex;
            const locked = item.id === "signon" && (!store.date || !store.time);
            return (
              <li key={item.id} className={cn(on && "is-on", done && "is-done")}>
                <button type="button" disabled={locked && !on} onClick={() => go(item.id)}>
                  <i aria-hidden />
                  <b>{item.n}</b>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <form className="acid-race-body" onSubmit={onSubmit}>
          {stage === "plan" && plan ? (
            <div className="acid-pane acid-plan">
              <div className="acid-ticket-col">
                {plans.map((item, index) => {
                  const on = item.slug === plan.slug;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={cn("acid-ticket", on && "is-on")}
                      onClick={() => store.patch({ planSlug: item.slug })}
                    >
                      <span className="acid-ticket-pos">{String(index + 1).padStart(2, "0")}</span>
                      <span className="acid-ticket-copy">
                        <span className="acid-ticket-name">{item.translation.name}</span>
                        <span className="acid-ticket-meta">
                          {minutes(item.duration_minutes)}
                          {item.distance_km != null ? ` · ${km(item.distance_km)}` : ""}
                        </span>
                      </span>
                      <span className="acid-ticket-price">{formatJpy(item.base_price_jpy, locale)}</span>
                    </button>
                  );
                })}
              </div>
              <article className="acid-plan-sheet">
                <div className="acid-plan-hero">
                  <img
                    className="acid-plan-cover"
                    src={coverOf(plan)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="acid-plan-hero-copy">
                    <h3>{plan.translation.name}</h3>
                    <p className="acid-ticket-price">{formatJpy(plan.base_price_jpy, locale)}</p>
                    <p className="acid-plan-spec">
                      {minutes(plan.duration_minutes)}
                      {plan.distance_km != null ? ` · ${km(plan.distance_km)}` : ""}
                      {` · ${planT("perPerson")}`}
                    </p>
                    <button type="button" className="cta-btn cta-btn-solid" onClick={() => go("session")}>
                      {planT("continue")}
                    </button>
                  </div>
                </div>
                <div className="acid-plan-facts">
                  <p className="acid-route">{plan.translation.description}</p>
                  <ul>
                    {plan.translation.highlights.slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {routeOf(plan) ? (
                    <img className="acid-plan-route" src={routeOf(plan)} alt="" loading="lazy" decoding="async" />
                  ) : null}
                </div>
              </article>
            </div>
          ) : null}

          {stage === "session" ? (
            <div className="acid-pane acid-session">
              <div className="acid-plate">
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
              </div>
              <div className="acid-gates" role="group" aria-label={book("time")}>
                <p className="acid-gates-tag">{book("time")}</p>
                {BOOKING_SLOTS.map((slot) => {
                  const left = store.date ? live.remaining(store.date, slot) : 0;
                  const full = Boolean(store.date) && left <= 0;
                  const on = store.time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={cn("acid-gate", on && "is-on", full && "is-full")}
                      disabled={full || !store.date}
                      onClick={() =>
                        store.patch({
                          time: slot,
                          riders: live.clampRiders(store.riders, store.date, slot),
                        })
                      }
                    >
                      <strong>{slot}</strong>
                      {store.date ? <small>{cal("spots", { n: left })}</small> : <small>{book("date")}</small>}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="cta-btn cta-btn-solid cal-go"
                disabled={!store.date || !store.time}
                onClick={() => go("signon")}
              >
                {store.date && store.time ? cal("select") : cal("needDate")}
              </button>
            </div>
          ) : null}

          {stage === "signon" && plan ? (
            <div className="acid-pane acid-signon">
              <div className="acid-signon-split">
                <div className="acid-signon-col">
                  {mode === "page" ? (
                    <div className="acid-signon-grid">
                      <label className="book-field">
                        <span>{book("name")}</span>
                        <input value={store.name} onChange={(event) => store.patch({ name: event.target.value })} required />
                      </label>
                      <label className="book-field">
                        <span>{book("email")}</span>
                        <input type="email" value={store.email} onChange={(event) => store.patch({ email: event.target.value })} required />
                      </label>
                      <label className="book-field">
                        <span>{book("phone")}</span>
                        <input value={store.phone} onChange={(event) => store.patch({ phone: event.target.value })} required />
                      </label>
                      <label className="book-field">
                        <span>ID</span>
                        <input value={passport} onChange={(event) => setPassport(event.target.value)} required />
                      </label>
                    </div>
                  ) : null}
                  <BookingExtras plan={plan} addons={addons} locale={locale} />
                </div>
                <div className="acid-signon-col">
                  <RideNoteChecks checked={notes} onToggle={toggleNote} />
                  <p className="acid-race-total">
                    <span>{book("total")}</span>
                    <strong>
                      {formatJpy(bookingTotal(plan, addons, store.riders, store.addonSlugs), locale)}
                      <small>{book("taxIncluded")}</small>
                    </strong>
                  </p>
                  <button type="submit" className="cta-btn cta-btn-solid cal-go" disabled={!canSubmit}>
                    {book("submit")}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
