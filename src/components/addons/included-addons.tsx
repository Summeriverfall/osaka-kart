"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLiveCatalog } from "@/lib/live-catalog";
import { cn } from "@/lib/utils";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

export function IncludedAddonsList({
  addons,
  title,
  prominent = false,
}: {
  addons: AddonWithTranslation[];
  title?: string;
  prominent?: boolean;
}) {
  const t = useTranslations("Plan");
  if (!addons.length) return null;
  return (
    <div className={cn("ok-included", prominent && "is-loud")}>
      <p className="ok-included-kicker">{title ?? t("includedAddons")}</p>
      {prominent ? <p className="ok-included-lead">{t("includedLoud")}</p> : null}
      <ul>
        {addons.map((addon) => (
          <li key={addon.id} className="addon-included">
            <Check className="size-4" aria-hidden />
            <span>{addon.translation.name}</span>
            {prominent ? <em>{t("includedFree")}</em> : null}
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
