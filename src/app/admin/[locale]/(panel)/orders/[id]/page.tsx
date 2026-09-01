import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { MOCK_ORDER_IDS } from "@/lib/mock/orders";

type PageProps = {
  params: Promise<{ locale: AppLocale; id: string }>;
};

export function generateStaticParams() {
  return [...MOCK_ORDER_IDS, "demo"].map((id) => ({ id }));
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return null;
}
