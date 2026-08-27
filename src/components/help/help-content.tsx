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

  return (
    <div className="help-page bg-[#0A0A0F]">
      <SiteNav />
      <main className="help-main">
        <p className="shop-kicker">Help</p>
        <h1>{t("title")}</h1>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black">{t("licenseTitle")}</h2>
          <p className="mb-6 text-[#9CA3AF]">{t("licenseLead")}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {COUNTRIES.map((item) => (
              <article key={item.code} className="rounded-2xl border border-white/10 bg-[#12121A] p-5">
                <p className="text-xs tracking-[0.16em] text-neon-pink uppercase">{item.code}</p>
                <h3 className="mt-2 font-black">{t(item.name)}</h3>
                <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{t(item.body)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-black">{t("safetyTitle")}</h2>
          <article className="rounded-2xl border border-white/10 bg-[#12121A] p-5">
            <Shield className="size-5 text-neon-pink" />
            <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">{t("safetyBody")}</p>
          </article>
        </section>
      </main>
      <HomeFaq />
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
