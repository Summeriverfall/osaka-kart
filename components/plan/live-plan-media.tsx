"use client";

import { useLivePlans } from "@/lib/live-catalog";
import { coverOf, routeOf } from "@/lib/media";
import type { PlanWithTranslation } from "@/lib/plans/types";

type MediaProps = {
  plan: PlanWithTranslation;
  className?: string;
  alt?: string;
};

export function LivePlanCover({ plan, className, alt = "" }: MediaProps) {
  const locale = plan.translation.locale || "zh-TW";
  const live = useLivePlans([plan], locale)[0] ?? plan;
  return <img src={coverOf(live)} alt={alt} className={className} />;
}

export function LivePlanRoute({ plan, className, alt = "" }: MediaProps) {
  const locale = plan.translation.locale || "zh-TW";
  const live = useLivePlans([plan], locale)[0] ?? plan;
  const src = routeOf(live);
  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}

export function LivePlanDescription({ plan }: { plan: PlanWithTranslation }) {
  const locale = plan.translation.locale || "zh-TW";
  const live = useLivePlans([plan], locale)[0] ?? plan;
  return <>{live.translation.description}</>;
}