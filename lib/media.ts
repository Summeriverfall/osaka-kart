export const PLAN_IMAGES: Record<string, string> = {
  standard: "/images/plans/standard.webp",
  "night-run": "/images/plans/night-run.webp",
  "grand-tour": "/images/plans/grand-tour.webp",
};

export function planImage(slug: string) {
  return PLAN_IMAGES[slug] ?? PLAN_IMAGES.standard;
}
