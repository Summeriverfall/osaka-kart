"use client";

import { Calendar, ChevronDown, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { HeroVideo } from "@/components/home/hero-video";
import { asset } from "@/lib/asset";
import { LOOK_VIDEO, type SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

type HomeHeroProps = {
  look: SiteTheme;
};

export function HomeHero({ look }: HomeHeroProps) {
  const t = useTranslations("Hero");
  const clip = LOOK_VIDEO[look];
  const title = `${t("title")} ${t("titleRest")}`;

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <HeroVideo
        src={asset(clip.src)}
        startAt={clip.startAt}
        poster={asset("/images/hero/poster.jpg")}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {look === "neon" && (
        <>
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0A0A0F]/70 via-[#0A0A0F]/30 to-[#0A0A0F]/90" />
          <div className="pointer-events-none absolute -top-24 left-[-4rem] z-[1] h-96 w-96 rounded-full bg-neon-pink/20 blur-[128px]" />
        </>
      )}
      {look === "acid" && (
        <>
          <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-[#090109]/92 via-[#ff00a8]/30 to-[#1a2a00]/45" />
          <div className="hero-acid-slash" />
        </>
      )}
      {look === "oni" && (
        <>
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-[#3a0000]/45 to-black/90" />
          <div className="hero-oni-frame" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <h1
          data-text={title}
          className={cn(
            "text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl",
            look === "oni" && "oni-text",
            (look === "neon" || look === "acid") && "neon-text",
          )}
        >
          <span className="title-line">{t("title")}</span>{" "}
          <span className="title-line">{t("titleRest")}</span>
        </h1>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-200 md:text-base">{t("rating")}</span>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-light tracking-wide text-gray-300 md:text-2xl">
          {t("subtitle")}
        </p>
        <a href="#plans" className="cta-btn mt-8 gap-2 px-8 py-4 text-lg">
          <Calendar className="size-5" />
          {t("cta")}
        </a>
      </div>

      <button
        type="button"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gray-400 transition-colors hover:text-neon-pink"
        aria-label={t("scroll")}
        onClick={() =>
          document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <ChevronDown className="bounce-slow size-8" />
      </button>
    </section>
  );
}
