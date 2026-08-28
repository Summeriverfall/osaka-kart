"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { formatJpy } from "@/lib/format";
import { cn } from "@/lib/utils";
import { coverOf } from "@/lib/media";
import { RideNoteChecks, allNotesChecked, emptyNoteChecks, type NoteKey } from "@/components/notes/ride-notes";
import { AddonPicker, type AddonCardModel } from "@/components/addons/addon-picker";
import { IncludedAddonsList } from "@/components/addons/included-addons";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { BOOKING_SLOTS, todayIsoDate } from "@/lib/booking/slots";
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

const STEPS = ["stepPlan", "stepDate", "stepTime", "stepInfo"] as const;

type BookingFormProps = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  initialPlan: string;
};

export function BookingForm({ plans: seedPlans, addons: seedAddons, locale, initialPlan }: BookingFormProps) {
  const t = useTranslations("Booking");
  const router = useRouter();
  const store = useBookingStore();
  const live = useLiveInventory();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [passport, setPassport] = useState("");
  const [nation, setNation] = useState("USA");
  const [request, setRequest] = useState("");
  const [notes, setNotes] = useState(emptyNoteChecks);
  const notesOk = allNotesChecked(notes);

  const planSlugHint = hydrated ? store.planSlug || initialPlan : initialPlan;
  const { plans, addons, includedAddons, plan: catalogPlan } = useLiveCatalog(seedPlans, seedAddons, locale, planSlugHint);

  useEffect(() => {
    const queryPlan = new URLSearchParams(window.location.search).get("plan") || "";
    const fromUrl = plans.some((item) => item.slug === queryPlan) ? queryPlan : "";
    const fallback = fromUrl || initialPlan || plans[0]?.slug || "";
    store.patch({ planSlug: fromUrl || store.planSlug || fallback });
    if (fromUrl) store.patch({ planSlug: fromUrl });
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

  function goNext() {
    if (step === 0) setStep(1);
    else if (step === 1 && store.date) setStep(2);
    else if (step === 2 && store.time) setStep(3);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) {
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

  return (
    <form className="book-form" onSubmit={onSubmit}>
      <ol className="ok-steps">
        {STEPS.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                "ok-step",
                index === step && "is-on",
                index < step && "is-done",
              )}
            >
              <span className="ok-step-num">{index + 1}</span>
              <span className="ok-step-label">{t(label)}</span>
            </button>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <>
          <div className="ok-pick-grid">
            {plans.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn("ok-pick", item.slug === plan.slug && "is-on")}
                onClick={() => store.patch({ planSlug: item.slug, riders: 1 })}
              >
                <img src={coverOf(item)} alt="" />
                <span>
                  <strong>{item.translation.name}</strong>
                  <em>{formatJpy(item.base_price_jpy, locale)}</em>
                </span>
              </button>
            ))}
          </div>
          <IncludedAddonsList addons={includedAddons} />
          <AddonPicker addons={addonCards} ctaLabel={t("submit")} onCta={() => undefined} sticky={false} />
        </>
      ) : null}

      {step === 1 ? (
        <MonthCalendar
          locale={locale}
          priceJpy={plan.base_price_jpy}
          value={hydrated ? store.date : ""}
          minIso={todayIsoDate()}
          onChange={(iso) => store.patch({ date: iso, riders: live.clampRiders(store.riders, iso, store.time) })}
        />
      ) : null}

      {step === 2 ? (
        <div className="book-slots">
          {BOOKING_SLOTS.map((slot) => {
            const left = store.date ? live.remaining(store.date, slot) : 0;
            const full = Boolean(store.date) && left <= 0;
            return (
              <label key={slot} className={cn(store.time === slot && "is-on", full && "is-full")}>
                <input
                  type="radio"
                  name="time"
                  value={slot}
                  checked={hydrated && store.time === slot}
                  disabled={full}
                  onChange={() => store.patch({ time: slot, riders: live.clampRiders(store.riders, store.date, slot) })}
                />
                <span>{slot}</span>
                <small>{full ? t("full") : t("spotsLeft", { n: left })}</small>
              </label>
            );
          })}
        </div>
      ) : null}

      {step === 3 ? (
        <>
          <label className="book-field">
            <span>{t("riders")}</span>
            <select value={riders} disabled={cap <= 0} onChange={(e) => store.patch({ riders: Number(e.target.value) })}>
              {(cap > 0 ? Array.from({ length: cap }, (_, i) => i + 1) : [1]).map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </label>
          <div className="book-grid">
            <label className="book-field"><span>{t("name")}</span><input value={hydrated ? store.name : ""} onChange={(e) => store.patch({ name: e.target.value })} required /></label>
            <label className="book-field"><span>{t("email")}</span><input type="email" value={hydrated ? store.email : ""} onChange={(e) => store.patch({ email: e.target.value })} required /></label>
          </div>
          <label className="book-field"><span>{t("phone")}</span><input value={hydrated ? store.phone : ""} onChange={(e) => store.patch({ phone: e.target.value })} required /></label>
          <label className="book-field"><span>{t("passport")}</span><input value={passport} onChange={(e) => setPassport(e.target.value)} required /></label>
          <label className="book-field">
            <span>{t("nationality")}</span>
            <select value={nation} onChange={(e) => setNation(e.target.value)}>
              {["USA", "China", "Japan", "United Kingdom", "Korea", "Taiwan", "Other"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="book-field"><span>{t("request")}</span><textarea value={request} onChange={(e) => setRequest(e.target.value)} /></label>
          <RideNoteChecks checked={notes} onToggle={(key: NoteKey, on: boolean) => {
            setNotes((prev) => {
              const next = { ...prev, [key]: on };
              store.patch({ licenseOk: allNotesChecked(next) });
              return next;
            });
          }} />
          <aside className="rounded-2xl border border-white/10 bg-[#12121A] p-4">
            <p className="text-xs text-[#9CA3AF]">{t("summary")}</p>
            <p className="mt-2 font-black">{plan.translation.name}</p>
            <p className="text-sm text-[#9CA3AF]">{store.date} {store.time} · {riders}</p>
            <p className="mt-3 text-2xl font-black text-neon-pink">{formatJpy(total, locale)}</p>
          </aside>
        </>
      ) : null}

      <div className="book-total">
        <span>{t("total")}</span>
        <strong>{formatJpy(total, locale)}<small>{t("taxIncluded")}</small></strong>
      </div>
      <div className="flex gap-3">
        {step > 0 ? (
          <button type="button" className="cta-btn cta-btn-ghost px-5 py-3" onClick={() => setStep((n) => n - 1)}>{t("back")}</button>
        ) : null}
        <button type="submit" className="ok-btn book-submit flex-1 justify-center" disabled={step === 3 && !notesOk}>
          {step === 3 ? t("submit") : t("next")}
        </button>
      </div>
    </form>
  );
}
