import { create } from "zustand";
import { adminTabFromLocation, normalizeAdminTab } from "@/lib/admin/nav";
import { pushAppPath } from "@/lib/file-href";

type AdminNavState = {
  tab: string | null;
  locale: string;
  setLocale: (locale: string) => void;
  go: (href: string) => void;
  reset: () => void;
  syncFromWindow: () => void;
};

function tabFromWindow() {
  return adminTabFromLocation();
}

export const useAdminNavStore = create<AdminNavState>((set, get) => ({
  tab: null,
  locale: "zh-TW",
  setLocale: (locale) => set({ locale }),
  go: (href) => {
    const tab = normalizeAdminTab(href);
    if (typeof window !== "undefined") {
      const locale = get().locale || document.documentElement.lang || "zh-TW";
      pushAppPath(tab, locale);
    }
    set({ tab });
  },
  reset: () => set({ tab: null }),
  syncFromWindow: () => set({ tab: tabFromWindow() }),
}));
