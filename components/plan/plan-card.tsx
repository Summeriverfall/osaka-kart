import { Clock, MapPinned } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { planImage } from "@/lib/media";
import { withSlash } from "@/lib/paths";
import type { PlanWithTranslation } from "@/lib/plans/types";

type PlanCardProps = {
  plan: PlanWithTranslation;
  locale: string;
};

export async function PlanCard({ plan, locale }: PlanCardProps) {
  const t = await getTranslations("Plan");
  const { translation } = plan;

  return (
    <article className="skin-card flex h-full flex-col overflow-hidden p-0">
      <div className="relative aspect-video overflow-hidden bg-[#12121A]">
        <img
          src={planImage(plan.slug)}
          alt={translation.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-black tracking-tight text-[#F1F1F5]">
          {translation.name}
        </h3>
        <p className="mt-2 text-2xl font-black text-[#F1F1F5]">
          {formatJpy(plan.base_price_jpy, locale)}
          <span className="ml-1 text-sm font-medium text-[#9CA3AF]">
            {t("perPerson")}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#9CA3AF]">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {t("minutes", { n: plan.duration_minutes })}
          </span>
          {plan.distance_km != null && (
            <span className="inline-flex items-center gap-1">
              <MapPinned className="size-3.5" />
              {t("km", { n: plan.distance_km })}
            </span>
          )}
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-[#9CA3AF]">
          {translation.highlights.slice(0, 3).map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        <Link
          href={withSlash(`/plan/${plan.slug}`)}
          className="cta-btn mt-6 w-full px-4 py-2.5 text-center"
        >
          {t("select")}
        </Link>
      </div>
    </article>
  );
}
