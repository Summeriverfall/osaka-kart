"use client";

import { useTranslations } from "next-intl";
import { useBookingContact } from "@/lib/live-cms";

export function BookingPageContact() {
  const contact = useTranslations("Contact");
  const book = useBookingContact();

  return <p className="ok-page-hours">{contact("hours", { hours: book.hours })}</p>;
}
