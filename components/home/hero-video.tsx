"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  src: string;
  startAt: number;
  poster?: string;
  className?: string;
  preload?: "none" | "metadata" | "auto";
};

export function HeroVideo({
  src,
  startAt,
  poster,
  className,
  preload = "auto",
}: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const jumpToStart = () => {
      if (Math.abs(video.currentTime - startAt) > 0.35) {
        video.currentTime = startAt;
      }
    };

    const onLoaded = () => {
      jumpToStart();
      video.play().catch(() => undefined);
    };

    const onEnded = () => {
      video.currentTime = startAt;
      video.play().catch(() => undefined);
    };

    const onSeeked = () => {
      if (startAt > 1 && video.currentTime < 0.4) {
        video.currentTime = startAt;
      }
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("ended", onEnded);
    video.addEventListener("seeked", onSeeked);

    if (video.readyState >= 1) onLoaded();

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [src, startAt]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      playsInline
      autoPlay
      preload={preload}
      poster={poster}
    >
      <source src={`${src}#t=${startAt}`} type="video/mp4" />
    </video>
  );
}
