"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

const REVIEWS = [
  { name: "r1Name", country: "r1Country", quote: "r1Quote", photo: "/images/reviews/r1.png" },
  { name: "r2Name", country: "r2Country", quote: "r2Quote", photo: "/images/reviews/r2.png" },
  { name: "r3Name", country: "r3Country", quote: "r3Quote", photo: "/images/reviews/r3.png" },
] as const;

export function HomeReviews() {
  const t = useTranslations("ReviewsHome");

  return (
    <section id="reviews" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-3xl font-black md:text-4xl">{t("title")}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121A]"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={item.photo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-200">
                  “{t(item.quote)}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={item.photo}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{t(item.name)}</p>
                    <p className="text-xs text-gray-400">{t(item.country)}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
