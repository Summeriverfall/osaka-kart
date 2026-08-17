import { asset } from "./asset";

export const PLAN_IMAGES: Record<string, string> = {
  standard: asset("/images/plans/standard.webp"),
  "night-run": asset("/images/plans/night-run.webp"),
  "grand-tour": asset("/images/plans/grand-tour.webp"),
};

export function planImage(slug: string) {
  return PLAN_IMAGES[slug] ?? PLAN_IMAGES.standard;
}

export const ADDON_IMAGES: Record<string, string> = {
  gopro: asset("/images/videos/cover-1.jpg"),
  costume: asset("/images/plans/costume.png"),
};

export function addonImage(slug: string) {
  return ADDON_IMAGES[slug] ?? asset("/images/plans/standard.webp");
}

export const FEATURE_IMAGES = [
  asset("/images/safety/insurance.png"),
  asset("/images/safety/helmet.png"),
  asset("/images/safety/guide.png"),
] as const;
