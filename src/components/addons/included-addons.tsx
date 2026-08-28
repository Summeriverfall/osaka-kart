"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLiveCatalog } from "@/lib/live-catalog";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

export function IncludedAddonsList({
  addons,
  title,
}: {
  addons: AddonWithTranslation[];
  title?: string;
}) {
  const t = useTranslations("Plan");
  if (!addons.length) return null;
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{title ?? t("includedAddons")}</p>
      <ul className="space-y-2">
        {addons.map((addon) => (
          <li key={addon.id} className="addon-included">
            <Check className="size-4" aria-hidden />
            <span>{addon.translation.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IncludedAddonsLive({
  plan,
  addons,
  locale,
}: {
  plan: PlanWithTranslation;
  addons: AddonWithTranslation[];
  locale: string;
}) {
  const { includedAddons } = useLiveCatalog([plan], addons, locale, plan.slug);
  return <IncludedAddonsList addons={includedAddons} />;
}
