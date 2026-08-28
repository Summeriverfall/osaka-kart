import { GatewayView } from "@/components/gateway/gateway-view";
import type { AppLocale } from "@/i18n/routing";
import { BASE_PATH } from "@/lib/asset";
import { getPlans } from "@/lib/plans/queries";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function LooksPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const plans = await getPlans(locale);
  const fromPrice = Math.min(...plans.map((plan) => plan.base_price_jpy), 12800);

  return (
    <>
      <link rel="preload" as="image" href={`${BASE_PATH}/images/plans/standard.webp`} fetchPriority="high" />
      <GatewayView fromPrice={fromPrice} locale={locale} />
    </>
  );
}
