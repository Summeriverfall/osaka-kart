import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messageImports = {
  en: () => import("../messages/en.json"),
  ja: () => import("../messages/ja.json"),
  "zh-TW": () => import("../messages/zh-TW.json"),
  ko: () => import("../messages/ko.json"),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const loadMessages = messageImports[locale];
  const messages = (await loadMessages()).default;

  return {
    locale,
    messages,
    timeZone: "Asia/Tokyo",
  };
});
