"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { addMonths, monthCells, monthLabel, weekdayLabels } from "@/lib/calendar";
import { BOOKING_SLOTS } from "@/lib/booking/slots";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdminCalendarView() {
  const orders = useOpsStore((state) => state.orders);
  const [cursor, setCursor] = useState(() => new Date(2026, 7, 1));
  const [picked, setPicked] = useState("2026-08-20");
  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const dayOrders = orders.filter((item) => item.date === picked);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-black">{monthLabel(cursor, "zh-TW")}</h2>
          <div className="flex gap-2">
            <button type="button" className="plan-qty-btn" onClick={() => setCursor((d) => addMonths(d, -1))}>
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" className="plan-qty-btn" onClick={() => setCursor((d) => addMonths(d, 1))}>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
          {weekdayLabels("zh-TW").map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, index) => {
            if (!cell.iso) return <div key={`e-${index}`} className="h-16" />;
            const count = orders.filter((item) => item.date === cell.iso).length;
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setPicked(cell.iso!)}
                className={cn(
                  "h-16 rounded-xl border p-1 text-left text-sm transition",
                  picked === cell.iso
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-400",
                )}
              >
                <b>{cell.day}</b>
                {count > 0 ? <i className="mt-1 block size-2 rounded-full bg-blue-600" /> : null}
                {count > 0 ? <small className="text-[10px] text-slate-500">{count} 单</small> : null}
              </button>
            );
          })}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-black">{picked} 时段</h2>
        <div className="mt-4 space-y-2">
          {BOOKING_SLOTS.map((slot) => {
            const slotOrders = dayOrders.filter((item) => item.time === slot);
            return (
              <div key={slot} className="rounded-xl border border-slate-200 px-3 py-3">
                <div className="flex items-center justify-between text-sm">
                  <b>{slot}</b>
                  <span className="text-slate-500">{slotOrders.length} 组</span>
                </div>
                {slotOrders.map((order) => (
                  <div key={order.id} className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {order.customer} · {order.planName}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
