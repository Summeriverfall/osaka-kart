import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomePlans } from "@/components/home/home-plans";
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
        <HomePlans plans={plans} locale={locale} />
      </main>
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
