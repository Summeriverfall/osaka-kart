"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { formatJpy } from "@/lib/format";
import { useLivePlans } from "@/lib/live-catalog";
import { coverOf } from "@/lib/media";
import { appPageHref, isFileProtocol, navigateToHref } from "@/lib/file-href";
import { withSlash } from "@/lib/paths";
import { cn } from "@/lib/utils";
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
  const [on, setOn] = useState(plans[0]?.slug ?? "");

  useEffect(() => {
    if (!plans.some((item) => item.slug === on)) {
      setOn(plans[0]?.slug ?? "");
    }
  }, [plans, on]);

  const current = plans.find((item) => item.slug === on) ?? plans[0];
  const points = current?.translation.highlights.slice(0, 3) ?? [];
  const bookPath = current ? withSlash(`/booking?plan=${current.slug}`) : "";
  const detailPath = current ? withSlash(`/plan/${current.slug}`) : "";
  const bookHref = bookPath ? appPageHref(bookPath, locale) : "";
  const detailHref = detailPath ? appPageHref(detailPath, locale) : "";

  const go = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isFileProtocol()) return;
    event.preventDefault();
    navigateToHref(path, locale);
  };

  const deck = current ? (
    <div className="ok-pack">
      <div className="ok-pack-tabs" role="tablist" aria-label={t("title")}>
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            role="tab"
            id={`pack-tab-${plan.slug}`}
            aria-selected={plan.slug === current.slug}
            className={cn("ok-pack-tab", plan.slug === current.slug && "is-on")}
            onClick={() => setOn(plan.slug)}
          >
            <em>{planT("minutes", { n: plan.duration_minutes })}</em>
            <strong>{plan.translation.name}</strong>
            <span>{formatJpy(plan.base_price_jpy, locale)}</span>
          </button>
        ))}
      </div>

      <article className="ok-pack-board" aria-labelledby={`pack-tab-${current.slug}`}>
        <div className="ok-pack-photo">
          <img src={coverOf(current)} alt="" />
          <span className="ok-pack-chip">{planT("minutes", { n: current.duration_minutes })}</span>
        </div>
        <div className="ok-pack-copy">
          <h3>{current.translation.name}</h3>
          <p className="ok-pack-meta">
            {planT("minutes", { n: current.duration_minutes })}
            {current.distance_km != null ? ` · ${planT("km", { n: current.distance_km })}` : ""}
          </p>
          <p className="ok-pack-desc">{current.translation.description}</p>
          {points.length ? (
            <ul className="ok-pack-points">
              {points.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <p className="ok-pack-price">
            {formatJpy(current.base_price_jpy, locale)}
            <span>{planT("perPerson")}</span>
          </p>
          <div className="ok-pack-actions">
            <a className="ok-btn" href={bookHref} onClick={go(bookPath)}>
              {nav("booking")}
            </a>
            <a className="ok-btn-ghost" href={detailHref} onClick={go(detailPath)}>
              {t("details")}
            </a>
          </div>
        </div>
      </article>
    </div>
  ) : null;

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
