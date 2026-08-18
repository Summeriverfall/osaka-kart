"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { formatJpy } from "@/lib/format";
import { addonImage } from "@/lib/media";
import { clampRiders, riderCap } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/stores/booking-store";
import type {
  AddonWithTranslation,
  PlanWithTranslation,
} from "@/lib/plans/types";

type BookingExtrasProps = {
  plan: PlanWithTranslation;
  addons: AddonWithTranslation[];
  locale: string;
};

export function BookingExtras({ plan, addons, locale }: BookingExtrasProps) {
  const t = useTranslations("Booking");
  const store = useBookingStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const cap = riderCap(hydrated ? store.date : "", hydrated ? store.time : "");
  const riders = clampRiders(hydrated ? store.riders : 1, hydrated ? store.date : "", hydrated ? store.time : "");
  const selectedAddons = hydrated ? store.addonSlugs : [];

  useEffect(() => {
    if (!hydrated) return;
    if (store.riders !== riders) store.patch({ riders });
  }, [hydrated, riders, store.riders, store.patch]);

  const total = useMemo(() => {
    const extras = addons
      .filter((addon) => selectedAddons.includes(addon.slug))
      .reduce((sum, addon) => sum + addon.price_jpy, 0);
    return plan.base_price_jpy * riders + extras;
  }, [plan, riders, addons, selectedAddons]);

  function toggleAddon(slug: string) {
    const next = selectedAddons.includes(slug)
      ? selectedAddons.filter((item) => item !== slug)
      : [...selectedAddons, slug];
    store.patch({ addonSlugs: next });
  }

  return (
    <>
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

      <div className="book-total">
        <span>{t("total")}</span>
        <strong>
          {formatJpy(total, locale)}
          <small>{t("taxIncluded")}</small>
        </strong>
      </div>
    </>
  );
}

export function bookingTotal(
  plan: PlanWithTranslation,
  addons: AddonWithTranslation[],
  riders: number,
  addonSlugs: string[],
) {
  const extras = addons
    .filter((addon) => addonSlugs.includes(addon.slug))
    .reduce((sum, addon) => sum + addon.price_jpy, 0);
  return plan.base_price_jpy * riders + extras;
}
