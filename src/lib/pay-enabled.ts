import type { MockPayChannel } from "@/lib/mock/settings";

export const PAY_ENABLED_KEY = "osaka-kart-pay-enabled";

export function writePayEnabled(payments: MockPayChannel[]) {
  if (typeof window === "undefined") return;
  const map: Record<string, boolean> = {};
  for (const item of payments) map[item.id] = Boolean(item.enabled);
  try {
    localStorage.setItem(PAY_ENABLED_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("osaka-pay-enabled"));
  } catch {
    /* private mode */
  }
}

export function readPayEnabled(): Record<string, boolean> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PAY_ENABLED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
