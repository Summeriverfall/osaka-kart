"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE_CONTACT } from "@/lib/contact";
import {
  dayStatus,
  slotRemaining as fallbackSlotRemaining,
  type DayStatus,
} from "@/lib/calendar";
import type { MockAddon } from "@/lib/mock/addons";
import type { MockPlan } from "@/lib/mock/plans";
import type { MockSpecialDate } from "@/lib/mock/inventory";
import type { MockSettings, MockStore } from "@/lib/mock/settings";
import type { MockVehicle } from "@/lib/mock/vehicles";
import { vehicleIdsForStore } from "@/lib/ops-inventory";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";
import { DEFAULT_STORE_ID, storeIdOf } from "@/lib/store-id";
import { scheduleOpsRehydrate, useOpsStore } from "@/stores/ops-store";
import type { PayMethod } from "@/components/booking/pay-icons";
import type { VehicleSlotCell } from "@/lib/mock/vehicle-timeline";

export function useOpsHydrated() {
  const [ready, setReady] = useState(() =>
    typeof window === "undefined" ? false : useOpsStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (useOpsStore.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsub = useOpsStore.persist.onFinishHydration(() => setReady(true));
    scheduleOpsRehydrate();
    return unsub;
  }, []);

  return ready;
}

function localePlanName(plan: MockPlan, locale: string, fallback: string) {
  if (locale.startsWith("ja") && plan.nameJa) return plan.nameJa;
  if (locale.startsWith("en") && plan.nameEn) return plan.nameEn;
  if (locale.startsWith("ko") && plan.nameKo) return plan.nameKo;
  return plan.name || fallback;
}

function localePlanDescription(plan: MockPlan, locale: string, fallback: string) {
  if (locale.startsWith("ja") && plan.descriptionJa?.trim()) return plan.descriptionJa;
  if (locale.startsWith("en") && plan.descriptionEn?.trim()) return plan.descriptionEn;
  if (locale.startsWith("ko") && plan.descriptionKo?.trim()) return plan.descriptionKo;
  if (locale.startsWith("zh") && plan.description?.trim()) return plan.description;
  return fallback;
}

function localePlanHighlights(plan: MockPlan, locale: string, fallback: string[]) {
  if (locale.startsWith("ja") && plan.highlightsJa?.some((item) => item.trim())) return plan.highlightsJa;
  if (locale.startsWith("en") && plan.highlightsEn?.some((item) => item.trim())) return plan.highlightsEn;
  if (locale.startsWith("ko") && plan.highlightsKo?.some((item) => item.trim())) return plan.highlightsKo;
  if (locale.startsWith("zh") && plan.highlights?.some((item) => item.trim())) return plan.highlights;
  return fallback;
}

function localeAddonName(addon: MockAddon, locale: string, fallback: string) {
  if (locale.startsWith("ja") && addon.nameJa) return addon.nameJa;
  if (locale.startsWith("en") && addon.nameEn) return addon.nameEn;
  if (locale.startsWith("ko") && addon.nameEn) return addon.nameEn;
  return addon.name || fallback;
}

function mockPlanToPublic(plan: MockPlan, locale: string): PlanWithTranslation {
  const name = localePlanName(plan, locale, plan.name);
  return {
    id: plan.id,
    slug: plan.slug,
    duration_minutes: plan.durationMinutes,
    distance_km: plan.distanceKm,
    base_price_jpy: plan.priceJpy,
    max_participants: plan.maxRiders,
    is_active: plan.active,
    source: "seed",
    cover_image: plan.coverImage,
    detail_image: plan.detailImage,
    translation: {
      locale,
      name,
      description: localePlanDescription(plan, locale, plan.includes.join(" · ")),
      highlights: localePlanHighlights(plan, locale, plan.includes.slice(0, 3)),
      route_summary: "",
      includes: plan.includes,
      requirements: [],
    },
  };
}

export function overlayPlan(
  seed: PlanWithTranslation,
  opsPlans: MockPlan[],
  locale: string,
): PlanWithTranslation {
  const live = opsPlans.find((item) => item.slug === seed.slug);
  if (!live) return seed;
  return {
    ...seed,
    duration_minutes: live.durationMinutes,
    distance_km: live.distanceKm,
    base_price_jpy: live.priceJpy,
    max_participants: live.maxRiders,
    is_active: live.active,
    cover_image: live.coverImage?.trim() || seed.cover_image,
    detail_image: live.detailImage?.trim() || undefined,
    translation: {
      ...seed.translation,
      name: localePlanName(live, locale, seed.translation.name),
      description: localePlanDescription(live, locale, seed.translation.description),
      highlights: localePlanHighlights(live, locale, seed.translation.highlights),
      includes: live.includes.length ? live.includes : seed.translation.includes,
    },
  };
}

export function overlayPlans(
  seed: PlanWithTranslation[],
  opsPlans: MockPlan[],
  locale: string,
  includeInactive = false,
): PlanWithTranslation[] {
  const used = new Set<string>();
  const out: PlanWithTranslation[] = [];
  for (const plan of seed) {
    const next = overlayPlan(plan, opsPlans, locale);
    used.add(plan.slug);
    if (includeInactive || next.is_active) out.push(next);
  }
  for (const live of opsPlans) {
    if (used.has(live.slug)) continue;
    if (!includeInactive && !live.active) continue;
    out.push(mockPlanToPublic(live, locale));
  }
  return out;
}

export function overlayAddons(
  seed: AddonWithTranslation[],
  opsAddons: MockAddon[],
  locale: string,
): AddonWithTranslation[] {
  const used = new Set<string>();
  const out: AddonWithTranslation[] = [];
  for (const addon of seed) {
    const live = opsAddons.find((item) => item.slug === addon.slug);
    used.add(addon.slug);
    if (live && !live.active) continue;
    if (!live && !addon.is_active) continue;
    out.push(
      live
        ? {
            ...addon,
            price_jpy: live.priceJpy,
            max_qty: live.maxQty,
            is_active: live.active,
            translation: {
              ...addon.translation,
              name: localeAddonName(live, locale, addon.translation.name),
              description: live.description || addon.translation.description,
            },
          }
        : addon,
    );
  }
  for (const live of opsAddons) {
    if (used.has(live.slug) || !live.active) continue;
    out.push({
      id: live.id,
      slug: live.slug,
      price_jpy: live.priceJpy,
      max_qty: live.maxQty,
      is_active: live.active,
      source: "seed",
      translation: {
        locale,
        name: localeAddonName(live, locale, live.name),
        description: live.description,
      },
    });
  }
  return out;
}

export function filterAddonsForPlan(
  addons: AddonWithTranslation[],
  opsPlan: MockPlan | undefined,
  opsAddons: MockAddon[],
) {
  if (!opsPlan?.allowedAddonIds?.length) return addons;
  const allowedSlugs = new Set(
    opsPlan.allowedAddonIds.map((id) => opsAddons.find((item) => item.id === id)?.slug ?? id),
  );
  return addons.filter((addon) => allowedSlugs.has(addon.slug));
}

export function useLiveCatalog(
  seedPlans: PlanWithTranslation[],
  seedAddons: AddonWithTranslation[],
  locale: string,
  planSlug?: string,
) {
  const opsPlans = useOpsStore((state) => state.plans);
  const opsAddons = useOpsStore((state) => state.addons);
  const hydrated = useOpsHydrated();

  return useMemo(() => {
    const liveOps = hydrated ? opsPlans : [];
    const plans = overlayPlans(seedPlans, liveOps, locale);
    const allAddons = overlayAddons(seedAddons, hydrated ? opsAddons : [], locale);
    const listed = planSlug ? plans.find((item) => item.slug === planSlug) : undefined;
    const seedMatch = planSlug
      ? seedPlans.find((item) => item.slug === planSlug)
      : seedPlans[0];
    const opsMatch = planSlug ? liveOps.find((item) => item.slug === planSlug) : liveOps[0];
    const plan =
      listed ??
      (seedMatch
        ? overlayPlan(seedMatch, liveOps, locale)
        : opsMatch
          ? mockPlanToPublic(opsMatch, locale)
          : plans[0]);
    const opsPlan = liveOps.find((item) => item.slug === plan?.slug);
    const addons = filterAddonsForPlan(allAddons, opsPlan, opsAddons);
    return { plans, addons, allAddons, plan, opsPlan };
  }, [seedPlans, seedAddons, locale, planSlug, opsPlans, opsAddons, hydrated]);
}

export function useLivePlans(seedPlans: PlanWithTranslation[], locale: string) {
  const opsPlans = useOpsStore((state) => state.plans);
  const hydrated = useOpsHydrated();
  return useMemo(
    () => overlayPlans(seedPlans, hydrated ? opsPlans : [], locale),
    [seedPlans, opsPlans, locale, hydrated],
  );
}

function dateClosed(
  iso: string,
  specialDates: MockSpecialDate[],
  storeId: string,
) {
  return specialDates.some(
    (row) => row.date === iso && row.closed && storeIdOf(row.storeId) === storeId,
  );
}

export function liveSlotRemaining(
  iso: string,
  time: string,
  slots: VehicleSlotCell[],
  vehicles: MockVehicle[],
  specialDates: MockSpecialDate[],
  storeId = DEFAULT_STORE_ID,
) {
  if (!iso || !time) return 0;
  if (dateClosed(iso, specialDates, storeId)) return 0;
  const ids = new Set(vehicleIdsForStore(vehicles, storeId));
  const cells = slots.filter(
    (cell) => cell.date === iso && cell.time === time && ids.has(cell.vehicleId),
  );
  if (!cells.length) return fallbackSlotRemaining(iso, time);
  return cells.reduce((sum, cell) => sum + (cell.closed ? 0 : cell.remaining), 0);
}

export function liveDayRemaining(
  iso: string,
  slots: VehicleSlotCell[],
  vehicles: MockVehicle[],
  specialDates: MockSpecialDate[],
  storeId = DEFAULT_STORE_ID,
) {
  const times = Array.from(new Set(slots.filter((cell) => cell.date === iso).map((cell) => cell.time)));
  const list = times.length ? times : ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
  return Math.max(0, ...list.map((time) => liveSlotRemaining(iso, time, slots, vehicles, specialDates, storeId)));
}

export function liveDayStatus(
  iso: string,
  minIso: string,
  maxIso: string,
  slots: VehicleSlotCell[],
  vehicles: MockVehicle[],
  specialDates: MockSpecialDate[],
  storeId = DEFAULT_STORE_ID,
): DayStatus {
  if (iso < minIso || iso > maxIso) return "closed";
  if (dateClosed(iso, specialDates, storeId)) return "closed";
  const ids = new Set(vehicleIdsForStore(vehicles, storeId));
  const hasRows = slots.some((cell) => cell.date === iso && ids.has(cell.vehicleId));
  if (!hasRows) return dayStatus(iso, minIso, maxIso);
  const left = liveDayRemaining(iso, slots, vehicles, specialDates, storeId);
  if (left <= 0) return "closed";
  if (left <= 2) return "ask";
  if (left <= 6) return "busy";
  return "open";
}

export function liveSlotStatus(
  iso: string,
  time: string,
  minIso: string,
  maxIso: string,
  slots: VehicleSlotCell[],
  vehicles: MockVehicle[],
  specialDates: MockSpecialDate[],
  storeId = DEFAULT_STORE_ID,
): DayStatus {
  if (iso < minIso || iso > maxIso) return "closed";
  const left = liveSlotRemaining(iso, time, slots, vehicles, specialDates, storeId);
  if (left <= 0) return "closed";
  if (left <= 2) return "ask";
  if (left <= 4) return "busy";
  return "open";
}

export function useLiveInventory(storeId = DEFAULT_STORE_ID) {
  const vehicleSlots = useOpsStore((state) => state.vehicleSlots);
  const specialDates = useOpsStore((state) => state.specialDates);
  const vehicles = useOpsStore((state) => state.vehicles);

  return useMemo(() => {
    const remaining = (iso: string, time: string) =>
      liveSlotRemaining(iso, time, vehicleSlots, vehicles, specialDates, storeId);
    const dayLeft = (iso: string) =>
      liveDayRemaining(iso, vehicleSlots, vehicles, specialDates, storeId);
    return {
      remaining,
      dayRemaining: dayLeft,
      dayStatus: (iso: string, minIso: string, maxIso: string) =>
        liveDayStatus(iso, minIso, maxIso, vehicleSlots, vehicles, specialDates, storeId),
      slotStatus: (iso: string, time: string, minIso: string, maxIso: string) =>
        liveSlotStatus(iso, time, minIso, maxIso, vehicleSlots, vehicles, specialDates, storeId),
      riderCap: (date: string, time: string) => (date && time ? remaining(date, time) : 0),
      clampRiders: (riders: number, date: string, time: string) => {
        const cap = date && time ? remaining(date, time) : 0;
        if (cap <= 0) return 1;
        return Math.min(Math.max(Math.floor(riders) || 1, 1), cap);
      },
    };
  }, [vehicleSlots, specialDates, vehicles, storeId]);
}

export function enabledPayMethods(settings: MockSettings): PayMethod[] {
  const channel = (id: string) => settings.payments.find((item) => item.id === id);
  const on = (id: string) => {
    const row = channel(id);
    return Boolean(row?.enabled && !row.reserved);
  };
  const methods: PayMethod[] = [];
  if (on("stripe") || settings.stripe) {
    methods.push("card", "stripe");
  }
  if (settings.paypay) methods.push("paypay");
  if (on("apple") || settings.applePay) methods.push("apple");
  if (on("alipay")) methods.push("alipay");
  if (on("wechat")) methods.push("wechat");
  return methods.length ? methods : ["card"];
}

export function liveStoreContact(stores: MockStore[]) {
  const namba = stores.find((item) => item.id === DEFAULT_STORE_ID);
  const placeholder = !namba?.phone || /0000|待开通/.test(namba.phone);
  return {
    name: namba?.name ?? "",
    address: namba?.address ?? "",
    hours: namba?.hours || SITE_CONTACT.hours,
    phone: placeholder ? SITE_CONTACT.phone : namba.phone,
    maps: namba?.maps ?? SITE_CONTACT.whatsapp,
  };
}

export function useLiveStoreContact() {
  const stores = useOpsStore((state) => state.stores);
  const hydrated = useOpsHydrated();
  return useMemo(
    () => liveStoreContact(hydrated ? stores : []),
    [stores, hydrated],
  );
}
