import { create } from "zustand";

export type ToastKind = "ok" | "err";

type ToastState = {
  message: string | null;
  kind: ToastKind;
  notify: (message: string, kind?: ToastKind) => void;
};

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  kind: "ok",
  notify: (message, kind = "ok") => {
    if (timer) clearTimeout(timer);
    set({ message, kind });
    timer = setTimeout(() => set({ message: null, kind: "ok" }), 5200);
  },
}));
