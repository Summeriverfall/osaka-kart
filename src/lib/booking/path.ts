import { siteHome, withSlash } from "@/lib/paths";
import type { SiteTheme } from "@/lib/visual-theme";

export function bookingHref(_look: SiteTheme, plan?: string) {
  return withSlash(plan ? `/plan/${plan}` : "/plan");
}

export function landingHref(look: SiteTheme) {
  return siteHome(look);
}
