"use client";

import { HomeFaq } from "@/components/home/home-faq";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatBook, SiteNav } from "@/components/site/site-nav";
import { useTranslations } from "next-intl";

export function HelpContent() {
  const t = useTranslations("Help");

  return (
    <div className="help-page">
      <SiteNav />
      <main className="help-main">
        <p className="shop-kicker">Help</p>
        <h1>{t("title")}</h1>
        <section className="help-card">
          <h2>{t("licenseTitle")}</h2>
          <p className="mt-3">{t("licenseLead")}</p>
          <ul>
            <li>{t("us")}</li>
            <li>{t("cn")}</li>
            <li>{t("kr")}</li>
            <li>{t("jp")}</li>
            <li>{t("uk")}</li>
            <li>{t("eu")}</li>
          </ul>
        </section>
        <section className="help-card">
          <h2>{t("safetyTitle")}</h2>
          <p className="mt-3">{t("safetyBody")}</p>
        </section>
      </main>
      <HomeFaq />
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
