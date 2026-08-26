const KEY = "osaka-kart-admin-focus-date";

export function setAdminFocusDate(iso: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, iso);
}

export function readAdminFocusDate() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(KEY) ?? "";
}
