"use client";

import { useLocale, useTranslations } from "next-intl";
import { BrandMark } from "@/components/site/brand-mark";
import { SocialLinks } from "@/components/site/social-links";
import { localeText, useLiveCms } from "@/lib/live-cms";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const cms = useLiveCms();
  const company = localeText(cms.site.footerCompany, locale, t("company"));

  const hasSocial = Object.values(cms.site.social).some((value) => value?.trim());

  return (
    <footer id="footer" className="site-foot">
      <div className="site-foot-inner">
        <BrandMark />
        <p className="site-foot-company">{company}</p>
        {hasSocial ? (
          <>
            <p className="site-foot-follow">{t("social")}</p>
            <SocialLinks />
          </>
        ) : null}
        <p className="site-foot-copy">{t("copyright")}</p>
      </div>
    </footer>
  );
}
