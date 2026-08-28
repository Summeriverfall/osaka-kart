"use client";

import { useMemo } from "react";
import { Clock, MapPinned } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { AddonPicker, type AddonCardModel } from "@/components/addons/addon-picker";
import { IncludedAddonsList } from "@/components/addons/included-addons";
import { MonthCalendar } from "@/components/booking/month-calendar";
import { BOOKING_SLOTS, todayIsoDate } from "@/lib/booking/slots";
import { formatJpy } from "@/lib/format";
import { useLiveCatalog, useLiveInventory } from "@/lib/live-catalog";
import { addonUnitLabel } from "@/lib/mock/addons";
import { coverOf } from "@/lib/media";
import { PLAN_SLUGS } from "@/lib/plans/seed";
import { withSlash } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/stores/booking-store";
import { useToastStore } from "@/stores/toast-store";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

type PlanExperienceProps = {
  plan: PlanWithTranslation;
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
};

export function PlanExperience({ plan: seedPlan, plans: seedPlans, addons: seedAddons, locale }: PlanExperienceProps) {
  const t = useTranslations("Plan");
  const book = useTranslations("Booking");
  const router = useRouter();
  const store = useBookingStore();
  const notify = useToastStore((state) => state.notify);
  const minIso = todayIsoDate();
  const live = useLiveInventory();
  const { plans, addons, includedAddons, plan } = useLiveCatalog(seedPlans, seedAddons, locale, seedPlan.slug);
  const current = plan ?? seedPlan;

  const cards: AddonCardModel[] = useMemo(
    () =>
      addons.map((addon) => ({
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
      })),
    [addons, locale],
  );

  function pickSlot(slot: string, full: boolean) {
    if (full) return;
    store.setTimeSlot(slot);
  }

  function addToBooking() {
    store.setPlan(current.id, current.slug, current.translation.name, current.base_price_jpy);
    store.calcTotal();
    notify("已加入预订");
    router.push(withSlash(`/booking?plan=${current.slug}`));
  }

  return (
    <div className="space-y-10">
      <section>
        <p className="mb-4 text-xs tracking-[0.18em] text-neon-cyan uppercase">{t("otherPlans")}</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {plans.map((item) => {
            const on = item.slug === current.slug;
            const href = (PLAN_SLUGS as readonly string[]).includes(item.slug)
              ? withSlash(`/plan/${item.slug}`)
              : withSlash(`/booking?plan=${item.slug}`);
            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  "min-w-[16.5rem] shrink-0 overflow-hidden rounded-2xl border bg-[#12121A] transition hover:shadow-[0_0_20px_rgb(255_46_147_/_25%)]",
                  on ? "border-neon-pink shadow-[0_0_20px_rgb(255_46_147_/_30%)]" : "border-white/10",
                )}
              >
                <img src={coverOf(item)} alt="" className="h-28 w-full object-cover" />
                <div className="p-4">
                  <p className="font-black text-white">{item.translation.name}</p>
                  <p className="mt-1 text-neon-pink">{formatJpy(item.base_price_jpy, locale)}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {t("minutes", { n: item.duration_minutes })}
                    </span>
                    {item.distance_km != null ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPinned className="size-3.5" />
                        {t("km", { n: item.distance_km })}
                      </span>
                    ) : null}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-4 text-xl font-black">{book("date")}</h2>
          <MonthCalendar
            locale={locale}
            priceJpy={current.base_price_jpy}
            value={store.date}
            time={store.time}
            minIso={minIso}
            onChange={(iso) => store.setDate(iso)}
          />
        </div>
        <div>
          <h2 className="mb-4 text-xl font-black">{book("time")}</h2>
          {!store.date ? (
            <p className="rounded-2xl border border-white/10 bg-[#12121A] p-6 text-sm text-gray-300">
              {t("pickDateFirst")}
            </p>
          ) : (
            <div className="book-slots">
              {BOOKING_SLOTS.map((slot) => {
                const left = live.remaining(store.date, slot);
                const full = left <= 0;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={full}
                    onClick={() => pickSlot(slot, full)}
                    className={cn(
                      "rounded-full border px-3 py-3 text-left transition",
                      store.time === slot && "is-on border-neon-pink shadow-[0_0_14px_rgb(255_46_147_/_30%)]",
                      full && "is-full",
                      !full && store.time !== slot && "border-white/15 hover:border-neon-purple",
                    )}
                  >
                    <span>{slot}</span>
                    <small>{full ? t("soldOut") : book("spotsLeft", { n: left })}</small>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="pb-24">
        <IncludedAddonsList addons={includedAddons} />
        <h2 className="mt-8 mb-6 text-xl font-semibold">{book("addons")}</h2>
        <AddonPicker addons={cards} ctaLabel={t("addToBooking")} onCta={addToBooking} />
      </section>
    </div>
  );
}
