"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatYenShort } from "@/lib/format";
import {
  addMonths,
  dayStatus,
  monthCells,
  monthLabel,
  parseIsoDate,
  weekdayLabels,
  type DayStatus,
} from "@/lib/calendar";
import { maxBookIsoDate, tomorrowIsoDate } from "@/lib/booking/slots";
import { cn } from "@/lib/utils";

type MonthCalendarProps = {
  locale: string;
  priceJpy: number;
  value: string;
  onChange: (iso: string) => void;
};

export function MonthCalendar({ locale, priceJpy, value, onChange }: MonthCalendarProps) {
  const t = useTranslations("Calendar");
  const minIso = tomorrowIsoDate();
  const maxIso = maxBookIsoDate();
  const [cursor, setCursor] = useState(() =>
    value ? parseIsoDate(value) : parseIsoDate(minIso),
  );

  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);
  const price = formatYenShort(priceJpy);

  function pick(iso: string, status: DayStatus) {
    if (status === "closed") return;
    onChange(iso);
  }

  return (
    <div className="cal-board">
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
          const status = dayStatus(cell.iso, minIso, maxIso);
          const selected = value === cell.iso;
          return (
            <button
              key={cell.iso}
              type="button"
              className={cn("cal-cell", `is-${status}`, selected && "is-on")}
              disabled={status === "closed"}
              onClick={() => pick(cell.iso!, status)}
            >
              <i className={`cal-mark is-${status}`} />
              <b>{cell.day}</b>
              {status !== "closed" ? <small>{price}</small> : null}
            </button>
          );
        })}
      </div>

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
    </div>
  );
}
