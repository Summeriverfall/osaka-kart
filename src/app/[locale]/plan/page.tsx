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
    <div className="ok-page ok-page-pad">
      <SiteNav />
      <main className="ok-shell">
        <header className="ok-page-head">
          <p className="ok-kicker">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p className="ok-page-lead">{t("lead")}</p>
        </header>
        <HomePlans plans={plans} locale={locale} heading={false} />
      </main>
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
