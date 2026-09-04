import { setRequestLocale } from "next-intl/server";
import { PlanLayoutGallery } from "@/components/plan/plan-layout-gallery";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import type { AppLocale } from "@/i18n/routing";
import { getPlans } from "@/lib/plans/queries";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function PlanIdeasPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const plans = await getPlans(locale);

  return (
    <div className="ok-page ok-page-pad">
      <SiteNav />
      <main className="ok-shell">
        <header className="ok-page-head">
          <p className="ok-kicker">套餐版式</p>
          <h1>选择套餐 · 方案预览</h1>
          <p className="ok-page-lead">上面四颗按钮切换版式。这是预览页，选定后我再接到正式套餐页。</p>
        </header>
        <PlanLayoutGallery plans={plans} locale={locale} />
      </main>
      <SiteFooter />
    </div>
  );
}
