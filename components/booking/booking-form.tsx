"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { cn } from "@/lib/utils";
import { RideNoteChecks, allNotesChecked, emptyNoteChecks, type NoteKey } from "@/components/notes/ride-notes";
import { AddonPicker, type AddonCardModel } from "@/components/addons/addon-picker";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { BOOKING_SLOTS, todayIsoDate } from "@/lib/booking/slots";
import { clampRiders, riderCap, slotRemaining } from "@/lib/calendar";
import { addonUnitLabel } from "@/lib/mock/addons";
import { withSlash } from "@/lib/paths";
import {
  BOOKING_RESULT_KEY,
  useBookingStore,
  type BookingResult,
} from "@/stores/booking-store";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

const STEPS = ["Plan", "Date", "Time", "Info"] as const;

type BookingFormProps = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  initialPlan: string;
};

export function BookingForm({ plans, addons, locale, initialPlan }: BookingFormProps) {
  const t = useTranslations("Booking");
  const router = useRouter();
  const store = useBookingStore();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [passport, setPassport] = useState("");
  const [nation, setNation] = useState("USA");
  const [request, setRequest] = useState("");
  const [notes, setNotes] = useState(emptyNoteChecks);
  const notesOk = allNotesChecked(notes);

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
  const plan = plans.find((item) => item.slug === planSlug) ?? plans[0];
  const cap = riderCap(hydrated ? store.date : "", hydrated ? store.time : "");
  const riders = clampRiders(hydrated ? store.riders : 1, hydrated ? store.date : "", hydrated ? store.time : "");
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
      ref: `OK-${Date.now().toString(36).toUpperCase()}`,
      planName: plan.translation.name,
      totalJpy: total,
    };
    sessionStorage.setItem(BOOKING_RESULT_KEY, JSON.stringify(result));
    router.push(withSlash("/pay"));
  }

  return (
    <form className="book-form" onSubmit={onSubmit}>
      <ol className="mb-8 grid grid-cols-4 gap-2">
        {STEPS.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                "w-full rounded-full border px-2 py-2 text-xs font-black tracking-[0.12em] uppercase transition",
                index === step
                  ? "border-neon-pink bg-gradient-to-r from-neon-pink to-neon-purple text-white"
                  : "border-white/10 text-[#9CA3AF]",
              )}
            >
              {index + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <>
          <article className="rounded-2xl border border-white/10 bg-[#12121A] p-4">
            <p className="text-xs text-[#9CA3AF]">{t("plan")}</p>
            <h2 className="mt-1 text-xl font-black">{plan.translation.name}</h2>
            <p className="text-neon-pink">{formatJpy(plan.base_price_jpy, locale)}</p>
            <label className="admin-field mt-3">
              更换套餐
              <select className="admin-input" value={plan.slug} onChange={(e) => store.patch({ planSlug: e.target.value, riders: 1 })}>
                {plans.map((item) => (
                  <option key={item.id} value={item.slug}>{item.translation.name}</option>
                ))}
              </select>
            </label>
          </article>
          <AddonPicker addons={addonCards} ctaLabel={t("submit")} onCta={() => undefined} sticky={false} />
        </>
      ) : null}

      {step === 1 ? (
        <MonthCalendar
          locale={locale}
          priceJpy={plan.base_price_jpy}
          value={hydrated ? store.date : ""}
          minIso={todayIsoDate()}
          onChange={(iso) => store.patch({ date: iso, riders: clampRiders(store.riders, iso, store.time) })}
        />
      ) : null}

      {step === 2 ? (
        <div className="book-slots">
          {BOOKING_SLOTS.map((slot) => {
            const left = store.date ? slotRemaining(store.date, slot) : 0;
            const full = Boolean(store.date) && left <= 0;
            return (
              <label key={slot} className={cn(store.time === slot && "is-on", full && "is-full")}>
                <input
                  type="radio"
                  name="time"
                  value={slot}
                  checked={hydrated && store.time === slot}
                  disabled={full}
                  onChange={() => store.patch({ time: slot, riders: clampRiders(store.riders, store.date, slot) })}
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
          <label className="book-field"><span>证件号</span><input value={passport} onChange={(e) => setPassport(e.target.value)} required /></label>
          <label className="book-field">
            <span>国籍</span>
            <select value={nation} onChange={(e) => setNation(e.target.value)}>
              {["USA", "China", "Japan", "United Kingdom", "Korea", "Taiwan", "Other"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="book-field"><span>特殊要求</span><textarea className="admin-input min-h-24" value={request} onChange={(e) => setRequest(e.target.value)} /></label>
          <RideNoteChecks checked={notes} onToggle={(key: NoteKey, on: boolean) => {
            setNotes((prev) => {
              const next = { ...prev, [key]: on };
              store.patch({ licenseOk: allNotesChecked(next) });
              return next;
            });
          }} />
          <aside className="rounded-2xl border border-white/10 bg-[#12121A] p-4">
            <p className="text-xs text-[#9CA3AF]">订单摘要</p>
            <p className="mt-2 font-black">{plan.translation.name}</p>
            <p className="text-sm text-[#9CA3AF]">{store.date} {store.time} · {riders}人</p>
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
          <button type="button" className="rounded-full border border-white/15 px-5 py-3" onClick={() => setStep((n) => n - 1)}>返回</button>
        ) : null}
        <button type="submit" className="cta-btn book-submit flex-1" disabled={step === 3 && !notesOk}>
          {step === 3 ? t("submit") : "Continue"}
        </button>
      </div>
    </form>
  );
}
