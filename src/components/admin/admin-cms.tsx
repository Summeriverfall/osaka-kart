"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { adminCopy } from "@/lib/admin/copy";
import { LocaleField } from "@/components/admin/locale-field";
import { parseYoutubeId, readLocalVideo, localeText, type LocaleText } from "@/lib/cms-text";
import { CMS_IMAGE_LIMIT, readCmsImage, readLocalLogo } from "@/lib/read-local-image";
import {
  MOCK_CMS,
  blankFaq,
  blankPress,
  blankReview,
  blankVideo,
  type CmsFaq,
  type CmsHowToBook,
  type CmsMeetup,
  type CmsPress,
  type CmsReview,
  type CmsSite,
  type CmsVideo,
} from "@/lib/mock/cms";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";
import { asset } from "@/lib/asset";

export type CmsSection = "videos" | "reviews" | "faq" | "press" | "meetup" | "how" | "site";

function replaceById<T extends { id: string }>(list: T[], item: T) {
  const index = list.findIndex((row) => row.id === item.id);
  if (index < 0) return [...list, item];
  const next = [...list];
  next[index] = item;
  return next;
}

function localeTextSafe(value: LocaleText, locale: string) {
  return localeText(value, locale) || value.zh || value.en || value.ja || value.ko || "";
}

function mediaSrc(value?: string) {
  if (!value) return "";
  if (value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("http")) return value;
  return asset(value);
}

function PreviewVideo({ src, poster, startAt }: { src: string; poster?: string; startAt?: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const seek = () => {
      if ((startAt ?? 0) > 0 && Number.isFinite(startAt)) video.currentTime = startAt ?? 0;
    };
    video.addEventListener("loadedmetadata", seek);
    if (video.readyState >= 1) seek();
    return () => video.removeEventListener("loadedmetadata", seek);
  }, [src, startAt]);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className="mt-3 h-36 w-full rounded-xl object-cover"
      muted
      playsInline
      autoPlay
      loop
      preload="metadata"
    />
  );
}

function langLabels(copy: ReturnType<typeof adminCopy>) {
  return { zh: copy.plans.zh, en: copy.plans.en, ja: copy.plans.ja, ko: copy.plans.ko };
}

function VideoPositionCard({
  copy,
  locale,
  heading,
  hint,
  video,
  onChange,
  onSave,
  onError,
  onRemove,
}: {
  copy: ReturnType<typeof adminCopy>;
  locale: string;
  heading: string;
  hint: string;
  video: CmsVideo;
  onChange: (next: CmsVideo) => void;
  onSave: (video: CmsVideo) => void;
  onError: (message: string) => void;
  onRemove?: () => void;
}) {
  const youtube = parseYoutubeId(video.youtubeId);
  const fileSrc = video.file ? mediaSrc(video.file) : "";
  const posterSrc = video.poster ? mediaSrc(video.poster) : "";
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-800">{heading}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p>
      {video.source === "youtube" && youtube ? (
        <img src={`https://img.youtube.com/vi/${youtube}/hqdefault.jpg`} alt="" className="mt-3 h-36 w-full rounded-xl object-cover" />
      ) : fileSrc ? (
        <PreviewVideo src={fileSrc} poster={posterSrc || undefined} startAt={video.startAt} />
      ) : posterSrc ? (
        <img src={posterSrc} alt="" className="mt-3 h-36 w-full rounded-xl object-cover" />
      ) : null}
      <div className="mt-3">
        <LocaleField
          locale={locale}
          labels={langLabels(copy)}
          emptyLabel={copy.plans.unfilled}
          label={copy.cms.caption}
          value={video.title}
          onChange={(title) => onChange({ ...video, title })}
        />
      </div>
      <label className="admin-field mt-3">
        {copy.cms.source}
        <select
          className="admin-input"
          value={video.source}
          onChange={(event) => onChange({ ...video, source: event.target.value as CmsVideo["source"] })}
        >
          <option value="file">{copy.cms.file}</option>
          <option value="youtube">{copy.cms.youtube}</option>
        </select>
      </label>
      {video.source === "youtube" ? (
        <label className="admin-field mt-3">
          {copy.cms.youtubeUrl}
          <input className="admin-input" value={video.youtubeId} onChange={(event) => onChange({ ...video, youtubeId: event.target.value })} />
        </label>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-slate-600">{copy.cms.uploadVideo}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.cms.videoHint}</p>
          <input
            type="file"
            accept="video/mp4,video/webm,video/*"
            className="mt-2 block w-full text-xs"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              try {
                onChange({ ...video, file: await readLocalVideo(file), source: "file" });
              } catch (error) {
                const code = error instanceof Error ? error.message : "fail";
                onError(code === "size" ? copy.cms.errVideoSize : copy.cms.errVideoType);
              }
            }}
          />
        </div>
      )}
      <label className="admin-field mt-3">
        {copy.cms.startAt}
        <input
          className="admin-input"
          type="number"
          min={0}
          value={video.startAt ?? 0}
          onChange={(event) => onChange({ ...video, startAt: Math.max(0, Number(event.target.value) || 0) })}
        />
      </label>
      <button type="button" className="cta-btn mt-4 px-4 py-2 text-sm" onClick={() => onSave(video)}>{copy.common.save}</button>
      {onRemove ? (
        <button type="button" className="mt-2 block text-xs text-slate-500" onClick={onRemove}>{copy.cms.remove}</button>
      ) : null}
    </article>
  );
}

function ImageField({
  label,
  hint,
  value,
  onChange,
  onError,
  logo,
}: {
  label: string;
  hint: string;
  value?: string;
  onChange: (next: string) => void;
  onError: (message: string) => void;
  logo?: boolean;
}) {
  const src = value?.trim()
    ? value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("http")
      ? value
      : asset(value)
    : "";
  return (
    <div>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p>
      {src ? <img src={src} alt="" className="mt-2 max-h-28 rounded-xl object-contain" /> : null}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="mt-2 block w-full text-xs text-slate-500"
        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          try {
            onChange(logo ? await readLocalLogo(file) : await readCmsImage(file));
          } catch (error) {
            onError(error instanceof Error ? error.message : "fail");
          }
        }}
      />
    </div>
  );
}

export function AdminCmsView({ section }: { section: CmsSection }) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const cms = useOpsStore((state) => state.cms);
  const patchCms = useOpsStore((state) => state.patchCms);
  const notify = useToastStore((state) => state.notify);
  const [review, setReview] = useState<CmsReview | null>(null);
  const [faq, setFaq] = useState<CmsFaq | null>(null);
  const [press, setPress] = useState<CmsPress | null>(null);
  const [meetup, setMeetup] = useState<CmsMeetup>(cms.meetup);
  const [how, setHow] = useState<CmsHowToBook>({ ...MOCK_CMS.howToBook, ...cms.howToBook });
  const [site, setSite] = useState<CmsSite>(cms.site);
  const [labels, setLabels] = useState(cms.labels);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [videoTab, setVideoTab] = useState<"home" | "group">("home");
  const [editingVideos, setEditingVideos] = useState(cms.videos);

  useEffect(() => {
    setMeetup(cms.meetup);
    setHow({ ...MOCK_CMS.howToBook, ...cms.howToBook });
    setSite(cms.site);
    setLabels(cms.labels);
    setEditingVideos(cms.videos);
  }, [cms.meetup, cms.howToBook, cms.site, cms.labels, cms.videos]);

  function imageError(code: string) {
    if (code === "size") return copy.plans.errSize;
    if (code === "small") return copy.plans.errSmall;
    if (code === "large") return copy.plans.errLarge;
    if (code === "type") return copy.plans.errType;
    return copy.plans.errFail;
  }

  function saveList<K extends "videos" | "reviews" | "faqs" | "press">(key: K, list: CmsStateList[K]) {
    patchCms({ [key]: list });
    notify(copy.cms.saved);
  }

  if (section === "meetup") {
    return (
      <div className="space-y-4">
        <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sectionTitle} value={meetup.title} onChange={(title) => setMeetup({ ...meetup, title })} />
        <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.visitLead} value={meetup.lead} onChange={(lead) => setMeetup({ ...meetup, lead })} rows={3} />
        <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.walk} value={meetup.walk} onChange={(walk) => setMeetup({ ...meetup, walk })} />
        <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.address} value={meetup.address} onChange={(address) => setMeetup({ ...meetup, address })} />
        <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.station} value={meetup.station} onChange={(station) => setMeetup({ ...meetup, station })} />
        <label className="admin-field">
          {copy.cms.maps}
          <input className="admin-input" value={meetup.mapsUrl} onChange={(event) => setMeetup({ ...meetup, mapsUrl: event.target.value })} />
          <span className="text-xs text-slate-500">{copy.cms.mapsHint}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { patchCms({ meetup }); notify(copy.cms.saved); }}>{copy.common.save}</button>
          <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => { setMeetup(MOCK_CMS.meetup); patchCms({ meetup: MOCK_CMS.meetup }); notify(copy.cms.saved); }}>{copy.cms.restore}</button>
        </div>
      </div>
    );
  }

  if (section === "how") {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-slate-500">{copy.cms.channelLead}</p>
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.howTitle} value={how.title} onChange={(title) => setHow({ ...how, title })} />
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{copy.cms.showOnline}</p>
              <NeonToggle checked={how.showOnline !== false} onChange={(on) => setHow({ ...how, showOnline: on })} />
            </div>
            <div className="mt-3">
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.onlineLabel} value={how.onlineLabel} onChange={(onlineLabel) => setHow({ ...how, onlineLabel })} />
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{copy.cms.showWhatsapp}</p>
              <NeonToggle checked={how.showWhatsapp} onChange={(on) => setHow({ ...how, showWhatsapp: on })} />
            </div>
            <label className="admin-field mt-3">
              {copy.cms.whatsapp}
              <input className="admin-input" value={how.whatsapp ?? ""} onChange={(event) => setHow({ ...how, whatsapp: event.target.value })} placeholder="https://wa.me/..." />
            </label>
            <div className="mt-3">
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.whatsappHint} value={how.whatsappHint} onChange={(whatsappHint) => setHow({ ...how, whatsappHint })} />
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{copy.cms.showPhone}</p>
              <NeonToggle checked={how.showPhone} onChange={(on) => setHow({ ...how, showPhone: on })} />
            </div>
            <label className="admin-field mt-3">
              {copy.cms.phone}
              <input className="admin-input" value={how.phone ?? ""} onChange={(event) => setHow({ ...how, phone: event.target.value })} placeholder="+81 ..." />
            </label>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{copy.cms.showEmail}</p>
              <NeonToggle checked={how.showEmail} onChange={(on) => setHow({ ...how, showEmail: on })} />
            </div>
            <label className="admin-field mt-3">
              {copy.cms.email}
              <input className="admin-input" value={how.email ?? ""} onChange={(event) => setHow({ ...how, email: event.target.value })} placeholder="book@..." />
            </label>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{copy.cms.showLine}</p>
              <NeonToggle checked={Boolean(how.showLine)} onChange={(on) => setHow({ ...how, showLine: on })} />
            </div>
            <label className="admin-field mt-3">
              {copy.cms.line}
              <input className="admin-input" value={how.line ?? ""} onChange={(event) => setHow({ ...how, line: event.target.value })} placeholder="https://line.me/..." />
            </label>
          </article>
        </div>
        <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { patchCms({ howToBook: how }); notify(copy.cms.saved); }}>{copy.common.save}</button>
      </div>
    );
  }

  if (section === "site") {
    return (
      <div className="space-y-4">
        <label className="admin-field">{copy.cms.brandName}<input className="admin-input" value={site.brandName} onChange={(event) => setSite({ ...site, brandName: event.target.value })} /></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="admin-field">{copy.cms.brandShort}<input className="admin-input" value={site.brandShort} onChange={(event) => setSite({ ...site, brandShort: event.target.value })} /></label>
          <label className="admin-field">{copy.cms.brandSuffix}<input className="admin-input" value={site.brandSuffix} onChange={(event) => setSite({ ...site, brandSuffix: event.target.value })} /></label>
        </div>
        <ImageField
          logo
          label={copy.cms.logo}
          hint={copy.cms.logoHint}
          value={site.logo}
          onChange={(logo) => setSite({ ...site, logo })}
          onError={(code) => notify(imageError(code))}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="admin-field">{copy.cms.phone}<input className="admin-input" value={site.phone} onChange={(event) => setSite({ ...site, phone: event.target.value })} /></label>
          <label className="admin-field">{copy.cms.email}<input className="admin-input" value={site.email} onChange={(event) => setSite({ ...site, email: event.target.value })} /></label>
          <label className="admin-field">{copy.cms.hours}<input className="admin-input" value={site.hours} onChange={(event) => setSite({ ...site, hours: event.target.value })} /></label>
          <label className="admin-field">{copy.cms.whatsapp}<input className="admin-input" value={site.whatsapp} onChange={(event) => setSite({ ...site, whatsapp: event.target.value })} /></label>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">{copy.cms.social}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["instagram", "youtube", "x", "facebook", "tiktok", "line"] as const).map((key) => (
              <label key={key} className="admin-field">
                {key === "youtube" ? copy.cms.youtubeSocial : copy.cms[key]}
                <input
                  className="admin-input"
                  value={site.social[key]}
                  onChange={(event) => setSite({ ...site, social: { ...site.social, [key]: event.target.value } })}
                />
              </label>
            ))}
          </div>
        </div>
        <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.footerCompany} value={site.footerCompany} onChange={(footerCompany) => setSite({ ...site, footerCompany })} />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { patchCms({ site }); notify(copy.cms.saved); }}>{copy.common.save}</button>
          <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => { setSite(MOCK_CMS.site); patchCms({ site: MOCK_CMS.site }); notify(copy.cms.saved); }}>{copy.cms.restore}</button>
        </div>
      </div>
    );
  }

  if (section === "videos") {
    const list = editingVideos;
    const hero = list.find((item) => item.slot === "hero") ?? MOCK_CMS.videos.find((item) => item.slot === "hero") ?? { ...blankVideo(), id: "hero-main", slot: "hero" as const, sort: 0 };
    const gallery = list.find((item) => item.slot === "gallery") ?? MOCK_CMS.videos.find((item) => item.slot === "gallery") ?? { ...blankVideo(), id: "gallery-main", slot: "gallery" as const, sort: 1 };
    const listedXp = list.filter((item) => item.slot === "experience").slice().sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id));
    const experience = listedXp;

    function writeVideo(next: CmsVideo) {
      if (next.source === "youtube") {
        const id = parseYoutubeId(next.youtubeId);
        if (!id) {
          notify(copy.cms.invalidYoutube);
          return;
        }
        next = { ...next, youtubeId: id };
      }
      setEditingVideos((current) => {
        const merged = replaceById(current, next);
        saveList("videos", merged);
        return merged;
      });
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={`rounded-full border px-4 py-1.5 text-sm ${videoTab === "home" ? "border-blue-600 bg-blue-50 font-semibold text-blue-700" : "border-slate-200 text-slate-600"}`} onClick={() => setVideoTab("home")}>{copy.cms.tabHome}</button>
          <button type="button" className={`rounded-full border px-4 py-1.5 text-sm ${videoTab === "group" ? "border-blue-600 bg-blue-50 font-semibold text-blue-700" : "border-slate-200 text-slate-600"}`} onClick={() => setVideoTab("group")}>{copy.cms.tabGroup}</button>
        </div>

        {videoTab === "home" ? (
          <>
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={`${copy.cms.galleryClip} · ${copy.cms.sectionTitle}`} value={labels.videosTitle} onChange={(videosTitle) => setLabels({ ...labels, videosTitle })} />
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={`${copy.cms.galleryClip} · ${copy.cms.sectionLead}`} value={labels.videosLead} onChange={(videosLead) => setLabels({ ...labels, videosLead })} rows={2} />
              <div className="md:col-span-2">
                <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { patchCms({ labels }); notify(copy.cms.saved); }}>{copy.common.save}</button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
            <VideoPositionCard
              copy={copy}
              locale={locale}
              heading={copy.cms.heroLoop}
              hint={copy.cms.heroHint}
              video={hero}
              onChange={(next) => setEditingVideos((current) => replaceById(current, { ...next, slot: "hero" }))}
              onSave={(next) => writeVideo({ ...next, slot: "hero" })}
              onError={notify}
            />
            <VideoPositionCard
              copy={copy}
              locale={locale}
              heading={copy.cms.galleryClip}
              hint={copy.cms.galleryHint}
              video={gallery}
              onChange={(next) => setEditingVideos((current) => replaceById(current, { ...next, slot: "gallery" }))}
              onSave={(next) => writeVideo({ ...next, slot: "gallery" })}
              onError={notify}
            />
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sectionTitle} value={labels.experienceTitle} onChange={(experienceTitle) => setLabels({ ...labels, experienceTitle })} />
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sectionLead} value={labels.experienceLead} onChange={(experienceLead) => setLabels({ ...labels, experienceLead })} rows={2} />
              <div className="md:col-span-2">
                <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { patchCms({ labels }); notify(copy.cms.saved); }}>{copy.common.save}</button>
              </div>
            </div>
            <p className="text-sm text-slate-500">{copy.cms.groupHint}</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="cta-btn px-5 py-2.5"
                onClick={() => {
                  const next = { ...blankVideo(), slot: "experience" as const, sort: experience.length + 1 };
                  const merged = replaceById(list, next);
                  setEditingVideos(merged);
                  saveList("videos", merged);
                }}
              >
                {copy.cms.addVideo}
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {experience.map((item, index) => (
                <VideoPositionCard
                  key={item.id}
                  copy={copy}
                  locale={locale}
                  heading={`${copy.cms.tabGroup} ${index + 1}`}
                  hint={localeTextSafe(item.title, locale)}
                  video={item}
                  onChange={(next) => setEditingVideos((current) => replaceById(current, { ...next, slot: "experience" }))}
                  onSave={(next) => writeVideo({ ...next, slot: "experience" })}
                  onError={notify}
                  onRemove={() => setRemoveId(item.id)}
                />
              ))}
            </div>
            <RemoveModal copy={copy} open={Boolean(removeId)} onClose={() => setRemoveId(null)} onConfirm={() => {
              if (!removeId) return;
              const next = list.filter((item) => item.id !== removeId);
              saveList("videos", next);
              setEditingVideos(next);
              setRemoveId(null);
            }} />
          </>
        )}
      </div>
    );
  }

  if (section === "reviews") {
    const rows = [...cms.reviews].sort((a, b) => a.sort - b.sort);
    return (
      <div className="space-y-4">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
          <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sectionTitle} value={labels.reviewsTitle} onChange={(reviewsTitle) => setLabels({ ...labels, reviewsTitle })} />
          <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sectionLead} value={labels.reviewsLead} onChange={(reviewsLead) => setLabels({ ...labels, reviewsLead })} rows={2} />
          <div className="md:col-span-2">
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { patchCms({ labels }); notify(copy.cms.saved); }}>{copy.common.save}</button>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setReview(blankReview())}>{copy.cms.addReview}</button>
        </div>
        <CmsTable
          empty={copy.cms.empty}
          heads={[copy.cms.name, copy.cms.country, copy.cms.listed, copy.common.actions]}
          edit={copy.common.edit}
          remove={copy.cms.remove}
          rows={rows.map((item) => ({
            id: item.id,
            dim: !item.active,
            cells: [item.name, item.country, item.active ? copy.cms.on : copy.cms.off],
            onEdit: () => setReview(item),
            onRemove: () => setRemoveId(item.id),
          }))}
        />
        <Modal
          wide
          top
          open={Boolean(review)}
          title={copy.cms.addReview}
          onClose={() => setReview(null)}
          footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!review) return; saveList("reviews", replaceById(cms.reviews, review)); setReview(null); }}>{copy.common.save}</button>}
        >
          {review ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="admin-field">{copy.cms.name}<input className="admin-input" value={review.name} onChange={(event) => setReview({ ...review, name: event.target.value })} /></label>
                <label className="admin-field">{copy.cms.country}<input className="admin-input" value={review.country} onChange={(event) => setReview({ ...review, country: event.target.value })} /></label>
              </div>
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.quote} value={review.quote} onChange={(quote) => setReview({ ...review, quote })} rows={3} />
              <ImageField
                label={copy.cms.photo}
                hint={`${CMS_IMAGE_LIMIT.minEdge}px+`}
                value={review.photo}
                onChange={(photo) => setReview({ ...review, photo })}
                onError={(code) => notify(imageError(code))}
              />
              <label className="admin-field">{copy.cms.sort}<input className="admin-input" type="number" value={review.sort} onChange={(event) => setReview({ ...review, sort: Number(event.target.value) || 0 })} /></label>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span>{copy.cms.on}</span>
                <NeonToggle checked={review.active} onChange={(on) => setReview({ ...review, active: on })} />
              </div>
            </>
          ) : null}
        </Modal>
        <RemoveModal copy={copy} open={Boolean(removeId)} onClose={() => setRemoveId(null)} onConfirm={() => {
          if (!removeId) return;
          saveList("reviews", cms.reviews.filter((item) => item.id !== removeId));
          setRemoveId(null);
        }} />
      </div>
    );
  }

  if (section === "faq") {
    const rows = [...cms.faqs].sort((a, b) => a.sort - b.sort);
    return (
      <div className="space-y-4">
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
          <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sectionTitle} value={labels.faqTitle} onChange={(faqTitle) => setLabels({ ...labels, faqTitle })} />
          <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sectionLead} value={labels.faqLead} onChange={(faqLead) => setLabels({ ...labels, faqLead })} rows={2} />
          <div className="md:col-span-2">
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { patchCms({ labels }); notify(copy.cms.saved); }}>{copy.common.save}</button>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setFaq(blankFaq())}>{copy.cms.addFaq}</button>
        </div>
        <CmsTable
          empty={copy.cms.empty}
          heads={[copy.cms.question, copy.cms.homeFaq, copy.cms.listed, copy.common.actions]}
          edit={copy.common.edit}
          remove={copy.cms.remove}
          rows={rows.map((item) => ({
            id: item.id,
            dim: !item.active,
            cells: [localeTextSafe(item.q, locale) || item.id, item.home ? copy.cms.on : "—", item.active ? copy.cms.on : copy.cms.off],
            onEdit: () => setFaq(item),
            onRemove: () => setRemoveId(item.id),
          }))}
        />
        <Modal
          wide
          top
          open={Boolean(faq)}
          title={copy.cms.addFaq}
          onClose={() => setFaq(null)}
          footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!faq) return; saveList("faqs", replaceById(cms.faqs, faq)); setFaq(null); }}>{copy.common.save}</button>}
        >
          {faq ? (
            <>
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.question} value={faq.q} onChange={(q) => setFaq({ ...faq, q })} />
              <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.answer} value={faq.a} onChange={(a) => setFaq({ ...faq, a })} rows={4} />
              <label className="admin-field">{copy.cms.sort}<input className="admin-input" type="number" value={faq.sort} onChange={(event) => setFaq({ ...faq, sort: Number(event.target.value) || 0 })} /></label>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p>{copy.cms.homeFaq}</p>
                  <p className="text-xs text-slate-500">{copy.cms.homeFaqHint}</p>
                </div>
                <NeonToggle checked={faq.home} onChange={(on) => setFaq({ ...faq, home: on })} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span>{copy.cms.on}</span>
                <NeonToggle checked={faq.active} onChange={(on) => setFaq({ ...faq, active: on })} />
              </div>
            </>
          ) : null}
        </Modal>
        <RemoveModal copy={copy} open={Boolean(removeId)} onClose={() => setRemoveId(null)} onConfirm={() => {
          if (!removeId) return;
          saveList("faqs", cms.faqs.filter((item) => item.id !== removeId));
          setRemoveId(null);
        }} />
      </div>
    );
  }

  const rows = [...cms.press].sort((a, b) => a.sort - b.sort);
  return (
    <div className="space-y-4">
          <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sectionTitle} value={labels.pressTitle} onChange={(pressTitle) => setLabels({ ...labels, pressTitle })} />
      <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { patchCms({ labels }); notify(copy.cms.saved); }}>{copy.common.save}</button>
      <div className="flex justify-end">
        <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setPress(blankPress())}>{copy.cms.addPress}</button>
      </div>
      <CmsTable
        empty={copy.cms.empty}
        heads={[copy.cms.sourceName, copy.cms.pressTitle, copy.cms.listed, copy.common.actions]}
        edit={copy.common.edit}
        remove={copy.cms.remove}
        rows={rows.map((item) => ({
          id: item.id,
          dim: !item.active,
          cells: [localeTextSafe(item.source, locale), localeTextSafe(item.title, locale), item.active ? copy.cms.on : copy.cms.off],
          onEdit: () => setPress(item),
          onRemove: () => setRemoveId(item.id),
        }))}
      />
      <Modal
        wide
        top
        open={Boolean(press)}
        title={copy.cms.addPress}
        onClose={() => setPress(null)}
        footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!press) return; saveList("press", replaceById(cms.press, press)); setPress(null); }}>{copy.common.save}</button>}
      >
        {press ? (
          <>
            <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.sourceName} value={press.source} onChange={(source) => setPress({ ...press, source })} />
            <LocaleField locale={locale} labels={langLabels(copy)} emptyLabel={copy.plans.unfilled} label={copy.cms.pressTitle} value={press.title} onChange={(title) => setPress({ ...press, title })} rows={3} />
            <ImageField
              label={copy.cms.image}
              hint={copy.plans.coverHint}
              value={press.image}
              onChange={(image) => setPress({ ...press, image })}
              onError={(code) => notify(imageError(code))}
            />
            <label className="admin-field">{copy.cms.link}<input className="admin-input" value={press.href ?? ""} onChange={(event) => setPress({ ...press, href: event.target.value })} /></label>
            <label className="admin-field">{copy.cms.sort}<input className="admin-input" type="number" value={press.sort} onChange={(event) => setPress({ ...press, sort: Number(event.target.value) || 0 })} /></label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>{copy.cms.on}</span>
              <NeonToggle checked={press.active} onChange={(on) => setPress({ ...press, active: on })} />
            </div>
          </>
        ) : null}
      </Modal>
      <RemoveModal copy={copy} open={Boolean(removeId)} onClose={() => setRemoveId(null)} onConfirm={() => {
        if (!removeId) return;
        saveList("press", cms.press.filter((item) => item.id !== removeId));
        setRemoveId(null);
      }} />
    </div>
  );
}

type CmsStateList = {
  videos: CmsVideo[];
  reviews: CmsReview[];
  faqs: CmsFaq[];
  press: CmsPress[];
};

function CmsTable({
  heads,
  rows,
  empty,
  edit,
  remove,
}: {
  heads: string[];
  empty: string;
  edit: string;
  remove: string;
  rows: { id: string; dim?: boolean; cells: string[]; onEdit: () => void; onRemove: () => void }[];
}) {
  if (!rows.length) return <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">{empty}</p>;
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              {heads.map((head) => (
                <th key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={row.dim ? "opacity-50" : ""}>
                {row.cells.map((cell, index) => (
                  <td key={index}>{cell}</td>
                ))}
                <td className="space-x-2">
                  <button type="button" className="text-xs text-blue-600" onClick={row.onEdit}>{edit}</button>
                  <button type="button" className="text-xs text-slate-500" onClick={row.onRemove}>{remove}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-black">{row.cells[0]}</p>
            <p className="text-sm text-slate-500">{row.cells.slice(1).join(" · ")}</p>
            <div className="mt-3 space-x-3">
              <button type="button" className="text-xs text-blue-600" onClick={row.onEdit}>{edit}</button>
              <button type="button" className="text-xs text-slate-500" onClick={row.onRemove}>{remove}</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function RemoveModal({
  copy,
  open,
  onClose,
  onConfirm,
}: {
  copy: ReturnType<typeof adminCopy>;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      title={copy.cms.removeAsk}
      onClose={onClose}
      footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={onConfirm}>{copy.common.confirm}</button>}
    >
      <p className="text-sm text-slate-500">{copy.cms.remove}</p>
    </Modal>
  );
}
