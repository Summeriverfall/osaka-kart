import { Check, MapPinned, ShieldAlert, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PlanExperience } from "@/components/plan/plan-experience";
import { PlanSummaryCard } from "@/components/plan/plan-summary";
import { planImage, planRoute } from "@/lib/media";
import type { AddonWithTranslation, PlanWithTranslation } from "@/lib/plans/types";

type PlanDetailViewProps = {
  plan: PlanWithTranslation;
  plans: PlanWithTranslation[];
  addons: AddonWithTranslation[];
  locale: string;
};

export async function PlanDetailView({ plan, plans, addons, locale }: PlanDetailViewProps) {
  const t = await getTranslations("Plan");
  const { translation } = plan;
  const flow = [
    { title: t("flow1Title"), body: t("flow1Body") },
    { title: t("flow2Title"), body: t("flow2Body") },
    { title: t("flow3Title"), body: t("flow3Body") },
    { title: t("flow4Title"), body: t("flow4Body") },
  ];

  return (
    <article>
      <section className="relative min-h-[42vh] overflow-hidden">
        <img
          src={planImage(plan.slug)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/55 to-[#0A0A0F]/20" />
        <div className="relative z-10 mx-auto flex min-h-[42vh] w-full max-w-6xl items-end px-4 pb-10">
          <div>
            <p className="mb-3 text-xs tracking-[0.2em] text-neon-cyan uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="neon-text max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              {translation.name}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          <section>
            <p className="text-base leading-relaxed text-[#F1F1F5]/90">
              {translation.description}
            </p>
          </section>

          <PlanExperience plan={plan} plans={plans} addons={addons} locale={locale} />

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-black">
              <MapPinned className="size-5 text-neon-pink" />
              {t("route")}
            </h2>
            {translation.route_summary && (
              <p className="text-[#9CA3AF]">{translation.route_summary}</p>
            )}
            <img
              src={planRoute(plan.slug)}
              alt=""
              className="mt-4 w-full rounded-2xl border border-white/10 object-contain"
            />
            <iframe
              title={t("map")}
              src="https://maps.google.com/maps?q=Namba%20Station%20Osaka&z=16&output=embed"
              className="mt-4 h-64 w-full rounded-2xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </section>

          {translation.includes.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-black">{t("includes")}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {translation.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-[#F1F1F5]"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-neon-cyan" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              <Sparkles className="size-5 text-neon-pink" />
              {t("flow")}
            </h2>
            <ol className="space-y-4">
              {flow.map((step, index) => (
                <li key={step.title} className="skin-card p-4">
                  <p className="text-xs tracking-[0.16em] text-neon-cyan uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-semibold text-[#F1F1F5]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-[#9CA3AF]">{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {translation.requirements.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
                <ShieldAlert className="size-5 text-neon-pink" />
                {t("notes")}
              </h2>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                {translation.requirements.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside>
          <PlanSummaryCard plan={plan} addons={addons} locale={locale} />
        </aside>
      </div>
    </article>
  );
}
