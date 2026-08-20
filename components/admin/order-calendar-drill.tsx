"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, isoFromDate, monthCells, monthLabel, parseIsoDate, weekdayLabels } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";

export type CalendarView = "month" | "week" | "day";

type Props = {
  value: string;
  view: CalendarView;
  onView: (view: CalendarView) => void;
  onChange: (iso: string) => void;
  counts?: Map<string, number>;
  heatFor?: "orders" | "stock";
};

function weekStart(iso: string) {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() - date.getDay());
  return isoFromDate(date);
}

function addDays(iso: string, count: number) {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + count);
  return isoFromDate(date);
}

function band(time: string) {
  const hour = Number(time.slice(0, 2));
  if (hour < 12) return "上午";
  if (hour < 17) return "下午";
  return "晚上";
}

function heat(count: number, mode: "orders" | "stock") {
  if (mode === "stock") {
    if (count <= 0) return "bg-rose-50 border-rose-200 text-rose-800";
    if (count < 16) return "bg-amber-50 border-amber-200 text-amber-800";
    return "bg-emerald-50 border-emerald-200 text-emerald-800";
  }
  if (count > 20) return "bg-rose-50 border-rose-200 text-rose-800";
  if (count >= 10) return "bg-amber-50 border-amber-200 text-amber-800";
  if (count > 0) return "bg-emerald-50 border-emerald-200 text-emerald-800";
  return "border-slate-200 text-slate-500";
}

export function OrderCalendarDrill({ value, view, onView, onChange, counts: countsProp, heatFor = "orders" }: Props) {
  const orders = useOpsStore((state) => state.orders);
  const [cursor, setCursor] = useState(() => parseIsoDate(value));
  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const orderCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of orders) {
      map.set(order.date, (map.get(order.date) ?? 0) + 1);
    }
    return map;
  }, [orders]);
  const counts = countsProp ?? orderCounts;

  const start = weekStart(value);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(start, index));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full border border-slate-200 p-1">
          {(["month", "week", "day"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onView(item)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition",
                view === item ? "bg-blue-600 text-white" : "text-slate-500",
              )}
            >
              {item === "month" ? "月" : item === "week" ? "周" : "日"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="plan-qty-btn" onClick={() => setCursor((d) => addMonths(d, -1))}>
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm text-slate-500">{monthLabel(cursor, "zh-TW")}</span>
          <button type="button" className="plan-qty-btn" onClick={() => setCursor((d) => addMonths(d, 1))}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {view === "month" ? (
        <>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
            {weekdayLabels("zh-TW").map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, index) => {
              if (!cell.iso) return <div key={`e-${index}`} className="h-16" />;
              const count = counts.get(cell.iso) ?? 0;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => {
                    onChange(cell.iso!);
                    onView("day");
                  }}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center rounded-xl border text-sm transition hover:border-blue-400",
                    heat(count, heatFor),
                    value === cell.iso && "ring-1 ring-blue-500",
                  )}
                >
                  <b>{cell.day}</b>
                  <span className="text-lg font-black leading-none">{count || "·"}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {heatFor === "stock" ? "绿=充足，橙=紧张，红=满员。点日期看时段。" : "点击日期进入日列表。深红 >20 单，橙色 10–20，绿色 <10。"}
          </p>
        </>
      ) : null}

      {view === "week" ? (
        <div className="grid gap-2 md:grid-cols-7">
          {weekDays.map((iso) => {
            const dayOrders = orders.filter((item) => item.date === iso);
            const buckets = { 上午: 0, 下午: 0, 晚上: 0 };
            for (const order of dayOrders) buckets[band(order.time)] += 1;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  onChange(iso);
                  onView("day");
                }}
                className={cn(
                  "rounded-2xl border p-3 text-left transition hover:border-blue-400",
                  iso === value ? "border-blue-500 bg-blue-50" : "border-slate-200",
                )}
              >
                <p className="text-xs text-slate-500">{iso.slice(5)}</p>
                <p className="mt-1 text-2xl font-black">{dayOrders.length}</p>
                {(["上午", "下午", "晚上"] as const).map((key) => (
                  <p key={key} className="mt-1 text-xs text-slate-500">
                    {key} {buckets[key]}
                  </p>
                ))}
                {dayOrders.length > 0 ? (
                  <p className="mt-2 text-[11px] leading-4 text-slate-500">
                    {[...new Set(dayOrders.map((item) => item.channel))].join(" · ")}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {view === "day" ? (
        <p className="text-sm text-slate-500">
          正在查看 {value}，下方是该日完整订单列表。切回月/周可继续下钻。
        </p>
      ) : null}
    </section>
  );
}
