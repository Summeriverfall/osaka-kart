"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { bookingHref } from "@/lib/booking/path";
import type { PlanWithTranslation } from "@/lib/plans/types";
import type { SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";
import type { LandingCopy } from "@/components/landing/copy";

type PlanShowcaseProps = {
  plans: PlanWithTranslation[];
  locale: string;
  theme: SiteTheme;
  labels: LandingCopy["labels"];
};

export function PlanShowcase({
  plans,
  locale,
  theme,
  labels,
}: PlanShowcaseProps) {
  const planT = useTranslations("Plan");
  const [slug, setSlug] = useState(plans[0]?.slug ?? "");
  const active = plans.find((plan) => plan.slug === slug) ?? plans[0];
  const minutes = (n: number) => planT("minutes", { n });
  const km = (n: number) => planT("km", { n });

  if (!active) return null;

  if (theme === "hud") {
    return (
      <div className="hud-plan">
        <div className="hud-plan-head">
          <span>ID</span>
          <span>UNIT</span>
          <span>TIME</span>
          <span>JPY</span>
        </div>
        {plans.map((plan, index) => {
          const selected = plan.slug === active.slug;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSlug(plan.slug)}
              className={cn("hud-plan-row", selected && "is-on")}
            >
              <span>P-{String(index + 1).padStart(2, "0")}</span>
              <span>{plan.translation.name}</span>
              <span>{minutes(plan.duration_minutes)}</span>
              <span>{formatJpy(plan.base_price_jpy, locale)}</span>
            </button>
          );
        })}

        <pre className="hud-plan-dump">
{`> LOAD ${active.slug.toUpperCase()}
> ${labels.route.toUpperCase()}  ${active.translation.route_summary || "—"}
> ${labels.includes.toUpperCase()}
${active.translation.includes.map((item) => `  - ${item}`).join("\n")}
> ${labels.notes.toUpperCase()}
${active.translation.requirements.map((item) => `  - ${item}`).join("\n")}`}
        </pre>
        <Link href={bookingHref(theme, active.slug)} className="cta-btn mt-6 inline-flex px-6 py-3">
          {labels.continue}
        </Link>
      </div>
    );
  }

  if (theme === "acid") {
    return (
      <div className="acid-plan">
        <div className="acid-ticket-col">
          {plans.map((plan) => {
            const selected = plan.slug === active.slug;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSlug(plan.slug)}
                className={cn("acid-ticket", selected && "is-on")}
              >
                <span className="acid-ticket-name">{plan.translation.name}</span>
                <span className="acid-ticket-price">
                  {formatJpy(plan.base_price_jpy, locale)}
                </span>
                <span className="acid-ticket-meta">
                  {minutes(plan.duration_minutes)}
                  {plan.distance_km != null ? ` / ${km(plan.distance_km)}` : ""}
                </span>
              </button>
            );
          })}
        </div>

        <article className="acid-plan-sheet">
          <h3>{active.translation.name}</h3>
          <p>{active.translation.description}</p>
          {active.translation.route_summary && (
            <p className="acid-route">
              {labels.route} — {active.translation.route_summary}
            </p>
          )}
          <ul>
            {active.translation.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href={bookingHref(theme, active.slug)} className="cta-btn mt-6 inline-flex px-6 py-3">
            {labels.continue}
          </Link>
        </article>
      </div>
    );
  }

  return (
    <div className="neon-plan">
      <div className="neon-plan-grid">
        {plans.map((plan) => {
          const selected = plan.slug === active.slug;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSlug(plan.slug)}
              className={cn("neon-plan-card", selected && "is-on")}
            >
              <p className="neon-plan-name">{plan.translation.name}</p>
              <p className="neon-plan-price">
                {formatJpy(plan.base_price_jpy, locale)}
                <span>{labels.perPerson}</span>
              </p>
              <p className="neon-plan-meta">
                {minutes(plan.duration_minutes)}
                {plan.distance_km != null ? ` · ${km(plan.distance_km)}` : ""}
              </p>
            </button>
          );
        })}
      </div>

      <article className="neon-plan-detail">
        <div className="neon-plan-media" aria-hidden />
        <div className="neon-plan-copy">
          <h3>{active.translation.name}</h3>
          <p>{active.translation.description}</p>
          {active.translation.route_summary && (
            <p className="neon-route">
              {labels.route} · {active.translation.route_summary}
            </p>
          )}
          <ul>
            {active.translation.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href={bookingHref(theme, active.slug)} className="cta-btn mt-6 inline-flex px-6 py-3">
            {labels.continue}
          </Link>
        </div>
      </article>
    </div>
  );
}
