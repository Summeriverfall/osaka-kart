"use client";

import { Mail, Phone } from "lucide-react";
import { useLayoutEffect, useRef, useState, type CSSProperties, type Ref } from "react";
import { useBookingContact } from "@/lib/live-cms";
import { cn } from "@/lib/utils";

type ContactTickerProps = {
  className?: string;
  onNavigate?: () => void;
};

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(10);
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;
    const box = viewport;
    const strip = group;

    function measure() {
      const viewW = box.offsetWidth;
      const groupW = strip.offsetWidth;
      if (!viewW || !groupW) return;
      const perItem = groupW / repeat;
      if (!perItem) return;
      const need = Math.max(4, Math.ceil(viewW / perItem) + 2);
      if (need > repeat) {
        setRepeat(need);
        return;
      }
      setShift(groupW);
    }

    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(group);
    measure();
    return () => ro.disconnect();
  }, [repeat, book.phone, book.email, book.showPhone, book.showEmail]);

  if (!book.showPhone && !book.showEmail) return null;

  const duration = shift > 0 ? `${Math.max(16, shift / 72)}s` : "28s";

  return (
    <div ref={viewportRef} className={cn("contact-ticker", className)}>
      <div
        className="contact-ticker-track"
        style={
          {
            "--ticker-shift": shift ? `${shift}px` : "50%",
            "--ticker-duration": duration,
          } as CSSProperties
        }
      >
        <ContactTickerSet
          ref={groupRef}
          book={book}
          count={repeat}
          onNavigate={onNavigate}
        />
        <ContactTickerSet book={book} count={repeat} onNavigate={onNavigate} clone />
      </div>
    </div>
  );
}

function ContactTickerSet({
  book,
  count,
  onNavigate,
  clone = false,
  ref,
}: {
  book: ReturnType<typeof useBookingContact>;
  count: number;
  onNavigate?: () => void;
  clone?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className="contact-ticker-group" aria-hidden={clone || undefined}>
      {Array.from({ length: count }, (_, index) => (
        <ContactTickerPair
          key={index}
          book={book}
          tabbable={!clone && index === 0}
          onNavigate={onNavigate}
        />
      ))}
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
    <span className="contact-ticker-unit">
      {book.showPhone ? (
        <a href={book.tel} tabIndex={tabbable ? undefined : -1} onClick={onNavigate}>
          <Phone className="size-5" />
          {book.phone}
        </a>
      ) : null}
      {book.showEmail ? (
        <a href={book.mailto} tabIndex={tabbable ? undefined : -1} onClick={onNavigate}>
          <Mail className="size-5" />
          {book.email}
        </a>
      ) : null}
    </span>
  );
}
