"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { CmsVideoMedia } from "@/components/site/cms-video-media";
import { youtubeThumb } from "@/lib/cms-text";
import { cmsBySlot, localeText, resolveCmsVideo, useLiveCms } from "@/lib/live-cms";

export function HomeVideos({ limit }: { limit?: number }) {
  const t = useTranslations("VideosHome");
  const locale = useLocale();
  const cms = useLiveCms();
  const [playing, setPlaying] = useState<string | null>(null);
  const all = cmsBySlot(cms.videos, "page");
  const clips = limit ? all.slice(0, limit) : all;
  const active = all.find((clip) => clip.id === playing);
  const resolved = resolveCmsVideo(active);
  const title = localeText(cms.labels.videosTitle, locale, t("title"));
  const lead = localeText(cms.labels.videosLead, locale, t("lead"));

  return (
    <section id="videos" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-3 text-3xl font-black md:text-4xl">{title}</h2>
        <p className="mb-8 text-gray-400">{lead}</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clips.map((clip) => {
            const media = resolveCmsVideo(clip);
            return (
              <button
                key={clip.id}
                type="button"
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121A] text-left transition hover:border-neon-pink hover:shadow-[0_0_22px_rgb(255_46_147_/_30%)]"
                onClick={() => setPlaying(clip.id)}
              >
                <div className="relative aspect-video overflow-hidden bg-[#0A0A0F]">
                  {media?.kind === "youtube" ? (
                    <img src={youtubeThumb(media.id)} alt="" className="h-full w-full object-cover" />
                  ) : media?.kind === "file" ? (
                    <img src={media.poster} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#FF2E93] via-[#A855F7] to-[#0A0A0F]" />
                  )}
                  <Play className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
                </div>
                <p className="p-4 font-semibold">{localeText(clip.title, locale)}</p>
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        open={Boolean(active)}
        title={active ? localeText(active.title, locale) : ""}
        onClose={() => setPlaying(null)}
        wide
        footer={
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setPlaying(null)}>
            <X className="size-4" /> {t("title")}
          </button>
        }
      >
        {active && resolved ? (
          <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0F]">
            <CmsVideoMedia video={active} controls autoPlay className="h-full w-full" />
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
