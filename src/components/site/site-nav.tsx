"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAppPathname } from "@/lib/use-app-pathname";
import { LiveBrandMark } from "@/components/site/live-brand-mark";
import { LocaleLinks, LocaleSwitcher } from "@/components/site/locale-switcher";
import { withSlash } from "@/lib/paths";
import { appPageHref, isFileProtocol, navigateToHref } from "@/lib/file-href";
import { useSiteLook } from "@/lib/site-look";
import { isSiteTheme, type SiteTheme } from "@/lib/visual-theme";
import { ToastHost } from "@/components/ui/toast-host";

type SiteNavProps = {
  look?: SiteTheme;
};

export function SiteNav({ look }: SiteNavProps) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = useAppPathname();
  const currentLook = useSiteLook(look);
  const segment = pathname.split("/").filter(Boolean)[0];
  const onTheme = isSiteTheme(segment);
  const onHome = !segment;
  const onLanding = onHome || onTheme;
  const onBooking = pathname.startsWith("/booking");
  const onPay = pathname.startsWith("/pay");
  const hideBookCta = onBooking || onPay || onLanding;
  const [open, setOpen] = useState(false);

  const items = [
    { key: "home" as const, hash: onTheme ? "#top" : "#home", href: withSlash("/") },
    { key: "plans" as const, hash: onTheme ? "#plans" : "#packages", href: withSlash("/#packages") },
    { key: "videos" as const, hash: onTheme ? "#experience" : "#videos", href: withSlash("/#videos") },
    { key: "reviews" as const, hash: "#reviews", href: withSlash("/#reviews") },
    { key: "help" as const, hash: "", href: withSlash("/help") },
  ];

  function go(href: string) {
    if (isFileProtocol()) {
      navigateToHref(href, locale);
      return;
    }
    window.location.href = appPageHref(href, locale);
  }

  const contactBtn = (
    <button
      type="button"
      className="ok-nav-sheet-contact-btn"
      onClick={() => {
        setOpen(false);
        const foot = document.getElementById("footer");
        const hidden = !foot || foot.offsetParent === null;
        if (hidden) {
          go(withSlash("/#footer"));
          return;
        }
        foot.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {t("contact")}
    </button>
  );

  return (
    <>
      <header className="ok-nav">
        <div className="ok-nav-inner">
          <LiveBrandMark className="ok-brand" look={currentLook} />
          <nav className="ok-nav-links">
            {items.map((item) => {
              const href = onLanding && item.hash ? item.hash : appPageHref(item.href, locale);
              const on =
                (item.key === "home" && onHome) ||
                (item.key === "help" && (pathname.startsWith("/help") || pathname.startsWith("/faq"))) ||
                (item.key === "videos" && pathname.startsWith("/videos")) ||
                (item.key === "plans" && pathname.startsWith("/plan"));
              return (
                <a
                  key={item.key}
                  href={href}
                  className={on ? "ok-nav-link is-on" : "ok-nav-link"}
                  suppressHydrationWarning
                  onClick={(event) => {
                    if (onLanding && item.hash) return;
                    if (!isFileProtocol()) return;
                    event.preventDefault();
                    go(item.href);
                  }}
                >
                  {t(item.key)}
                </a>
              );
            })}
          </nav>
          <div className="ok-nav-end">
            <LocaleSwitcher />
            {!hideBookCta ? (
              <a
                href={appPageHref(withSlash("/booking"), locale)}
                className="ok-nav-cta"
                suppressHydrationWarning
                onClick={(event) => {
                  if (!isFileProtocol()) return;
                  event.preventDefault();
                  go(withSlash("/booking"));
                }}
              >
                {t("booking")}
              </a>
            ) : null}
            <button
              type="button"
              className={open ? "ok-nav-menu is-open" : "ok-nav-menu"}
              aria-label={t("menu")}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        {open ? (
          <div className="ok-nav-sheet">
            <nav className="ok-nav-sheet-links">
              {items.map((item) => {
                const href = onLanding && item.hash ? item.hash : appPageHref(item.href, locale);
                return (
                  <a
                    key={item.key}
                    href={href}
                    suppressHydrationWarning
                    onClick={(event) => {
                      setOpen(false);
                      if (onLanding && item.hash) return;
                      if (!isFileProtocol()) return;
                      event.preventDefault();
                      go(item.href);
                    }}
                  >
                    {t(item.key)}
                  </a>
                );
              })}
            </nav>
            <div className="ok-nav-sheet-langs">
              <p>{t("language")}</p>
              <LocaleLinks onPicked={() => setOpen(false)} />
            </div>
            <div className="ok-nav-sheet-contact">{contactBtn}</div>
            {!hideBookCta ? (
              <a
                href={appPageHref(withSlash("/booking"), locale)}
                className="ok-btn ok-nav-sheet-cta"
                suppressHydrationWarning
                onClick={(event) => {
                  setOpen(false);
                  if (!isFileProtocol()) return;
                  event.preventDefault();
                  go(withSlash("/booking"));
                }}
              >
                {t("booking")}
              </a>
            ) : null}
          </div>
        ) : null}
      </header>
      <ToastHost />
    </>
  );
}
