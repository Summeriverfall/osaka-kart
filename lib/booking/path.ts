import type { SiteTheme } from "@/lib/visual-theme";

export function bookingHref(_look: SiteTheme, plan?: string) {
  return plan ? `/plan/${plan}` : "/plan";
}

export function landingHref(look: SiteTheme) {
  return `/${look}`;
}
