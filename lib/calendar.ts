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
