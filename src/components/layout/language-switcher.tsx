"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { useAppPathname } from "@/lib/use-app-pathname";
import { withSlash } from "@/lib/paths";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_META: Record<
  AppLocale,
  { short: string; native: string }
> = {
  en: { short: "EN", native: "English" },
  ja: { short: "日", native: "日本語" },
  "zh-TW": { short: "繁", native: "繁體中文" },
  ko: { short: "한", native: "한국어" },
};

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = useAppPathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function switchTo(next: AppLocale) {
    if (next === locale) {
      setOpen(false);
      return;
    }

    const query = searchParams.toString();
    const href = query ? withSlash(`${pathname}?${query}`) : withSlash(pathname);
    router.replace(href, { locale: next });
    setOpen(false);
  }

  const current = LOCALE_META[locale] ?? LOCALE_META.en;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="lang-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.native}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe className="size-4" />
        <span>{current.short}</span>
        <ChevronDown
          className={cn("size-3.5 transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          className="lang-switcher-menu"
          role="listbox"
          aria-label="Language"
        >
          {routing.locales.map((code) => {
            const meta = LOCALE_META[code];
            const active = code === locale;

            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={cn("lang-switcher-option", active && "is-active")}
                  onClick={() => switchTo(code)}
                >
                  <span className="w-6 font-semibold">{meta.short}</span>
                  <span className="text-[#9CA3AF]">{meta.native}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
