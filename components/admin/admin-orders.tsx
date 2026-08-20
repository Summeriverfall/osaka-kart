"use client";

import { useMemo, useState } from "react";
import { ChannelBadge } from "@/components/admin/channel-badge";
import { OrderCalendarDrill, type CalendarView } from "@/components/admin/order-calendar-drill";
import { StatusBadge } from "@/components/admin/status-badge";
import { Modal } from "@/components/ui/modal";
import { formatYenShort } from "@/lib/format";
import { CHANNELS, ORDER_STATUS_LABEL, type MockOrder, type OrderChannel, type OrderStatus } from "@/lib/mock/orders";
import { MOCK_PLANS } from "@/lib/mock/plans";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

const EMPTY: MockOrder = {
  id: "",
  customer: "",
  nationality: "USA",
  email: "",
  phone: "",
  passport: "",
  planName: MOCK_PLANS[1].name,
  planSlug: MOCK_PLANS[1].slug,
  date: "2026-08-21",
  time: "11:30",
  riders: 1,
  male: 1,
  female: 0,
  addons: [],
  totalJpy: MOCK_PLANS[1].priceJpy,
  channel: "官网",
  status: "pending",
  paid: false,
  note: "",
  logs: [],
};

export function AdminOrdersView() {
  const { orders, upsertOrder, patchOrder } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [view, setView] = useState<CalendarView>("month");
  const [picked, setPicked] = useState("2026-08-20");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [channel, setChannel] = useState<OrderChannel | "all">("all");
  const [editing, setEditing] = useState<MockOrder | null>(null);
  const [detail, setDetail] = useState<MockOrder | null>(null);
  const [cancelWhy, setCancelWhy] = useState("");

  const rows = useMemo(() => {
    return orders.filter((item) => {
      if (view === "day" && item.date !== picked) return false;
      if (status !== "all" && item.status !== status) return false;
      if (channel !== "all" && item.channel !== channel) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [item.id, item.customer, item.planName, item.nationality, item.channel].join(" ").toLowerCase().includes(q);
    });
  }, [orders, view, picked, status, channel, query]);

  const channelCounts = useMemo(() => {
    const map = new Map<OrderChannel | "all", number>();
    map.set("all", orders.length);
    for (const item of CHANNELS) map.set(item, 0);
    for (const order of orders) map.set(order.channel, (map.get(order.channel) ?? 0) + 1);
    return map;
  }, [orders]);

  function save(order: MockOrder) {
    const id = order.id || `FK-${Date.now().toString(36).toUpperCase()}`;
    upsertOrder({ ...order, id });
    setEditing(null);
    notify("订单已保存");
  }

  return (
    <div className="space-y-6">
      <OrderCalendarDrill
        value={picked}
        view={view}
        onView={setView}
        onChange={(iso) => {
          setPicked(iso);
          setView("day");
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        {([["all", "全部渠道"], ...CHANNELS.map((item) => [item, item])] as [OrderChannel | "all", string][]).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setChannel(id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              channel === id
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-400",
            )}
          >
            {label} {channelCounts.get(id) ?? 0}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input className="admin-input max-w-xs" placeholder="搜索订单号 / 客户 / 套餐 / 渠道" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="admin-input max-w-40" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "all")}>
          <option value="all">全部状态</option>
          {Object.entries(ORDER_STATUS_LABEL).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setEditing({ ...EMPTY, date: picked })}>
          添加订单
        </button>
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>渠道</th>
              <th>时间</th>
              <th>客户</th>
              <th>套餐</th>
              <th>人数</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id}>
                <td className="font-mono text-xs">{order.id}</td>
                <td><ChannelBadge channel={order.channel} /></td>
                <td>{order.date}<span className="block text-xs text-slate-500">{order.time}</span></td>
                <td>{order.customer}<span className="block text-xs text-slate-500">{order.nationality}</span></td>
                <td>{order.planName}</td>
                <td>{order.riders}（{order.male}男/{order.female}女）</td>
                <td>{formatYenShort(order.totalJpy)}</td>
                <td><StatusBadge status={order.status} /></td>
                <td className="space-x-2">
                  <button type="button" className="text-xs text-sky-600" onClick={() => setDetail(order)}>查看</button>
                  <button type="button" className="text-xs text-blue-600" onClick={() => setEditing(order)}>编辑</button>
                  <button type="button" className="text-xs text-slate-500" onClick={() => setDetail({ ...order, note: "cancel" })}>取消</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((order) => (
          <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-blue-600">{order.id}</p>
                <p className="mt-1 font-black">{order.customer}</p>
                <p className="text-sm text-slate-500">{order.time} · {order.planName} · {order.riders}人</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <ChannelBadge channel={order.channel} />
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-sm">{formatYenShort(order.totalJpy)}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" className="rounded-full border border-slate-200 px-3 py-1 text-xs" onClick={() => setDetail(order)}>查看</button>
              <button type="button" className="rounded-full border border-slate-200 px-3 py-1 text-xs" onClick={() => setEditing(order)}>编辑</button>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(editing)}
        title={editing?.id ? "编辑订单" : "添加订单"}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setEditing(null)}>取消</button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => editing && save(editing)}>保存</button>
          </>
        }
      >
        {editing ? (
          <>
            <label className="admin-field">客户名<input className="admin-input" value={editing.customer} onChange={(e) => setEditing({ ...editing, customer: e.target.value })} /></label>
            <label className="admin-field">邮箱<input className="admin-input" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></label>
            <label className="admin-field">证件号<input className="admin-input" value={editing.passport} onChange={(e) => setEditing({ ...editing, passport: e.target.value })} /></label>
            <label className="admin-field">
              套餐
              <select className="admin-input" value={editing.planSlug} onChange={(e) => {
                const plan = MOCK_PLANS.find((item) => item.slug === e.target.value) ?? MOCK_PLANS[0];
                setEditing({ ...editing, planSlug: plan.slug, planName: plan.name, totalJpy: plan.priceJpy * editing.riders });
              }}>
                {MOCK_PLANS.map((plan) => <option key={plan.id} value={plan.slug}>{plan.name}</option>)}
              </select>
            </label>
            <label className="admin-field">
              渠道
              <select className="admin-input" value={editing.channel} onChange={(e) => setEditing({ ...editing, channel: e.target.value as OrderChannel })}>
                {CHANNELS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="admin-field">备注<textarea className="admin-input min-h-24" value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(detail)}
        title={detail ? `订单 ${detail.id}` : ""}
        onClose={() => { setDetail(null); setCancelWhy(""); }}
        wide
        footer={
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { setDetail(null); setCancelWhy(""); }}>关闭</button>
        }
      >
        {detail ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2 text-sm text-slate-500">
              <p>客户：{detail.customer} / {detail.nationality}</p>
              <p>邮箱：{detail.email}</p>
              <p>电话：{detail.phone}</p>
              <p>证件：{detail.passport}</p>
              <p>套餐：{detail.planName}</p>
              <p>附加项：{detail.addons.join("、") || "无"}</p>
              <p>日期：{detail.date} {detail.time}</p>
              <p>人数：{detail.riders}（{detail.male}男 / {detail.female}女）</p>
              <p>金额：{formatYenShort(detail.totalJpy)} · {detail.paid ? "已支付" : "未支付"}</p>
              <p>渠道：<ChannelBadge channel={detail.channel} /></p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-900">状态流转</p>
              <div className="flex flex-wrap gap-2">
                {(["pending", "confirmed", "completed"] as OrderStatus[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={cn("rounded-full border px-3 py-1.5 text-xs", detail.status === item ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200")}
                    onClick={() => {
                      patchOrder(detail.id, { status: item });
                      setDetail({ ...detail, status: item });
                      notify(`已改为${ORDER_STATUS_LABEL[item]}`);
                    }}
                  >
                    {ORDER_STATUS_LABEL[item]}
                  </button>
                ))}
              </div>
              <label className="admin-field">
                取消原因
                <input className="admin-input" value={cancelWhy} onChange={(e) => setCancelWhy(e.target.value)} placeholder="填原因后取消" />
              </label>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500"
                onClick={() => {
                  if (!cancelWhy.trim()) return;
                  patchOrder(detail.id, { status: "cancelled", note: cancelWhy });
                  notify("订单已取消");
                  setDetail(null);
                  setCancelWhy("");
                }}
              >
                确认取消
              </button>
              <div>
                <p className="mb-2 text-sm font-black text-slate-900">操作日志</p>
                <ul className="space-y-2 text-xs text-slate-500">
                  {detail.logs.map((item, index) => (
                    <li key={`${item.time}-${index}`} className="rounded-xl border border-slate-200 px-3 py-2">
                      {item.time} · {item.actor} · {item.action} {item.note ? `· ${item.note}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
