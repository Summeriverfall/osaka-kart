import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { AdminRedirect } from "@/components/admin/admin-redirect";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function AdminSettingsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminRedirect locale={locale} to="/admin/settings/pay" />;
}
