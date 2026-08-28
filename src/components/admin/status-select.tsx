"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { adminOrderStatus } from "@/lib/admin/copy";
import { type OrderStatus } from "@/lib/mock/orders";
import { cn } from "@/lib/utils";

const TONE: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-slate-200 bg-slate-100 text-slate-500",
  completed: "border-sky-200 bg-sky-50 text-sky-800",
};

const OPTIONS: OrderStatus[] = ["pending", "confirmed", "completed", "cancelled"];

type Props = {
  status: OrderStatus;
  onChange: (status: OrderStatus) => void;
  allowComplete?: boolean;
};

export function StatusSelect({ status, onChange, allowComplete = true }: Props) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const options = OPTIONS.filter((item) => item !== "completed" || allowComplete || status === "completed");

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={wrap} className="relative inline-block">
      <button
        type="button"
        className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", TONE[status])}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        {adminOrderStatus(locale, status)}
      </button>
      {open ? (
        <div className="absolute top-full right-0 z-20 mt-1 min-w-28 rounded-lg border border-slate-200 bg-white py-1 shadow-lg md:right-auto md:left-0">
          {options.map((item) => (
            <button
              key={item}
              type="button"
              className={cn(
                "block w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50",
                item === status ? "font-semibold text-blue-600" : "text-slate-600",
              )}
              onClick={(event) => {
                event.stopPropagation();
                onChange(item);
                setOpen(false);
              }}
            >
              {adminOrderStatus(locale, item)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
