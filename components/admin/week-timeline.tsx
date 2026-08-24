"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { weekdayLabel } from "@/lib/calendar";
import { formatYenShort } from "@/lib/format";
import { adminChannel, adminCopy, adminOrderStatus, adminPlanName } from "@/lib/admin/copy";
import { type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import type { MockPlan } from "@/lib/mock/plans";
import { TIMELINE_END_HOUR, TIMELINE_START_HOUR } from "@/lib/mock/vehicle-timeline";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";

const HOUR_H = 56;
const HOURS = TIMELINE_END_HOUR - TIMELINE_START_HOUR;
const START_MIN = TIMELINE_START_HOUR * 60;
const END_MIN = TIMELINE_END_HOUR * 60;

type Props = {
  value: string;
  orders: MockOrder[];
  days: string[];
  compact?: boolean;
  onSelectDate: (iso: string) => void;
  onSelectOrder?: (order: MockOrder) => void;
};

type LaidOut = {
  order: MockOrder;
  top: number;
  height: number;
  col: number;
  cols: number;
  duration: number;
};

function parseMinutes(time: string) {
  const hour = Number(time.slice(0, 2)) || 0;
  const minute = Number(time.slice(3, 5)) || 0;
  return hour * 60 + minute;
}

function durationOf(order: MockOrder, plans: MockPlan[]) {
  const plan = plans.find((item) => item.slug === order.planSlug);
  if (plan) return plan.durationMinutes;
  const match = order.planName.match(/(\d+)\s*分钟/);
  return match ? Number(match[1]) : 60;
}

function layoutDay(dayOrders: MockOrder[], plans: MockPlan[]): LaidOut[] {
  const items = dayOrders
    .map((order) => {
      const start = parseMinutes(order.time);
      const duration = durationOf(order, plans);
      const end = start + duration;
      const top = ((Math.max(start, START_MIN) - START_MIN) / 60) * HOUR_H;
      const visibleEnd = Math.min(end, END_MIN);
      const visibleStart = Math.max(start, START_MIN);
      const height = Math.max(((visibleEnd - visibleStart) / 60) * HOUR_H, 22);
      return { order, start, end, top, height, duration, col: 0 };
    })
    .sort((a, b) => a.start - b.start || a.end - b.end);

  const laneEnds: number[] = [];
  for (const item of items) {
    let lane = laneEnds.findIndex((end) => end <= item.start + 1);
    if (lane < 0) {
      lane = laneEnds.length;
      laneEnds.push(item.end);
    } else {
      laneEnds[lane] = item.end;
    }
    item.col = lane;
  }

  return items.map((item) => {
    const overlapping = items.filter((other) => other.start < item.end && other.end > item.start);
    const cols = Math.max(1, ...overlapping.map((other) => other.col + 1));
    return { order: item.order, top: item.top, height: item.height, col: item.col, cols, duration: item.duration };
  });
}

function statusClass(status: OrderStatus) {
  if (status === "confirmed") return "is-confirmed";
  if (status === "pending") return "is-pending";
  if (status === "cancelled") return "is-cancelled";
  return "is-completed";
}

export function WeekTimeline({ value, orders, days, compact = false, onSelectDate, onSelectOrder }: Props) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const plans = useOpsStore((state) => state.plans);
  const byDate = useMemo(() => {
    const map = new Map<string, LaidOut[]>();
    for (const iso of days) {
      map.set(iso, layoutDay(orders.filter((item) => item.date === iso), plans));
    }
    return map;
  }, [orders, days, plans]);

  const [tip, setTip] = useState<{ order: MockOrder; duration: number; x: number; y: number } | null>(null);

  return (
    <div className={cn("week-board", compact && "is-three")}>
      <div className={cn("week-scroll", compact && "is-three")}>
        <div className={cn("week-grid", compact && "is-three")} style={{ ["--hour-h" as string]: `${HOUR_H}px` }}>
          <div className="week-axis week-axis-head" aria-hidden>
            <span>{copy.calendar.time}</span>
          </div>
          {days.map((iso) => {
            const count = byDate.get(iso)?.length ?? 0;
            const picked = iso === value;
            return (
              <button
                key={`h-${iso}`}
                type="button"
                className={cn("week-day-head", picked && "is-picked")}
                onClick={() => onSelectDate(iso)}
              >
                <span className="week-day-wd">{weekdayLabel(iso, locale)}</span>
                <b>{Number(iso.slice(8))}</b>
                <span className="week-day-count">{count}</span>
              </button>
            );
          })}

          <div className="week-axis week-axis-body" aria-hidden>
            {Array.from({ length: HOURS }, (_, index) => {
              const hour = TIMELINE_START_HOUR + index;
              return (
                <div key={hour} className="week-hour" style={{ height: HOUR_H }}>
                  {String(hour).padStart(2, "0")}:00
                </div>
              );
            })}
            <span className="week-hour-end">20:00</span>
          </div>

          {days.map((iso) => {
            const blocks = byDate.get(iso) ?? [];
            const picked = iso === value;
            return (
              <div
                key={iso}
                className={cn("week-day", picked && "is-picked")}
                style={{ height: HOURS * HOUR_H }}
                onClick={() => onSelectDate(iso)}
              >
                {blocks.map((block) => {
                  const width = `calc((100% - 6px) / ${block.cols})`;
                  const left = `calc(3px + ${block.col} * (100% - 6px) / ${block.cols})`;
                  return (
                    <button
                      key={block.order.id}
                      type="button"
                      className={cn("week-block", statusClass(block.order.status))}
                      style={{ top: block.top, height: block.height, width, left }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setTip(null);
                        if (onSelectOrder) onSelectOrder(block.order);
                        else onSelectDate(iso);
                      }}
                      onMouseEnter={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        setTip({
                          order: block.order,
                          duration: block.duration,
                          x: Math.min(Math.max(rect.left + rect.width / 2, 120), window.innerWidth - 120),
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setTip(null)}
                    >
                      <span className="week-block-name">{block.order.customer}</span>
                      <span className="week-block-dur">{block.duration}分</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <ul className="week-legend">
        <li>
          <i className="is-confirmed" />
          {copy.orderStatus.confirmed}
        </li>
        <li>
          <i className="is-pending" />
          {copy.orderStatus.pending}
        </li>
        <li>
          <i className="is-cancelled" />
          {copy.orderStatus.cancelled}
        </li>
        <li>
          <i className="is-completed" />
          {copy.orderStatus.completed}
        </li>
      </ul>
      <p className="week-hint">
        {compact ? copy.calendar.compactHint : copy.calendar.weekHint}
      </p>

      {tip ? (
        <div
          className={cn("week-tip", tip.y < 120 && "is-below")}
          style={{ left: tip.x, top: tip.y }}
          role="tooltip"
        >
          <p className="week-tip-name">
            {tip.order.customer}
            <span>{adminOrderStatus(locale, tip.order.status)}</span>
          </p>
          <p>
            {tip.order.time} · {copy.calendar.minutes(tip.duration)} · {adminPlanName(locale, plans.find((item) => item.slug === tip.order.planSlug), tip.order.planName)}
          </p>
          <p>
            {adminChannel(locale, tip.order.channel)} · {formatYenShort(tip.order.totalJpy)} · {tip.order.id}
          </p>
        </div>
      ) : null}
    </div>
  );
}
