export const SITE_THEMES = ["neon", "acid", "oni"] as const;
export const RETIRED_THEMES = ["glitch"] as const;

export type SiteTheme = (typeof SITE_THEMES)[number];

export function isSiteTheme(value: string | null | undefined): value is SiteTheme {
  return SITE_THEMES.includes(value as SiteTheme);
}

export function isRetiredTheme(value: string | null | undefined) {
  return RETIRED_THEMES.includes(value as (typeof RETIRED_THEMES)[number]);
}

/** hero-bg.mp4 is ~2:37. Each look starts at a different beat. */
export const LOOK_VIDEO = {
  neon: { startAt: 0, src: "/videos/hero-bg.mp4" },
  acid: { startAt: 32, src: "/videos/hero-bg.mp4" },
  oni: { startAt: 96, src: "/videos/hero-bg.mp4" },
} as const satisfies Record<SiteTheme, { startAt: number; src: string }>;
