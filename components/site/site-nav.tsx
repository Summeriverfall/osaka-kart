"use client";

import { useEffect, useState } from "react";
import { Calendar, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { LookSwitcher } from "@/components/site/look-switcher";
import { SITE_CONTACT } from "@/lib/contact";
import { isSiteTheme, type SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

const items = [
  { hash: "#top", href: "/", key: "home" as const },
  { hash: "#plans", href: "/plan", key: "plans" as const },
  { hash: "#faq", href: "/faq", key: "faq" as const },
  { hash: "#videos", href: "/videos", key: "videos" as const },
];

type SiteNavProps = {
  look?: SiteTheme;
};

export function SiteNav({ look }: SiteNavProps) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0];
  const currentLook = look ?? (isSiteTheme(segment) ? segment : undefined);
  const onLanding = Boolean(currentLook);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0A0A0F]/75 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <a
          href={onLanding ? "#top" : "/"}
          className="neon-text text-lg font-black tracking-[0.18em]"
        >
          OSAKA KART
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) =>
            onLanding ? (
              <a
                key={item.key}
                href={item.hash}
                className="text-sm text-[#F1F1F5] hover:text-neon-pink"
              >
                {t(item.key)}
              </a>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm text-[#F1F1F5] hover:text-neon-pink"
              >
                {t(item.key)}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE_CONTACT.tel}
            className="hidden text-xs tracking-wide text-gray-300 hover:text-white lg:inline"
          >
            {SITE_CONTACT.phone}
          </a>
          <a
            href={SITE_CONTACT.mailto}
            className="hidden text-xs tracking-wide text-gray-300 hover:text-white lg:inline"
          >
            {SITE_CONTACT.email}
          </a>
          <div className="hidden sm:block">
            <LookSwitcher current={currentLook} />
          </div>
          <LocaleSwitcher />
          <Link
            href="/plan"
            className="cta-btn hidden px-4 py-2 text-xs md:inline-flex"
          >
            {t("booking")}
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 md:hidden"
            aria-label={t("menu")}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0A0A0F]/95 px-4 py-4 backdrop-blur-md md:hidden">
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
            <LookSwitcher current={currentLook} />
            <Link href="/plan" className="cta-btn mt-2 px-4 py-3 text-center" onClick={() => setOpen(false)}>
              {t("booking")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function FloatBook() {
  const t = useTranslations("Nav");
  return (
    <Link
      href="/plan"
      className="fixed right-4 bottom-4 z-[80] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(255,46,147,0.55)]"
    >
      <Calendar className="size-4" />
      {t("booking")}
    </Link>
  );
}
