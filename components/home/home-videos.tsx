"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";

const CLIPS = [
  {
    id: "1",
    titleKey: "v1" as const,
    src: asset("/videos/street-run.mp4"),
    cover: asset("/images/reviews/r1.png"),
  },
  {
    id: "2",
    titleKey: "v2" as const,
    src: asset("/videos/hero-bg.mp4"),
    cover: asset("/images/hero/poster.jpg"),
  },
  {
    id: "3",
    titleKey: "v3" as const,
    src: asset("/videos/street-run.mp4"),
    cover: asset("/images/reviews/r3.png"),
  },
];

export function HomeVideos() {
  const t = useTranslations("VideosHome");
  const [playing, setPlaying] = useState<string | null>(null);
  const active = CLIPS.find((clip) => clip.id === playing);

  return (
    <section id="videos" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-3xl font-black md:text-4xl">{t("title")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLIPS.map((clip) => (
            <button
              key={clip.id}
              type="button"
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121A] text-left"
              onClick={() => setPlaying(clip.id)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={clip.cover}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-black/25" />
                <Play className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
              </div>
              <p className="p-4 font-semibold">{t(clip.titleKey)}</p>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPlaying(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -top-10 right-0 text-white"
              onClick={() => setPlaying(null)}
              aria-label="Close"
            >
              <X className="size-7" />
            </button>
            <video
              className="w-full rounded-xl"
              src={active.src}
              poster={active.cover}
              controls
              autoPlay
              playsInline
            />
            <p className="mt-3 text-center font-semibold">{t(active.titleKey)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
