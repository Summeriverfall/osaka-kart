import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function AdminSettingsSendRedirect({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/${locale}/admin/settings/email/`);
}
