"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAppPathname } from "@/lib/use-app-pathname";
import { appPageHref, isFileProtocol } from "@/lib/file-href";
import { routing, type AppLocale } from "@/i18n/routing";
import { consumeLangPicked, LOCALE_LABELS, markLangPicked, withLangPickedQuery } from "@/lib/locales";
import { cn } from "@/lib/utils";

function useLocaleSwitch() {
  const locale = useLocale() as AppLocale;
  const pathname = useAppPathname() || "/";
  const router = useRouter();
  const intlPath = usePathname() || "/";
  const switchPath = pathname === "/acid" || pathname.startsWith("/acid/")
    ? "/acid/?palette=pace"
    : pathname;

  function goTo(code: AppLocale, event?: MouseEvent<HTMLAnchorElement>) {
    markLangPicked(code);
    if (code === locale) {
      event?.preventDefault();
      return;
    }
    document.documentElement.lang = code;
    if (isFileProtocol()) return;
    event?.preventDefault();
    const qs = new URLSearchParams(window.location.search);
    qs.set("langpicked", "1");
    const pathOnly = intlPath.split("?")[0] || "/";
    router.replace(`${pathOnly}?${qs}${window.location.hash}`, { locale: code });
  }

  return { locale, switchPath, goTo };
}

export function LocaleLinks({
  className,
  onPicked,
}: {
  className?: string;
  onPicked?: () => void;
}) {
  const { locale, switchPath, goTo } = useLocaleSwitch();

  return (
    <div className={cn("ok-lang-grid", className)} role="listbox">
      {routing.locales.map((code) => {
        const on = locale === code;
        return (
          <a
            key={code}
            href={withLangPickedQuery(appPageHref(switchPath, code))}
            hrefLang={code}
            aria-current={on ? "true" : undefined}
            className={on ? "is-on" : undefined}
            onClick={(event) => {
              goTo(code, event);
              onPicked?.();
            }}
          >
            {LOCALE_LABELS[code]}
          </a>
        );
      })}
    </div>
  );
}

export function LocaleGate() {
  const { locale, switchPath, goTo } = useLocaleSwitch();
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/admin") || path.includes("/agent")) return;
    if (consumeLangPicked(locale)) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [locale]);

  if (!open) return null;

  return (
    <div className="ok-lang-gate" role="dialog" aria-modal="true" aria-labelledby="ok-lang-gate-title">
      <div className="ok-lang-gate-card">
        <p className="ok-lang-gate-kicker">{t("language")}</p>
        <h2 id="ok-lang-gate-title">{t("chooseLanguage")}</h2>
        <div className="ok-lang-grid is-gate">
          {routing.locales.map((code) => (
            <a
              key={code}
              href={withLangPickedQuery(appPageHref(switchPath, code))}
              hrefLang={code}
              className={locale === code ? "is-on" : undefined}
              onClick={(event) => {
                goTo(code, event);
                setOpen(false);
              }}
            >
              {LOCALE_LABELS[code]}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LocaleSwitcher() {
  const { locale, switchPath, goTo } = useLocaleSwitch();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(event: globalThis.MouseEvent) {
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
        <span>{LOCALE_LABELS[locale]}</span>
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
                  goTo(code, event);
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
