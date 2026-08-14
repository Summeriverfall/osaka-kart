import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PlanDetailView } from "@/components/plan/plan-detail";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatBook, SiteNav } from "@/components/site/site-nav";
import type { AppLocale } from "@/i18n/routing";
import { getPlanBySlug } from "@/lib/plans/queries";
import { PLAN_SLUGS } from "@/lib/plans/seed";

type PageProps = {
  params: Promise<{ locale: AppLocale; slug: string }>;
};

export function generateStaticParams() {
  return PLAN_SLUGS.map((slug) => ({ slug }));
}

export default async function PlanDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const plan = await getPlanBySlug(slug, locale);
  if (!plan) notFound();

  return (
    <div className="min-h-dvh bg-[#0A0A0F] pt-16">
      <SiteNav />
      <PlanDetailView plan={plan} locale={locale} />
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
