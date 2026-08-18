import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AcidLanding } from "@/components/landing/acid-landing";
import { getLandingCopy } from "@/components/landing/copy";
import { NeonLanding } from "@/components/landing/neon-landing";
import { OniLanding } from "@/components/landing/oni-landing";
import type { AppLocale } from "@/i18n/routing";
import { getAddons, getPlans } from "@/lib/plans/queries";
import {
  isRetiredTheme,
  isSiteTheme,
  RETIRED_THEMES,
  SITE_THEMES,
  type SiteTheme,
} from "@/lib/visual-theme";

type PageProps = {
  params: Promise<{ locale: AppLocale; theme: string }>;
};

export function generateStaticParams() {
  return [...SITE_THEMES, ...RETIRED_THEMES].map((theme) => ({ theme }));
}

const LANDINGS: Record<SiteTheme, typeof NeonLanding> = {
  neon: NeonLanding,
  acid: AcidLanding,
  oni: OniLanding,
};

export default async function ThemeHomePage({ params }: PageProps) {
  const { locale, theme } = await params;
  setRequestLocale(locale);
  if (isRetiredTheme(theme)) {
    redirect(`/${locale}/neon/`);
  }
  if (!isSiteTheme(theme)) notFound();

  const [plans, addons, copy] = await Promise.all([
    getPlans(locale),
    getAddons(locale),
    getLandingCopy(),
  ]);
  const View = LANDINGS[theme];

  return <View plans={plans} addons={addons} locale={locale} copy={copy} />;
}
