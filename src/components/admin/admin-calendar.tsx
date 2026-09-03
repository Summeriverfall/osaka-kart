"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { OrderCalendarDrill } from "@/components/admin/order-calendar-drill";
import { OrderDetailModal } from "@/components/admin/order-detail-modal";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminCopy, adminPlanName } from "@/lib/admin/copy";
import { adminShopOrders } from "@/lib/admin-schedule";
import { useAdminShopFocus } from "@/lib/admin-shop-focus";
import { readAdminFocusDate } from "@/lib/admin/focus-date";
import { todayIsoDate } from "@/lib/booking/slots";
import { formatYenShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useStoreData } from "@/lib/use-store-data";
import type { MockOrder } from "@/lib/mock/orders";

function scrollAdminMainTo(target: HTMLElement, offset = 12) {
  const scroller = document.querySelector(".admin-app main");
  if (scroller instanceof HTMLElement) {
    const top =
      scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - offset;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AdminCalendarView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { orders, plans, storeId } = useStoreData();
  const { focusStore } = useAdminShopFocus();
  const listRef = useRef<HTMLElement>(null);
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [picked, setPicked] = useState(() => readAdminFocusDate() || todayIsoDate());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const dayOrders = useMemo(
    () =>
      adminShopOrders(orders, storeId, focusStore)
        .filter((item) => item.date === picked)
        .sort((a, b) => a.time.localeCompare(b.time) || a.id.localeCompare(b.id)),
    [orders, storeId, focusStore, picked],
  );

  function revealDayList(orderId?: string) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const section = listRef.current;
        if (!section) return;
        const row = orderId ? section.querySelector(`[data-order-id="${CSS.escape(orderId)}"]`) : null;
        scrollAdminMainTo(row instanceof HTMLElement ? row : section);
      });
    });
  }

  function pickDate(iso: string, orderId?: string) {
    setPicked(iso);
    setFocusId(orderId ?? null);
    revealDayList(orderId);
  }

  function openOrder(order: MockOrder) {
    setPicked(order.date);
    setFocusId(order.id);
    setDetailId(order.id);
  }

  return (
    <div className="min-w-0 space-y-6">
      <OrderCalendarDrill
        value={picked}
        view={view}
        onView={setView}
        onChange={(iso) => pickDate(iso)}
        onSelectOrder={openOrder}
      />

      <section ref={listRef} className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-black">{copy.calendar.dayOrders(picked)}</h2>
          <span className="text-sm text-slate-500">{copy.calendar.count(dayOrders.length)}</span>
        </div>
        {dayOrders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{copy.calendar.empty}</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {dayOrders.map((order) => {
              const seed = plans.find((item) => item.slug === order.planSlug);
              const focused = focusId === order.id;
              return (
                <li key={order.id} data-order-id={order.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full flex-wrap items-center justify-between gap-3 py-3 text-left transition hover:bg-slate-50",
                      focused && "cal-day-row-focus",
                    )}
                    onClick={() => setDetailId(order.id)}
                  >
                    <div>
                      <p className="font-mono text-xs text-blue-600">{order.id}</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        {order.time} · {order.customer} · {adminPlanName(locale, seed, order.planName)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600">{formatYenShort(order.totalJpy)}</span>
                      <StatusBadge status={order.status} />
                      <span className="cal-day-drill">{copy.calendar.drill}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <OrderDetailModal
        orderId={detailId}
        onClose={() => setDetailId(null)}
        onOrderIdChange={setDetailId}
      />
    </div>
  );
}
