"use client";

import { Mail, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localeText, useBookingContact } from "@/lib/live-cms";
import { cn } from "@/lib/utils";

type BookingChannelsProps = {
  onlineHref?: string;
  onlineHash?: string;
  showOnline?: boolean;
  className?: string;
  stacked?: boolean;
};

export function BookingChannels({
  onlineHref,
  onlineHash = "#book",
  showOnline = true,
  className,
  stacked = true,
}: BookingChannelsProps) {
  const locale = useLocale();
  const contact = useTranslations("Contact");
  const book = useBookingContact();
  const online = localeText(book.onlineLabel, locale, contact("online"));
  const waHint = localeText(book.whatsappHint, locale, contact("whatsappHint"));
  const allowOnline = showOnline && book.showOnline;

  const items = [
    allowOnline ? (
      onlineHref ? (
        <Link key="online" href={onlineHref} className="cta-btn cta-btn-solid">
          {online}
        </Link>
      ) : (
        <a key="online" href={onlineHash} className="cta-btn cta-btn-solid">
          {online}
        </a>
      )
    ) : null,
    book.showWhatsapp ? (
      <a
        key="whatsapp"
        href={book.whatsapp}
        className="cta-btn has-tip"
        data-tip={waHint}
        title={waHint}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
    ) : null,
    book.showLine ? (
      <a key="line" href={book.line} className="cta-btn" target="_blank" rel="noreferrer">
        LINE
      </a>
    ) : null,
    book.showPhone ? (
      <a key="phone" href={book.tel} className="cta-btn cta-btn-ghost">
        <Phone className="size-4 shrink-0" aria-hidden />
        {book.phone}
      </a>
    ) : null,
    book.showEmail ? (
      <a key="email" href={book.mailto} className="cta-btn cta-btn-ghost">
        <Mail className="size-4 shrink-0" aria-hidden />
        {book.email}
      </a>
    ) : null,
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className={cn(stacked ? "grid gap-3" : "book-contact-row", className)}>
      {items}
    </div>
  );
}
