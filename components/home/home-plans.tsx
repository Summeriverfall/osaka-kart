"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { planImage } from "@/lib/media";
import { withSlash } from "@/lib/paths";
import type { PlanWithTranslation } from "@/lib/plans/types";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
};

export function HomePlans({ plans, locale }: Props) {
  const t = useTranslations("PlansHome");
  const planT = useTranslations("Plan");

  return (
    <section id="plans" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-3xl font-black md:text-4xl">{t("title")}</h2>
      </div>
      <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:px-[max(1rem,calc((100vw-72rem)/2+1rem))]">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className="w-80 flex-shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-[#12121A]"
          >
            <div className="aspect-video overflow-hidden bg-[#12121A]">
              <img
                src={planImage(plan.slug)}
                alt={plan.translation.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-black">{plan.translation.name}</h3>
              <p className="mt-2 text-2xl font-black">
                {formatJpy(plan.base_price_jpy, locale)}
                <span className="ml-1 text-sm font-medium text-gray-400">
                  {planT("perPerson")}
                </span>
              </p>
              <p className="mt-3 line-clamp-3 text-sm text-gray-400">
                {plan.translation.description}
              </p>
              <Link
                href={withSlash(`/plan/${plan.slug}`)}
                className="cta-btn mt-5 inline-flex w-full px-4 py-2.5 text-center text-sm"
              >
                {t("select")}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
