"use client";

import { useEffect, useState } from "react";
import { Calendar, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAppPathname } from "@/lib/use-app-pathname";
import { LiveBrandMark } from "@/components/site/live-brand-mark";
import { ContactTicker, NavBookingContact } from "@/components/site/contact-ticker";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { siteHome, withSlash } from "@/lib/paths";
import { useSiteLook } from "@/lib/site-look";
import { isSiteTheme, type SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";
import { ToastHost } from "@/components/ui/toast-host";

type SiteNavProps = {
  look?: SiteTheme;
};

export function SiteNav({ look }: SiteNavProps) {
  const t = useTranslations("Nav");
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
    { hash: "#videos", href: siteHome(currentLook, "videos"), key: "videos" as const },
  ];

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
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
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
                  className="text-[1.05rem] font-semibold text-[#F1F1F5] hover:text-neon-pink"
                >
                  {t(item.key)}
                </a>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-[1.05rem] font-semibold text-[#F1F1F5] hover:text-neon-pink"
                >
                  {t(item.key)}
                </Link>
              ),
            )}
          </nav>
          <LocaleSwitcher />
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
                  className="py-2 text-[#F1F1F5]"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </a>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className="py-2 text-[#F1F1F5]"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ),
            )}
            {contact}
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
  return (
    <Link
      href={withSlash("/booking")}
      className="fixed right-4 bottom-4 z-[80] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,46,147,0.55)]"
    >
      <Calendar className="size-4" />
      {t("booking")}
    </Link>
  );
}
