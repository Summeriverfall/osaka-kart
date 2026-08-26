"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  src: string;
  startAt: number;
  poster?: string;
  className?: string;
  preload?: "none" | "metadata" | "auto";
  eager?: boolean;
};

function skipHeavyVideo() {
  if (typeof window === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") return true;
  return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

export function HeroVideo({
  src,
  startAt,
  poster,
  className,
  preload = "none",
  eager = false,
}: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const active = eager && !skipHeavyVideo();

  useEffect(() => {
    const video = ref.current;
    if (!video || !active) return;

    const jumpToStart = () => {
      if (startAt <= 0) return;
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
  }, [active, src, startAt]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      playsInline
      autoPlay={active}
      preload={active ? preload : "none"}
      {...(poster ? { poster } : {})}
    >
      {active ? (
        <source
          src={src.startsWith("data:") || src.startsWith("blob:") ? src : `${src}#t=${startAt}`}
          type={src.startsWith("data:video/webm") ? "video/webm" : "video/mp4"}
        />
      ) : null}
    </video>
  );
}
