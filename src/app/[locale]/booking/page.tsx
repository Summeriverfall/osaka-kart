import { setRequestLocale } from "next-intl/server";
import { BookingPageView } from "@/components/booking/booking-page-view";
import type { AppLocale } from "@/i18n/routing";
import { getAddons, getPlans } from "@/lib/plans/queries";

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [plans, addons] = await Promise.all([
    getPlans(locale),
    getAddons(locale),
  ]);

  const initialPlan = plans[0]?.slug ?? "";

  return (
    <BookingPageView
      plans={plans}
      addons={addons}
      locale={locale}
      initialPlan={initialPlan}
    />
  );
}
