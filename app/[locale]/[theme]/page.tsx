import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AcidLanding } from "@/components/landing/acid-landing";
import { getLandingCopy } from "@/components/landing/copy";
import { GlitchLanding } from "@/components/landing/glitch-landing";
import { NeonLanding } from "@/components/landing/neon-landing";
import { OniLanding } from "@/components/landing/oni-landing";
import type { AppLocale } from "@/i18n/routing";
import { getPlans } from "@/lib/plans/queries";
import { isSiteTheme, SITE_THEMES, type SiteTheme } from "@/lib/visual-theme";

type PageProps = {
  params: Promise<{ locale: AppLocale; theme: string }>;
};

export function generateStaticParams() {
  return SITE_THEMES.map((theme) => ({ theme }));
}

const LANDINGS: Record<SiteTheme, typeof NeonLanding> = {
  neon: NeonLanding,
  acid: AcidLanding,
  oni: OniLanding,
  glitch: GlitchLanding,
};

export default async function ThemeHomePage({ params }: PageProps) {
  const { locale, theme } = await params;
  setRequestLocale(locale);
  if (!isSiteTheme(theme)) notFound();

  const [plans, copy] = await Promise.all([getPlans(locale), getLandingCopy()]);
  const View = LANDINGS[theme];

  return <View plans={plans} locale={locale} copy={copy} />;
}
