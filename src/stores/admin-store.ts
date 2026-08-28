import { create } from "zustand";
import { persist } from "zustand/middleware";
import { boundStoreIdFromEmail, isSuperAdminEmail, staffRecordForEmail } from "@/lib/staff-bind";
import { ALL_STORES_ID } from "@/lib/store-id";

export type AdminRole = "admin" | "manager" | "staff";

type AdminState = {
  email: string;
  role: AdminRole | null;
  storeId: string;
  login: (email: string) => void;
  setStoreId: (storeId: string) => void;
  lockBoundStore: () => void;
  logout: () => void;
};

export function roleFromEmail(email: string): AdminRole {
  const staff = staffRecordForEmail(email);
  if (staff?.role === "admin" || isSuperAdminEmail(email)) return "admin";
  if (staff?.role === "staff") return "staff";
  return "manager";
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  admin: "超管",
  manager: "店长",
  staff: "员工",
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      email: "",
      role: null,
      storeId: ALL_STORES_ID,
      login: (email) => {
        const trimmed = email.trim();
        const role = roleFromEmail(trimmed);
        set({
          email: trimmed,
          role,
        storeId: role === "admin" ? ALL_STORES_ID : boundStoreIdFromEmail(trimmed),
        });
      },
      setStoreId: (storeId) => {
        if (get().role !== "admin") return;
        set({ storeId });
      },
      lockBoundStore: () => {
        const { role, email } = get();
        if (role !== "manager" && role !== "staff") return;
        const next = boundStoreIdFromEmail(email);
        if (get().storeId !== next) set({ storeId: next });
      },
      logout: () => set({ email: "", role: null, storeId: ALL_STORES_ID }),
    }),
    {
      name: "osaka-kart-admin",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.role === "manager" || state.role === "staff") {
          state.storeId = boundStoreIdFromEmail(state.email);
          return;
        }
        if (state.role === "admin") {
          state.storeId = ALL_STORES_ID;
        }
      },
    },
  ),
);
