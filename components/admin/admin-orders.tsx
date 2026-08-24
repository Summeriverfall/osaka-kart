"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Ban, Check, Eye, Pencil } from "lucide-react";
import { ChannelBadge } from "@/components/admin/channel-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { Modal } from "@/components/ui/modal";
import { adminChannel, adminCopy, adminNation, adminOrderStatus, adminPlanName } from "@/lib/admin/copy";
import { todayIsoDate } from "@/lib/booking/slots";
import { formatYenShort } from "@/lib/format";
import { CHANNELS, type MockOrder, type OrderChannel, type OrderStatus } from "@/lib/mock/orders";
import { MOCK_PLANS } from "@/lib/mock/plans";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";
import { sendStatusMail } from "@/lib/ops-notify";
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

type SortKey = "time" | "amount";
type SortDir = "asc" | "desc";

function OrderOps({
  order,
  copy,
  onDetail,
  onEdit,
  onRefund,
  onConfirm,
}: {
  order: MockOrder;
  copy: ReturnType<typeof adminCopy>;
  onDetail: () => void;
  onEdit: () => void;
  onRefund: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="order-ops">
      <div className="order-ops-group">
        <button type="button" className="is-edit" title={copy.orders.edit} onClick={onEdit}>
          <Pencil className="size-3.5" />
          {copy.orders.edit}
        </button>
        <button
          type="button"
          className="is-refund"
          title={copy.orders.refund}
          disabled={order.status === "cancelled"}
          onClick={onRefund}
        >
          <Ban className="size-3.5" />
          {copy.orders.refund}
        </button>
        <button
          type="button"
          className="is-confirm"
          title={copy.orders.confirm}
          disabled={order.status !== "pending"}
          onClick={onConfirm}
        >
          <Check className="size-3.5" />
          {copy.orders.confirm}
        </button>
      </div>
      <button type="button" className="order-ops-detail" onClick={onDetail}>
        <Eye className="size-3.5" />
        {copy.orders.detail}
      </button>
    </div>
  );
}

export function AdminOrdersView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { upsertOrder, patchOrder, setOrderStatus, templates, settings } = useOpsStore();
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
  const today = todayIsoDate();

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
    notify(copy.orders.saved);
  }

  function changeStatus(id: string, next: OrderStatus) {
    const current = useOpsStore.getState().orders.find((item) => item.id === id);
    setOrderStatus(id, next);
    if (!current) {
      notify(copy.notify.status(adminOrderStatus(locale, next)));
      return;
    }
    void sendStatusMail(next, { ...current, status: next }, templates, settings, locale).then(notify);
  }

  function sortMark(key: SortKey) {
    if (sortKey !== key) return "↕";
    return sortDir === "desc" ? "↓" : "↑";
  }

  function planLabel(order: MockOrder) {
    const seed = plans.find((item) => item.slug === order.planSlug);
    return adminPlanName(locale, seed, order.planName);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid gap-1 text-xs text-slate-500">
            {copy.orders.date}
            <input
              className="admin-input mt-0 w-auto min-w-[11rem] max-w-44"
              type="date"
              value={picked}
              onChange={(event) => setPicked(event.target.value)}
            />
          </label>
          <button type="button" className="h-11 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600" onClick={() => setPicked(today)}>
            {copy.orders.today}
          </button>
          <button type="button" className="h-11 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600" onClick={() => setPicked("")}>
            {copy.orders.allDates}
          </button>
          <input
            className="admin-input mt-0 min-w-52 flex-1"
            placeholder={copy.orders.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select className="admin-input mt-0 max-w-36" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus | "all")}>
            <option value="all">{copy.orders.allStatus}</option>
            {Object.keys(copy.orderStatus).map((key) => (
              <option key={key} value={key}>{copy.orderStatus[key]}</option>
            ))}
          </select>
          <button type="button" className="cta-btn h-11 px-5" onClick={() => setEditing({ ...EMPTY, date: picked || today, storeId })}>
            {copy.orders.add}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {picked ? copy.orders.filtering(picked, rows.length) : copy.orders.allDatesCount(rows.length)}
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {([["all", copy.orders.allChannels], ...CHANNELS.map((item) => [item, adminChannel(locale, item)])] as [OrderChannel | "all", string][]).map(([id, label]) => (
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
            {copy.orders.channelChip(label, channelCounts.get(id) ?? 0)}
          </button>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{copy.orders.id}</th>
              <th>{copy.orders.channel}</th>
              <th>
                <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => toggleSort("time")}>
                  {copy.orders.time} {sortMark("time")}
                </button>
              </th>
              <th>{copy.orders.customer}</th>
              <th>{copy.orders.plan}</th>
              <th>{copy.orders.riders}</th>
              <th>
                <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => toggleSort("amount")}>
                  {copy.orders.amount} {sortMark("amount")}
                </button>
              </th>
              <th>{copy.orders.status}</th>
              <th>{copy.orders.ops}</th>
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
                  <span className="block text-xs text-slate-500">{adminNation(locale, order.nationality)}</span>
                </td>
                <td>{planLabel(order)}</td>
                <td className="u-mix">{order.riders}{copy.orders.mf(order.male, order.female)}</td>
                <td>{formatYenShort(order.totalJpy)}</td>
                <td>
                  <StatusSelect status={order.status} onChange={(next) => changeStatus(order.id, next)} />
                </td>
                <td>
                  <OrderOps
                    order={order}
                    copy={copy}
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
        {rows.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-400">{copy.orders.empty}</p> : null}
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((order) => (
          <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-blue-600">{order.id}</p>
                <p className="mt-1 font-black">{order.customer}</p>
                <p className="text-sm text-slate-500">{order.date} {order.time} · {planLabel(order)}</p>
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
                copy={copy}
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
        title={editing?.id ? copy.orders.editTitle : copy.orders.addTitle}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setEditing(null)}>{copy.common.cancel}</button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => editing && save(editing)}>{copy.common.save}</button>
          </>
        }
      >
        {editing ? (
          <>
            <label className="admin-field">{copy.orders.customerName}<input className="admin-input" value={editing.customer} onChange={(event) => setEditing({ ...editing, customer: event.target.value })} /></label>
            <label className="admin-field">{copy.orders.email}<input className="admin-input" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} /></label>
            <label className="admin-field">{copy.orders.passport}<input className="admin-input" value={editing.passport} onChange={(event) => setEditing({ ...editing, passport: event.target.value })} /></label>
            <label className="admin-field">
              {copy.orders.plan}
              <select className="admin-input" value={editing.planSlug} onChange={(event) => {
                const plan = plans.find((item) => item.slug === event.target.value) ?? plans[0];
                setEditing({ ...editing, planSlug: plan.slug, planName: plan.name, totalJpy: plan.priceJpy * editing.riders });
              }}>
                {plans.map((plan) => <option key={plan.id} value={plan.slug}>{adminPlanName(locale, plan, plan.name)}</option>)}
              </select>
            </label>
            <label className="admin-field">
              {copy.orders.channel}
              <select className="admin-input" value={editing.channel} onChange={(event) => setEditing({ ...editing, channel: event.target.value as OrderChannel })}>
                {CHANNELS.map((item) => <option key={item} value={item}>{adminChannel(locale, item)}</option>)}
              </select>
            </label>
            <label className="admin-field">{copy.orders.note}<textarea className="admin-input min-h-24" value={editing.note} onChange={(event) => setEditing({ ...editing, note: event.target.value })} /></label>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(detail)}
        title={detail ? copy.orders.detailTitle(detail.id) : ""}
        onClose={() => setDetail(null)}
        wide
        footer={
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setDetail(null)}>{copy.common.close}</button>
        }
      >
        {detail ? (
          <div className="space-y-2 text-sm text-slate-500">
            <p>{copy.orders.customer}：{detail.customer} / {adminNation(locale, detail.nationality)}</p>
            <p>{copy.orders.email}：{detail.email}</p>
            <p>{copy.orders.phone}：{detail.phone}</p>
            <p>{copy.orders.passport}：{detail.passport}</p>
            <p>{copy.orders.plan}：{planLabel(detail)}</p>
            <p>{copy.orders.addons}：{detail.addons.join("、") || copy.common.none}</p>
            <p>{copy.orders.date}：{detail.date} {detail.time}</p>
            <p>{copy.orders.riders}：{detail.riders}{copy.orders.mf(detail.male, detail.female)}</p>
            <p>{copy.orders.amount}：{formatYenShort(detail.totalJpy)} · {detail.paid ? copy.common.paid : copy.common.unpaid}</p>
            <p>{copy.orders.channel}：<ChannelBadge channel={detail.channel} /></p>
            <p>{copy.orders.status}：{adminOrderStatus(locale, detail.status)}</p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(refund)}
        title={copy.orders.refundTitle}
        onClose={() => setRefund(null)}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setRefund(null)}>{copy.common.back}</button>
            <button
              type="button"
              className="rounded-full bg-slate-700 px-5 py-2.5 text-sm text-white"
              onClick={() => {
                if (!refund) return;
                patchOrder(refund.id, { status: "cancelled", note: refund.note || copy.orders.refundNote });
                void sendStatusMail("cancelled", { ...refund, status: "cancelled" }, templates, settings, locale).then(
                  notify,
                );
                setRefund(null);
              }}
            >
              {copy.orders.refundOk}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          {refund ? copy.orders.refundLead(refund.id, refund.customer) : ""}
        </p>
      </Modal>
    </div>
  );
}
