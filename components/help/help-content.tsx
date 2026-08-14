"use client";

import { HomeFaq } from "@/components/home/home-faq";
import { HomeSafety } from "@/components/home/home-safety";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatBook, SiteNav } from "@/components/site/site-nav";
import { useTranslations } from "next-intl";

export function HelpContent() {
  const t = useTranslations("Help");

  return (
    <div className="min-h-dvh bg-[#0A0A0F] pt-16">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-black">{t("title")}</h1>
        <section className="mt-10">
          <h2 className="text-2xl font-black">{t("licenseTitle")}</h2>
          <p className="mt-3 text-gray-300">{t("licenseLead")}</p>
          <ul className="mt-4 space-y-3 text-sm text-gray-300">
            <li>{t("us")}</li>
            <li>{t("cn")}</li>
            <li>{t("jp")}</li>
            <li>{t("uk")}</li>
            <li>{t("eu")}</li>
          </ul>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-black">{t("safetyTitle")}</h2>
          <p className="mt-3 text-gray-300">{t("safetyBody")}</p>
        </section>
      </main>
      <HomeFaq />
      <HomeSafety />
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
