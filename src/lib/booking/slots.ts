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

export function todayIsoDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function tomorrowIsoDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function maxBookIsoDate() {
  const date = new Date();
  date.setDate(date.getDate() + 60);
  return date.toISOString().slice(0, 10);
}
