"use client";

import { useLiveCatalog } from "@/lib/live-catalog";
import type { PlanWithTranslation } from "@/lib/plans/types";

export function LivePlanHeading({
  plan,
  locale,
}: {
  plan: PlanWithTranslation;
  locale: string;
}) {
  const { plan: live } = useLiveCatalog([plan], [], locale, plan.slug);
  const name = live?.translation.name || plan.translation.name;
  return (
    <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
      {name}
    </h1>
  );
}
