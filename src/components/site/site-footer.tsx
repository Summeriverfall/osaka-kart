"use client";

import { useLocale, useTranslations } from "next-intl";
import { LiveBrandMark } from "@/components/site/live-brand-mark";
import { SocialLinks } from "@/components/site/social-links";
import { localeText, mailHref, telHref, useLiveCms } from "@/lib/live-cms";
import { appPageHref } from "@/lib/file-href";
import { withSlash } from "@/lib/paths";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const locale = useLocale();
  const cms = useLiveCms();
  const company = localeText(cms.site.footerCompany, locale, t("company"));
  const phone = cms.site.phone?.trim();
  const hours = cms.site.hours?.trim();
  const email = cms.site.email?.trim();
  const address = localeText(cms.meetup.address, locale);
  const walk = localeText(cms.meetup.walk, locale);
  const maps = cms.meetup.mapsUrl?.trim();

  return (
    <footer id="footer" className="ok-foot">
      <div className="ok-foot-grid">
        <div className="ok-foot-brand">
          <LiveBrandMark className="ok-brand" />
          <p className="mt-4">{company}</p>
          <p className="mt-2">{t("blurb")}</p>
          <SocialLinks className="ok-foot-social" />
        </div>
        <div>
          <h4>{nav("help")}</h4>
          <div className="space-y-1">
            <a className="block" href={appPageHref(withSlash("/help"), locale)}>{nav("faq")}</a>
            <a className="block" href={appPageHref(withSlash("/help#license"), locale)}>{t("license")}</a>
            <a className="block" href={appPageHref(withSlash("/help#safety"), locale)}>{t("safety")}</a>
            <a className="block" href={appPageHref(withSlash("/booking"), locale)}>{nav("booking")}</a>
            <a className="block" href={appPageHref(withSlash("/looks"), locale)}>{t("looks")}</a>
          </div>
        </div>
        <div>
          <h4>{t("contact")}</h4>
          <div className="ok-foot-contact">
            {address ? (
              <div>
                <span>📍</span>
                <span>{address}</span>
              </div>
            ) : null}
            {walk ? (
              <div>
                <span>🚇</span>
                <span>{walk}</span>
              </div>
            ) : null}
            {phone ? (
              <div>
                <span>📞</span>
                <a href={telHref(phone)}>{phone}</a>
              </div>
            ) : null}
            {hours ? (
              <div>
                <span>🕐</span>
                <span>{hours}</span>
              </div>
            ) : null}
            {email ? (
              <div>
                <span>✉️</span>
                <a href={mailHref(email)}>{email}</a>
              </div>
            ) : null}
          </div>
          {maps ? (
            <a className="ok-map" href={maps} target="_blank" rel="noopener noreferrer">
              📍 {t("map")}
            </a>
          ) : null}
        </div>
      </div>
      <div className="ok-legal">
        <div>{t("copyright")}</div>
        <div className="flex gap-6">
          <span>{t("privacy")}</span>
          <span>{t("terms")}</span>
        </div>
      </div>
    </footer>
  );
}
