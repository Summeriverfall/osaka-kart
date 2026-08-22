"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { formatJpy } from "@/lib/format";
import { useLivePlans } from "@/lib/live-catalog";
import { planImage, planRoute } from "@/lib/media";
import { useBookingStore } from "@/stores/booking-store";
import type { PlanWithTranslation } from "@/lib/plans/types";
import { cn } from "@/lib/utils";
import type { LandingCopy } from "@/components/landing/copy";

type PlanShowcaseProps = {
  plans: PlanWithTranslation[];
  locale: string;
  labels: LandingCopy["labels"];
};

export function PlanShowcase({ plans: seedPlans, locale, labels }: PlanShowcaseProps) {
  const planT = useTranslations("Plan");
  const store = useBookingStore();
  const plans = useLivePlans(seedPlans, locale);
  const minutes = (n: number) => planT("minutes", { n });
  const km = (n: number) => planT("km", { n });
  const activeSlug = store.planSlug && plans.some((item) => item.slug === store.planSlug)
    ? store.planSlug
    : plans[0]?.slug ?? "";

  useEffect(() => {
    if (!store.planSlug && plans[0]) {
      store.patch({ planSlug: plans[0].slug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed default plan once
  }, []);

  return (
    <div className="plan-board">
      {plans.map((plan) => {
        const selected = plan.slug === activeSlug;
        return (
          <article key={plan.id} className={cn("plan-card", selected && "is-on")}>
            <img className="plan-card-shot" src={planImage(plan.slug)} alt="" />
            <div className="plan-card-body">
              <h3>{plan.translation.name}</h3>
              <p className="plan-card-price">
                {formatJpy(plan.base_price_jpy, locale)}
                <span>{labels.perPerson}</span>
              </p>
              <p className="plan-card-meta">
                {minutes(plan.duration_minutes)}
                {plan.distance_km != null ? ` · ${km(plan.distance_km)}` : ""}
              </p>
              <p className="plan-card-desc">{plan.translation.description}</p>
              <ul>
                {plan.translation.highlights.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <img
                className="plan-card-route"
                src={planRoute(plan.slug)}
                alt=""
              />
              {selected ? (
                <a href="#book" className="cta-btn cta-btn-solid">
                  {labels.continue}
                </a>
              ) : (
                <button
                  type="button"
                  className="cta-btn cta-btn-ghost"
                  onClick={() => store.patch({ planSlug: plan.slug })}
                >
                  {labels.select}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
