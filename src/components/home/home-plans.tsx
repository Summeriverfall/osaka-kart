"use client";

import { type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { formatJpy } from "@/lib/format";
import { useLivePlans } from "@/lib/live-catalog";
import { coverOf } from "@/lib/media";
import { appPageHref, isFileProtocol, navigateToHref } from "@/lib/file-href";
import { withSlash } from "@/lib/paths";
import type { PlanWithTranslation } from "@/lib/plans/types";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
  sectionId?: string;
  kicker?: string;
  heading?: boolean;
};

export function HomePlans({ plans: seedPlans, locale, sectionId = "plans", kicker, heading = true }: Props) {
  const t = useTranslations("PlansHome");
  const planT = useTranslations("Plan");
  const nav = useTranslations("Nav");
  const plans = useLivePlans(seedPlans, locale);

  const go = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isFileProtocol()) return;
    event.preventDefault();
    navigateToHref(path, locale);
  };

  const deck = (
    <div className="ok-pack-grid">
      {plans.map((plan) => {
        const points = plan.translation.highlights.slice(0, 3);
        const bookPath = withSlash(`/booking?plan=${plan.slug}`);
        const detailPath = withSlash(`/plan/${plan.slug}`);
        return (
          <article key={plan.id} className="ok-pack-card">
            <div className="ok-pack-photo">
              <img src={coverOf(plan)} alt="" />
              <span className="ok-pack-chip">{planT("minutes", { n: plan.duration_minutes })}</span>
            </div>
            <div className="ok-pack-copy">
              <h3>{plan.translation.name}</h3>
              <p className="ok-pack-meta">
                {planT("minutes", { n: plan.duration_minutes })}
                {plan.distance_km != null ? ` · ${planT("km", { n: plan.distance_km })}` : ""}
              </p>
              <p className="ok-pack-desc">{plan.translation.description}</p>
              {points.length ? (
                <ul className="ok-pack-points">
                  {points.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              <p className="ok-pack-price">
                {formatJpy(plan.base_price_jpy, locale)}
                <span>{planT("perPerson")}</span>
              </p>
              <div className="ok-pack-actions">
                <a className="ok-btn" href={appPageHref(bookPath, locale)} onClick={go(bookPath)}>
                  {nav("booking")}
                </a>
                <a className="ok-btn-ghost" href={appPageHref(detailPath, locale)} onClick={go(detailPath)}>
                  {t("details")}
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  if (!heading) return deck;

  return (
    <section id={sectionId} className="ok-sec">
      <div className="ok-sec-wide">
        <header className="ok-sec-head">
          {kicker ? <p className="ok-kicker">{kicker}</p> : null}
          <h2>{t("title")}</h2>
        </header>
        {deck}
      </div>
    </section>
  );
}
