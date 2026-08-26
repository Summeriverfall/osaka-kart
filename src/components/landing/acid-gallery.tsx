"use client";

import { useLocale, useTranslations } from "next-intl";
import { ClickToPlayClip } from "@/components/landing/landing-commerce";
import type { LandingCopy } from "@/components/landing/copy";
import { SOCIAL_CARDS } from "@/lib/contact";
import { asset } from "@/lib/asset";
import { cmsBySlot, localeText, useLiveCms } from "@/lib/live-cms";

export function AcidGallery({ copy }: { copy: LandingCopy }) {
  const locale = useLocale();
  const social = useTranslations("Social");
  const cms = useLiveCms();
  const clip = cmsBySlot(cms.videos, "gallery")[0];
  const title = localeText(cms.labels.videosTitle, locale, copy.videosTitle);
  const lead = localeText(cms.labels.videosLead, locale, copy.videosLead);
  const caption = clip ? localeText(clip.title, locale) : copy.videos[0]?.title;
  const photos = SOCIAL_CARDS.slice(0, 4);

  return (
    <section id="videos" className="acid-gallery">
      <div className="acid-band-inner">
        <div className="acid-gallery-copy">
          <h2 className="acid-h2">{title}</h2>
          <p className="acid-lead">{lead}</p>
        </div>
        <div className="acid-gallery-board">
          <figure className="acid-gallery-hero">
            <div className="acid-gallery-frame">
              <ClickToPlayClip
                video={clip}
                fallback="/videos/street-run.mp4"
                startAt={clip?.startAt ?? 0}
                label={caption || title}
              />
            </div>
            {caption ? <figcaption>{caption}</figcaption> : null}
          </figure>
          {photos.map((card) => (
            <figure key={card.nameKey}>
              <div className="acid-gallery-frame">
                <img src={asset(card.img)} alt="" loading="lazy" decoding="async" />
              </div>
              <figcaption>{social(card.nameKey)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
