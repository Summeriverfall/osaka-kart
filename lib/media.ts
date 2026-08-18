import { asset } from "./asset";

export const PLAN_IMAGES: Record<string, string> = {
  standard: asset("/images/social/nanbo.webp"),
  "night-run": asset("/images/social/tongtiange.webp"),
  "grand-tour": asset("/images/plans/grand-tour.webp"),
};

export function planImage(slug: string) {
  return PLAN_IMAGES[slug] ?? PLAN_IMAGES.standard;
}

export const PLAN_ROUTES: Record<string, string> = {
  standard: asset("/images/routes/namba-60.jpg"),
  "night-run": asset("/images/routes/tsutenkaku-90.jpg"),
  "grand-tour": asset("/images/routes/osaka-castle-120.jpg"),
};

export function planRoute(slug: string) {
  return PLAN_ROUTES[slug] ?? PLAN_ROUTES.standard;
}

export const ADDON_IMAGES: Record<string, string> = {
  gopro: asset("/images/videos/cover-1.jpg"),
  costume: asset("/images/plans/costume.png"),
  photos: asset("/images/reviews/r3.png"),
};

export function addonImage(slug: string) {
  return ADDON_IMAGES[slug] ?? asset("/images/plans/standard.webp");
}

export const FEATURE_IMAGES = [
  asset("/images/safety/insurance.png"),
  asset("/images/safety/helmet.png"),
  asset("/images/safety/guide.png"),
] as const;
