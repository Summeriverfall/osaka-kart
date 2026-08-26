"use client";

import { Camera, Image as ImageIcon, Minus, Plus, Shield, Shirt } from "lucide-react";
import { formatYenShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/stores/booking-store";

export type AddonCardModel = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceJpy: number;
  unitLabel: string;
  maxQty: number;
};

const ICONS = {
  gopro: Camera,
  costume: Shirt,
  photos: ImageIcon,
  insurance: Shield,
} as const;

type AddonPickerProps = {
  addons: AddonCardModel[];
  ctaLabel: string;
  onCta: () => void;
  sticky?: boolean;
};

export function AddonPicker({ addons, ctaLabel, onCta, sticky = true }: AddonPickerProps) {
  const store = useBookingStore();
  const extras = addons.reduce((sum, addon) => {
    const qty = store.addons.find((item) => item.id === addon.id)?.qty ?? 0;
    return sum + addon.priceJpy * qty;
  }, 0);

  function qtyOf(id: string) {
    return store.addons.find((item) => item.id === id)?.qty ?? 0;
  }

  function setQty(addon: AddonCardModel, qty: number) {
    const next = Math.min(Math.max(qty, 0), addon.maxQty);
    if (next <= 0) {
      store.removeAddon(addon.id);
      return;
    }
    if (!store.addons.some((item) => item.id === addon.id)) {
      store.addAddon({
        id: addon.id,
        slug: addon.slug,
        name: addon.name,
        price: addon.priceJpy,
        qty: next,
      });
      return;
    }
    store.updateAddonQty(addon.id, next);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {addons.map((addon) => {
          const qty = qtyOf(addon.id);
          const selected = qty > 0;
          const Icon = ICONS[addon.slug as keyof typeof ICONS] ?? Camera;
          return (
            <article
              key={addon.id}
              className={cn(
                "rounded-2xl border bg-[#12121A] p-6 transition duration-200",
                selected
                  ? "border-neon-pink shadow-[0_0_28px_rgb(255_46_147_/_35%)]"
                  : "border-white/10 hover:border-neon-purple/60 hover:shadow-[0_0_24px_rgb(168_85_247_/_25%)]",
              )}
            >
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-pink to-neon-purple text-white shadow-[0_0_18px_rgb(255_46_147_/_35%)]">
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-black text-white">{addon.name}</h3>
              <p className="mt-2 min-h-[3rem] text-sm leading-6 text-gray-300">{addon.description}</p>
              <p className="mt-4 text-xl font-black text-neon-pink">
                + {formatYenShort(addon.priceJpy)}
                <span className="ml-1 text-sm font-medium text-gray-400">{addon.unitLabel}</span>
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  className="plan-qty-btn"
                  onClick={() => setQty(addon, qty - 1)}
                  aria-label="decrease"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-lg font-black">{qty}</span>
                <button
                  type="button"
                  className="plan-qty-btn"
                  onClick={() => setQty(addon, qty + 1)}
                  disabled={qty >= addon.maxQty}
                  aria-label="increase"
                >
                  <Plus className="size-3.5" />
                </button>
                {addon.maxQty <= 1 ? (
                  <span className="text-xs text-gray-400">最多 1</span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {sticky ? (
        <div className="addon-sticky-bar">
          <p className="text-sm text-gray-300">
            附加项总计：
            <strong className="ml-2 text-lg font-black text-white">{formatYenShort(extras)}</strong>
          </p>
          <button type="button" className="cta-btn px-6 py-3" onClick={onCta}>
            {ctaLabel}
          </button>
        </div>
      ) : null}
    </>
  );
}
