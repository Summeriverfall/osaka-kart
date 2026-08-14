import { HelpContent } from "@/components/help/help-content";
import type { AppLocale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function HelpPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HelpContent />;
}
