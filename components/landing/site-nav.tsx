"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { SITE_CONTACT } from "@/lib/contact";
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

function HashLinks({
  plans,
  videos,
  faq,
  calendar,
}: Pick<SiteNavProps, "plans" | "videos" | "faq" | "calendar">) {
  return (
    <>
      <a href="#plans">{plans}</a>
      <a href="#videos">{videos}</a>
      <a href="#book">{calendar}</a>
      <a href="#faq">{faq}</a>
    </>
  );
}

function ContactMini() {
  return (
    <p className="nav-contact">
      <a href={SITE_CONTACT.tel}>{SITE_CONTACT.phone}</a>
      <a href={SITE_CONTACT.mailto}>{SITE_CONTACT.email}</a>
    </p>
  );
}

export function SiteNav({
  theme,
  changeLook,
  plans,
  videos,
  faq,
  booking,
  calendar,
}: SiteNavProps) {
  const hashes = { plans, videos, faq, calendar };

  if (theme === "hud") {
    return (
      <aside className="hud-dock">
        <a href="#top" className="hud-dock-logo">
          OSAKA.KART
        </a>
        <p className="hud-dock-sys">SYS // STREET_01</p>
        <nav className="hud-dock-nav">
          <HashLinks {...hashes} />
        </nav>
        <div className="hud-dock-end">
          <ContactMini />
          <Link href="/" className="hud-dock-back">
            {changeLook}
          </Link>
          <LocaleSwitcher />
          <Link href="/plan" className="cta-btn hud-dock-cta">
            {booking}
          </Link>
        </div>
      </aside>
    );
  }

  if (theme === "acid") {
    return (
      <header className="acid-bar">
        <a href="#top" className="acid-bar-logo">
          OSAKA KART
        </a>
        <nav className="acid-bar-nav">
          <HashLinks {...hashes} />
        </nav>
        <div className="acid-bar-end">
          <ContactMini />
          <Link href="/">{changeLook}</Link>
          <LocaleSwitcher />
          <Link href="/plan" className="cta-btn">
            {booking}
          </Link>
        </div>
      </header>
    );
  }

  if (theme === "oni") {
    return (
      <header className="oni-tabs">
        <a href="#top" className="oni-tabs-mark">
          鬼
        </a>
        <nav>
          <HashLinks {...hashes} />
        </nav>
        <div className="oni-tabs-end">
          <ContactMini />
          <Link href="/">{changeLook}</Link>
          <LocaleSwitcher />
          <Link href="/plan" className="cta-btn">
            {booking}
          </Link>
        </div>
      </header>
    );
  }

  if (theme === "glitch") {
    return (
      <header className="glitch-chips">
        <a href="#top" className="glitch-chips-logo">
          OSAKA//KART
        </a>
        <nav>
          <a href="#plans" className="chip-a">
            {plans}
          </a>
          <a href="#videos" className="chip-b">
            {videos}
          </a>
          <a href="#book" className="chip-c">
            {calendar}
          </a>
          <a href="#faq" className="chip-a">
            {faq}
          </a>
        </nav>
        <div className="glitch-chips-end">
          <ContactMini />
          <Link href="/">{changeLook}</Link>
          <LocaleSwitcher />
          <Link href="/plan" className="cta-btn">
            {booking}
          </Link>
        </div>
      </header>
    );
  }

  return <NeonNav changeLook={changeLook} booking={booking} {...hashes} />;
}

function NeonNav({
  changeLook,
  plans,
  videos,
  faq,
  booking,
  calendar,
}: Omit<SiteNavProps, "theme">) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("landing-nav nav-neon", scrolled && "is-scrolled")}>
      <div className="nav-brand">
        <a href="#top" className="nav-logo">
          OSAKA KART
        </a>
        <Link href="/" className="looks-link">
          {changeLook}
        </Link>
      </div>
      <nav className="nav-hash">
        <a href="#plans" className="hash-link">
          {plans}
        </a>
        <a href="#videos" className="hash-link">
          {videos}
        </a>
        <a href="#book" className="hash-link">
          {calendar}
        </a>
        <a href="#faq" className="hash-link">
          {faq}
        </a>
      </nav>
      <div className="nav-end">
        <ContactMini />
        <LocaleSwitcher />
        <Link href="/plan" className="cta-btn nav-cta">
          {booking}
        </Link>
      </div>
    </header>
  );
}
