import { GatewayView } from "@/components/gateway/gateway-view";
import type { AppLocale } from "@/i18n/routing";
import { getPlans } from "@/lib/plans/queries";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function GatewayPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const plans = await getPlans(locale);
  const fromPrice = Math.min(...plans.map((plan) => plan.base_price_jpy), 8000);

  return <GatewayView fromPrice={fromPrice} locale={locale} />;
}
