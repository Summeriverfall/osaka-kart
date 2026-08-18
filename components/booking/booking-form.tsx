"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { addonImage } from "@/lib/media";
import { cn } from "@/lib/utils";
import { RideNoteChecks, allNotesChecked, emptyNoteChecks, type NoteKey } from "@/components/notes/ride-notes";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { BOOKING_SLOTS } from "@/lib/booking/slots";
import { clampRiders, riderCap, slotRemaining } from "@/lib/calendar";
import { withSlash } from "@/lib/paths";
import {
  BOOKING_RESULT_KEY,
  useBookingStore,
  type BookingResult,
} from "@/stores/booking-store";
import type {
  AddonWithTranslation,
  PlanWithTranslation,
} from "@/lib/plans/types";

type BookingFormProps = {
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
  initialPlan: string;
};

export function BookingForm({
  plans,
  addons,
  locale,
  initialPlan,
}: BookingFormProps) {
  const t = useTranslations("Booking");
  const router = useRouter();
  const store = useBookingStore();
  const [hydrated, setHydrated] = useState(false);
  const [notes, setNotes] = useState(emptyNoteChecks);
  const notesOk = allNotesChecked(notes);

  useEffect(() => {
    const queryPlan = new URLSearchParams(window.location.search).get("plan") || "";
    const fromUrl = plans.some((item) => item.slug === queryPlan) ? queryPlan : "";
    const fallback = fromUrl || initialPlan || plans[0]?.slug || "";
    store.patch({
      planSlug: fromUrl || store.planSlug || fallback,
    });
    if (fromUrl) {
      store.patch({ planSlug: fromUrl });
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once from URL + persist
  }, []);

  const planSlug = hydrated ? store.planSlug || initialPlan || plans[0]?.slug : initialPlan;
  const plan = plans.find((item) => item.slug === planSlug) ?? plans[0];
  const cap = riderCap(hydrated ? store.date : "", hydrated ? store.time : "");
  const riders = clampRiders(
    hydrated ? store.riders : 1,
    hydrated ? store.date : "",
    hydrated ? store.time : "",
  );
  const selectedAddons = hydrated ? store.addonSlugs : [];

  useEffect(() => {
    if (!hydrated) return;
    if (store.riders !== riders) store.patch({ riders });
  }, [hydrated, riders, store.riders, store.patch]);

  const total = useMemo(() => {
    if (!plan) return 0;
    const extras = addons
      .filter((addon) => selectedAddons.includes(addon.slug))
      .reduce((sum, addon) => sum + addon.price_jpy, 0);
    return plan.base_price_jpy * riders + extras;
  }, [plan, riders, addons, selectedAddons]);

  if (!plan) return null;

  function toggleNote(key: NoteKey, on: boolean) {
    setNotes((prev) => {
      const next = { ...prev, [key]: on };
      store.patch({ licenseOk: allNotesChecked(next) });
      return next;
    });
  }

  function toggleAddon(slug: string) {
    const next = selectedAddons.includes(slug)
      ? selectedAddons.filter((item) => item !== slug)
      : [...selectedAddons, slug];
    store.patch({ addonSlugs: next });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!store.date || !store.time || !notesOk) return;

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
      <label className="book-field">
        <span>{t("plan")}</span>
        <select
          value={plan.slug}
          onChange={(event) => store.patch({ planSlug: event.target.value, riders: 1 })}
          required
        >
          {plans.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.translation.name} · {formatJpy(item.base_price_jpy, locale)}
            </option>
          ))}
        </select>
      </label>

      <div className="book-cal-field">
        <span>{t("date")}</span>
        <MonthCalendar
          locale={locale}
          priceJpy={plan.base_price_jpy}
          value={hydrated ? store.date : ""}
          time={hydrated ? store.time : ""}
          onChange={(iso) =>
            store.patch({
              date: iso,
              riders: clampRiders(store.riders, iso, store.time),
            })
          }
        />
        <input type="hidden" name="date" value={hydrated ? store.date : ""} required />
      </div>

      <fieldset className="book-field">
        <legend>{t("time")}</legend>
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
                  onChange={() =>
                    store.patch({
                      time: slot,
                      riders: clampRiders(store.riders, store.date, slot),
                    })
                  }
                  required
                />
                <span>{slot}</span>
                {store.date ? <small>{t("spotsLeft", { n: left })}</small> : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="book-field">
        <span>{t("riders")}</span>
        <select
          value={riders}
          disabled={cap <= 0}
          onChange={(event) => store.patch({ riders: Number(event.target.value) })}
        >
          {(cap > 0 ? Array.from({ length: cap }, (_, index) => index + 1) : [1]).map(
            (count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ),
          )}
        </select>
      </label>

      <fieldset className="book-field">
        <legend>{t("addons")}</legend>
        <div className="addon-board">
          {addons.map((addon) => {
            const on = selectedAddons.includes(addon.slug);
            return (
              <label key={addon.id} className={cn("addon-card", on && "is-on")}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleAddon(addon.slug)}
                />
                <img src={addonImage(addon.slug)} alt="" />
                <span className="addon-card-copy">
                  <span className="addon-card-top">
                    <strong>{addon.translation.name}</strong>
                    <b>+{formatJpy(addon.price_jpy, locale)}</b>
                  </span>
                  <small>{addon.translation.description}</small>
                  <em>{on ? t("addonOn") : t("addonAdd")}</em>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="book-grid">
        <label className="book-field">
          <span>{t("name")}</span>
          <input
            value={hydrated ? store.name : ""}
            onChange={(event) => store.patch({ name: event.target.value })}
            autoComplete="name"
            required
          />
        </label>
        <label className="book-field">
          <span>{t("email")}</span>
          <input
            type="email"
            value={hydrated ? store.email : ""}
            onChange={(event) => store.patch({ email: event.target.value })}
            autoComplete="email"
            required
          />
        </label>
      </div>

      <label className="book-field">
        <span>{t("phone")}</span>
        <input
          type="tel"
          value={hydrated ? store.phone : ""}
          onChange={(event) => store.patch({ phone: event.target.value })}
          autoComplete="tel"
          required
        />
      </label>

      <RideNoteChecks checked={notes} onToggle={toggleNote} />

      <div className="book-total">
        <span>{t("total")}</span>
        <strong>
          {formatJpy(total, locale)}
          <small>{t("taxIncluded")}</small>
        </strong>
      </div>

      <button type="submit" className="cta-btn book-submit" disabled={!notesOk}>
        {t("submit")}
      </button>
    </form>
  );
}
