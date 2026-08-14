"use client";

import { MapPinned } from "lucide-react";
import { useTranslations } from "next-intl";

export function HomeMeeting() {
  const t = useTranslations("Meet");

  return (
    <section id="meeting" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-black md:text-4xl">{t("title")}</h2>
          <p className="mt-4 flex items-start gap-2 text-gray-200">
            <MapPinned className="mt-1 size-5 text-neon-pink" />
            {t("address")}
          </p>
          <p className="mt-3 text-gray-300">{t("station")}</p>
          <p className="mt-1 text-gray-400">{t("walk")}</p>
        </div>
        <iframe
          title={t("title")}
          src="https://maps.google.com/maps?q=Namba%20Station%20Osaka&z=16&output=embed"
          className="h-72 w-full rounded-2xl border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
