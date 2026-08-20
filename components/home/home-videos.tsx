"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { MOCK_VIDEOS } from "@/lib/mock/videos";

export function HomeVideos({ limit }: { limit?: number }) {
  const t = useTranslations("VideosHome");
  const [playing, setPlaying] = useState<string | null>(null);
  const clips = limit ? MOCK_VIDEOS.slice(0, limit) : MOCK_VIDEOS;
  const active = MOCK_VIDEOS.find((clip) => clip.id === playing);

  return (
    <section id="videos" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-3 text-3xl font-black md:text-4xl">{t("title")}</h2>
        <p className="mb-8 text-gray-400">{t("lead")}</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clips.map((clip) => (
            <button
              key={clip.id}
              type="button"
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121A] text-left transition hover:border-neon-pink hover:shadow-[0_0_22px_rgb(255_46_147_/_30%)]"
              onClick={() => setPlaying(clip.id)}
            >
              <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${clip.accent}`}>
                <Play className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
                <span className="absolute right-3 bottom-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] tracking-[0.16em] text-white uppercase">
                  Kart
                </span>
              </div>
              <p className="p-4 font-semibold">{t(clip.titleKey)}</p>
            </button>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(active)}
        title={active ? t(active.titleKey) : ""}
        onClose={() => setPlaying(null)}
        wide
        footer={
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setPlaying(null)}>
            <X className="size-4" /> 关闭
          </button>
        }
      >
        {active ? (
          <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0F]">
            <iframe
              title={t(active.titleKey)}
              src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?autoplay=1`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
