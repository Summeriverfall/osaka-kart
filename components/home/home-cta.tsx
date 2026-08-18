"use client";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { asset } from "@/lib/asset";
import { withSlash } from "@/lib/paths";

export function HomeCta() {
  const t = useTranslations("CtaBand");

  return (
    <section id="cta" className="relative overflow-hidden px-4 py-24">
      <img
        src={asset("/images/reviews/r2.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#0A0A0F]/80" />
      <div className="relative mx-auto max-w-3xl rounded-3xl border border-neon-pink/30 bg-[#12121A]/80 px-6 py-14 text-center backdrop-blur-sm">
        <h2 className="neon-text text-4xl font-black md:text-5xl">{t("title")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-300">{t("subtitle")}</p>
        <Link
          href={withSlash("/booking")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-8 py-4 text-lg font-semibold hover:scale-105 hover:shadow-[0_0_40px_rgba(255,46,147,0.6)]"
        >
          <Calendar className="size-5" />
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
