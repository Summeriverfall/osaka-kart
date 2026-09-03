"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 112 });
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const options = OPTIONS.filter((item) => item !== "completed" || allowComplete || status === "completed");

  useLayoutEffect(() => {
    if (!open) return;
    const rect = btn.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.max(112, rect.width);
    let left = rect.left;
    if (left + width > window.innerWidth - 8) left = Math.max(8, rect.right - width);
    const est = options.length * 32 + 10;
    let top = rect.bottom + 4;
    if (top + est > window.innerHeight - 8) top = Math.max(8, rect.top - est - 4);
    setPos({ top, left, width });
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    function onScrollOrResize() {
      setOpen(false);
    }
    function close(event: MouseEvent) {
      const target = event.target as Node;
      if (btn.current?.contains(target) || menu.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={btn}
        type="button"
        className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", TONE[status])}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        {adminOrderStatus(locale, status)}
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menu}
              className="fixed z-[80] min-w-28 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
              style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
            >
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
