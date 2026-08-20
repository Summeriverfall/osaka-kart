import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminRole = "admin" | "manager";

type AdminState = {
  email: string;
  role: AdminRole | null;
  login: (email: string) => void;
  logout: () => void;
};

export function roleFromEmail(email: string): AdminRole {
  return email.toLowerCase().includes("admin") ? "admin" : "manager";
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  admin: "超管",
  manager: "店长",
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      email: "",
      role: null,
      login: (email) =>
        set({
          email: email.trim(),
          role: roleFromEmail(email),
        }),
      logout: () => set({ email: "", role: null }),
    }),
    { name: "osaka-kart-admin" },
  ),
);
