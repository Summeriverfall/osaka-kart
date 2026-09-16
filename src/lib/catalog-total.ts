import { type MockAddon } from "@/lib/mock/addons";
import { type MockPlan } from "@/lib/mock/plans";

export function catalogTotalJpy(
  plans: MockPlan[],
  addons: MockAddon[],
  planSlug: string,
  riders: number,
  addonSlugs: string[],
) {
  const plan = plans.find((item) => item.slug === planSlug);
  const extras = addonSlugs.reduce((sum, slug) => {
    const addon = addons.find((item) => item.slug === slug);
    return sum + (addon?.priceJpy ?? 0);
  }, 0);
  return Math.max(0, (plan?.priceJpy ?? 0) * Math.max(1, riders) + extras);
}
