import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { AgentHome } from "@/components/agent/agent-portal";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function AgentHomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AgentHome />;
}
