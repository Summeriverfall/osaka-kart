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
  if (resolved.kind === "facebook") {
    return (
      <iframe
        title={title}
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(resolved.href)}&show_text=false`}
        className={cn("h-full w-full border-0", className)}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (resolved.kind === "instagram") {
    return (
      <a
        href={resolved.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("relative block h-full w-full overflow-hidden bg-[#f5f5f7]", className)}
      >
        <img src={resolved.poster} alt="" className="h-full w-full object-cover" />
        <span className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-center text-sm font-semibold text-white">
          Instagram
        </span>
      </a>
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
