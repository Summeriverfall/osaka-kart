"use client";

import { Mail, Phone } from "lucide-react";
import { SITE_CONTACT } from "@/lib/contact";
import { cn } from "@/lib/utils";

type ContactTickerProps = {
  className?: string;
  onNavigate?: () => void;
};

const TICKER_PAIRS = 4;

export function ContactTicker({ className, onNavigate }: ContactTickerProps) {
  return (
    <div className={cn("contact-ticker", className)}>
      <div className="contact-ticker-track">
        <ContactTickerSet onNavigate={onNavigate} />
        <ContactTickerSet onNavigate={onNavigate} clone />
      </div>
    </div>
  );
}

function ContactTickerSet({
  onNavigate,
  clone = false,
}: {
  onNavigate?: () => void;
  clone?: boolean;
}) {
  return (
    <div className="site-bar-contact-list" aria-hidden={clone || undefined}>
      {Array.from({ length: TICKER_PAIRS }, (_, index) => {
        const tabbable = !clone && index === 0;
        return (
          <ContactTickerPair
            key={index}
            tabbable={tabbable}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}

function ContactTickerPair({
  tabbable,
  onNavigate,
}: {
  tabbable: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <a
        href={SITE_CONTACT.tel}
        tabIndex={tabbable ? undefined : -1}
        onClick={onNavigate}
      >
        <Phone className="size-5" />
        {SITE_CONTACT.phone}
      </a>
      <a
        href={SITE_CONTACT.mailto}
        tabIndex={tabbable ? undefined : -1}
        onClick={onNavigate}
      >
        <Mail className="size-5" />
        {SITE_CONTACT.email}
      </a>
    </>
  );
}

