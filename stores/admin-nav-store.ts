import { create } from "zustand";
import { normalizeAdminTab } from "@/lib/admin/nav";
import { withSlash } from "@/lib/paths";

type AdminNavState = {
  tab: string | null;
  locale: string;
  setLocale: (locale: string) => void;
  go: (href: string) => void;
  reset: () => void;
  syncFromWindow: () => void;
};

function tabFromWindow() {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/\/admin(?:\/(.*))?$/);
  if (!match) return null;
  const rest = (match[1] ?? "").replace(/\/$/, "");
  return normalizeAdminTab(rest ? `/admin/${rest}` : "/admin/dashboard");
}

export const useAdminNavStore = create<AdminNavState>((set, get) => ({
  tab: null,
  locale: "zh-TW",
  setLocale: (locale) => set({ locale }),
  go: (href) => {
    const tab = normalizeAdminTab(href);
    set({ tab });
    if (typeof window === "undefined") return;
    const locale = get().locale || document.documentElement.lang || "zh-TW";
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    window.history.pushState({ adminTab: tab }, "", `${base}/${locale}${withSlash(tab)}`);
  },
  reset: () => set({ tab: null }),
  syncFromWindow: () => set({ tab: tabFromWindow() }),
}));
