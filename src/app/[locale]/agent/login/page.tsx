import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { AgentLoginForm } from "@/components/agent/agent-portal";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function AgentLoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AgentLoginForm />;
}
