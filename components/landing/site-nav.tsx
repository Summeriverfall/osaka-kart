"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LiveBrandMark } from "@/components/site/live-brand-mark";
import { ContactTicker, NavBookingContact } from "@/components/site/contact-ticker";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import type { SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

type SiteNavProps = {
  theme: SiteTheme;
  experience: string;
  plans: string;
  faq: string;
  calendar: string;
};

export function SiteNav({ theme, experience, plans, faq, calendar }: SiteNavProps) {
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
      <a href="#experience" className="hash-link" onClick={() => setOpen(false)}>
        {experience}
      </a>
      <a href="#faq" className="hash-link" onClick={() => setOpen(false)}>
        {faq}
      </a>
    </>
  );

  const contact = <NavBookingContact onClick={() => setOpen(false)} />;

  return (
    <header
      className={cn(
        "site-bar",
        `site-bar-${theme}`,
        scrolled && "is-scrolled",
      )}
    >
      <LiveBrandMark className="site-bar-logo" look={theme} />
      <div className="site-bar-contact">
        <ContactTicker />
      </div>
      <div className="site-bar-end">
        <nav className="site-bar-nav">{links}</nav>
        <LocaleSwitcher />
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
          {contact}
        </div>
      ) : null}
    </header>
  );
}
