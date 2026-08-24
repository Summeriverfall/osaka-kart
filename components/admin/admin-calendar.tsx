"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { OrderCalendarDrill } from "@/components/admin/order-calendar-drill";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminCopy, adminPlanName } from "@/lib/admin/copy";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { formatYenShort } from "@/lib/format";
import { useStoreData } from "@/lib/use-store-data";

export function AdminCalendarView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { orders, plans } = useStoreData();
  const go = useAdminNavStore((state) => state.go);
  const [view, setView] = useState<"month" | "week" | "day">("week");
  const [picked, setPicked] = useState("2026-08-20");
  const dayOrders = useMemo(
    () => orders.filter((item) => item.date === picked).sort((a, b) => a.time.localeCompare(b.time) || a.id.localeCompare(b.id)),
    [orders, picked],
  );

  return (
    <div className="min-w-0 space-y-6">
      <OrderCalendarDrill
        value={picked}
        view={view}
        onView={setView}
        onChange={setPicked}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
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
              return (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-mono text-xs text-blue-600">{order.id}</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {order.time} · {order.customer} · {adminPlanName(locale, seed, order.planName)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{formatYenShort(order.totalJpy)}</span>
                    <StatusBadge status={order.status} />
                    <button
                      type="button"
                      className="text-xs text-blue-600"
                      onClick={() => go(`/admin/orders/${order.id}`)}
                    >
                      {copy.calendar.drill}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
