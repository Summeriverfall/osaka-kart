"use client";

import { useMemo } from "react";
import { asset } from "@/lib/asset";
import { localeText } from "@/lib/cms-text";
import { SITE_CONTACT } from "@/lib/contact";
import { useLiveStoreContact, useOpsHydrated } from "@/lib/live-catalog";
import { LOOK_VIDEO, type SiteTheme } from "@/lib/visual-theme";
import { MOCK_CMS, cmsBySlot, type CmsState, type CmsVideo } from "@/lib/mock/cms";
import { useOpsStore } from "@/stores/ops-store";

export function useLiveCms(): CmsState {
  const cms = useOpsStore((state) => state.cms);
  const hydrated = useOpsHydrated();
  return useMemo(() => (hydrated && cms ? cms : MOCK_CMS), [cms, hydrated]);
}

export type ResolvedCmsVideo =
  | { kind: "youtube"; id: string; poster: string }
  | { kind: "file"; src: string; poster: string };

export function resolveCmsVideo(video: CmsVideo | undefined, fallback?: string): ResolvedCmsVideo | null {
  if (!video) {
    if (!fallback) return null;
    return { kind: "file", src: asset(fallback), poster: asset("/images/hero/poster.webp") };
  }
  const poster = video.poster
    ? video.poster.startsWith("data:") || video.poster.startsWith("blob:") || video.poster.startsWith("http")
      ? video.poster
      : asset(video.poster)
    : asset("/images/hero/poster.webp");

  if (video.source === "youtube" && video.youtubeId) {
    return { kind: "youtube", id: video.youtubeId, poster };
  }
  const file = video.file?.trim();
  if (file) {
    const src =
      file.startsWith("data:") || file.startsWith("blob:") || file.startsWith("http") ? file : asset(file);
    return { kind: "file", src, poster };
  }
  if (fallback) return { kind: "file", src: asset(fallback), poster };
  return null;
}

export function heroMediaOf(cms: CmsState, theme: SiteTheme) {
  const clip = LOOK_VIDEO[theme];
  const video = cmsBySlot(cms.videos, "hero")[0];
  return {
    video,
    resolved: resolveCmsVideo(video, clip.src),
    startAt: video?.source === "file" && video.file && !video.file.startsWith("/videos/hero-bg") ? 0 : clip.startAt,
  };
}

export function cmsMediaSrc(value: string) {
  if (value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("http")) return value;
  return asset(value.startsWith("/") ? value : `/${value}`);
}

export function localizedList<T extends { active: boolean; sort: number }>(items: T[]) {
  return items
    .filter((item) => item.active)
    .slice()
    .sort((a, b) => a.sort - b.sort);
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mailHref(email: string, subject = "Future Kart Osaka Booking") {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export function bookingContact(cms: CmsState, store?: { phone?: string; hours?: string }) {
  const how = cms.howToBook;
  const phone = how.phone?.trim() || store?.phone || cms.site.phone || SITE_CONTACT.phone;
  const email = how.email?.trim() || cms.site.email || SITE_CONTACT.email;
  const whatsapp = how.whatsapp?.trim() || cms.site.whatsapp || SITE_CONTACT.whatsapp;
  const line = how.line?.trim() || cms.site.social.line || SITE_CONTACT.line;
  const hours = store?.hours || cms.site.hours || SITE_CONTACT.hours;
  return {
    phone,
    email,
    whatsapp,
    line,
    hours,
    tel: telHref(phone),
    mailto: mailHref(email),
    showOnline: how.showOnline !== false,
    showWhatsapp: Boolean(how.showWhatsapp && whatsapp),
    showPhone: Boolean(how.showPhone && phone),
    showEmail: Boolean(how.showEmail && email),
    showLine: Boolean(how.showLine && line),
    title: how.title,
    onlineLabel: how.onlineLabel,
    whatsappHint: how.whatsappHint,
  };
}

export function useBookingContact() {
  const cms = useLiveCms();
  const store = useLiveStoreContact();
  return useMemo(() => bookingContact(cms, store), [cms, store]);
}

export { localeText, cmsBySlot };
