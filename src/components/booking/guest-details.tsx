"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CountrySearch } from "@/components/booking/country-search";
import {
  extraGuestCount,
  formatParticipantsNote,
  readParticipants,
  saveParticipants,
  type ParticipantDraft,
} from "@/lib/booking/participants";
import { regionName } from "@/lib/geo/countries";
import { useOpsStore } from "@/stores/ops-store";
import type { BookingResult } from "@/stores/booking-store";

type GuestDetailsProps = {
  locale: string;
  result: BookingResult;
};

export function GuestDetails({ locale, result }: GuestDetailsProps) {
  const t = useTranslations("Success");
  const count = extraGuestCount(result.riders);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ParticipantDraft[]>(() => emptyOrSaved(result));
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRows(readParticipants(result.ref, result.riders));
  }, [result.ref, result.riders]);

  if (count < 1) return null;

  function patch(index: number, next: Partial<ParticipantDraft>) {
    setRows((cur) => cur.map((row, i) => (i === index ? { ...row, ...next } : row)));
    setSaved(false);
  }

  function persist() {
    saveParticipants(result.ref, rows);
    const note = formatParticipantsNote(rows);
    if (note) {
      const order = useOpsStore.getState().orders.find((item) => item.id === result.ref);
      if (order) {
        const cleaned = order.note.replace(/(?:\n)?同行者\d+:.+$/g, "").trim();
        useOpsStore.getState().patchOrder(result.ref, {
          note: cleaned ? `${cleaned}\n${note}` : note,
        });
      }
    }
    setSaved(true);
  }

  async function copyInvite() {
    const text = t("inviteText", { n: count, ref: result.ref });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="book-guests">
      <button type="button" className="ok-btn-ghost book-guests-toggle" onClick={() => setOpen((value) => !value)}>
        {t("addGuests")}
      </button>
      {open ? (
        <div className="book-guests-panel">
          <p>{t("addGuestsLead")}</p>
          {rows.map((row, index) => (
            <div key={index} className="book-guest-row">
              <p>{t("guestN", { n: index + 2 })}</p>
              <label className="book-field">
                <span>{t("guestName")}</span>
                <input value={row.name} onChange={(event) => patch(index, { name: event.target.value })} autoComplete="name" />
              </label>
              <div className="book-field">
                <span>{t("guestLicence")}</span>
                <CountrySearch
                  locale={locale}
                  value={row.licenceCountry}
                  onChange={(code) => patch(index, { licenceCountry: code })}
                  placeholder={t("guestSearch")}
                />
                {row.licenceCountry ? (
                  <small className="book-guest-picked">{regionName(row.licenceCountry, locale)}</small>
                ) : null}
              </div>
            </div>
          ))}
          <div className="book-guests-actions">
            <button type="button" className="ok-btn" onClick={persist}>
              {saved ? t("guestSaved") : t("guestSave")}
            </button>
            <button type="button" className="ok-btn-ghost" onClick={() => void copyInvite()}>
              {copied ? t("inviteCopied") : t("inviteCopy")}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function emptyOrSaved(result: BookingResult) {
  return readParticipants(result.ref, result.riders);
}
