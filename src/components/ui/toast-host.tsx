"use client";

import { cn } from "@/lib/utils";
import { useToastStore } from "@/stores/toast-store";

export function ToastHost({ light = false }: { light?: boolean }) {
  const message = useToastStore((state) => state.message);
  if (!message) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed top-20 right-4 z-[100] rounded-full border px-4 py-2 text-sm font-semibold",
        light
          ? "border-blue-200 bg-white text-slate-800 shadow-md"
          : "border-neon-pink/40 bg-[#12121A] text-white shadow-[0_0_24px_rgb(255_46_147_/_35%)]",
      )}
    >
      {message}
    </div>
  );
}
