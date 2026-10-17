export const SITE_CONTACT = {
  phone: "+81 6-7771-0100",
  tel: "tel:+81677710100",
  email: "book@osakakart.jp",
  mailto: "mailto:book@osakakart.jp?subject=Future%20Kart%20Osaka%20Booking",
  hours: "10:00～21:00",
  whatsapp: "",
  instagram: "",
  youtube: "",
  x: "",
  facebook: "",
  tiktok: "",
  line: "",
  tripadvisor: "",
} as const;

export const SITE_MAPS_URL = "https://maps.app.goo.gl/wLwUcA8YABaQCB6p8";
export const SITE_MAPS_EMBED =
  "https://maps.google.com/maps?q=%E3%81%8A%E3%81%8A%E3%81%8D%E3%81%AB%E9%81%93%E9%A0%93%E5%A0%80%E3%83%93%E3%83%AB&hl=ja&z=17&output=embed";

const SOCIAL_ROOTS = new Set([
  "instagram.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "youtu.be",
  "tiktok.com",
  "facebook.com",
  "line.me",
  "tripadvisor.com",
]);

export function usableHref(href?: string | null) {
  const value = href?.trim() ?? "";
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "");
    if (SOCIAL_ROOTS.has(host) && (!path || path === "/Search")) return "";
    if (host === "wa.me") {
      const digits = url.pathname.replace(/\D/g, "");
      if (!digits || (/^81/.test(digits) && !/^81(70|80|90)/.test(digits))) return "";
    }
    return value;
  } catch {
    return "";
  }
}

export const PRESS_CARDS = [
  { img: "/images/news/n1.webp", sourceKey: "s1" as const, titleKey: "n1" as const },
  { img: "/images/news/n2.webp", sourceKey: "s2" as const, titleKey: "n2" as const },
  { img: "/images/news/n3.webp", sourceKey: "s3" as const, titleKey: "n3" as const },
  { img: "/images/news/n4.webp", sourceKey: "s4" as const, titleKey: "n4" as const },
  { img: "/images/hero/poster.webp", sourceKey: "s5" as const, titleKey: "n5" as const },
  { img: "/images/social/tsutenkaku-kart.webp", sourceKey: "s6" as const, titleKey: "n6" as const },
];

export const PRESS_OUTLETS = [
  "CNN TRAVEL",
  "BBC",
  "NATIONAL GEOGRAPHIC",
  "TIME OUT",
  "FORBES",
  "THE JAPAN TIMES",
];

export const SOCIAL_CARDS = [
  { img: "/images/social/tsutenkaku-kart.webp", nameKey: "s1" as const },
  { img: "/images/social/yejiankadingche.webp", nameKey: "s2" as const },
  { img: "/images/social/33.webp", nameKey: "s3" as const },
  { img: "/images/social/22.webp", nameKey: "s4" as const },
  { img: "/images/social/s4.webp", nameKey: "s5" as const },
  { img: "/images/social/yejingtiyan.webp", nameKey: "s6" as const },
];
