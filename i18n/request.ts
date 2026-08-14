import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messageImports = {
  en: () => import("../messages/en.json"),
  ja: () => import("../messages/ja.json"),
  "zh-CN": () => import("../messages/zh-CN.json"),
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
