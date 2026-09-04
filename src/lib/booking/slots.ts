import { tokyoDateIso } from "@/lib/japan-time";

export const BOOKING_SLOTS = [
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
] as const;

export const BOOKING_DAYPARTS = [
  { id: "morning", label: "上午", range: "10:00–11:30", slots: ["10:00", "11:30"] },
  { id: "afternoon", label: "下午", range: "13:00–14:30", slots: ["13:00", "14:30"] },
  { id: "dusk", label: "傍晚", range: "16:00–17:30", slots: ["16:00", "17:30"] },
  { id: "night", label: "夜晚", range: "19:00", slots: ["19:00"] },
] as const;

function addIsoDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  return tokyoDateIso(new Date(Date.UTC(year, month - 1, day + days)));
}

export function todayIsoDate() {
  return tokyoDateIso();
}

export function tomorrowIsoDate() {
  return addIsoDays(todayIsoDate(), 1);
}

export function maxBookIsoDate() {
  return addIsoDays(todayIsoDate(), 60);
}
