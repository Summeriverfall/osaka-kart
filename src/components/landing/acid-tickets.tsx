"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { formatJpy } from "@/lib/format";
import { useLivePlans } from "@/lib/live-catalog";
import { coverOf, routeOf } from "@/lib/media";
import { useBookingStore } from "@/stores/booking-store";
import type { PlanWithTranslation } from "@/lib/plans/types";
import { cn } from "@/lib/utils";
import type { LandingCopy } from "@/components/landing/copy";

type AcidTicketsProps = {
  plans: PlanWithTranslation[];
  locale: string;
  labels: LandingCopy["labels"];
  title: string;
  lead: string;
};

export function AcidTickets({ plans: seedPlans, locale, labels, title, lead }: AcidTicketsProps) {
  const planT = useTranslations("Plan");
  const store = useBookingStore();
  const plans = useLivePlans(seedPlans, locale);
  const minutes = (n: number) => planT("minutes", { n });
  const km = (n: number) => planT("km", { n });
  const activeSlug =
    store.planSlug && plans.some((item) => item.slug === store.planSlug)
      ? store.planSlug
      : plans[0]?.slug ?? "";
  const active = plans.find((item) => item.slug === activeSlug) ?? plans[0];

  useEffect(() => {
    if (!store.planSlug && plans[0]) {
      store.patch({ planSlug: plans[0].slug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed default plan once
  }, []);

  if (!active) return null;

  return (
    <section id="plans" className="acid-section acid-plan-band">
      <h2 className="acid-h2">{title}</h2>
      <p className="acid-lead">{lead}</p>
      <div className="acid-plan">
        <div className="acid-ticket-col">
          {plans.map((plan, index) => {
            const on = plan.slug === active.slug;
            return (
              <button
                key={plan.id}
                type="button"
                className={cn("acid-ticket", on && "is-on")}
                onClick={() => store.patch({ planSlug: plan.slug })}
              >
                <span className="acid-ticket-pos">{String(index + 1).padStart(2, "0")}</span>
                <span className="acid-ticket-copy">
                  <span className="acid-ticket-name">{plan.translation.name}</span>
                  <span className="acid-ticket-meta">
                    {minutes(plan.duration_minutes)}
                    {plan.distance_km != null ? ` · ${km(plan.distance_km)}` : ""}
                  </span>
                </span>
                <span className="acid-ticket-price">{formatJpy(plan.base_price_jpy, locale)}</span>
              </button>
            );
          })}
        </div>
        <article className="acid-plan-sheet">
          <img
            className="acid-plan-cover"
            src={coverOf(active)}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <h3>{active.translation.name}</h3>
          <p className="acid-ticket-price">{formatJpy(active.base_price_jpy, locale)}</p>
          <p>
            {minutes(active.duration_minutes)}
            {active.distance_km != null ? ` · ${km(active.distance_km)}` : ""}
            {` · ${labels.perPerson}`}
          </p>
          <p className="acid-route">{active.translation.description}</p>
          <ul>
            {active.translation.highlights.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {routeOf(active) ? (
            <img
              className="acid-plan-route"
              src={routeOf(active)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <a href="#book" className="cta-btn cta-btn-solid">
            {labels.continue}
          </a>
        </article>
      </div>
    </section>
  );
}
