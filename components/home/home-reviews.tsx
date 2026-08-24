"use client";

import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cmsMediaSrc, localeText, localizedList, useLiveCms } from "@/lib/live-cms";

export function HomeReviews() {
  const t = useTranslations("ReviewsHome");
  const locale = useLocale();
  const cms = useLiveCms();
  const reviews = localizedList(cms.reviews);
  const title = localeText(cms.labels.reviewsTitle, locale, t("title"));

  return (
    <section id="reviews" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-3xl font-black md:text-4xl">{title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((item) => {
            const photo = item.photo ? cmsMediaSrc(item.photo) : "";
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121A]"
              >
                {photo ? (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={photo} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="p-6">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-gray-100">
                    “{localeText(item.quote, locale)}”
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    {photo ? (
                      <img src={photo} alt="" className="size-10 rounded-full object-cover" />
                    ) : null}
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-300">{item.country}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
