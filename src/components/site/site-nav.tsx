"use client";

import { useEffect, useState } from "react";
import { Calendar, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAppPathname } from "@/lib/use-app-pathname";
import { LiveBrandMark } from "@/components/site/live-brand-mark";
import { ContactTicker, NavBookingContact } from "@/components/site/contact-ticker";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { siteHome, withSlash } from "@/lib/paths";
import { appPageHref, isFileProtocol, navigateToHref } from "@/lib/file-href";
import { useSiteLook } from "@/lib/site-look";
import { isSiteTheme, type SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";
import { ToastHost } from "@/components/ui/toast-host";

type SiteNavProps = {
  look?: SiteTheme;
};

export function SiteNav({ look }: SiteNavProps) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = useAppPathname();
  const currentLook = useSiteLook(look);
  const home = siteHome(currentLook);
  const segment = pathname.split("/").filter(Boolean)[0];
  const onLanding = isSiteTheme(segment);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const items = [
    { hash: "#top", href: home, key: "home" as const },
    { hash: "#plans", href: siteHome(currentLook, "plans"), key: "plans" as const },
    { hash: "#faq", href: withSlash("/faq"), key: "faq" as const },
    { hash: "#experience", href: siteHome(currentLook, "experience"), key: "videos" as const },
  ];

  function go(href: string) {
    if (isFileProtocol()) {
      navigateToHref(href, locale);
      return;
    }
    window.location.href = appPageHref(href, locale);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const contact = <NavBookingContact onClick={() => setOpen(false)} />;

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0A0A0F]/75 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
        <LiveBrandMark look={currentLook} />
        <div className="site-bar-contact">
          <ContactTicker />
        </div>
        <div className="site-bar-end">
          <nav className="hidden items-center gap-8 md:flex">
            {items.map((item) =>
              onLanding ? (
                <a
                  key={item.key}
                  href={item.hash}
                  className="text-[1.05rem] font-semibold text-[#D4D4DC] hover:text-neon-pink"
                >
                  {t(item.key)}
                </a>
              ) : (
                <a
                  key={item.key}
                  href={appPageHref(item.href, locale)}
                  className="text-[1.05rem] font-semibold text-[#D4D4DC] hover:text-neon-pink"
                  suppressHydrationWarning
                  onClick={(event) => {
                    if (!isFileProtocol()) return;
                    event.preventDefault();
                    go(item.href);
                  }}
                >
                  {t(item.key)}
                </a>
              ),
            )}
          </nav>
          <LocaleSwitcher />
          <a
            href={appPageHref(withSlash("/booking"), locale)}
            className="cta-btn nav-cta site-bar-cta hidden md:inline-flex"
            suppressHydrationWarning
            onClick={(event) => {
              if (!isFileProtocol()) return;
              event.preventDefault();
              go(withSlash("/booking"));
            }}
          >
            {t("booking")}
          </a>
          <button
            type="button"
            className="site-bar-menu"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="site-bar-sheet border-t border-white/10 bg-[#0A0A0F]/95 px-4 py-4 backdrop-blur-md">
          <div className="flex flex-col gap-3">
            {items.map((item) =>
              onLanding ? (
                <a
                  key={item.key}
                  href={item.hash}
                  className="py-2 text-[#D4D4DC]"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </a>
              ) : (
                <a
                  key={item.key}
                  href={appPageHref(item.href, locale)}
                  className="py-2 text-[#D4D4DC]"
                  suppressHydrationWarning
                  onClick={(event) => {
                    setOpen(false);
                    if (!isFileProtocol()) return;
                    event.preventDefault();
                    go(item.href);
                  }}
                >
                  {t(item.key)}
                </a>
              ),
            )}
            {contact}
            <a
              href={appPageHref(withSlash("/booking"), locale)}
              className="cta-btn nav-cta"
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
          </div>
        </div>
      )}
    </header>
    <ToastHost />
    </>
  );
}

export function FloatBook() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  return (
    <a
      href={appPageHref(withSlash("/booking"), locale)}
      className="fixed right-4 bottom-4 z-[80] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,46,147,0.55)]"
      suppressHydrationWarning
      onClick={(event) => {
        if (!isFileProtocol()) return;
        event.preventDefault();
        navigateToHref(withSlash("/booking"), locale);
      }}
    >
      <Calendar className="size-4" />
      {t("booking")}
    </a>
  );
}
