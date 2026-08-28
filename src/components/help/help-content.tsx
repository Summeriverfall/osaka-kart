"use client";

import { HomeFaq } from "@/components/home/home-faq";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatBook, SiteNav } from "@/components/site/site-nav";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

const COUNTRIES = [
  { code: "US", name: "usName", body: "us" },
  { code: "CN", name: "cnName", body: "cn" },
  { code: "JP", name: "jpName", body: "jp" },
  { code: "UK", name: "ukName", body: "uk" },
  { code: "EU", name: "euName", body: "eu" },
  { code: "OT", name: "otName", body: "ot" },
] as const;

export function HelpContent() {
  const t = useTranslations("Help");
  const nav = useTranslations("Nav");

  return (
    <div className="ok-page">
      <SiteNav />
      <header className="ok-page-head ok-page-head-pad">
        <div className="ok-sec-wide">
          <p className="ok-kicker">{nav("help")}</p>
          <h1>{t("title")}</h1>
        </div>
      </header>

      <HomeFaq kicker={nav("faq")} />

      <section id="license" className="ok-sec ok-sec-alt">
        <div className="ok-sec-wide">
          <header className="ok-sec-head">
            <p className="ok-kicker">License</p>
            <h2>{t("licenseTitle")}</h2>
            <p className="ok-sec-lead">{t("licenseLead")}</p>
          </header>
          <div className="ok-safety">
            {COUNTRIES.map((item) => (
              <article key={item.code}>
                <p className="ok-kicker">{item.code}</p>
                <h3>{t(item.name)}</h3>
                <p>{t(item.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="safety" className="ok-sec">
        <div className="ok-sec-wide">
          <header className="ok-sec-head">
            <p className="ok-kicker">Safety</p>
            <h2>{t("safetyTitle")}</h2>
          </header>
          <article className="ok-panel ok-panel-wide">
            <Shield className="size-5 text-[var(--ok-pink)]" />
            <p className="mt-3">{t("safetyBody")}</p>
          </article>
        </div>
      </section>

      <SiteFooter />
      <FloatBook />
    </div>
  );
}
