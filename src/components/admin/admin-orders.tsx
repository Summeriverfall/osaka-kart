"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Ban, Check, ChevronRight, Eye, Pencil, Plus, Search } from "lucide-react";
import { ChannelBadge } from "@/components/admin/channel-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { Modal } from "@/components/ui/modal";
import { adminCopy, adminNation, adminOrderStatus, adminPlanName } from "@/lib/admin/copy";
import { b2Copy } from "@/lib/admin/b2-copy";
import { useAdminAccess } from "@/lib/admin-access";
import { collectChannelIds, labelChannel, liveChannelIds } from "@/lib/channel-options";
import { readAdminFocusDate } from "@/lib/admin/focus-date";
import { todayIsoDate } from "@/lib/booking/slots";
import { formatYenShort } from "@/lib/format";
import { OrderDocs } from "@/components/admin/order-docs";
import { OrderEditFields } from "@/components/admin/order-edit-fields";
import { type MockOrder, type OrderCancelKind, type OrderStatus } from "@/lib/mock/orders";
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
      <span className="order-ops-gutter" aria-hidden />
      <button type="button" className="order-ops-detail" title={copy.orders.detail} onClick={onDetail}>
        <Eye className="size-3.5" />
        {copy.orders.detail}
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}

function orderDateMeta(
  from: string,
  to: string,
  count: number,
  copy: ReturnType<typeof adminCopy>["orders"],
) {
  const start = from && to && from > to ? to : from;
  const end = from && to && from > to ? from : to;
  if (!start && !end) return copy.allDatesCount(count);
  if (start && end && start === end) return copy.filtering(start, count);
  if (start && end) return copy.filteringRange(start, end, count);
  if (start) return copy.filteringFrom(start, count);
  return copy.filteringTo(end, count);
}

function orderDateInRange(date: string, from: string, to: string) {
  const start = from && to && from > to ? to : from;
  const end = from && to && from > to ? from : to;
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

export function AdminOrdersView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const { canCompleteOrder } = useAdminAccess();
  const { upsertOrder, patchOrder, setOrderStatus, templates, settings, affiliates } = useOpsStore();
  const { orders: storeOrders, storeId, plans } = useStoreData();
  const notify = useToastStore((state) => state.notify);
  const [from, setFrom] = useState(() => readAdminFocusDate());
  const [to, setTo] = useState(() => readAdminFocusDate());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [channel, setChannel] = useState<string>("all");
  const [affiliate, setAffiliate] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [editing, setEditing] = useState<MockOrder | null>(null);
  const [editingFromId, setEditingFromId] = useState("");
  const [detail, setDetail] = useState<MockOrder | null>(null);
  const [refund, setRefund] = useState<MockOrder | null>(null);
  const [refundNote, setRefundNote] = useState("");
  const [cancelTarget, setCancelTarget] = useState<MockOrder | null>(null);
  const [cancelKind, setCancelKind] = useState<OrderCancelKind>("voluntary");
  const today = todayIsoDate();

  const rows = useMemo(() => {
    const filtered = storeOrders.filter((item) => {
      if (!orderDateInRange(item.date, from, to)) return false;
      if (status !== "all" && item.status !== status) return false;
      if (channel !== "all" && item.channel !== channel) return false;
      if (affiliate !== "all" && (item.affiliateId ?? "") !== affiliate) return false;
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
  }, [storeOrders, from, to, status, channel, affiliate, query, sortKey, sortDir]);

  const listedChannels = useMemo(
    () => collectChannelIds(settings.channels, storeOrders.map((item) => item.channel)),
    [settings.channels, storeOrders],
  );

  const datedOrders = useMemo(
    () => storeOrders.filter((item) => orderDateInRange(item.date, from, to)),
    [storeOrders, from, to],
  );

  const channelCounts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("all", datedOrders.length);
    for (const id of listedChannels) map.set(id, 0);
    for (const order of datedOrders) map.set(order.channel, (map.get(order.channel) ?? 0) + 1);
    return map;
  }, [datedOrders, listedChannels]);

  const channelOptions = useMemo(
    () => liveChannelIds(settings.channels, editing?.channel),
    [settings.channels, editing?.channel],
  );

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
      return;
    }
    setSortDir((current) => (current === "desc" ? "asc" : "desc"));
  }

  function openEdit(order: MockOrder) {
    setEditingFromId(order.id);
    setEditing({ ...order });
  }

  function openAdd() {
    setEditingFromId("");
    setEditing({ ...EMPTY, date: to || from || today, storeId });
  }

  function save(order: MockOrder) {
    const id = order.id.trim() || `FK-${Date.now().toString(36).toUpperCase()}`;
    const male = Math.max(0, order.male);
    const female = Math.max(0, order.female);
    const next: MockOrder = {
      ...order,
      id,
      male,
      female,
      riders: male + female,
      time: order.time.slice(0, 5),
      totalJpy: Math.max(0, order.totalJpy),
      storeId: order.storeId || storeId,
    };
    const taken = useOpsStore.getState().orders.some((item) => item.id === next.id && item.id !== editingFromId);
    if (taken) {
      notify(copy.orders.idTaken);
      return;
    }
    const prev = editingFromId ? useOpsStore.getState().orders.find((item) => item.id === editingFromId) : undefined;
    upsertOrder(next, editingFromId || undefined);
    setEditing(null);
    setEditingFromId("");
    if (prev && prev.status !== next.status) {
      void sendStatusMail(next.status, next, templates, settings, locale).then(notify);
      return;
    }
    notify(copy.orders.saved);
  }

  function changeStatus(id: string, next: OrderStatus) {
    const current = useOpsStore.getState().orders.find((item) => item.id === id);
    if (next === "completed" && !canCompleteOrder()) {
      notify(b2.completeOnlyManager);
      return;
    }
    if (next === "cancelled") {
      if (current) setCancelTarget(current);
      setCancelKind(current?.cancelKind ?? "voluntary");
      return;
    }
    setOrderStatus(id, next);
    if (!current) {
      notify(copy.notify.status(adminOrderStatus(locale, next)));
      return;
    }
    void sendStatusMail(next, { ...current, status: next }, templates, settings, locale).then(notify);
  }

  function confirmCancel() {
    if (!cancelTarget) return;
    setOrderStatus(cancelTarget.id, "cancelled", { cancelKind });
    void sendStatusMail("cancelled", { ...cancelTarget, status: "cancelled", cancelKind }, templates, settings, locale).then(
      notify,
    );
    setCancelTarget(null);
  }

  function recordRefund() {
    if (!refund) return;
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    patchOrder(refund.id, {
      refunds: [...(refund.refunds ?? []), { time: stamp, note: refundNote.trim() || b2.refundReserved }],
    });
    notify(b2.refundReserved);
    setRefund(null);
    setRefundNote("");
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
      <section className="order-toolbar">
        <div className="order-toolbar-main">
          <label className="order-toolbar-search">
            <Search />
            <input
              type="search"
              placeholder={copy.orders.search}
              aria-label={copy.orders.search}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="order-toolbar-dates">
            <input
              type="date"
              aria-label={copy.orders.dateFrom}
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
            <span className="order-toolbar-range-mark" aria-hidden>
              –
            </span>
            <input
              type="date"
              aria-label={copy.orders.dateTo}
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
            <button
              type="button"
              className={cn(from === today && to === today && "is-on")}
              onClick={() => {
                setFrom(today);
                setTo(today);
              }}
            >
              {copy.orders.today}
            </button>
            <button
              type="button"
              className={cn(!from && !to && "is-on")}
              onClick={() => {
                setFrom("");
                setTo("");
              }}
            >
              {copy.orders.allDates}
            </button>
          </div>
          <select
            className="order-toolbar-status"
            aria-label={copy.orders.status}
            value={status}
            onChange={(event) => setStatus(event.target.value as OrderStatus | "all")}
          >
            <option value="all">{copy.orders.allStatus}</option>
            {Object.keys(copy.orderStatus).map((key) => (
              <option key={key} value={key}>{copy.orderStatus[key]}</option>
            ))}
          </select>
          <select
            className="order-toolbar-status"
            aria-label={b2.channelFilter}
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
          >
            <option value="all">{copy.orders.allChannels}</option>
            {listedChannels.map((id) => (
              <option key={id} value={id}>
                {labelChannel(locale, id, settings.channels)}
              </option>
            ))}
          </select>
          <select
            className="order-toolbar-status"
            aria-label={b2.affiliateFilter}
            value={affiliate}
            onChange={(event) => setAffiliate(event.target.value)}
          >
            <option value="all">{b2.allAffiliates}</option>
            {affiliates.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name} ({row.commissionPct}%)
              </option>
            ))}
          </select>
          <button
            type="button"
            className="cta-btn order-toolbar-add"
            onClick={openAdd}
          >
            <Plus className="size-4" />
            {copy.orders.add}
          </button>
        </div>
        <div className="order-toolbar-channels">
          {([["all", copy.orders.allChannels], ...listedChannels.map((item) => [item, labelChannel(locale, item, settings.channels)])] as [string, string][]).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setChannel(id)}
              className={cn("order-toolbar-chip", channel === id && "is-on")}
            >
              {copy.orders.channelChip(label, channelCounts.get(id) ?? 0)}
            </button>
          ))}
          <p className="order-toolbar-meta">
            {orderDateMeta(from, to, rows.length, copy.orders)}
          </p>
        </div>
      </section>

      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
        <table className="admin-table order-table">
          <thead>
            <tr>
              <th>{copy.orders.id}</th>
              <th>{copy.orders.customer}</th>
              <th>{copy.orders.channel}</th>
              <th>
                <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => toggleSort("time")}>
                  {copy.orders.time} {sortMark("time")}
                </button>
              </th>
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
                <td>
                  {order.customer}
                  <span className="block text-xs text-slate-500">{adminNation(locale, order.nationality)}</span>
                </td>
                <td><ChannelBadge channel={order.channel} /></td>
                <td>
                  {order.date}
                  <span className="block text-xs text-slate-500">{order.time}</span>
                </td>
                <td>{planLabel(order)}</td>
                <td className="u-mix">{order.riders}{copy.orders.mf(order.male, order.female)}</td>
                <td>{formatYenShort(order.totalJpy)}</td>
                <td>
                  <StatusSelect status={order.status} allowComplete={canCompleteOrder()} onChange={(next) => changeStatus(order.id, next)} />
                </td>
                <td className="order-ops-cell">
                  <OrderOps
                    order={order}
                    copy={copy}
                    onDetail={() => setDetail(order)}
                    onEdit={() => openEdit(order)}
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
              <div className="min-w-0">
                <p className="font-mono text-xs text-blue-600">{order.id}</p>
                <p className="mt-1 font-black break-words">{order.customer}</p>
                <p className="text-sm break-words text-slate-500">{order.date} {order.time} · {planLabel(order)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <ChannelBadge channel={order.channel} />
                <StatusSelect status={order.status} allowComplete={canCompleteOrder()} onChange={(next) => changeStatus(order.id, next)} />
              </div>
            </div>
            <div className="order-ops-mobile">
              <span className="text-sm">{formatYenShort(order.totalJpy)}</span>
              <OrderOps
                order={order}
                copy={copy}
                onDetail={() => setDetail(order)}
                onEdit={() => openEdit(order)}
                onRefund={() => setRefund(order)}
                onConfirm={() => changeStatus(order.id, "confirmed")}
              />
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(editing)}
        title={editingFromId ? copy.orders.editTitle : copy.orders.addTitle}
        onClose={() => {
          setEditing(null);
          setEditingFromId("");
        }}
        wide
        footer={
          <>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm"
              onClick={() => {
                setEditing(null);
                setEditingFromId("");
              }}
            >
              {copy.common.cancel}
            </button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => editing && save(editing)}>{copy.common.save}</button>
          </>
        }
      >
        {editing ? (
          <OrderEditFields
            order={editing}
            plans={plans}
            channelOptions={channelOptions}
            locale={locale}
            onChange={setEditing}
          />
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
            <p>
              {b2.affiliateField}：
              {(() => {
                const row = affiliates.find((item) => item.id === detail.affiliateId);
                return row ? `${row.name}（${row.commissionPct}%）` : b2.affiliateNone;
              })()}
            </p>
            <p>{copy.orders.status}：{adminOrderStatus(locale, detail.status)}</p>
            {detail.status === "cancelled" ? (
              <p>
                {b2.cancelKind}：{detail.cancelKind === "noshow" ? b2.noshow : b2.voluntary}
              </p>
            ) : null}
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-700">{b2.refundLog}</p>
              {(detail.refunds ?? []).length ? (
                <ul className="mt-2 space-y-1">
                  {(detail.refunds ?? []).map((item, index) => (
                    <li key={`${item.time}-${index}`}>
                      {item.time} · {item.note}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1">{b2.refundEmpty}</p>
              )}
            </div>
            <OrderDocs locale={locale} />
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(refund)}
        title={b2.refundAction}
        onClose={() => {
          setRefund(null);
          setRefundNote("");
        }}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => { setRefund(null); setRefundNote(""); }}>{copy.common.back}</button>
            <button
              type="button"
              className="rounded-full bg-slate-700 px-5 py-2.5 text-sm text-white"
              onClick={recordRefund}
            >
              {b2.refundAction}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-500">{b2.refundReserved}</p>
        <label className="admin-field mt-3">
          {b2.refundNote}
          <textarea className="admin-input min-h-20" value={refundNote} onChange={(event) => setRefundNote(event.target.value)} />
        </label>
      </Modal>

      <Modal
        open={Boolean(cancelTarget)}
        title={b2.cancelKind}
        onClose={() => setCancelTarget(null)}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setCancelTarget(null)}>{copy.common.back}</button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={confirmCancel}>{copy.common.save}</button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          {cancelTarget ? `${cancelTarget.id} · ${cancelTarget.customer}` : ""}
        </p>
        <label className="admin-field mt-3">
          {b2.cancelKind}
          <select className="admin-input" value={cancelKind} onChange={(event) => setCancelKind(event.target.value as OrderCancelKind)}>
            <option value="voluntary">{b2.voluntary}</option>
            <option value="noshow">{b2.noshow}</option>
          </select>
        </label>
      </Modal>
    </div>
  );
}
