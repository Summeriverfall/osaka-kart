"use client";

import { Link } from "@/i18n/navigation";
import { useAppPathname } from "@/lib/use-app-pathname";
import { SITE_BRAND, SITE_BRAND_SHORT } from "@/lib/brand";
import { cmsMediaSrc, useLiveCms } from "@/lib/live-cms";
import { siteHome, withSlash } from "@/lib/paths";
import { useSiteLook } from "@/lib/site-look";
import type { SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  look?: SiteTheme;
};

export function BrandMark({ className, look }: BrandMarkProps) {
  const pathname = useAppPathname();
  const current = useSiteLook(look);
  const cms = useLiveCms();
  const segment = pathname.split("/").filter(Boolean)[0];
  const href = !segment ? "/" : withSlash(siteHome(current));
  const name = cms.site.brandName || SITE_BRAND;
  const short = cms.site.brandShort || SITE_BRAND_SHORT;
  const suffix = cms.site.brandSuffix || "Osaka";
  const logo = cms.site.logo?.trim();

  return (
    <Link href={href} className={cn("brand-mark", className)} aria-label={name}>
      {logo ? (
        <img src={cmsMediaSrc(logo)} alt="" className="brand-mark-logo" />
      ) : (
        <>
          <span>{short}</span>
          <strong>{suffix}</strong>
        </>
      )}
    </Link>
  );
}
