"use client";

import { HeroVideo } from "@/components/home/hero-video";
import { resolveCmsVideo, type ResolvedCmsVideo } from "@/lib/live-cms";
import type { CmsVideo } from "@/lib/mock/cms";
import { youtubeThumb } from "@/lib/cms-text";
import { cn } from "@/lib/utils";

export function CmsVideoMedia({
  video,
  fallback,
  className,
  autoPlay,
  controls,
  startAt = 0,
  eager,
}: {
  video?: CmsVideo;
  fallback?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  startAt?: number;
  eager?: boolean;
}) {
  const resolved = resolveCmsVideo(video, fallback);
  if (!resolved) return null;
  return (
    <ResolvedVideo
      resolved={resolved}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
      startAt={startAt}
      eager={eager}
    />
  );
}

export function ResolvedVideo({
  resolved,
  className,
  autoPlay,
  controls,
  startAt = 0,
  title = "",
  eager,
}: {
  resolved: ResolvedCmsVideo;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  startAt?: number;
  title?: string;
  eager?: boolean;
}) {
  if (resolved.kind === "youtube") {
    const params = autoPlay
      ? `autoplay=1&mute=1&loop=1&playlist=${resolved.id}&controls=0&playsinline=1&start=${Math.max(0, Math.floor(startAt))}`
      : `playsinline=1&start=${Math.max(0, Math.floor(startAt))}`;
    return (
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${resolved.id}?${params}`}
        className={cn("h-full w-full border-0", className)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (autoPlay && !controls) {
    return (
      <HeroVideo
        src={resolved.src}
        startAt={startAt}
        poster={resolved.poster}
        className={className}
        eager={eager}
      />
    );
  }
  return (
    <video
      src={resolved.src}
      poster={resolved.poster}
      className={className}
      controls={controls}
      muted={autoPlay}
      loop={autoPlay}
      playsInline
      autoPlay={autoPlay}
    />
  );
}

export function youtubePoster(id: string) {
  return youtubeThumb(id);
}
