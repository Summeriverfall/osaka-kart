import { GatewayView } from "@/components/gateway/gateway-view";
import type { AppLocale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function GatewayPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GatewayView />;
}
