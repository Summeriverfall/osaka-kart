"use client";

import { useLocale, useTranslations } from "next-intl";
import { LiveBrandMark } from "@/components/site/live-brand-mark";
import { SocialLinks } from "@/components/site/social-links";
import { localeText, mailHref, telHref, useLiveCms } from "@/lib/live-cms";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const cms = useLiveCms();
  const company = localeText(cms.site.footerCompany, locale, t("company"));
  const phone = cms.site.phone?.trim();
  const hours = cms.site.hours?.trim();
  const email = cms.site.email?.trim();

  const hasSocial = Object.values(cms.site.social).some((value) => value?.trim());

  return (
    <footer id="footer" className="site-foot">
      <div className="site-foot-inner">
        <LiveBrandMark />
        <p className="site-foot-company">{company}</p>
        <div className="site-foot-meta">
          {phone ? (
            <a href={telHref(phone)}>
              {t("phone")} {phone}
            </a>
          ) : null}
          {hours ? (
            <span>
              {t("hours")} {hours}
            </span>
          ) : null}
          {email ? (
            <a href={mailHref(email)}>
              {t("email")} {email}
            </a>
          ) : null}
        </div>
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
