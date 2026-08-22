"use client";

import { useLocale } from "next-intl";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { useAppPathname } from "@/lib/use-app-pathname";
import { withSlash } from "@/lib/paths";
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
  const router = useRouter();
  const pathname = useAppPathname();

  function switchTo(next: AppLocale) {
    if (next === locale) return;
    document.documentElement.lang = next;
    router.replace(withSlash(pathname), { locale: next });
  }

  return (
    <div className="flex max-w-[min(100%,14.5rem)] items-center gap-0.5 overflow-x-auto rounded-full border border-white/10 bg-[#12121A]/80 p-1">
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          className={cn(
            "shrink-0 rounded-full px-2 py-1 text-[0.7rem] font-semibold tracking-wide",
            locale === code
              ? "bg-neon-pink text-white"
              : "text-gray-300 hover:text-white",
          )}
          onClick={() => switchTo(code)}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
