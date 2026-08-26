import { setRequestLocale } from "next-intl/server";
import { PayView } from "@/components/booking/pay-view";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function PayPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PayView locale={locale} />;
}
