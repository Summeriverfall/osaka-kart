"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LiveBrandMark } from "@/components/site/live-brand-mark";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { NavBookingContact } from "@/components/site/contact-ticker";
import { siteHome } from "@/lib/paths";

type AcidBarProps = {
  access: string;
  book: string;
  plans: string;
  faq: string;
  home?: string;
  away?: boolean;
};

export function AcidBar({ access, book, plans, faq, home, away = false }: AcidBarProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  function hashLink(hash: string, label: string, local = false) {
    if (away && !local) {
      return (
        <Link href={siteHome("acid", hash)} onClick={close}>
          {label}
        </Link>
      );
    }
    return (
      <a href={`#${hash}`} onClick={close}>
        {label}
      </a>
    );
  }

  const links = (
    <>
      {home ? (
        away ? (
          <Link href={siteHome("acid")} onClick={close}>
            {home}
          </Link>
        ) : (
          <a href="#top" onClick={close}>
            {home}
          </a>
        )
      ) : null}
      {hashLink("access", access)}
      {hashLink("book", book, true)}
      {hashLink("plans", plans)}
      {hashLink("faq", faq)}
    </>
  );

  return (
    <header className="acid-bar">
      <span className="acid-bar-stripe" aria-hidden />
      <span className="acid-lights" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <LiveBrandMark className="acid-bar-logo" look="acid" />
      <nav className="acid-bar-nav">{links}</nav>
      <div className="acid-bar-end">
        <LocaleSwitcher />
        <button
          type="button"
          className="acid-bar-menu"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="acid-bar-sheet">
          {links}
          <NavBookingContact onClick={() => setOpen(false)} />
        </div>
      ) : null}
    </header>
  );
}
