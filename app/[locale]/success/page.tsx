import { setRequestLocale } from "next-intl/server";
import { SuccessView } from "@/components/booking/success-view";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function SuccessPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SuccessView locale={locale} />;
}
