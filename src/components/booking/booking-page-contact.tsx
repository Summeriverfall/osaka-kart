"use client";

import { useTranslations } from "next-intl";
import { BookingChannels } from "@/components/site/booking-channels";
import { useBookingContact } from "@/lib/live-cms";

export function BookingPageContact() {
  const contact = useTranslations("Contact");
  const book = useBookingContact();

  return (
    <div className="book-contact-row">
      <BookingChannels stacked={false} showOnline={false} />
      <span>{contact("hours", { hours: book.hours })}</span>
    </div>
  );
}

export function BookingPageCallNote() {
  const t = useTranslations("Booking");
  const book = useBookingContact();
  const bits = [book.showPhone ? book.phone : null, book.showEmail ? book.email : null].filter(Boolean);
  if (!bits.length) return null;

  return (
    <article className="book-course">
      <h2>{t("call")}</h2>
      <p>{bits.join(" / ")}</p>
    </article>
  );
}
