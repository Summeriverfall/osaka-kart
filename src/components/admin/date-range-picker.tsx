"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminCopy } from "@/lib/admin/copy";
import {
  addMonths,
  calendarIntlLocale,
  monthCells,
  monthLabel,
  parseIsoDate,
  weekdayLabels,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";

type Props = {
  from: string;
  to: string;
  today: string;
  onChange: (from: string, to: string) => void;
};

function slashDate(iso: string) {
  return iso.replaceAll("-", "/");
}

export function DateRangePicker({ from, to, today, onChange }: Props) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const wrap = useRef<HTMLDivElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [cursor, setCursor] = useState(() => parseIsoDate(from || to || today));
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const labels = weekdayLabels(calendarIntlLocale(locale));

  function place() {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 280;
    let left = rect.left;
    if (left + width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - width - 8);
    let top = rect.bottom + 6;
    if (top + 340 > window.innerHeight - 8) top = Math.max(8, rect.top - 346);
    setPos({ top, left });
  }

  useLayoutEffect(() => {
    if (!open) return;
    place();
  }, [open, cursor]);

  useEffect(() => {
    if (!open) {
      setPending(null);
      setHover(null);
      return;
    }
    setCursor(parseIsoDate(from || to || today));
    // 只在打开时对准当前范围，避免点第一次时被重置
  // eslint-disable-next-line react-hooks/exhaustive-deps -- sync month only when the pop opens
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onScroll() {
      setOpen(false);
    }
    function close(event: MouseEvent) {
      const target = event.target as Node;
      if (wrap.current?.contains(target) || pop.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  const previewFrom = pending ?? from;
  const previewTo = pending ? hover || pending : to;
  const rangeStart = previewFrom && previewTo && previewFrom > previewTo ? previewTo : previewFrom;
  const rangeEnd = previewFrom && previewTo && previewFrom > previewTo ? previewFrom : previewTo;

  function pick(iso: string) {
    if (!pending) {
      setPending(iso);
      setHover(iso);
      return;
    }
    const start = pending < iso ? pending : iso;
    const end = pending < iso ? iso : pending;
    onChange(start, end);
    setPending(null);
    setOpen(false);
  }

  function applyToday() {
    onChange(today, today);
    setPending(null);
    setOpen(false);
  }

  function clearRange() {
    onChange("", "");
    setPending(null);
    setOpen(false);
  }

  return (
    <div ref={wrap} className="order-range">
      <button
        type="button"
        className={cn("order-range-field", !from && "is-empty")}
        aria-label={copy.orders.dateFrom}
        onClick={() => setOpen(true)}
      >
        {from ? slashDate(from) : copy.orders.dateFrom}
      </button>
      <span className="order-toolbar-range-mark" aria-hidden>
        –
      </span>
      <button
        type="button"
        className={cn("order-range-field", !to && "is-empty")}
        aria-label={copy.orders.dateTo}
        onClick={() => setOpen(true)}
      >
        {to ? slashDate(to) : copy.orders.dateTo}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={pop}
              className="order-range-pop"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="order-range-nav">
                <button type="button" onClick={() => setCursor((date) => addMonths(date, -1))} aria-label={copy.calendar.prev}>
                  <ChevronLeft className="size-4" />
                </button>
                <b>{monthLabel(cursor, calendarIntlLocale(locale))}</b>
                <button type="button" onClick={() => setCursor((date) => addMonths(date, 1))} aria-label={copy.calendar.next}>
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <div className="order-range-week">
                {labels.map((label, index) => (
                  <span key={`${label}-${index}`}>{label}</span>
                ))}
              </div>
              <div className="order-range-grid">
                {cells.map((cell, index) => {
                  if (!cell.iso) return <span key={`e-${index}`} />;
                  const iso = cell.iso;
                  const inRange = Boolean(rangeStart && rangeEnd && iso >= rangeStart && iso <= rangeEnd);
                  const isStart = iso === rangeStart;
                  const isEnd = iso === rangeEnd;
                  return (
                    <button
                      key={iso}
                      type="button"
                      className={cn(
                        inRange && "is-in",
                        isStart && "is-start",
                        isEnd && "is-end",
                        iso === today && "is-today",
                        pending === iso && "is-pending",
                      )}
                      onClick={() => pick(iso)}
                      onMouseEnter={() => pending && setHover(iso)}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
              <p className="order-range-hint">{copy.orders.rangeHint}</p>
              <div className="order-range-foot">
                <button type="button" className="is-ghost" onClick={clearRange}>
                  {copy.orders.rangeClear}
                </button>
                <button type="button" onClick={applyToday}>
                  {copy.orders.today}
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
