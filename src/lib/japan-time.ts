const TOKYO = "Asia/Tokyo";

export function tokyoDateIso(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TOKYO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function japanAppointmentMs(date: string, time: string) {
  const hm = (time || "00:00").slice(0, 5);
  return Date.parse(`${date}T${hm}:00+09:00`);
}

export function japanAppointmentPassed(date: string, time: string, now = Date.now()) {
  const start = japanAppointmentMs(date, time);
  return Number.isFinite(start) && now >= start;
}
