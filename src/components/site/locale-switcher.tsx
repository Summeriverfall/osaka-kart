"use client";

import { useLocale } from "next-intl";
import { useAppPathname } from "@/lib/use-app-pathname";
import { appPageHref } from "@/lib/file-href";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "EN",
  ja: "日",
  "zh-TW": "繁",
  ko: "한",
};

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = useAppPathname() || "/";
  const switchPath = pathname === "/acid" || pathname.startsWith("/acid/")
    ? "/acid/?palette=pace"
    : pathname;

  return (
    <nav className="locale-switch" aria-label="Language">
      {routing.locales.map((code) => {
        const on = locale === code;
        return (
          <a
            key={code}
            href={appPageHref(switchPath, code)}
            hrefLang={code}
            aria-current={on ? "page" : undefined}
            className={cn(
              "inline-flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-full px-2 text-[0.7rem] font-semibold tracking-wide",
              on ? "bg-neon-pink text-white" : "text-gray-300 hover:text-white",
            )}
            onClick={(event) => {
              if (on) event.preventDefault();
              else document.documentElement.lang = code;
            }}
          >
            {LOCALE_LABELS[code]}
          </a>
        );
      })}
    </nav>
  );
}
