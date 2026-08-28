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
      {plans.map((plan) => {
        const href = (PLAN_SLUGS as readonly string[]).includes(plan.slug)
          ? withSlash(`/plan/${plan.slug}`)
          : withSlash(`/booking?plan=${plan.slug}`);
        return (
          <article key={plan.id} className="ok-pkg">
            <img src={coverOf(plan)} alt={plan.translation.name} />
            <div className="ok-pkg-body">
              <h3>{plan.translation.name}</h3>
              <p className="ok-pkg-price">
                {formatJpy(plan.base_price_jpy, locale)}
                <span>{planT("perPerson")}</span>
              </p>
              <p className="line-clamp-3">{plan.translation.description}</p>
              <Link href={href} className="ok-btn ok-btn-sm">
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
