import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { AdminRedirect } from "@/components/admin/admin-redirect";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

/** 旧地址 /zh-TW/admin/ → /admin/zh-TW/login/ */
export default async function LegacyAdminRedirect({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminRedirect locale={locale} to="/admin/login" />;
}
