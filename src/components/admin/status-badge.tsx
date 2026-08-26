"use client";

import { useLocale } from "next-intl";
import { adminOrderStatus } from "@/lib/admin/copy";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/mock/orders";

const TONE: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-slate-200 bg-slate-100 text-slate-600",
  completed: "border-sky-200 bg-sky-50 text-sky-800",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const locale = useLocale();
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", TONE[status])}>
      {adminOrderStatus(locale, status)}
    </span>
  );
}
