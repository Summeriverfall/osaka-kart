"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { CmsVideoMedia } from "@/components/site/cms-video-media";
import { youtubeThumb } from "@/lib/cms-text";
import { cmsBySlot, localeText, resolveCmsVideo, useLiveCms } from "@/lib/live-cms";
import type { CmsVideo } from "@/lib/mock/cms";

function sourceLabel(clip: CmsVideo) {
  if (clip.source === "facebook") return "Facebook";
  if (clip.source === "instagram") return "Instagram";
  if (clip.source === "youtube") return "YouTube";
  return "";
}

export function HomeVideos({ limit }: { limit?: number }) {
  const t = useTranslations("VideosHome");
  const locale = useLocale();
  const cms = useLiveCms();
  const [playing, setPlaying] = useState<string | null>(null);
  const all = cmsBySlot(cms.videos, "page");
  const clips = limit ? all.slice(0, limit) : all;
  const featured = clips[0];
  const rest = clips.slice(1);
  const active = all.find((clip) => clip.id === playing);
  const resolved = resolveCmsVideo(active);
  const title = localeText(cms.labels.videosTitle, locale, t("title"));
  const lead = localeText(cms.labels.videosLead, locale, t("lead"));

  function openClip(clip: CmsVideo) {
    const media = resolveCmsVideo(clip);
    if (media?.kind === "facebook" || media?.kind === "instagram") {
      window.open(media.href, "_blank", "noopener,noreferrer");
      return;
    }
    setPlaying(clip.id);
  }

  return (
    <section id="videos" className="bg-black py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-3 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
        <p className="mb-10 text-[#A0A0A0]">{lead}</p>

        {featured ? (
          <div className="mb-10 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#161625] shadow-[0_12px_36px_rgb(0_0_0_/_35%)]">
            <div className="aspect-video bg-black">
              <CmsVideoMedia video={featured} controls className="h-full w-full" />
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <p className="font-semibold text-white">{localeText(featured.title, locale)}</p>
              {sourceLabel(featured) ? (
                <span className="rounded-full bg-[#FF2E97]/15 px-3 py-1 text-xs font-semibold text-[#FF2E97]">
                  {sourceLabel(featured)}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((clip) => {
            const media = resolveCmsVideo(clip);
            const platform = sourceLabel(clip);
            return (
              <button
                key={clip.id}
                type="button"
                className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#161625] text-left shadow-[0_12px_36px_rgb(0_0_0_/_35%)] transition hover:-translate-y-0.5 hover:border-[#FF2E97]/40 hover:shadow-[0_16px_44px_rgb(255_46_151_/_18%)]"
                onClick={() => openClip(clip)}
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  {media?.kind === "youtube" ? (
                    <img src={youtubeThumb(media.id)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <img src={media?.poster} alt="" className="h-full w-full object-cover" />
                  )}
                  <Play className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white">{localeText(clip.title, locale)}</p>
                  {platform ? (
                    <p className="mt-1 text-xs font-semibold text-[#FF2E97]">
                      {t("watchOn", { platform })}
                    </p>
                  ) : null}
                </div>
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
          <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
            <CmsVideoMedia video={active} controls autoPlay className="h-full w-full" />
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
