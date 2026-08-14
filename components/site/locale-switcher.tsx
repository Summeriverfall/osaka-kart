"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "EN",
  ja: "日",
  "zh-CN": "中",
};

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: AppLocale) {
    if (next === locale) return;
    document.documentElement.lang = next;
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#12121A]/80 p-1">
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
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
