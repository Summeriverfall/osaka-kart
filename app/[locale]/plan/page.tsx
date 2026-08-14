import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlanCard } from "@/components/plan/plan-card";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatBook, SiteNav } from "@/components/site/site-nav";
import type { AppLocale } from "@/i18n/routing";
import { getPlans } from "@/lib/plans/queries";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function PlanListPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Plan");
  const plans = await getPlans(locale);

  return (
    <div className="min-h-dvh bg-[#0A0A0F] pt-16">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-black">{t("title")}</h1>
        <p className="mt-2 text-gray-400">{t("lead")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} locale={locale} />
          ))}
        </div>
      </main>
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
