import { OsakaHome } from "@/components/home/osaka-home";
import type { AppLocale } from "@/i18n/routing";
import { BASE_PATH } from "@/lib/asset";
import { getPlans } from "@/lib/plans/queries";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const plans = await getPlans(locale);

  return (
    <>
      <link rel="preload" as="image" href={`${BASE_PATH}/images/social/22.webp`} fetchPriority="high" />
      <OsakaHome plans={plans} locale={locale} />
    </>
  );
}
