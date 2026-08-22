"use client";

import { useEffect } from "react";
import { CalendarDays, ClipboardList, Plus, Wallet, Warehouse } from "lucide-react";
import { CountUp } from "@/components/admin/count-up";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatYenShort } from "@/lib/format";
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

const TODAY = "2026-08-20";

export function AdminDashboardView() {
  const go = useAdminNavStore((state) => state.go);
  const role = useAdminStore((state) => state.role);
  const notify = useToastStore((state) => state.notify);
  const ordersAll = useOpsStore((state) => state.orders);
  const vehiclesAll = useOpsStore((state) => state.vehicles);
  const { orders, vehicles, stores, storeId, setStoreId, canSwitch, store } = useStoreData();
  const showingAll = canSwitch && isAllStores(storeId);

  useEffect(() => {
    if (canSwitch) setStoreId(ALL_STORES_ID);
    // 每次进入仪表盘，超管默认看全店合计
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSwitch]);

  const today = orders.filter((item) => item.date === TODAY).sort((a, b) => a.time.localeCompare(b.time));
  const yesterday = orders.filter((item) => item.date === "2026-08-19");
  const pending = orders.filter((item) => item.status === "pending").length;
  const todayRevenue = today.reduce((sum, item) => sum + item.totalJpy, 0);
  const yesterdayRevenue = yesterday.reduce((sum, item) => sum + item.totalJpy, 0);
  const freeKarts = vehicles.filter((item) => item.status === "available").length;
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = `2026-08-${String(14 + index).padStart(2, "0")}`;
    return { day: date.slice(5), orders: orders.filter((item) => item.date === date).length };
  });

  const branches = stores.map((item) => {
    const storeOrders = ordersAll.filter((order) => storeIdOf(order.storeId) === item.id);
    const storeVehicles = vehiclesAll.filter((vehicle) => storeIdOf(vehicle.storeId) === item.id);
    const storeToday = storeOrders.filter((order) => order.date === TODAY);
    return {
      id: item.id,
      name: item.name,
      status: item.status,
      todayOrders: storeToday.length,
      todayRevenue: storeToday.reduce((sum, order) => sum + order.totalJpy, 0),
      pending: storeOrders.filter((order) => order.status === "pending").length,
      karts: storeVehicles.filter((vehicle) => vehicle.status === "available").length,
    };
  });

  const cards = [
    { label: "今日订单", value: today.length, icon: ClipboardList, trend: showingAll ? "全店合计" : `${today.length} 笔`, warn: false },
    { label: "今日营收", value: todayRevenue, icon: Wallet, trend: yesterdayRevenue ? `${todayRevenue >= yesterdayRevenue ? "↑" : "↓"} vs 昨日` : showingAll ? "全店合计" : "今日该店营收", yen: true, warn: false },
    { label: "待确认", value: pending, icon: CalendarDays, trend: pending ? "需尽快处理" : "暂无待确认", warn: pending > 0 },
    { label: "空余车位", value: freeKarts, icon: Warehouse, trend: `${freeKarts}/${vehicles.length} 正常`, warn: false },
  ] as const;

  const actions = [
    { label: "新建订单", href: "/admin/orders" },
    { label: "调整库存", href: "/admin/inventory" },
    { label: "查看报表", href: role === "admin" ? "/admin/reports" : "/admin/dashboard" },
    { label: "管理员工", href: role === "admin" ? "/admin/staff" : "/admin/orders" },
  ];

  return (
    <div className="space-y-6">
      {canSwitch ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {showingAll ? "当前为全店合计。点分店卡片可查看该店数据。" : `正在查看 ${store?.name}。`}
          </p>
          {showingAll ? null : (
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-blue-400"
              onClick={() => setStoreId(ALL_STORES_ID)}
            >
              返回全部店铺
            </button>
          )}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between text-slate-500">
              <span>{card.label}</span>
              <card.icon className="size-4 text-blue-600" />
            </div>
            <p className="mt-3 text-3xl font-black text-slate-900">
              <CountUp value={card.value} yen={"yen" in card} />
            </p>
            <p className={`mt-2 text-xs ${card.warn ? "text-amber-600" : "text-emerald-600"}`}>{card.trend}</p>
          </article>
        ))}
      </div>

      {canSwitch ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">分店</h2>
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
                    今日 {item.todayOrders} 单 · {formatYenShort(item.todayRevenue)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    待确认 {item.pending} · 可用车 {item.karts}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">今日订单时间线</h2>
          <ul className="mt-4 space-y-3">
            {today.length === 0 ? <li className="text-sm text-slate-400">{showingAll ? "今日暂无订单" : "该店今日暂无订单"}</li> : null}
            {today.map((order) => (
              <li key={order.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
                <div>
                  <p className="font-black">{order.time} · {order.planName}</p>
                  <p className="text-sm text-slate-500">
                    {order.customer} · {order.riders}人 · {formatYenShort(order.totalJpy)}
                    {showingAll ? ` · ${stores.find((item) => item.id === storeIdOf(order.storeId))?.name ?? "难波本店"}` : ""}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">快捷操作</h2>
          <div className="mt-4 grid gap-3">
            {actions.map((item) => (
              <button
                key={item.label}
                type="button"
                className="rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-blue-400"
                onClick={() => {
                  if (item.label === "管理员工" && role !== "admin") {
                    notify("店长账号请从订单页确认预约");
                    go("/admin/orders");
                    return;
                  }
                  if (item.label === "查看报表" && role !== "admin") {
                    notify("报表仅超管可见，已留在仪表盘");
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
          <p className="mt-4 text-xs text-slate-500">手机上可直接确认订单、调整库存。</p>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-black">最近 7 天订单量</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={week}>
              <CartesianGrid stroke="rgba(15,23,42,0.08)" />
              <XAxis dataKey="day" stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="orders" name="订单" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
