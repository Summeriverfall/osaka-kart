"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { SITE_BRAND, SITE_BRAND_SHORT } from "@/lib/brand";
import { siteHome, withSlash } from "@/lib/paths";
import { useSiteLook } from "@/lib/site-look";
import type { SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  look?: SiteTheme;
};

export function BrandMark({ className, look }: BrandMarkProps) {
  const pathname = usePathname();
  const current = useSiteLook(look);
  const segment = pathname.split("/").filter(Boolean)[0];
  const href = !segment ? "/" : withSlash(siteHome(current));

  return (
    <Link href={href} className={cn("brand-mark", className)} aria-label={SITE_BRAND}>
      <span>{SITE_BRAND_SHORT}</span>
      <strong>Osaka</strong>
    </Link>
  );
}
