"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { useLivePlans } from "@/lib/live-catalog";
import { coverOf } from "@/lib/media";
import { withSlash } from "@/lib/paths";
import { PLAN_SLUGS } from "@/lib/plans/seed";
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
  const plans = useLivePlans(seedPlans, locale);

  const grid = (
    <div className="ok-pkgs">
      {plans.map((plan, index) => {
        const href = (PLAN_SLUGS as readonly string[]).includes(plan.slug)
          ? withSlash(`/plan/${plan.slug}`)
          : withSlash(`/booking?plan=${plan.slug}`);
        const points = plan.translation.highlights.slice(0, 3);
        return (
          <article key={plan.id} className="ok-pkg">
            <div className="ok-pkg-shot">
              <img src={coverOf(plan)} alt="" />
              <span className="ok-pkg-idx">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="ok-pkg-body">
              <p className="ok-pkg-time">{plan.duration_minutes}</p>
              <h3>{plan.translation.name}</h3>
              <p className="ok-pkg-meta">
                {planT("minutes", { n: plan.duration_minutes })}
                {plan.distance_km != null ? ` · ${planT("km", { n: plan.distance_km })}` : ""}
              </p>
              {points.length ? (
                <ul className="ok-pkg-points">
                  {points.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="ok-pkg-desc">{plan.translation.description}</p>
              )}
              <p className="ok-pkg-price">
                {formatJpy(plan.base_price_jpy, locale)}
                <span>{planT("perPerson")}</span>
              </p>
              <Link href={href} className="ok-pkg-go">
                {t("select")}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );

  if (!heading) return grid;

  return (
    <section id={sectionId} className="ok-sec">
      <div className="ok-sec-wide">
        <header className="ok-sec-head">
          {kicker ? <p className="ok-kicker">{kicker}</p> : null}
          <h2>{t("title")}</h2>
        </header>
        {grid}
      </div>
    </section>
  );
}
