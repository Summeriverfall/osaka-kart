"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { CmsVideoMedia } from "@/components/site/cms-video-media";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";
import { isFileProtocol } from "@/lib/file-href";
import { cmsBySlot, localeText, resolveCmsVideo, useLiveCms } from "@/lib/live-cms";
import type { CmsVideo } from "@/lib/mock/cms";

function sourceLabel(clip: CmsVideo) {
  if (clip.source === "facebook") return "Facebook";
  if (clip.source === "instagram") return "Instagram";
  if (clip.source === "youtube") return "YouTube";
  return "";
}

export function HomeVideos({ limit, kicker }: { limit?: number; kicker?: string }) {
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

  function openClip(clip: CmsVideo) {
    const media = resolveCmsVideo(clip);
    if (media?.kind === "facebook" || media?.kind === "instagram") {
      window.open(media.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (media?.kind === "youtube" && isFileProtocol()) {
      window.open(`https://www.youtube.com/watch?v=${media.id}`, "_blank", "noopener,noreferrer");
      return;
    }
    setPlaying(clip.id);
  }

  return (
    <section id="videos" className="ok-sec">
      <div className="ok-sec-wide">
        <header className="ok-sec-head">
          {kicker ? <p className="ok-kicker">{kicker}</p> : null}
          <h2>{title}</h2>
          <p className="ok-sec-lead">{lead}</p>
        </header>

        <div className="ok-vids">
          {clips.map((clip, index) => {
            const media = resolveCmsVideo(clip);
            const platform = sourceLabel(clip);
            const feature = index === 0;
            return (
              <button
                key={clip.id}
                type="button"
                className={cn("ok-vid", feature && "is-feature")}
                onClick={() => openClip(clip)}
              >
                <div className="relative overflow-hidden bg-black">
                  <img
                    src={media?.poster ?? asset("/images/hero/poster.webp")}
                    alt=""
                    loading={feature ? undefined : "lazy"}
                    decoding="async"
                  />
                  <Play className="ok-vid-play absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
                </div>
                <div className="ok-vid-body">
                  <p className="font-semibold">{localeText(clip.title, locale)}</p>
                  {platform ? (
                    feature ? (
                      <span className="ok-vid-plat">{platform}</span>
                    ) : (
                      <p className="text-xs font-semibold text-[var(--ok-pink)]">
                        {t("watchOn", { platform })}
                      </p>
                    )
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
          <button type="button" className="ok-btn px-5 py-2.5" onClick={() => setPlaying(null)}>
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
