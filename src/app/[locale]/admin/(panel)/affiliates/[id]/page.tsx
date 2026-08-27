import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { MOCK_AFFILIATE_IDS } from "@/lib/mock/affiliates";

type PageProps = {
  params: Promise<{ locale: AppLocale; id: string }>;
};

export function generateStaticParams() {
  return [...MOCK_AFFILIATE_IDS, "demo"].map((id) => ({ id }));
}

export default async function AdminAffiliateDetailPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return null;
}
