"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WeekTimeline } from "@/components/admin/week-timeline";
import {
  addDaysIso,
  addMonths,
  formatIsoRangeZh,
  monthCells,
  monthLabel,
  parseIsoDate,
  weekdayLabels,
  weekStartMonday,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { useStoreData } from "@/lib/use-store-data";

export type CalendarView = "month" | "week" | "day";

type Props = {
  value: string;
  view: CalendarView;
  onView: (view: CalendarView) => void;
  onChange: (iso: string) => void;
  counts?: Map<string, number>;
  heatFor?: "orders" | "stock";
};

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

function readThreeDayMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(orientation: portrait)").matches && window.innerWidth < 768;
}

function useThreeDayMode() {
  const [threeDay, setThreeDay] = useState(false);
  useEffect(() => {
    const sync = () => setThreeDay(readThreeDayMode());
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    const media = window.matchMedia("(orientation: portrait)");
    media.addEventListener("change", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      media.removeEventListener("change", sync);
    };
  }, []);
  return threeDay;
}

export function OrderCalendarDrill({ value, view, onView, onChange, counts: countsProp, heatFor = "orders" }: Props) {
  const { orders } = useStoreData();
  const [cursor, setCursor] = useState(() => parseIsoDate(value));
  const [threeStart, setThreeStart] = useState(value);
  const threeDay = useThreeDayMode();
  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const orderCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of orders) {
      map.set(order.date, (map.get(order.date) ?? 0) + 1);
    }
    return map;
  }, [orders]);
  const counts = countsProp ?? orderCounts;

  useEffect(() => {
    const end = addDaysIso(threeStart, 2);
    if (value < threeStart || value > end) setThreeStart(value);
  }, [value, threeStart]);

  const weekDays = useMemo(() => {
    if (view === "week" && threeDay) {
      return Array.from({ length: 3 }, (_, index) => addDaysIso(threeStart, index));
    }
    const start = weekStartMonday(value);
    return Array.from({ length: 7 }, (_, index) => addDaysIso(start, index));
  }, [view, threeDay, threeStart, value]);

  const goPrev = () => {
    if (view === "week") {
      if (threeDay) {
        const next = addDaysIso(threeStart, -3);
        setThreeStart(next);
        onChange(next);
        return;
      }
      onChange(addDaysIso(value, -7));
      return;
    }
    if (view === "day") {
      onChange(addDaysIso(value, -1));
      return;
    }
    setCursor((date) => addMonths(date, -1));
  };

  const goNext = () => {
    if (view === "week") {
      if (threeDay) {
        const next = addDaysIso(threeStart, 3);
        setThreeStart(next);
        onChange(next);
        return;
      }
      onChange(addDaysIso(value, 7));
      return;
    }
    if (view === "day") {
      onChange(addDaysIso(value, 1));
      return;
    }
    setCursor((date) => addMonths(date, 1));
  };

  const headerLabel =
    view === "week"
      ? formatIsoRangeZh(weekDays[0], weekDays[weekDays.length - 1])
      : view === "day"
        ? value
        : monthLabel(cursor, "zh-TW");

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
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
              {item === "month" ? "月" : item === "week" ? (threeDay ? "3日" : "周") : "日"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="plan-qty-btn" onClick={goPrev} aria-label="上一页">
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-28 text-center text-sm text-slate-500">{headerLabel}</span>
          <button type="button" className="plan-qty-btn" onClick={goNext} aria-label="下一页">
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
              if (!cell.iso) return <div key={`e-${index}`} className="min-h-20" />;
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
                    "flex min-h-20 flex-col items-center justify-center rounded-xl border text-sm transition hover:border-blue-400",
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
        <WeekTimeline value={value} orders={orders} days={weekDays} compact={threeDay} onSelectDate={onChange} />
      ) : null}

      {view === "day" ? (
        <p className="text-sm text-slate-500">
          正在查看 {value}，下方是该日完整订单列表。切回月/周可继续下钻。
        </p>
      ) : null}
    </section>
  );
}
