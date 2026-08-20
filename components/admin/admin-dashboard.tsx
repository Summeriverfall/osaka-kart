"use client";

import { CalendarDays, ClipboardList, Plus, Wallet, Warehouse } from "lucide-react";
import { CountUp } from "@/components/admin/count-up";
import { StatusBadge } from "@/components/admin/status-badge";
import { MOCK_DASHBOARD } from "@/lib/mock/dashboard";
import { REPORT_WEEK_7D } from "@/lib/mock/reports";
import { formatYenShort } from "@/lib/format";
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
  const go = useAdminNavStore((state) => state.go);
  const role = useAdminStore((state) => state.role);
  const orders = useOpsStore((state) => state.orders);
  const notify = useToastStore((state) => state.notify);
  const today = orders.filter((item) => item.date === "2026-08-20").sort((a, b) => a.time.localeCompare(b.time));

  const cards = [
    { label: "今日订单", value: MOCK_DASHBOARD.todayOrders, icon: ClipboardList, trend: `↑${MOCK_DASHBOARD.ordersVsYesterday}% vs 昨日`, warn: false },
    { label: "今日营收", value: MOCK_DASHBOARD.todayRevenue, icon: Wallet, trend: `↑${MOCK_DASHBOARD.revenueVsYesterday}% vs 昨日`, yen: true, warn: false },
    { label: "待确认", value: MOCK_DASHBOARD.pending, icon: CalendarDays, trend: "需尽快处理", warn: true },
    { label: "空余车位", value: MOCK_DASHBOARD.freeKarts, icon: Warehouse, trend: `${MOCK_DASHBOARD.freeKarts}/${MOCK_DASHBOARD.totalKarts} 正常`, warn: false },
  ] as const;

  const actions = [
    { label: "新建订单", href: "/admin/orders" },
    { label: "调整库存", href: "/admin/inventory" },
    { label: "查看报表", href: role === "admin" ? "/admin/reports" : "/admin/dashboard" },
    { label: "管理员工", href: role === "admin" ? "/admin/staff" : "/admin/orders" },
  ];

  return (
    <div className="space-y-6">
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

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-black">今日订单时间线</h2>
          <ul className="mt-4 space-y-3">
            {today.map((order) => (
              <li key={order.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
                <div>
                  <p className="font-black">{order.time} · {order.planName}</p>
                  <p className="text-sm text-slate-500">{order.customer} · {order.riders}人 · {formatYenShort(order.totalJpy)}</p>
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
            <LineChart data={REPORT_WEEK_7D}>
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
