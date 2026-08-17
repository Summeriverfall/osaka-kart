"use client";

import { useTranslations } from "next-intl";
import { BrandMark } from "@/components/site/brand-mark";
import { SocialLinks } from "@/components/site/social-links";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer id="footer" className="site-foot">
      <div className="site-foot-inner">
        <BrandMark />
        <p className="site-foot-company">{t("company")}</p>
        <p className="site-foot-follow">{t("social")}</p>
        <SocialLinks />
        <p className="site-foot-copy">{t("copyright")}</p>
      </div>
    </footer>
  );
}
