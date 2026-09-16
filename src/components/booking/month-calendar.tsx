"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatYenCell } from "@/lib/format";
import {
  addMonths,
  monthCells,
  monthLabel,
  parseIsoDate,
  weekdayLabels,
} from "@/lib/calendar";
import { dayCellFlags } from "@/lib/fleet-inventory";
import { useLiveInventory } from "@/lib/live-catalog";
import { maxBookIsoDate, tomorrowIsoDate } from "@/lib/booking/slots";
import { cn } from "@/lib/utils";

type MonthCalendarProps = {
  locale: string;
  priceJpy: number;
  value: string;
  time?: string;
  minIso?: string;
  minRiders?: number;
  partySize?: number;
  hideSpots?: boolean;
  onChange: (iso: string) => void;
};

export function MonthCalendar({
  locale,
  priceJpy,
  value,
  time = "",
  minIso,
  minRiders = 1,
  partySize,
  hideSpots = false,
  onChange,
}: MonthCalendarProps) {
  const t = useTranslations("Calendar");
  const live = useLiveInventory();
  const startIso = minIso ?? tomorrowIsoDate();
  const maxIso = maxBookIsoDate();
  const [cursor, setCursor] = useState(() =>
    value ? parseIsoDate(value) : parseIsoDate(startIso),
  );

  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);
  const cellPrice = formatYenCell(priceJpy);
  const bookingMode = partySize != null;

  function pick(iso: string, clickable: boolean) {
    if (!clickable) return;
    onChange(iso);
  }

  return (
    <div className={cn("cal-board", bookingMode && "is-booking")}>
      <div className="cal-head">
        <button type="button" onClick={() => setCursor((d) => addMonths(d, -1))} aria-label="prev">
          <ChevronLeft className="size-5" />
        </button>
        <p>{monthLabel(cursor, locale)}</p>
        <button type="button" onClick={() => setCursor((d) => addMonths(d, 1))} aria-label="next">
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="cal-week">
        {weekdays.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((cell, index) => {
          if (!cell.iso || cell.day == null) {
            return <div key={`e-${index}`} className="cal-cell is-empty" />;
          }

          if (bookingMode && partySize != null) {
            const kind = live.dayOffer(cell.iso, partySize, startIso, maxIso);
            const flags = dayCellFlags(kind, value, cell.iso);
            const stateLabel = flags.recommended
              ? t("recommend")
              : flags.clickable
                ? t("open")
                : t("blocked");
            return (
              <button
                key={cell.iso}
                type="button"
                className={cn(
                  "cal-cell",
                  flags.clickable ? "is-open is-clickable" : "is-blocked",
                  flags.recommended && "is-recommended",
                  flags.selected && "is-on",
                )}
                disabled={flags.disabled}
                aria-disabled={flags.disabled}
                aria-pressed={flags.selected}
                aria-label={`${cell.day} ${stateLabel}`}
                onClick={() => pick(cell.iso!, flags.clickable)}
              >
                {flags.recommended ? <i className="cal-rec" aria-hidden /> : null}
                <b>{cell.day}</b>
              </button>
            );
          }

          const status = time
            ? live.slotStatus(cell.iso, time, startIso, maxIso)
            : live.dayStatus(cell.iso, startIso, maxIso);
          const left = time ? live.remaining(cell.iso, time) : live.dayRemaining(cell.iso);
          const selected = value === cell.iso;
          const short = left < minRiders;
          const kind = short ? "closed" : status;
          const clickable = kind !== "closed";
          const tag = hideSpots || !clickable ? null : undefined;
          return (
            <button
              key={cell.iso}
              type="button"
              className={cn("cal-cell", `is-${kind}`, selected && "is-on")}
              disabled={!clickable}
              onClick={() => pick(cell.iso!, clickable)}
            >
              <i className={cn("cal-mark", `is-${kind}`)} />
              <b>{cell.day}</b>
              {tag ? (
                <em className="cal-tag is-recommend">{tag}</em>
              ) : tag === undefined ? (
                <>
                  <small className="cal-price">{cellPrice}</small>
                  <em className="cal-spots">{t("spots", { n: left })}</em>
                </>
              ) : null}
            </button>
          );
        })}
      </div>

      {bookingMode ? (
        <ul className="cal-legend">
          <li>
            <i className="cal-swatch is-open" />
            {t("open")}
          </li>
          <li>
            <i className="cal-swatch is-recommended" />
            {t("recommend")}
          </li>
          <li>
            <i className="cal-swatch is-blocked" />
            {t("blocked")}
          </li>
        </ul>
      ) : hideSpots ? null : (
      <ul className="cal-legend">
        <li>
          <i className="cal-mark is-open" />
          {t("open")}
        </li>
        <li>
          <i className="cal-mark is-busy" />
          {t("busy")}
        </li>
        <li>
          <i className="cal-mark is-ask" />
          {t("ask")}
        </li>
      </ul>
      )}
    </div>
  );
}
