import { BOOKING_SLOTS } from "@/lib/booking/slots";

export type DayStatus = "open" | "busy" | "ask" | "closed";

export function isoFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

export function addDaysIso(iso: string, count: number) {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + count);
  return isoFromDate(date);
}

/** 周一为一周起始（周视图用）。月历仍按周日对齐。 */
export function weekStartMonday(iso: string) {
  const date = parseIsoDate(iso);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return isoFromDate(date);
}

export function weekdayLabelZh(iso: string) {
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][parseIsoDate(iso).getDay()];
}

export function weekdayLabel(iso: string, locale: string) {
  if (locale.startsWith("ja")) {
    return ["日", "月", "火", "水", "木", "金", "土"][parseIsoDate(iso).getDay()];
  }
  return weekdayLabelZh(iso);
}

export function formatIsoRangeZh(startIso: string, endIso: string) {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (start.getMonth() === end.getMonth()) {
    return `${start.getMonth() + 1}月${start.getDate()}日 – ${end.getDate()}日`;
  }
  return `${start.getMonth() + 1}月${start.getDate()}日 – ${end.getMonth() + 1}月${end.getDate()}日`;
}

export function monthLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

export function weekdayLabels(locale: string) {
  const base = new Date(2026, 7, 2);
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + index),
    ),
  );
}

export type CalendarCell = {
  iso: string | null;
  day: number | null;
};

export function monthCells(cursor: Date): CalendarCell[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const pad = first.getDay();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < pad; i += 1) {
    cells.push({ iso: null, day: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    cells.push({ iso: isoFromDate(date), day });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ iso: null, day: null });
  }

  return cells;
}

export function dayStatus(iso: string, minIso: string, maxIso: string): DayStatus {
  if (iso < minIso || iso > maxIso) return "closed";
  const day = Number(iso.slice(8));
  if (day % 11 === 0) return "ask";
  if (day % 4 === 0) return "busy";
  return "open";
}

export function slotRemaining(iso: string, time: string): number {
  if (!iso || !time) return 0;
  const day = Number(iso.slice(8));
  const hour = Number(time.slice(0, 2)) || 0;
  const minute = Number(time.slice(3, 5)) || 0;
  if (time === "10:00" && day % 3 === 0) return 0;
  if (time === "19:00" && day % 5 === 0) return 0;
  const cap = 2 + (day % 5);
  const dip = (hour + Math.floor(minute / 30)) % 3;
  return Math.max(0, cap - dip);
}

/** Rider dropdown max = leftover seats for the picked date + slot. */
export function riderCap(date: string, time: string) {
  if (!date || !time) return 0;
  return slotRemaining(date, time);
}

export function clampRiders(riders: number, date: string, time: string) {
  const cap = riderCap(date, time);
  if (cap <= 0) return 1;
  return Math.min(Math.max(Math.floor(riders) || 1, 1), cap);
}

export function dayRemaining(iso: string): number {
  if (!iso) return 0;
  return Math.max(
    0,
    ...BOOKING_SLOTS.map((slot) => slotRemaining(iso, slot)),
  );
}

export function slotStatus(
  iso: string,
  time: string,
  minIso: string,
  maxIso: string,
): DayStatus {
  if (iso < minIso || iso > maxIso) return "closed";
  const left = slotRemaining(iso, time);
  if (left <= 0) return "closed";
  if (left <= 2) return "ask";
  if (left <= 3) return "busy";
  return "open";
}
