"use client";

import { BrandMark, type BrandMarkProps } from "@/components/site/brand-mark";
import { useLiveCms } from "@/lib/live-cms";

export function LiveBrandMark(props: BrandMarkProps) {
  const cms = useLiveCms();
  return (
    <BrandMark
      {...props}
      name={cms.site.brandName}
      short={cms.site.brandShort}
      suffix={cms.site.brandSuffix}
      logo={cms.site.logo?.trim()}
    />
  );
}
