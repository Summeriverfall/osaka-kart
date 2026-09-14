"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { formatJpy } from "@/lib/format";
import { cn } from "@/lib/utils";
import { RideNotes, allNotesChecked, emptyNoteChecks, filledNoteChecks } from "@/components/notes/ride-notes";
import { AddonPicker, type AddonCardModel } from "@/components/addons/addon-picker";
import { IncludedAddonsList } from "@/components/addons/included-addons";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { Modal } from "@/components/ui/modal";
import { BOOKING_DAYPARTS, todayIsoDate } from "@/lib/booking/slots";
import { useLiveCatalog, useLiveInventory } from "@/lib/live-catalog";
import { addonUnitLabel } from "@/lib/mock/addons";
import { DEFAULT_STORE_ID } from "@/lib/store-id";
import { withSlash } from "@/lib/paths";
import {
  BOOKING_RESULT_KEY,
  useBookingStore,
  type BookingResult,
} from "@/stores/booking-store";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

const BOOK_FLOW = ["plan", "date", "time", "info"] as const;
type Screen = (typeof BOOK_FLOW)[number];
const STEP_COPY: Record<Screen, "stepPlan" | "stepDate" | "stepTime" | "stepInfo"> = {
  plan: "stepPlan",
  date: "stepDate",
  time: "stepTime",
  info: "stepInfo",
};

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
  const mobile = useMobileBook();
  const flow: readonly Screen[] = BOOK_FLOW;
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<Screen>("plan");
  const [passport, setPassport] = useState("");
  const [nation, setNation] = useState("USA");
  const [request, setRequest] = useState("");
  const [notes, setNotes] = useState(emptyNoteChecks);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesOk = allNotesChecked(notes);

  useEffect(() => {
    if (!(flow as readonly string[]).includes(screen)) setScreen("plan");
  }, [flow, screen]);

  const planSlugHint = hydrated ? store.planSlug || initialPlan : initialPlan;
  const { plans, addons, includedAddons, plan: catalogPlan } = useLiveCatalog(seedPlans, seedAddons, locale, planSlugHint);

  useEffect(() => {
    const queryPlan = new URLSearchParams(window.location.search).get("plan") || "";
    const fromUrl = plans.some((item) => item.slug === queryPlan) ? queryPlan : "";
    const fallback = fromUrl || initialPlan || plans[0]?.slug || "";
    store.patch({ planSlug: fromUrl || store.planSlug || fallback });
    if (fromUrl) {
      store.patch({ planSlug: fromUrl });
      setScreen("date");
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const planSlug = hydrated ? store.planSlug || initialPlan || plans[0]?.slug : initialPlan;
  const plan = plans.find((item) => item.slug === planSlug) ?? catalogPlan;
  const cap = live.riderCap(hydrated ? store.date : "", hydrated ? store.time : "");
  const riders = live.clampRiders(hydrated ? store.riders : 1, hydrated ? store.date : "", hydrated ? store.time : "");
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

  function canOpen(target: Screen) {
    const ti = flow.indexOf(target);
    if (ti < 0) return false;
    for (let i = 0; i < ti; i++) {
      if (flow[i] === "date" && !store.date) return false;
      if (flow[i] === "time" && !store.time) return false;
    }
    return true;
  }

  function goNext() {
    if (screen === "date" && !store.date) return;
    if (screen === "time" && !store.time) return;
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
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!last) {
      goNext();
      return;
    }
    if (!store.date || !store.time || !notesOk || !store.name || !store.email || !store.phone || !passport) return;
    const result: BookingResult = {
      planSlug: plan.slug,
      riders,
      date: store.date,
      time: store.time,
      addonSlugs: selectedAddons,
      name: store.name,
      email: store.email,
      phone: store.phone,
      licenseOk: true,
      affiliateCode: store.affiliateCode,
      ref: `OK-${Date.now().toString(36).toUpperCase()}`,
      planName: plan.translation.name,
      totalJpy: total,
      passport,
      nationality: nation,
      note: request,
      storeId: DEFAULT_STORE_ID,
    };
    sessionStorage.setItem(BOOKING_RESULT_KEY, JSON.stringify(result));
    router.push(withSlash("/pay"));
  }

  const nextLocked =
    (screen === "date" && !store.date) ||
    (screen === "time" && !store.time) ||
    (last && !notesOk);

  const planPane = (
    <div className="book-pane-fill">
      <div className="ok-pkg-list">
        {plans.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn("ok-pkg-row", item.slug === plan.slug && "is-on")}
            onClick={() => store.patch({ planSlug: item.slug, riders: 1 })}
          >
            <span className="ok-pkg-row-time">{item.duration_minutes}</span>
            <span className="ok-pkg-row-copy">
              <strong>{item.translation.name}</strong>
            </span>
            <span className="ok-pkg-row-price">{formatJpy(item.base_price_jpy, locale)}</span>
          </button>
        ))}
      </div>
      <IncludedAddonsList addons={includedAddons} prominent />
    </div>
  );

  const datePane = (
    <MonthCalendar
      locale={locale}
      priceJpy={plan.base_price_jpy}
      value={hydrated ? store.date : ""}
      minIso={todayIsoDate()}
      onChange={(iso) => {
        store.patch({ date: iso, riders: live.clampRiders(store.riders, iso, store.time) });
      }}
    />
  );

  const timePane = (
    <div className="book-slot-board">
      {BOOKING_DAYPARTS.map((part) => (
        <section key={part.id} className="book-slot-group">
          <h3>{t(`parts.${part.id}`)}</h3>
          <div className="book-slot-row">
            {part.slots.map((slot) => {
              const left = store.date ? live.remaining(store.date, slot) : 0;
              const full = Boolean(store.date) && left <= 0;
              return (
                <label key={slot} className={cn("book-slot", store.time === slot && "is-on", full && "is-full")}>
                  <input
                    type="radio"
                    name="time"
                    value={slot}
                    checked={hydrated && store.time === slot}
                    disabled={full}
                    onChange={() => {
                      store.patch({ time: slot, riders: live.clampRiders(store.riders, store.date, slot) });
                    }}
                  />
                  <span>{slot}</span>
                  <small>{full ? t("full") : t("spotsLeft", { n: left })}</small>
                </label>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );

  const infoPane = (
    <div className="book-info">
      <div className="book-addon-block">
        <p className="book-addon-kicker">{t("addons")}</p>
        <p className="book-wizard-hint">{t("stepAddonsHint")}</p>
        <AddonPicker addons={addonCards} ctaLabel={t("submit")} onCta={() => undefined} sticky={false} layout="rows" />
      </div>
      <div className="book-grid">
        <label className="book-field">
          <span>{t("riders")}</span>
          <select value={riders} disabled={cap <= 0} onChange={(e) => store.patch({ riders: Number(e.target.value) })}>
            {(cap > 0 ? Array.from({ length: cap }, (_, i) => i + 1) : [1]).map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </label>
        <label className="book-field">
          <span>{t("nationality")}</span>
          <select value={nation} onChange={(e) => setNation(e.target.value)}>
            {["USA", "China", "Japan", "United Kingdom", "Korea", "Taiwan", "Other"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <label className="book-field"><span>{t("name")}</span><input value={hydrated ? store.name : ""} onChange={(e) => store.patch({ name: e.target.value })} required={last} autoComplete="name" /></label>
      <label className="book-field"><span>{t("email")}</span><input type="email" value={hydrated ? store.email : ""} onChange={(e) => store.patch({ email: e.target.value })} required={last} autoComplete="email" /></label>
      <label className="book-field"><span>{t("phone")}</span><input value={hydrated ? store.phone : ""} onChange={(e) => store.patch({ phone: e.target.value })} required={last} autoComplete="tel" /></label>
      <label className="book-field"><span>{t("passport")}</span><input value={passport} onChange={(e) => setPassport(e.target.value)} required={last} /></label>
      <label className="book-field"><span>{t("request")}</span><textarea value={request} onChange={(e) => setRequest(e.target.value)} rows={2} /></label>
      <button type="button" className={cn("book-notes-open", notesOk && "is-on")} onClick={() => setNotesOpen(true)}>
        <span className="book-notes-open-copy">
          <strong>{tn("title")}</strong>
          <small>{notesOk ? tn("agreed") : tn("openHint")}</small>
        </span>
        <span className="book-notes-open-cta">{notesOk ? tn("view") : tn("open")}</span>
      </button>
      {!mobile ? (
        <aside className="rounded-2xl border border-white/10 bg-[#12121A] p-4">
          <p className="text-xs text-[#9CA3AF]">{t("summary")}</p>
          <p className="mt-2 font-black">{plan.translation.name}</p>
          <p className="text-sm text-[#9CA3AF]">{store.date} {store.time} · {riders}</p>
          <p className="mt-3 text-2xl font-black text-neon-pink">{formatJpy(total, locale)}</p>
        </aside>
      ) : null}
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
          {screen !== "plan" ? (
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
          ) : null}
        </header>
      ) : (
        <ol className="ok-steps">
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
        {screen === "plan" ? planPane : null}
        {screen === "date" ? datePane : null}
        {screen === "time" ? timePane : null}
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
            {last ? t("submit") : t("next")}
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
