import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function AdminSettingsBookingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return null;
}
