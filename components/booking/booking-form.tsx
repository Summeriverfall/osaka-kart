"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { addonImage } from "@/lib/media";
import { cn } from "@/lib/utils";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { BOOKING_SLOTS } from "@/lib/booking/slots";
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
  const riders = Math.min(
    Math.max(hydrated ? store.riders : 1, 1),
    plan?.max_participants ?? 1,
  );
  const selectedAddons = hydrated ? store.addonSlugs : [];

  const total = useMemo(() => {
    if (!plan) return 0;
    const extras = addons
      .filter((addon) => selectedAddons.includes(addon.slug))
      .reduce((sum, addon) => sum + addon.price_jpy, 0);
    return plan.base_price_jpy * riders + extras;
  }, [plan, riders, addons, selectedAddons]);

  if (!plan) return null;

  function toggleAddon(slug: string) {
    const next = selectedAddons.includes(slug)
      ? selectedAddons.filter((item) => item !== slug)
      : [...selectedAddons, slug];
    store.patch({ addonSlugs: next });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!store.date || !store.time || !store.licenseOk) return;

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
    router.push(`/success?ref=${result.ref}`);
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

      <div className="book-grid">
        <label className="book-field">
          <span>{t("riders")}</span>
          <select
            value={riders}
            onChange={(event) => store.patch({ riders: Number(event.target.value) })}
          >
            {Array.from({ length: plan.max_participants }, (_, index) => index + 1).map(
              (count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <div className="book-cal-field">
        <span>{t("date")}</span>
        <MonthCalendar
          locale={locale}
          priceJpy={plan.base_price_jpy}
          value={hydrated ? store.date : ""}
          onChange={(iso) => store.patch({ date: iso, time: "" })}
        />
        <input type="hidden" name="date" value={hydrated ? store.date : ""} required />
      </div>

      <fieldset className="book-field">
        <legend>{t("time")}</legend>
        <div className="book-slots">
          {BOOKING_SLOTS.map((slot) => (
            <label key={slot} className={store.time === slot ? "is-on" : undefined}>
              <input
                type="radio"
                name="time"
                value={slot}
                checked={hydrated && store.time === slot}
                onChange={() => store.patch({ time: slot })}
                required
              />
              {slot}
            </label>
          ))}
        </div>
      </fieldset>

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
                    <b>{formatJpy(addon.price_jpy, locale)}</b>
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

      <label className="book-check">
        <input
          type="checkbox"
          checked={hydrated && store.licenseOk}
          onChange={(event) => store.patch({ licenseOk: event.target.checked })}
          required
        />
        <span>{t("license")}</span>
      </label>

      <div className="book-total">
        <span>{t("total")}</span>
        <strong>
          {formatJpy(total, locale)}
          <small>{t("taxIncluded")}</small>
        </strong>
      </div>

      <button type="submit" className="cta-btn book-submit">
        {t("submit")}
      </button>
    </form>
  );
}
