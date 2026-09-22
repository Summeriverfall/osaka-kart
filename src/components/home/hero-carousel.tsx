"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { HERO_SLIDES } from "@/lib/home-storefront";

const HOLD = 3000;

export function HeroCarousel() {
  const [on, setOn] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setOn((i) => (i + 1) % HERO_SLIDES.length);
    }, HOLD);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-media" aria-hidden>
      {HERO_SLIDES.map((file, i) => (
        <img
          key={file}
          src={asset(file)}
          alt=""
          className={i === on ? "ok-hero-slide is-on" : "ok-hero-slide"}
          width={1920}
          height={1080}
          fetchPriority={i === 0 ? "high" : "low"}
          decoding="async"
        />
      ))}
    </div>
  );
}
