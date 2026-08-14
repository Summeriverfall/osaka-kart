import { asset } from "./asset";

export const PLAN_IMAGES: Record<string, string> = {
  standard: asset("/images/plans/standard.webp"),
  "night-run": asset("/images/plans/night-run.webp"),
  "grand-tour": asset("/images/plans/grand-tour.webp"),
};

export function planImage(slug: string) {
  return PLAN_IMAGES[slug] ?? PLAN_IMAGES.standard;
}
