"use client";

import { Mail, Phone } from "lucide-react";
import { useBookingContact } from "@/lib/live-cms";
import { cn } from "@/lib/utils";

type ContactTickerProps = {
  className?: string;
  onNavigate?: () => void;
};

const TICKER_PAIRS = 4;

export function NavBookingContact({ onClick }: { onClick?: () => void }) {
  const book = useBookingContact();
  if (!book.showPhone && !book.showEmail) return null;
  return (
    <div className="site-bar-contact-list">
      {book.showPhone ? (
        <a href={book.tel} onClick={onClick}>
          <Phone className="size-4" />
          {book.phone}
        </a>
      ) : null}
      {book.showEmail ? (
        <a href={book.mailto} onClick={onClick}>
          <Mail className="size-4" />
          {book.email}
        </a>
      ) : null}
    </div>
  );
}

export function ContactTicker({ className, onNavigate }: ContactTickerProps) {
  const book = useBookingContact();
  if (!book.showPhone && !book.showEmail) return null;

  return (
    <div className={cn("contact-ticker", className)}>
      <div className="contact-ticker-track">
        <ContactTickerSet book={book} onNavigate={onNavigate} />
        <ContactTickerSet book={book} onNavigate={onNavigate} clone />
      </div>
    </div>
  );
}

function ContactTickerSet({
  book,
  onNavigate,
  clone = false,
}: {
  book: ReturnType<typeof useBookingContact>;
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
            book={book}
            tabbable={tabbable}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}

function ContactTickerPair({
  book,
  tabbable,
  onNavigate,
}: {
  book: ReturnType<typeof useBookingContact>;
  tabbable: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {book.showPhone ? (
        <a
          href={book.tel}
          tabIndex={tabbable ? undefined : -1}
          onClick={onNavigate}
        >
          <Phone className="size-5" />
          {book.phone}
        </a>
      ) : null}
      {book.showEmail ? (
        <a
          href={book.mailto}
          tabIndex={tabbable ? undefined : -1}
          onClick={onNavigate}
        >
          <Mail className="size-5" />
          {book.email}
        </a>
      ) : null}
    </>
  );
}
