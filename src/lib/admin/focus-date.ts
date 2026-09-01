const KEY = "osaka-kart-admin-focus-date";
const TIME_KEY = "osaka-kart-admin-focus-time";
const ADD_KEY = "osaka-kart-admin-focus-add";

export function setAdminFocusDate(iso: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, iso);
}

export function readAdminFocusDate() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(KEY) ?? "";
}

export function setAdminFocusSlot(date: string, time = "", openAdd = false) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, date);
  if (time) sessionStorage.setItem(TIME_KEY, time);
  else sessionStorage.removeItem(TIME_KEY);
  if (openAdd) sessionStorage.setItem(ADD_KEY, "1");
  else sessionStorage.removeItem(ADD_KEY);
}

export function readAdminFocusTime() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(TIME_KEY) ?? "";
}

export function consumeAdminFocusAdd() {
  if (typeof window === "undefined") return false;
  const on = sessionStorage.getItem(ADD_KEY) === "1";
  if (on) sessionStorage.removeItem(ADD_KEY);
  return on;
}
