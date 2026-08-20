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
};

export function Modal({ open, title, onClose, children, footer, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className={cn(
          "admin-modal-panel max-h-[90dvh] w-full overflow-auto rounded-2xl border border-white/10 bg-[#12121A] p-6 shadow-[0_0_40px_rgb(255_46_147_/_18%)]",
          wide ? "max-w-3xl" : "max-w-lg",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-neon-pink hover:shadow-[0_0_16px_rgb(255_46_147_/_40%)]"
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
