"use client";

import { useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { addonImage } from "@/lib/media";
import { withSlash } from "@/lib/paths";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";
import { useBookingStore } from "@/stores/booking-store";

type PlanSummaryCardProps = {
  plan: PlanWithTranslation;
  addons: AddonWithTranslation[];
  locale: string;
};

export function PlanSummaryCard({ plan, addons, locale }: PlanSummaryCardProps) {
  const t = useTranslations("Plan");
  const router = useRouter();
  const store = useBookingStore();

  useEffect(() => {
    store.setPlan(plan.id, plan.slug, plan.translation.name, plan.base_price_jpy);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bind this plan once per slug
  }, [plan.id, plan.slug, plan.translation.name, plan.base_price_jpy]);

  const extras = addons.reduce((sum, addon) => {
    const qty = store.addons.find((item) => item.id === addon.id)?.qty ?? 0;
    return sum + addon.price_jpy * qty;
  }, 0);
  const total = plan.base_price_jpy * Math.max(store.riders, 1) + extras;

  function qtyOf(id: string) {
    return store.addons.find((item) => item.id === id)?.qty ?? 0;
  }

  function setQty(addon: AddonWithTranslation, qty: number) {
    const next = Math.min(Math.max(qty, 0), addon.max_qty);
    if (next <= 0) {
      store.removeAddon(addon.id);
      return;
    }
    if (!store.addons.some((item) => item.id === addon.id)) {
      store.addAddon({
        id: addon.id,
        slug: addon.slug,
        name: addon.translation.name,
        price: addon.price_jpy,
        qty: next,
      });
      return;
    }
    store.updateAddonQty(addon.id, next);
  }

  function continueBooking() {
    store.setPlan(plan.id, plan.slug, plan.translation.name, plan.base_price_jpy);
    store.calcTotal();
    router.push(withSlash(`/booking?plan=${plan.slug}`));
  }

  return (
    <div className="plan-summary-card lg:sticky lg:top-24">
      <p className="text-xs tracking-[0.18em] text-[#9CA3AF] uppercase">
        {t("summary")}
      </p>
      <h2 className="mt-3 text-2xl font-black text-[#F1F1F5]">
        {plan.translation.name}
      </h2>
      <p className="neon-text mt-2 text-4xl font-black">
        {formatJpy(plan.base_price_jpy, locale)}
        <span className="ml-1 text-sm font-medium text-[#9CA3AF]">
          {t("perPerson")}
        </span>
      </p>
      <p className="mt-2 text-sm text-[#9CA3AF]">
        {t("minutes", { n: plan.duration_minutes })}
        {plan.distance_km != null ? ` · ${t("km", { n: plan.distance_km })}` : ""}
      </p>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#F1F1F5]">{t("addons")}</p>
        <ul className="mt-3 space-y-3">
          {addons.map((addon) => {
            const qty = qtyOf(addon.id);
            return (
              <li
                key={addon.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 p-2"
              >
                <img
                  src={addonImage(addon.slug)}
                  alt=""
                  className="size-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{addon.translation.name}</p>
                  <p className="text-xs text-[#9CA3AF]">
                    {formatJpy(addon.price_jpy, locale)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="plan-qty-btn"
                    onClick={() => setQty(addon, qty - 1)}
                    aria-label="-"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm">{qty}</span>
                  <button
                    type="button"
                    className="plan-qty-btn"
                    onClick={() => setQty(addon, qty + 1)}
                    disabled={qty >= addon.max_qty}
                    aria-label="+"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="flex items-center justify-between text-sm text-[#9CA3AF]">
          <span>{t("addonTotal")}</span>
          <span>{formatJpy(extras, locale)}</span>
        </p>
        <p className="mt-2 flex items-center justify-between text-lg font-black">
          <span>{t("grandTotal")}</span>
          <span>{formatJpy(total, locale)}</span>
        </p>
      </div>

      <button type="button" className="cta-btn mt-6 w-full px-4 py-3" onClick={continueBooking}>
        {t("continue")}
      </button>
      <Link href={withSlash("/plan")} className="mt-3 block text-center text-sm text-[#9CA3AF] underline">
        {t("changePlan")}
      </Link>
    </div>
  );
}
