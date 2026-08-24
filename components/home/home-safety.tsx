"use client";

import { HardHat, Shield, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";

export function HomeSafety() {
  const t = useTranslations("Safety");
  const items = [
    {
      icon: HardHat,
      title: t("s1Title"),
      body: t("s1Body"),
      photo: asset("/images/safety/helmet.webp"),
    },
    {
      icon: Shield,
      title: t("s2Title"),
      body: t("s2Body"),
      photo: asset("/images/plans/standard.webp"),
    },
    {
      icon: UserRound,
      title: t("s3Title"),
      body: t("s3Body"),
      photo: asset("/images/plans/costume.webp"),
    },
  ];

  return (
    <section id="safety" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-center text-3xl font-black md:text-4xl">
          {t("title")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121A] text-center"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={item.photo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <item.icon className="mx-auto size-10 text-neon-pink" />
                <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
