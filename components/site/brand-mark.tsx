"use client";

import { Link } from "@/i18n/navigation";
import { useAppPathname } from "@/lib/use-app-pathname";
import { SITE_BRAND, SITE_BRAND_SHORT } from "@/lib/brand";
import { asset } from "@/lib/asset";
import { siteHome, withSlash } from "@/lib/paths";
import { useSiteLook } from "@/lib/site-look";
import type { SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

export type BrandMarkProps = {
  className?: string;
  look?: SiteTheme;
  name?: string;
  short?: string;
  suffix?: string;
  logo?: string;
};

function logoSrc(logo: string) {
  if (logo.startsWith("data:") || logo.startsWith("blob:") || logo.startsWith("http")) return logo;
  return asset(logo.startsWith("/") ? logo : `/${logo}`);
}

export function BrandMark({ className, look, name, short, suffix, logo }: BrandMarkProps) {
  const pathname = useAppPathname();
  const current = useSiteLook(look);
  const segment = pathname.split("/").filter(Boolean)[0];
  const href = !segment ? "/" : withSlash(siteHome(current));
  const displayName = name?.trim() || SITE_BRAND;
  const displayShort = short?.trim() || SITE_BRAND_SHORT;
  const displaySuffix = suffix?.trim() || "Osaka";
  const mark = logo?.trim();

  return (
    <Link href={href} className={cn("brand-mark", className)} aria-label={displayName}>
      {mark ? (
        <img src={logoSrc(mark)} alt="" className="brand-mark-logo" />
      ) : (
        <>
          <span>{displayShort}</span>
          <strong>{displaySuffix}</strong>
        </>
      )}
    </Link>
  );
}
