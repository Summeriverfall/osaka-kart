"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { formatBookDate, formatBookDateLong, formatJpy } from "@/lib/format";
import { cn } from "@/lib/utils";
import { RideNotes, allNotesChecked, emptyNoteChecks, filledNoteChecks } from "@/components/notes/ride-notes";
import { AddonPicker, type AddonCardModel } from "@/components/addons/addon-picker";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { CountrySearch } from "@/components/booking/country-search";
import { PhoneField } from "@/components/booking/phone-field";
import { Modal } from "@/components/ui/modal";
import { maxBookIsoDate, todayIsoDate } from "@/lib/booking/slots";
import { defaultDial, isEmail, joinPhone, parsePhone } from "@/lib/geo/countries";
import { useLiveCatalog, useLiveInventory } from "@/lib/live-catalog";
import { addonUnitLabel } from "@/lib/mock/addons";
import { DEFAULT_STORE_ID } from "@/lib/store-id";
import { withSlash } from "@/lib/paths";
import {
  BOOKING_RESULT_KEY,
  useBookingStore,
  type BookingResult,
} from "@/stores/booking-store";
import { useToastStore } from "@/stores/toast-store";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

const BOOK_FLOW = ["date", "info"] as const;
type Screen = (typeof BOOK_FLOW)[number];
const STEP_COPY: Record<Screen, "stepDate" | "stepInfo"> = {
  date: "stepDate",
  info: "stepInfo",
};
const MAX_PARTY = 8;

function useMobileBook() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return mobile;
}

type BookingFormProps = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  initialPlan: string;
};

export function BookingForm({ plans: seedPlans, addons: seedAddons, locale, initialPlan }: BookingFormProps) {
  const t = useTranslations("Booking");
  const tn = useTranslations("Notes");
  const router = useRouter();
  const store = useBookingStore();
  const live = useLiveInventory();
  const notify = useToastStore((state) => state.notify);
  const mobile = useMobileBook();
  const flow: readonly Screen[] = BOOK_FLOW;
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<Screen>("date");
  const [notes, setNotes] = useState(emptyNoteChecks);
  const [notesOpen, setNotesOpen] = useState(false);
  const [slotOpen, setSlotOpen] = useState(false);
  const [draftTime, setDraftTime] = useState("");
  const [dial, setDial] = useState(() => defaultDial(locale));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const notesOk = allNotesChecked(notes);

  useEffect(() => {
    if (!(flow as readonly string[]).includes(screen)) setScreen("date");
  }, [flow, screen]);

  const planSlugHint = hydrated ? store.planSlug || initialPlan : initialPlan;
  const { plans, addons, includedAddons, plan: catalogPlan } = useLiveCatalog(seedPlans, seedAddons, locale, planSlugHint);

  useEffect(() => {
    let cancelled = false;
    let done = false;
    function apply() {
      if (cancelled || done) return;
      done = true;
      const params = new URLSearchParams(window.location.search);
      const queryPlan = params.get("plan") || "";
      const fromPay = params.get("from") === "pay";
      const snap = useBookingStore.getState();
      const fromUrl = plans.some((item) => item.slug === queryPlan) ? queryPlan : "";
      const fallback = fromUrl || initialPlan || plans[0]?.slug || "";
      snap.patch({ planSlug: fromUrl || snap.planSlug || fallback });
      let date = useBookingStore.getState().date;
      let time = useBookingStore.getState().time;
      if (fromPay && (!date || !time)) {
        try {
          const raw = sessionStorage.getItem(BOOKING_RESULT_KEY);
          if (raw) {
            const saved = JSON.parse(raw) as BookingResult;
            useBookingStore.getState().patch({
              planSlug: saved.planSlug || fallback,
              riders: saved.riders || 1,
              date: saved.date,
              time: saved.time,
              addonSlugs: saved.addonSlugs || [],
              name: saved.name || "",
              email: saved.email || "",
              phone: saved.phone || "",
              licenceCountry: saved.licenceCountry || "",
              nationality: saved.nationality || "",
              licenseOk: true,
            });
            date = saved.date;
            time = saved.time;
            setNotes(filledNoteChecks());
          }
        } catch {
          /* ignore */
        }
      }
      const licenseOk = useBookingStore.getState().licenseOk;
      if (fromPay && date && time) {
        setScreen("info");
        if (licenseOk) setNotes(filledNoteChecks());
      } else {
        setScreen("date");
      }
      setHydrated(true);
    }
    if (useBookingStore.persist.hasHydrated()) {
      apply();
      return () => {
        cancelled = true;
      };
    }
    const unsub = useBookingStore.persist.onFinishHydration(apply);
    const timer = window.setTimeout(apply, 160);
    return () => {
      cancelled = true;
      unsub();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const parsed = parsePhone(useBookingStore.getState().phone, defaultDial(locale));
    setDial(parsed.dial);
    setPhoneNumber(parsed.number);
  }, [hydrated, locale]);

  useEffect(() => {
    if (!slotOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSlotOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [slotOpen]);

  const planSlug = hydrated ? store.planSlug || initialPlan || plans[0]?.slug : initialPlan;
  const plan = plans.find((item) => item.slug === planSlug) ?? catalogPlan;
  const riders = Math.max(1, hydrated ? store.riders : 1);

  useEffect(() => {
    if (!hydrated || !store.date) return;
    const dayKind = live.dayOffer(store.date, riders, todayIsoDate(), maxBookIsoDate());
    const dayOk = dayKind === "recommended" || dayKind === "open";
    if (!dayOk) {
      store.patch({ date: "", time: "" });
      setDraftTime("");
      setSlotOpen(false);
      if (screen === "info") setScreen("date");
      notify(t("slotPastPick"));
      return;
    }
    if (!store.time) return;
    const offer = live.slotOffer(store.date, store.time, riders);
    if (offer.canBook) return;
    store.patch({ time: "" });
    setDraftTime("");
    if (offer.past) {
      if (screen === "info") setScreen("date");
      notify(t("slotPastPick"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, store.date, store.time, riders, screen]);

  function setParty(next: number) {
    const count = Math.min(MAX_PARTY, Math.max(1, next));
    const date = store.date;
    const time = store.time;
    if (!date) {
      store.patch({ riders: count });
      return;
    }
    const dayKind = live.dayOffer(date, count, todayIsoDate(), maxBookIsoDate());
    const dayOk = dayKind === "recommended" || dayKind === "open";
    if (!dayOk) {
      store.patch({ riders: count, date: "", time: "" });
      setDraftTime("");
      setSlotOpen(false);
      notify(t("partyChanged"));
      return;
    }
    if (time && !live.slotOffer(date, time, count).canBook) {
      store.patch({ riders: count, time: "" });
      setDraftTime("");
      setSlotOpen(true);
      notify(t("partyChanged"));
      return;
    }
    store.patch({ riders: count });
  }

  function setPhone(nextDial: string, nextNumber: string) {
    setDial(nextDial);
    setPhoneNumber(nextNumber);
    store.patch({ phone: joinPhone(nextDial, nextNumber) });
  }

  const selectedAddons = hydrated ? store.addonSlugs : [];
  const addonCards: AddonCardModel[] = addons.map((addon) => ({
    id: addon.id,
    slug: addon.slug,
    name: addon.translation.name,
    description: addon.translation.description,
    priceJpy: addon.price_jpy,
    unitLabel: addonUnitLabel(
      addon.slug === "gopro" ? "kart" : addon.slug === "photos" ? "set" : "person",
      locale,
    ),
    maxQty: addon.max_qty,
  }));

  const total = useMemo(() => {
    if (!plan) return 0;
    const extras = (hydrated ? store.addons : []).reduce((sum, item) => sum + item.price * item.qty, 0);
    return plan.base_price_jpy * riders + extras;
  }, [plan, riders, hydrated, store.addons]);

  if (!plan) return null;

  const step = Math.max(0, flow.indexOf(screen));
  const last = screen === "info";
  const slotDate = hydrated ? store.date : "";
  const slotOffers = slotDate ? live.daySlots(slotDate, riders) : [];
  const draftOffer = draftTime ? slotOffers.find((item) => item.time === draftTime) : undefined;
  const canConfirmTime = Boolean(draftOffer?.canBook);

  function openSlots(iso: string) {
    const same = iso === store.date;
    if (!same) {
      store.patch({ date: iso, time: "" });
      setDraftTime("");
    } else {
      setDraftTime(store.time);
    }
    setSlotOpen(true);
  }

  function confirmTime() {
    if (!draftOffer?.canBook) return;
    store.patch({ time: draftOffer.time });
    setSlotOpen(false);
  }

  function canOpen(target: Screen) {
    const ti = flow.indexOf(target);
    if (ti < 0) return false;
    for (let i = 0; i < ti; i++) {
      if (flow[i] === "date" && (!store.date || !store.time)) return false;
    }
    return true;
  }

  function goNext() {
    if (screen === "date" && (!store.date || !store.time || !live.slotOffer(store.date, store.time, riders).canBook)) return;
    const next = flow[step + 1];
    if (next) setScreen(next);
  }

  function goBack() {
    const prev = flow[step - 1];
    if (prev) setScreen(prev);
  }

  function agreeNotes() {
    const next = filledNoteChecks();
    setNotes(next);
    store.patch({ licenseOk: true });
    setNotesOpen(false);
    setErrors((cur) => ({ ...cur, notes: "" }));
  }

  function revokeNotes() {
    setNotes(emptyNoteChecks());
    store.patch({ licenseOk: false });
  }

  function revealFormErrors(nextErrors: Record<string, string>) {
    const order = ["name", "phone", "email", "licence", "notes"];
    const first = order.find((key) => nextErrors[key]) || Object.keys(nextErrors)[0];
    if (!first) return;
    window.requestAnimationFrame(() => {
      const node = document.getElementById(`book-field-${first}`);
      node?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (first === "notes") return;
      const focusable = node?.querySelector<HTMLElement>("input, button");
      focusable?.focus({ preventScroll: true });
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!last) {
      goNext();
      return;
    }
    const name = (hydrated ? store.name : "").trim();
    const email = (hydrated ? store.email : "").trim();
    const phone = joinPhone(dial, phoneNumber);
    const licence = (hydrated ? store.licenceCountry : "") || "";
    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = t("errName");
    if (!phoneNumber.replace(/[^\d]/g, "")) nextErrors.phone = t("errPhone");
    else if (phoneNumber.replace(/[^\d]/g, "").length < 6) nextErrors.phone = t("errPhone");
    if (!email) nextErrors.email = t("errEmail");
    else if (!isEmail(email)) nextErrors.email = t("errEmail");
    if (!licence) nextErrors.licence = t("errLicence");
    if (!notesOk) nextErrors.notes = t("errNotes");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      revealFormErrors(nextErrors);
      return;
    }
    if (!store.date || !store.time) return;
    store.patch({ name, email, phone, licenceCountry: licence });
    const result: BookingResult = {
      planSlug: plan.slug,
      riders,
      date: store.date,
      time: store.time,
      addonSlugs: selectedAddons,
      name,
      email,
      phone,
      licenceCountry: licence,
      nationality: store.nationality || "",
      licenseOk: true,
      affiliateCode: store.affiliateCode,
      ref: `OK-${Date.now().toString(36).toUpperCase()}`,
      planName: plan.translation.name,
      totalJpy: total,
      storeId: DEFAULT_STORE_ID,
    };
    sessionStorage.setItem(BOOKING_RESULT_KEY, JSON.stringify(result));
    router.push(withSlash("/pay"));
  }

  const nextLocked = screen === "date" && (!store.date || !store.time || !live.slotOffer(store.date, store.time, riders).canBook);

  const datePane = (
    <div className="book-date-stage">
      <div className="book-picked-plan">
        <span>{t("selectedPlan")}</span>
        <strong>{plan.translation.name}</strong>
      </div>
      <div className="book-riders">
        <span>{t("guestsAsk")}</span>
        <div className="book-riders-ctrl">
          <button type="button" aria-label="-" disabled={riders <= 1} onClick={() => setParty(riders - 1)}>
            −
          </button>
          <strong>{riders}</strong>
          <button type="button" aria-label="+" disabled={riders >= MAX_PARTY} onClick={() => setParty(riders + 1)}>
            +
          </button>
        </div>
      </div>
      <p className="book-date-label">{t("selectDate")}</p>
      <MonthCalendar
        locale={locale}
        priceJpy={plan.base_price_jpy}
        value={hydrated ? store.date : ""}
        minIso={todayIsoDate()}
        minRiders={riders}
        partySize={riders}
        hideSpots
        onChange={openSlots}
      />
      <p className={cn("book-picked-slot", store.date && store.time && "is-on")}>
        {store.date && store.time ? (
          <>
            <small>{t("pickedTime")}</small>
            <b>{formatBookDate(store.date, locale)} · {store.time}</b>
          </>
        ) : (
          t("needTime")
        )}
      </p>
      {slotOpen && store.date ? (
        <div className="book-slot-pop">
          <button type="button" className="book-slot-scrim" aria-label="Close" onClick={() => setSlotOpen(false)} />
          <div className="book-slot-sheet" role="dialog" aria-modal="true">
            <p className="book-slot-title">{formatBookDate(store.date, locale)}</p>
            <p className="book-slot-sub">{t("guestsN", { n: riders })}</p>
            <p className="book-slot-kicker">{t("pickTime")}</p>
            <div className="book-slot-list">
              {slotOffers.map((offer) => {
                const tag = offer.kind === "recommended"
                  ? t("recommendGo")
                  : offer.canBook
                    ? t("slotOpen")
                    : offer.past
                      ? t("slotPast")
                      : offer.kind === "short"
                        ? t("slotShort", { n: riders })
                        : t("slotFull");
                return (
                  <button
                    key={offer.time}
                    type="button"
                    disabled={!offer.canBook}
                    className={cn(
                      "book-slot-opt",
                      offer.kind === "recommended" && "is-recommend",
                      draftTime === offer.time && "is-on",
                      !offer.canBook && "is-off",
                    )}
                    onClick={() => setDraftTime(offer.time)}
                  >
                    <b>{offer.time}</b>
                    <span className="book-slot-copy">
                      <em>{tag}</em>
                    </span>
                  </button>
                );
              })}
            </div>
            <button type="button" className="ok-btn book-slot-confirm" disabled={!canConfirmTime} onClick={confirmTime}>
              {t("confirmTime")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  const infoPane = (
    <div className="book-info">
      <article className="book-summary-card">
        <div>
          <p className="book-summary-kicker">{t("summary")}</p>
          <strong>{plan.translation.name}</strong>
          <p>
            {store.date ? formatBookDateLong(store.date, locale) : "—"}
            {store.time ? ` · ${store.time}` : ""}
          </p>
          <p>{t("guestsN", { n: riders })}</p>
        </div>
        <button type="button" className="book-summary-edit" onClick={() => setScreen("date")}>
          {t("edit")}
        </button>
      </article>

      <div className="book-lead">
        <p className="book-lead-title">{t("leadTitle")}</p>
        <label id="book-field-name" className={cn("book-field", errors.name && "is-bad")}>
          <span>{t("fullName")} <i>{t("required")}</i></span>
          <input
            value={hydrated ? store.name : ""}
            onChange={(e) => {
              store.patch({ name: e.target.value });
              setErrors((cur) => ({ ...cur, name: "" }));
            }}
            autoComplete="name"
            name="name"
          />
          {errors.name ? <em className="book-field-err">{errors.name}</em> : null}
        </label>
        <div id="book-field-phone" className={cn("book-field", errors.phone && "is-bad")}>
          <span>{t("whatsapp")} <i>{t("required")}</i></span>
          <PhoneField
            locale={locale}
            dial={dial}
            number={phoneNumber}
            onDial={(value) => {
              setPhone(value, phoneNumber);
              setErrors((cur) => ({ ...cur, phone: "" }));
            }}
            onNumber={(value) => {
              setPhone(dial, value);
              setErrors((cur) => ({ ...cur, phone: "" }));
            }}
            error={errors.phone}
          />
          {errors.phone ? <em className="book-field-err">{errors.phone}</em> : null}
        </div>
        <label id="book-field-email" className={cn("book-field", errors.email && "is-bad")}>
          <span>{t("email")} <i>{t("required")}</i></span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            name="email"
            value={hydrated ? store.email : ""}
            onChange={(e) => {
              store.patch({ email: e.target.value });
              setErrors((cur) => ({ ...cur, email: "" }));
            }}
          />
          {errors.email ? <em className="book-field-err">{errors.email}</em> : null}
        </label>
        <div id="book-field-licence" className={cn("book-field", errors.licence && "is-bad")}>
          <span>{t("licenceCountry")} <i>{t("required")}</i></span>
          <CountrySearch
            locale={locale}
            value={hydrated ? store.licenceCountry || "" : ""}
            onChange={(code) => {
              store.patch({ licenceCountry: code });
              setErrors((cur) => ({ ...cur, licence: "" }));
            }}
            placeholder={t("searchCountry")}
            error={errors.licence}
          />
          {errors.licence ? <em className="book-field-err">{errors.licence}</em> : null}
        </div>
        <div className="book-field">
          <span>{t("nationality")} <i className="is-opt">{t("optional")}</i></span>
          <CountrySearch
            locale={locale}
            value={hydrated ? store.nationality || "" : ""}
            onChange={(code) => store.patch({ nationality: code })}
            placeholder={t("searchCountry")}
          />
        </div>
        {riders > 1 ? <p className="book-lead-hint">{t("leadHint")}</p> : null}
      </div>

      <div className="book-addon-block">
        <p className="book-addon-kicker">{t("addons")}</p>
        <p className="book-wizard-hint">{t("stepAddonsHint")}</p>
        <AddonPicker addons={addonCards} ctaLabel={t("submit")} onCta={() => undefined} sticky={false} layout="rows" />
      </div>
      <div id="book-field-notes" className={cn("book-notes-block", errors.notes && "is-bad")}>
        <div className={cn("book-notes-open", notesOk && "is-on", errors.notes && "is-bad")}>
          <button
            type="button"
            className={cn("book-notes-check", notesOk && "is-on")}
            aria-pressed={notesOk}
            aria-label={notesOk ? tn("agreed") : tn("open")}
            onClick={() => (notesOk ? revokeNotes() : setNotesOpen(true))}
          />
          <span className="book-notes-open-copy">
            <strong>{tn("title")}</strong>
            <small>{notesOk ? tn("agreed") : tn("openHint")}</small>
          </span>
          <button type="button" className="book-notes-open-cta" onClick={() => setNotesOpen(true)}>
            {notesOk ? tn("view") : tn("open")}
          </button>
        </div>
        {errors.notes ? <em className="book-field-err">{errors.notes}</em> : null}
      </div>
    </div>
  );

  return (
    <form className={cn("book-form", mobile && "is-wizard")} data-screen={screen} onSubmit={onSubmit}>
      {mobile ? (
        <header className="book-wizard-head">
          <div className="book-wizard-progress" role="progressbar" aria-valuemin={1} aria-valuenow={step + 1} aria-valuemax={flow.length}>
            {flow.map((key, index) => (
              <button
                key={key}
                type="button"
                className={cn(index < step && "is-done", index === step && "is-on")}
                onClick={() => canOpen(key) && setScreen(key)}
                aria-label={t(STEP_COPY[key])}
              />
            ))}
          </div>
          <p className="book-wizard-kicker">{step + 1} / {flow.length}</p>
          <h2 className="book-wizard-title">{t(STEP_COPY[screen])}</h2>
          <>
            <p className="book-wizard-sub">{plan.translation.name}</p>
            {includedAddons.length ? (
              <p className="ok-included-strip">
                <b>{t("includedNow")}</b>
                {includedAddons.map((addon) => (
                  <span key={addon.id}>{addon.translation.name}</span>
                ))}
              </p>
            ) : null}
          </>
        </header>
      ) : (
        <ol className="ok-steps is-2">
          {flow.map((key, index) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => canOpen(key) && setScreen(key)}
                className={cn(
                  "ok-step",
                  index === step && "is-on",
                  index < step && "is-done",
                )}
              >
                <span className="ok-step-num">{index + 1}</span>
                <span className="ok-step-label">{t(STEP_COPY[key])}</span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="book-wizard-pane">
        {screen === "date" ? datePane : null}
        {screen === "info" ? infoPane : null}
      </div>

      <div className="book-wizard-foot">
        <div className="book-total">
          <span>{t("total")}</span>
          <strong>{formatJpy(total, locale)}<small>{t("taxIncluded")}</small></strong>
        </div>
        <div className="book-wizard-nav">
          {step > 0 ? (
            <button type="button" className="ok-btn-ghost book-wizard-back" onClick={goBack}>{t("back")}</button>
          ) : null}
          <button type="submit" className="ok-btn book-submit" disabled={nextLocked}>
            {last ? t("continuePay") : t("continue")}
          </button>
        </div>
      </div>

      <Modal
        open={notesOpen}
        title={tn("title")}
        onClose={() => setNotesOpen(false)}
        wide
        footer={
          <button type="button" className="ok-btn book-submit" onClick={agreeNotes}>
            {tn("agreeBtn")}
          </button>
        }
      >
        <RideNotes title={false} />
      </Modal>
    </form>
  );
}
