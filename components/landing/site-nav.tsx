"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import type { SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

type SiteNavProps = {
  theme: SiteTheme;
  changeLook: string;
  plans: string;
  videos: string;
  faq: string;
  booking: string;
  calendar: string;
};

export function SiteNav({
  theme,
  changeLook,
  plans,
  faq,
  booking,
  calendar,
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = (
    <>
      <a href="#plans" className="hash-link" onClick={() => setOpen(false)}>
        {plans}
      </a>
      <a href="#book" className="hash-link" onClick={() => setOpen(false)}>
        {calendar}
      </a>
      <a href="#faq" className="hash-link" onClick={() => setOpen(false)}>
        {faq}
      </a>
    </>
  );

  return (
    <header
      className={cn(
        "site-bar",
        `site-bar-${theme}`,
        scrolled && "is-scrolled",
      )}
    >
      <a href="#top" className="site-bar-logo">
        OSAKA KART
      </a>
      <nav className="site-bar-nav">{links}</nav>
      <div className="site-bar-end">
        <Link href="/" className="looks-link">
          {changeLook}
        </Link>
        <LocaleSwitcher />
        <a href="#book" className="cta-btn cta-btn-solid site-bar-cta">
          {booking}
        </a>
        <button
          type="button"
          className="site-bar-menu"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="site-bar-sheet">
          {links}
          <Link href="/" onClick={() => setOpen(false)}>
            {changeLook}
          </Link>
          <a href="#book" className="cta-btn cta-btn-solid" onClick={() => setOpen(false)}>
            {booking}
          </a>
        </div>
      ) : null}
    </header>
  );
}
