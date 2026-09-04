"use client";

import { useEffect, useMemo } from "react";
import { useLocale } from "next-intl";
import { CalendarDays, ClipboardList, Gauge, Plus, Wallet, Warehouse } from "lucide-react";
import { CountUp } from "@/components/admin/count-up";
import { StatusBadge } from "@/components/admin/status-badge";
import { setAdminFocusDate } from "@/lib/admin/focus-date";
import { adminCopy, adminPlanName, adminStoreName, adminStoreStatus } from "@/lib/admin/copy";
import { addDaysIso } from "@/lib/calendar";
import { todayIsoDate } from "@/lib/booking/slots";
import { cutsFromChannels, sumOrderNet } from "@/lib/order-revenue";
import { occupancyRate } from "@/lib/fleet-inventory";
import { formatYenShort } from "@/lib/format";
import { b2Copy } from "@/lib/admin/b2-copy";
import { ALL_STORES_ID, isAllStores, storeIdOf } from "@/lib/store-id";
import { useStoreData } from "@/lib/use-store-data";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { useAdminStore } from "@/stores/admin-store";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  color: "#111827",
};

export function AdminDashboardView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const go = useAdminNavStore((state) => state.go);
  const role = useAdminStore((state) => state.role);
  const notify = useToastStore((state) => state.notify);
  const ordersAll = useOpsStore((state) => state.orders);
  const vehiclesAll = useOpsStore((state) => state.vehicles);
  const plans = useOpsStore((state) => state.plans);
  const ensureDemoOrders = useOpsStore((state) => state.ensureDemoOrders);
  const settleDueOrders = useOpsStore((state) => state.settleDueOrders);
  const settings = useOpsStore((state) => state.settings);
  const affiliates = useOpsStore((state) => state.affiliates);
  const { orders, vehicles, stores, storeId, setStoreId, canSwitch, store, vehicleSlots, specialDates } = useStoreData();
  const showingAll = canSwitch && isAllStores(storeId);
  const todayIso = todayIsoDate();

  useEffect(() => {
    ensureDemoOrders();
    settleDueOrders();
    if (canSwitch) setStoreId(ALL_STORES_ID);
    const tick = window.setInterval(settleDueOrders, 30000);
    return () => window.clearInterval(tick);
    // 每次进入仪表盘，超管默认看全店合计
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSwitch, ensureDemoOrders, settleDueOrders]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDaysIso(todayIso, index - 6)),
    [todayIso],
  );
  const yesterdayIso = addDaysIso(todayIso, -1);
  const dayOrders = orders.filter((item) => item.date === todayIso).sort((a, b) => a.time.localeCompare(b.time));
  const prevOrders = orders.filter((item) => item.date === yesterdayIso);
  const pending = dayOrders.filter((item) => item.status === "pending").length;
  const cuts = useMemo(() => cutsFromChannels(settings.channels), [settings.channels]);
  const todayRevenue = sumOrderNet(dayOrders, cuts, affiliates);
  const prevRevenue = sumOrderNet(prevOrders, cuts, affiliates);
  const freeKarts = vehicles.filter((item) => item.status === "available").length;
  const utilization = occupancyRate(
    todayIso,
    todayIso,
    [todayIso],
    vehicles,
    vehicleSlots,
    ordersAll,
    specialDates,
    showingAll ? undefined : storeId,
    plans,
  );
  const week = weekDays.map((date) => ({
    iso: date,
    day: date.slice(5),
    orders: orders.filter((item) => item.date === date).length,
  }));

  const branches = stores.map((item) => {
    const storeOrders = ordersAll.filter((order) => storeIdOf(order.storeId) === item.id);
    const storeVehicles = vehiclesAll.filter((vehicle) => storeIdOf(vehicle.storeId) === item.id);
    const storeToday = storeOrders.filter((order) => order.date === todayIso);
    return {
      id: item.id,
      name: adminStoreName(locale, item.id, item.name),
      status: adminStoreStatus(locale, item.status),
      todayOrders: storeToday.length,
      todayRevenue: sumOrderNet(storeToday, cuts, affiliates),
      pending: storeToday.filter((order) => order.status === "pending").length,
      karts: storeVehicles.filter((vehicle) => vehicle.status === "available").length,
    };
  });

  const cards = [
    {
      label: copy.dashboard.todayOrders,
      value: dayOrders.length,
      icon: ClipboardList,
      trend: showingAll ? copy.dashboard.allSum : copy.dashboard.count(dayOrders.length),
      warn: false,
      href: "/admin/orders",
    },
    {
      label: copy.dashboard.todayRevenue,
      value: todayRevenue,
      icon: Wallet,
      trend: prevRevenue
        ? `${todayRevenue >= prevRevenue ? "↑" : "↓"} ${copy.dashboard.vsYesterday} · ${copy.dashboard.todayRevenueHint}`
        : copy.dashboard.todayRevenueHint,
      yen: true,
      warn: false,
      href: "/admin/orders",
    },
    {
      label: copy.dashboard.pending,
      value: pending,
      icon: CalendarDays,
      trend: pending ? copy.dashboard.needHandle : copy.dashboard.noPending,
      warn: pending > 0,
      href: "/admin/orders",
    },
    {
      label: copy.dashboard.freeKarts,
      value: freeKarts,
      icon: Warehouse,
      trend: copy.dashboard.kartsOk(freeKarts, vehicles.length),
      warn: false,
      href: "/admin/inventory",
    },
    {
      label: b2.utilization,
      value: Math.round(utilization * 100),
      icon: Gauge,
      trend: b2.utilizationHint,
      warn: utilization >= 0.85,
      href: "/admin/inventory",
      pct: true,
    },
  ] as const;

  const actions = [
    { id: "order", label: copy.dashboard.newOrder, href: "/admin/orders" },
    { id: "inventory", label: copy.dashboard.inventory, href: "/admin/inventory" },
    { id: "reports", label: copy.dashboard.reports, href: role === "admin" ? "/admin/reports" : "/admin/dashboard" },
    { id: "staff", label: copy.dashboard.staff, href: role === "admin" ? "/admin/staff" : "/admin/orders" },
  ];

  function openToday(tab: "/admin/orders" | "/admin/calendar" = "/admin/orders") {
    setAdminFocusDate(todayIso);
    go(tab);
  }

  return (
    <div className="space-y-6">
      {canSwitch ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {showingAll
              ? copy.store.viewingAll
              : `${copy.store.viewing} ${store ? adminStoreName(locale, store.id, store.name) : ""}.`}
          </p>
          {showingAll ? null : (
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-blue-400"
              onClick={() => setStoreId(ALL_STORES_ID)}
            >
              {copy.store.backAll}
            </button>
          )}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => {
              setAdminFocusDate(todayIso);
              go(card.href);
            }}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-400 sm:p-6"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span>{card.label}</span>
              <card.icon className="size-4 text-blue-600" />
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {"pct" in card && card.pct ? `${card.value}%` : <CountUp value={card.value} yen={"yen" in card} />}
            </p>
            <p className={`mt-2 text-xs ${card.warn ? "text-amber-600" : "text-emerald-600"}`}>{card.trend}</p>
          </button>
        ))}
      </div>

      {canSwitch ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">{copy.dashboard.branches}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {branches.map((item) => {
              const active = storeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStoreId(item.id)}
                  className={`rounded-xl border p-4 text-left transition hover:border-blue-400 ${
                    active ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="font-black text-slate-900">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.status}</p>
                  <p className="mt-3 text-sm text-slate-600">
                    {copy.dashboard.todayLine(item.todayOrders, formatYenShort(item.todayRevenue))}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {copy.dashboard.pendingKarts(item.pending, item.karts)}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black">{copy.dashboard.timeline}</h2>
            <button type="button" className="text-xs text-blue-600" onClick={() => openToday("/admin/calendar")}>
              {copy.nav["/admin/calendar"]}
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {dayOrders.length === 0 ? (
              <li className="text-sm text-slate-400">{showingAll ? copy.dashboard.emptyAll : copy.dashboard.emptyStore}</li>
            ) : null}
            {dayOrders.map((order) => {
              const seed = plans.find((item) => item.slug === order.planSlug);
              const planName = adminPlanName(locale, seed, order.planName);
              const storeName = adminStoreName(
                locale,
                storeIdOf(order.storeId),
                stores.find((item) => item.id === storeIdOf(order.storeId))?.name ?? copy.nambaStore,
              );
              return (
                <li key={order.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminFocusDate(order.date);
                      go("/admin/calendar");
                    }}
                    className="flex w-full min-w-0 items-start justify-between gap-3 rounded-xl border border-slate-200 px-3 py-3 text-left hover:border-blue-400"
                  >
                    <div className="min-w-0">
                      <p className="font-black break-words">
                        {order.time} · {planName}
                      </p>
                      <p className="text-sm break-words text-slate-500">
                        {copy.dashboard.orderMeta(order.customer, order.riders, formatYenShort(order.totalJpy))}
                        {showingAll ? ` · ${storeName}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0">
                    <StatusBadge status={order.status} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">{copy.dashboard.shortcuts}</h2>
          <div className="mt-4 grid gap-3">
            {actions.map((item) => (
              <button
                key={item.id}
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-blue-400"
                onClick={() => {
                  if (item.id === "staff" && role !== "admin") {
                    notify(copy.dashboard.managerStaff);
                    go("/admin/orders");
                    return;
                  }
                  if (item.id === "reports" && role !== "admin") {
                    notify(copy.dashboard.managerReport);
                    return;
                  }
                  if (item.id === "order") {
                    openToday("/admin/orders");
                    return;
                  }
                  go(item.href);
                }}
              >
                <Plus className="mr-2 inline size-4 text-blue-600" />
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">{copy.dashboard.mobileHint}</p>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-black">{copy.dashboard.weekChart}</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={week}>
              <CartesianGrid stroke="rgba(15,23,42,0.08)" />
              <XAxis dataKey="day" stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="orders" name={copy.dashboard.chartOrders} stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
