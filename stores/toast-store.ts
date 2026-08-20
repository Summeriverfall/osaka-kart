import { create } from "zustand";

type ToastState = {
  message: string | null;
  notify: (message: string) => void;
};

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  notify: (message) => {
    if (timer) clearTimeout(timer);
    set({ message });
    timer = setTimeout(() => set({ message: null }), 2200);
  },
}));
