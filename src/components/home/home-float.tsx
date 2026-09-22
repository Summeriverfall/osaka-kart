"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { bookingContact, useLiveCms } from "@/lib/live-cms";
import { homeCopy, TRIPADVISOR_SEARCH } from "@/lib/home-storefront";
import { SITE_CONTACT } from "@/lib/contact";

type PopKind = "ask" | "social" | null;

export function HomeFloat({ locale }: { locale: string }) {
  const cms = useLiveCms();
  const copy = homeCopy(locale);
  const contact = bookingContact(cms);
  const [open, setOpen] = useState(false);
  const [pop, setPop] = useState<PopKind>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onScroll() {
      if (!pop) setOpen(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pop]);

  useEffect(() => {
    if (!pop) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setPop(null);
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [pop]);

  const socials = useMemo(() => {
    const s = cms.site.social;
    return [
      { id: "instagram", label: "Instagram", href: s.instagram?.trim() || SITE_CONTACT.instagram, icon: <InstagramIcon /> },
      { id: "tiktok", label: "TikTok", href: s.tiktok?.trim() || SITE_CONTACT.tiktok, icon: <TikTokIcon /> },
      { id: "facebook", label: "Facebook", href: s.facebook?.trim() || SITE_CONTACT.facebook, icon: <FacebookIcon /> },
      { id: "tripadvisor", label: "TripAdvisor", href: TRIPADVISOR_SEARCH, icon: <TripAdvisorIcon /> },
      { id: "twitter", label: "Twitter", href: s.x?.trim() || SITE_CONTACT.x, icon: <XIcon /> },
    ];
  }, [cms.site.social]);

  const wa =
    contact.whatsapp?.trim() ||
    `https://wa.me/${contact.phone.replace(/\D/g, "")}` ||
    SITE_CONTACT.whatsapp;

  const asks = [
    { href: wa, label: copy.floatWhatsapp, ext: true },
    { href: contact.line || SITE_CONTACT.line, label: copy.floatLine, ext: true },
    { href: contact.tel, label: copy.floatCall, ext: false },
    { href: contact.mailto, label: copy.floatMail, ext: false },
  ];

  if (!mounted) return null;

  return createPortal(
    <>
      <aside className="ok-social-dock" aria-label={copy.floatSocialTitle}>
        <p className="ok-social-dock-kicker">{copy.floatSocialTitle}</p>
        {socials.map((item) => (
          <a key={item.id} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </aside>

      <aside className={open ? "ok-action-dock is-open" : "ok-action-dock"} aria-label={copy.floatDock}>
        <button
          type="button"
          className="ok-action-magnet"
          aria-expanded={open}
          aria-label={open ? copy.floatClose : copy.floatOpen}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{copy.floatMagnet}</span>
        </button>
        <div className="ok-action-stack">
          <a className="ok-action-btn is-book" href="#packages" onClick={() => { setOpen(false); setPop(null); }}>
            {copy.floatBook}
          </a>
          <button type="button" className="ok-action-btn is-ask" onClick={() => setPop("ask")}>
            {copy.floatAsk}
          </button>
          <button type="button" className="ok-action-btn is-social" onClick={() => setPop("social")}>
            {copy.floatSocial}
          </button>
        </div>
      </aside>

      {pop ? (
        <div className="ok-float-pop" data-kind={pop} onClick={() => setPop(null)}>
          <div className="ok-float-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="ok-float-x" aria-label={copy.close} onClick={() => setPop(null)}>
              ×
            </button>
            <h3>{pop === "ask" ? copy.floatAskTitle : copy.floatSocialTitle}</h3>
            <div className="ok-float-choices">
              {pop === "ask"
                ? asks.map((item) => (
                    <a
                      key={item.label}
                      className="ok-float-choice"
                      href={item.href}
                      {...(item.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {item.label}
                    </a>
                  ))
                : socials.map((item) => (
                    <a key={item.id} className="ok-float-choice" href={item.href} target="_blank" rel="noreferrer">
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  ))}
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.2 3c.4 2.6 1.9 4.3 4.4 4.6v2.7c-1.5 0-2.9-.5-4.1-1.4v6.5c0 3.4-2.6 6-6.2 6.1A6.2 6.2 0 0 1 8.2 9.6v2.8c.5-.2 1-.3 1.6-.3 1.4 0 2.6 1.1 2.6 2.6V3h1.8Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.2 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.5 1.6-1.5h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H8.2v3.2h2.6V22h3.4Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.7 10.3 22 2h-2.2l-6.2 6.9L8.7 2H2l7.7 10.9L2 22h2.2l6.8-7.6L15.3 22H22l-7.3-11.7Zm-2.4 2.7-.8-1.1L5 3.5h2.6l5.2 7.2.8 1.1L19.2 20.5h-2.6l-4.3-7.5Z" />
    </svg>
  );
}

function TripAdvisorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.4 11.2A9.2 9.2 0 0 0 12.1 4a9.2 9.2 0 0 0-9.3 7.2H0l3.3 3.7L6.6 11.2H4.8a7.4 7.4 0 0 1 14.4 0h-1.8l3.3 3.7 3.3-3.7h-2.6Zm-13.1 1.4a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm7.4 0a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4ZM7.3 10a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm7.4 0a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2ZM8.6 16.2 12 19.4l3.4-3.2c-1 .5-2.2.8-3.4.8s-2.4-.3-3.4-.8Z" />
    </svg>
  );
}
