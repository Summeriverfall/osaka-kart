import { create } from "zustand";
import { persist } from "zustand/middleware";

type AgentState = {
  affiliateId: string | null;
  login: (id: string) => void;
  logout: () => void;
};

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      affiliateId: null,
      login: (id) => set({ affiliateId: id }),
      logout: () => set({ affiliateId: null }),
    }),
    { name: "osaka-kart-agent" },
  ),
);
