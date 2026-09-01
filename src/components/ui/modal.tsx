"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
  top?: boolean;
  layer?: "base" | "nested";
};

export function Modal({ open, title, onClose, children, footer, wide, top, layer = "base" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      onClose();
    }
    window.addEventListener("keydown", onKey, true);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "admin-modal-overlay fixed inset-0 flex justify-center bg-black/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        layer === "nested" ? "z-[100]" : "z-[90]",
        top ? "items-start pt-[max(1rem,env(safe-area-inset-top))] sm:pt-10" : "items-center sm:p-4",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "admin-modal-panel max-h-[92dvh] w-full overflow-auto rounded-2xl border border-white/10 bg-[#12121A] p-4 shadow-[0_0_40px_rgb(255_46_147_/_18%)] sm:p-6",
          wide ? "max-w-3xl" : "max-w-lg",
          top && "max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-5.5rem)]",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-base font-semibold leading-snug break-words text-white">{title}</h2>
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-neon-pink hover:shadow-[0_0_16px_rgb(255_46_147_/_40%)]"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}
