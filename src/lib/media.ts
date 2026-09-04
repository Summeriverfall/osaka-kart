import { asset } from "./asset";

export const PLAN_IMAGES: Record<string, string> = {
  sunset: asset("/images/social/yejingtiyan.webp"),
  standard: asset("/images/plans/standard.webp"),
  "night-run": asset("/images/plans/night-run.webp"),
  "grand-tour": asset("/images/plans/grand-tour.webp"),
  "vip-night": asset("/images/social/yejiankadingche.webp"),
};

export function planImage(slug: string) {
  return PLAN_IMAGES[slug] ?? PLAN_IMAGES.standard;
}

export const PLAN_ROUTES: Record<string, string> = {
  sunset: asset("/images/routes/namba-60.webp"),
  standard: asset("/images/routes/namba-60.webp"),
  "night-run": asset("/images/routes/tsutenkaku-90.webp"),
  "grand-tour": asset("/images/routes/osaka-castle-120.webp"),
  "vip-night": asset("/images/routes/tsutenkaku-90.webp"),
};

export function planRoute(slug: string) {
  return PLAN_ROUTES[slug] ?? "";
}

export function coverOf(plan: { slug: string; cover_image?: string | null }) {
  return plan.cover_image?.trim() || planImage(plan.slug);
}

export function routeOf(plan: { slug: string; detail_image?: string | null }) {
  return plan.detail_image?.trim() || planRoute(plan.slug);
}

export const ADDON_IMAGES: Record<string, string> = {
  gopro: asset("/images/videos/cover-1.webp"),
  costume: asset("/images/plans/costume.webp"),
  photos: asset("/images/reviews/r3.webp"),
};

export function addonImage(slug: string) {
  return ADDON_IMAGES[slug] ?? asset("/images/plans/standard.webp");
}

export const FEATURE_IMAGES = [
  asset("/images/safety/insurance.webp"),
  asset("/images/safety/helmet.webp"),
  asset("/images/safety/guide.webp"),
] as const;
