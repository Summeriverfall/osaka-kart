"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WeekTimeline } from "@/components/admin/week-timeline";
import { AdminShopPills } from "@/components/admin/admin-shop-pills";
import { adminCopy } from "@/lib/admin/copy";
import { adminShopOrders } from "@/lib/admin-schedule";
import { useAdminShopFocus } from "@/lib/admin-shop-focus";
import {
  addDaysIso,
  addMonths,
  calendarIntlLocale,
  formatIsoRange,
  monthCells,
  monthLabel,
  parseIsoDate,
  weekdayLabels,
  weekStartMonday,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { type MockOrder } from "@/lib/mock/orders";
import { useStoreData } from "@/lib/use-store-data";

export type CalendarView = "month" | "week" | "day";

type Props = {
  value: string;
  view: CalendarView;
  onView: (view: CalendarView) => void;
  onChange: (iso: string) => void;
  onSelectOrder?: (order: MockOrder) => void;
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

export function OrderCalendarDrill({ value, view, onView, onChange, onSelectOrder, counts: countsProp, heatFor = "orders" }: Props) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { orders, storeId } = useStoreData();
  const { focusStore } = useAdminShopFocus();
  const [cursor, setCursor] = useState(() => parseIsoDate(value));
  const [threeStart, setThreeStart] = useState(value);
  const threeDay = useThreeDayMode();
  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const orderCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const order of adminShopOrders(orders, storeId, focusStore)) {
      map.set(order.date, (map.get(order.date) ?? 0) + 1);
    }
    return map;
  }, [orders, storeId, focusStore]);
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
      ? formatIsoRange(weekDays[0], weekDays[weekDays.length - 1], locale)
      : view === "day"
        ? value
        : monthLabel(cursor, calendarIntlLocale(locale));

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full min-w-0 rounded-full border border-slate-200 p-1 md:w-auto">
          {(["month", "week", "day"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onView(item)}
              className={cn(
                "min-w-0 flex-1 rounded-full px-2 py-1.5 text-xs transition md:flex-none md:px-3 md:text-sm",
                view === item ? "bg-blue-600 text-white" : "text-slate-500",
              )}
            >
              {item === "month" ? copy.calendar.month : item === "week" ? (threeDay ? copy.calendar.threeDay : copy.calendar.week) : copy.calendar.day}
            </button>
          ))}
        </div>
        <div className="flex w-full min-w-0 items-center gap-2 md:w-auto">
          <button type="button" className="plan-qty-btn" onClick={goPrev} aria-label={copy.calendar.prev}>
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-0 flex-1 text-center text-sm text-slate-500 md:flex-none">{headerLabel}</span>
          <button type="button" className="plan-qty-btn" onClick={goNext} aria-label={copy.calendar.next}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <AdminShopPills className="mb-4" />

      {view === "month" ? (
        <>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
            {weekdayLabels(calendarIntlLocale(locale)).map((label, index) => (
              <span key={`${label}-${index}`} className="truncate px-0.5 text-[0.65rem] sm:text-xs">{label}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, index) => {
              if (!cell.iso) return <div key={`e-${index}`} className="min-h-14 sm:min-h-20" />;
              const count = counts.get(cell.iso) ?? 0;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => onChange(cell.iso!)}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center rounded-lg border px-0.5 py-1 text-[0.7rem] transition hover:border-blue-400 sm:min-h-20 sm:rounded-xl sm:text-sm",
                    heat(count, heatFor),
                    value === cell.iso && "ring-1 ring-blue-500",
                  )}
                >
                  <b>{cell.day}</b>
                  <span className="text-sm font-black leading-none sm:text-lg">{count || "·"}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {heatFor === "stock" ? copy.calendar.heatStock : copy.calendar.heatOrders}
          </p>
        </>
      ) : null}

      {view === "week" ? (
        <WeekTimeline value={value} orders={orders} days={weekDays} compact={threeDay} onSelectDate={onChange} onSelectOrder={onSelectOrder} />
      ) : null}

      {view === "day" ? (
        <p className="text-sm text-slate-500">
          {copy.calendar.dayHint(value)}
        </p>
      ) : null}
    </section>
  );
}
