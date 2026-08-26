export type LocaleText = {
  zh: string;
  en: string;
  ja: string;
  ko: string;
};

export function emptyLocaleText(): LocaleText {
  return { zh: "", en: "", ja: "", ko: "" };
}

export function localeText(text: LocaleText | undefined, locale: string, fallback = "") {
  if (!text) return fallback;
  if (locale.startsWith("ja")) return text.ja || text.en || text.zh || fallback;
  if (locale.startsWith("en")) return text.en || text.zh || fallback;
  if (locale.startsWith("ko")) return text.ko || text.en || text.zh || fallback;
  return text.zh || text.en || fallback;
}

export function parseYoutubeId(input: string) {
  const raw = input.trim();
  if (!raw) return "";
  if (/^[\w-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.replace(/^\//, "").slice(0, 11);
    const v = url.searchParams.get("v");
    if (v) return v.slice(0, 11);
    const embed = url.pathname.match(/\/embed\/([\w-]{11})/);
    if (embed?.[1]) return embed[1];
    const shorts = url.pathname.match(/\/shorts\/([\w-]{11})/);
    if (shorts?.[1]) return shorts[1];
  } catch {
    return "";
  }
  return "";
}

export function youtubeThumb(id: string) {
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

export const CMS_VIDEO_LIMIT = 12 * 1024 * 1024;

export function readLocalVideo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("video/")) {
      reject(new Error("type"));
      return;
    }
    if (file.size > CMS_VIDEO_LIMIT) {
      reject(new Error("size"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("fail"));
    reader.readAsDataURL(file);
  });
}
