"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useAppPathname } from "@/lib/use-app-pathname";
import { appPageHref } from "@/lib/file-href";
import { routing, type AppLocale } from "@/i18n/routing";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  ja: "日本語",
  "zh-TW": "繁體中文",
  ko: "한국어",
};

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = useAppPathname() || "/";
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const switchPath = pathname === "/acid" || pathname.startsWith("/acid/")
    ? "/acid/?palette=pace"
    : pathname;

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="ok-lang" ref={box}>
      <button type="button" className="ok-lang-btn" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
      </button>
      {open ? (
        <div className="ok-lang-menu" role="listbox">
          {routing.locales.map((code) => {
            const on = locale === code;
            return (
              <a
                key={code}
                href={appPageHref(switchPath, code)}
                hrefLang={code}
                aria-current={on ? "true" : undefined}
                className={on ? "is-on" : undefined}
                onClick={(event) => {
                  if (on) event.preventDefault();
                  else document.documentElement.lang = code;
                  setOpen(false);
                }}
              >
                {LOCALE_LABELS[code]}
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
