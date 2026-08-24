import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function AdminContentRedirect({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/${locale}/admin/content/videos/`);
}
