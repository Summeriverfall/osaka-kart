"use client";

import { useEffect, useRef, useState } from "react";

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
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string; downlink?: number };
  }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g" || conn?.effectiveType === "3g") return true;
  if (typeof conn?.downlink === "number" && conn.downlink > 0 && conn.downlink < 1.5) return true;
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
  const [armed, setArmed] = useState(eager);

  useEffect(() => {
    if (eager || skipHeavyVideo()) return;
    let idleId = 0;
    let timeoutId = 0;
    const arm = () => {
      const start = () => setArmed(true);
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 2500 });
        return;
      }
      timeoutId = window.setTimeout(start, 900);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [eager]);

  const active = armed && !skipHeavyVideo();

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
