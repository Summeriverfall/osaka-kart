import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { AdminLoginForm } from "@/components/admin/admin-login";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function AdminLoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminLoginForm />;
}
