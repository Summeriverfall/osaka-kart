"use client";

import { useMemo, useState } from "react";
import { Ban, Check, Eye, Pencil } from "lucide-react";
import { ChannelBadge } from "@/components/admin/channel-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { Modal } from "@/components/ui/modal";
import { formatYenShort } from "@/lib/format";
import { CHANNELS, ORDER_STATUS_LABEL, type MockOrder, type OrderChannel, type OrderStatus } from "@/lib/mock/orders";
import { MOCK_PLANS } from "@/lib/mock/plans";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";
import { mailNoticeForStatus } from "@/lib/ops-notify";
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
  storeId: "namba",
};

const TODAY = "2026-08-20";
type SortKey = "time" | "amount";
type SortDir = "asc" | "desc";

function OrderOps({
  order,
  onDetail,
  onEdit,
  onRefund,
  onConfirm,
}: {
  order: MockOrder;
  onDetail: () => void;
  onEdit: () => void;
  onRefund: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="order-ops">
      <div className="order-ops-group">
        <button type="button" className="is-edit" title="编辑" onClick={onEdit}>
          <Pencil className="size-3.5" />
          编辑
        </button>
        <button
          type="button"
          className="is-refund"
          title="退款/取消"
          disabled={order.status === "cancelled"}
          onClick={onRefund}
        >
          <Ban className="size-3.5" />
          退款
        </button>
        <button
          type="button"
          className="is-confirm"
          title="确认订单"
          disabled={order.status !== "pending"}
          onClick={onConfirm}
        >
          <Check className="size-3.5" />
          确认
        </button>
      </div>
      <button type="button" className="order-ops-detail" onClick={onDetail}>
        <Eye className="size-3.5" />
        详情
      </button>
    </div>
  );
}

export function AdminOrdersView() {
  const { upsertOrder, patchOrder, setOrderStatus, templates } = useOpsStore();
  const { orders: storeOrders, storeId, plans } = useStoreData();
  const notify = useToastStore((state) => state.notify);
  const [picked, setPicked] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [channel, setChannel] = useState<OrderChannel | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [editing, setEditing] = useState<MockOrder | null>(null);
  const [detail, setDetail] = useState<MockOrder | null>(null);
  const [refund, setRefund] = useState<MockOrder | null>(null);

  const rows = useMemo(() => {
    const filtered = storeOrders.filter((item) => {
      if (picked && item.date !== picked) return false;
      if (status !== "all" && item.status !== status) return false;
      if (channel !== "all" && item.channel !== channel) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [item.id, item.customer, item.planName].join(" ").toLowerCase().includes(q);
    });
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "amount") return (a.totalJpy - b.totalJpy) * dir;
      const left = `${a.date} ${a.time}`;
      const right = `${b.date} ${b.time}`;
      return left.localeCompare(right) * dir;
    });
    return sorted;
  }, [storeOrders, picked, status, channel, query, sortKey, sortDir]);

  const channelCounts = useMemo(() => {
    const map = new Map<OrderChannel | "all", number>();
    map.set("all", storeOrders.length);
    for (const item of CHANNELS) map.set(item, 0);
    for (const order of storeOrders) map.set(order.channel, (map.get(order.channel) ?? 0) + 1);
    return map;
  }, [storeOrders]);

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
      return;
    }
    setSortDir((current) => (current === "desc" ? "asc" : "desc"));
  }

  function save(order: MockOrder) {
    const id = order.id || `FK-${Date.now().toString(36).toUpperCase()}`;
    upsertOrder({ ...order, id, storeId: order.storeId || storeId });
    setEditing(null);
    notify("订单已保存，库存已按人数同步");
  }

  function changeStatus(id: string, next: OrderStatus) {
    const current = useOpsStore.getState().orders.find((item) => item.id === id);
    setOrderStatus(id, next);
    notify(
      current
        ? mailNoticeForStatus(next, { ...current, status: next }, templates)
        : `已改为${ORDER_STATUS_LABEL[next]}`,
    );
  }

  function sortMark(key: SortKey) {
    if (sortKey !== key) return "↕";
    return sortDir === "desc" ? "↓" : "↑";
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-500">
            日期
            <input
              className="admin-input ml-2 max-w-40"
              type="date"
              value={picked}
              onChange={(event) => setPicked(event.target.value)}
            />
          </label>
          <button type="button" className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600" onClick={() => setPicked(TODAY)}>
            今天
          </button>
          <button type="button" className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600" onClick={() => setPicked("")}>
            全部日期
          </button>
          <input
            className="admin-input min-w-52 flex-1"
            placeholder="搜索订单号/客户姓名/套餐"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select className="admin-input max-w-36" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus | "all")}>
            <option value="all">全部状态</option>
            {Object.entries(ORDER_STATUS_LABEL).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setEditing({ ...EMPTY, date: picked || TODAY, storeId })}>
            添加订单
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {picked ? `正在筛选 ${picked} · ${rows.length} 笔` : `全部日期 · ${rows.length} 笔`}
        </p>
      </section>

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

      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>渠道</th>
              <th>
                <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => toggleSort("time")}>
                  时间 {sortMark("time")}
                </button>
              </th>
              <th>客户</th>
              <th>套餐</th>
              <th>人数</th>
              <th>
                <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => toggleSort("amount")}>
                  金额 {sortMark("amount")}
                </button>
              </th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id}>
                <td className="font-mono text-xs">{order.id}</td>
                <td><ChannelBadge channel={order.channel} /></td>
                <td>
                  {order.date}
                  <span className="block text-xs text-slate-500">{order.time}</span>
                </td>
                <td>
                  {order.customer}
                  <span className="block text-xs text-slate-500">{order.nationality}</span>
                </td>
                <td>{order.planName}</td>
                <td>{order.riders}（{order.male}男/{order.female}女）</td>
                <td>{formatYenShort(order.totalJpy)}</td>
                <td>
                  <StatusSelect status={order.status} onChange={(next) => changeStatus(order.id, next)} />
                </td>
                <td>
                  <OrderOps
                    order={order}
                    onDetail={() => setDetail(order)}
                    onEdit={() => setEditing(order)}
                    onRefund={() => setRefund(order)}
                    onConfirm={() => changeStatus(order.id, "confirmed")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-400">没有符合条件的订单</p> : null}
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((order) => (
          <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-blue-600">{order.id}</p>
                <p className="mt-1 font-black">{order.customer}</p>
                <p className="text-sm text-slate-500">{order.date} {order.time} · {order.planName}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <ChannelBadge channel={order.channel} />
                <StatusSelect status={order.status} onChange={(next) => changeStatus(order.id, next)} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm">{formatYenShort(order.totalJpy)}</span>
              <OrderOps
                order={order}
                onDetail={() => setDetail(order)}
                onEdit={() => setEditing(order)}
                onRefund={() => setRefund(order)}
                onConfirm={() => changeStatus(order.id, "confirmed")}
              />
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
            <label className="admin-field">客户名<input className="admin-input" value={editing.customer} onChange={(event) => setEditing({ ...editing, customer: event.target.value })} /></label>
            <label className="admin-field">邮箱<input className="admin-input" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} /></label>
            <label className="admin-field">证件号<input className="admin-input" value={editing.passport} onChange={(event) => setEditing({ ...editing, passport: event.target.value })} /></label>
            <label className="admin-field">
              套餐
              <select className="admin-input" value={editing.planSlug} onChange={(event) => {
                const plan = plans.find((item) => item.slug === event.target.value) ?? plans[0];
                setEditing({ ...editing, planSlug: plan.slug, planName: plan.name, totalJpy: plan.priceJpy * editing.riders });
              }}>
                {plans.map((plan) => <option key={plan.id} value={plan.slug}>{plan.name}</option>)}
              </select>
            </label>
            <label className="admin-field">
              渠道
              <select className="admin-input" value={editing.channel} onChange={(event) => setEditing({ ...editing, channel: event.target.value as OrderChannel })}>
                {CHANNELS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="admin-field">备注<textarea className="admin-input min-h-24" value={editing.note} onChange={(event) => setEditing({ ...editing, note: event.target.value })} /></label>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(detail)}
        title={detail ? `订单 ${detail.id}` : ""}
        onClose={() => setDetail(null)}
        wide
        footer={
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setDetail(null)}>关闭</button>
        }
      >
        {detail ? (
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
            <p>状态：{ORDER_STATUS_LABEL[detail.status]}</p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(refund)}
        title="确认退款 / 取消？"
        onClose={() => setRefund(null)}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setRefund(null)}>返回</button>
            <button
              type="button"
              className="rounded-full bg-slate-700 px-5 py-2.5 text-sm text-white"
              onClick={() => {
                if (!refund) return;
                patchOrder(refund.id, { status: "cancelled", note: refund.note || "后台退款取消" });
                notify(
                  mailNoticeForStatus("cancelled", { ...refund, status: "cancelled" }, templates),
                );
                setRefund(null);
              }}
            >
              确认取消
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          {refund ? `将把 ${refund.id}（${refund.customer}）标为已取消。此操作为演示状态流转，不会真正打款。` : ""}
        </p>
      </Modal>
    </div>
  );
}
