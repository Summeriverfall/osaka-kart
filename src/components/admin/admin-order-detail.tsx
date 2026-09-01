"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { OrderDocs } from "@/components/admin/order-docs";
import { OrderEditFields } from "@/components/admin/order-edit-fields";
import { StatusBadge } from "@/components/admin/status-badge";
import { Modal } from "@/components/ui/modal";
import { adminCopy, adminNation, adminOrderStatus, adminPlanName } from "@/lib/admin/copy";
import { b2Copy } from "@/lib/admin/b2-copy";
import { useAdminAccess } from "@/lib/admin-access";
import { labelChannel, liveChannelIds } from "@/lib/channel-options";
import { formatYenShort } from "@/lib/format";
import { type MockOrder, type OrderCancelKind, type OrderStatus } from "@/lib/mock/orders";
import { sendStatusMail } from "@/lib/ops-notify";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

export function AdminOrderDetailView({ id }: { id: string }) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const { canCompleteOrder } = useAdminAccess();
  const go = useAdminNavStore((state) => state.go);
  const order = useOpsStore((state) => {
    const match = state.orders.find((item) => item.id === id);
    if (match) return match;
    if (id === "demo") return state.orders[0];
    return undefined;
  });
  const plans = useOpsStore((state) => state.plans);
  const affiliates = useOpsStore((state) => state.affiliates);
  const upsertOrder = useOpsStore((state) => state.upsertOrder);
  const patchOrder = useOpsStore((state) => state.patchOrder);
  const setOrderStatus = useOpsStore((state) => state.setOrderStatus);
  const templates = useOpsStore((state) => state.templates);
  const settings = useOpsStore((state) => state.settings);
  const notify = useToastStore((state) => state.notify);
  const [draft, setDraft] = useState<MockOrder | null>(null);
  const [refundNote, setRefundNote] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelKind, setCancelKind] = useState<OrderCancelKind>("voluntary");

  const channelOptions = useMemo(
    () => liveChannelIds(settings.channels, draft?.channel ?? order?.channel),
    [settings.channels, draft?.channel, order?.channel],
  );

  if (!order) {
    return (
      <div className="space-y-4">
        <button type="button" className="text-sm text-blue-600" onClick={() => go("/admin/orders")}>
          ← {copy.common.back}
        </button>
        <p className="text-sm text-slate-500">{copy.orders.empty}</p>
      </div>
    );
  }

  const seed = plans.find((item) => item.slug === order.planSlug);
  const planName = adminPlanName(locale, seed, order.planName);

  function save(next: MockOrder, fromId: string) {
    const id = next.id.trim() || fromId;
    const male = Math.max(0, next.male);
    const female = Math.max(0, next.female);
    const saved: MockOrder = {
      ...next,
      id,
      male,
      female,
      riders: male + female,
      time: next.time.slice(0, 5),
      totalJpy: Math.max(0, next.totalJpy),
    };
    const taken = useOpsStore.getState().orders.some((item) => item.id === saved.id && item.id !== fromId);
    if (taken) {
      notify(copy.orders.idTaken);
      return;
    }
    const prev = useOpsStore.getState().orders.find((item) => item.id === fromId);
    upsertOrder(saved, fromId);
    setDraft(null);
    if (saved.id !== fromId) go(`/admin/orders/${saved.id}`);
    if (prev && prev.status !== saved.status) {
      void sendStatusMail(saved.status, saved, templates, settings, locale).then(notify);
      return;
    }
    notify(copy.orders.saved);
  }

  return (
    <div className="space-y-4">
      <button type="button" className="text-sm text-blue-600" onClick={() => go("/admin/orders")}>
        ← {copy.common.back}
      </button>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-sm text-blue-600">{order.id}</p>
            <h2 className="mt-1 text-2xl font-black">{order.customer}</h2>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <dl className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div>{copy.orders.nationality}：{adminNation(locale, order.nationality)}</div>
          <div>{copy.orders.email}：{order.email}</div>
          <div>{copy.orders.phone}：{order.phone}</div>
          <div>{copy.orders.plan}：{planName}</div>
          <div>
            {copy.orders.date}：{order.date} {order.time}
          </div>
          <div>{copy.orders.passport}：{order.passport}</div>
          <div>{copy.orders.riders}：{order.riders}{copy.orders.mf(order.male, order.female)}</div>
          <div>{copy.orders.channel}：{labelChannel(locale, order.channel, settings.channels)}</div>
          <div>
            {b2.affiliateField}：
            {(() => {
              const row = affiliates.find((item) => item.id === order.affiliateId);
              return row ? `${row.name}（${row.commissionPct}%）` : b2.affiliateNone;
            })()}
          </div>
          <div>{copy.orders.amount}：{formatYenShort(order.totalJpy)} · {order.paid ? copy.common.paid : copy.common.unpaid}</div>
          <div className="sm:col-span-2">{copy.orders.addons}：{order.addons.join("、") || copy.common.none}</div>
          <div className="sm:col-span-2">{copy.orders.note}：{order.note || "—"}</div>
          {order.status === "cancelled" ? (
            <div className="sm:col-span-2">
              {b2.cancelKind}：{order.cancelKind === "noshow" ? b2.noshow : b2.voluntary}
            </div>
          ) : null}
        </dl>
        <div className="mt-6">
          <OrderDocs locale={locale} />
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">{b2.refundAction}</p>
          <p className="mt-1 text-xs text-slate-500">{b2.refundReserved}</p>
          {(order.refunds ?? []).length ? (
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {(order.refunds ?? []).map((item, index) => (
                <li key={`${item.time}-${index}`}>
                  {item.time} · {item.note}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-400">{b2.refundEmpty}</p>
          )}
          <label className="admin-field mt-3">
            {b2.refundNote}
            <textarea className="admin-input min-h-16" value={refundNote} onChange={(event) => setRefundNote(event.target.value)} />
          </label>
          <button
            type="button"
            className="mt-2 rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-blue-400"
            onClick={() => {
              const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
              patchOrder(order.id, {
                refunds: [...(order.refunds ?? []), { time: stamp, note: refundNote.trim() || b2.refundReserved }],
              });
              setRefundNote("");
              notify(b2.refundReserved);
            }}
          >
            {b2.refundAction}
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setDraft({ ...order })}>
            {copy.orders.editTitle}
          </button>
          {(["pending", "confirmed", "cancelled", "completed"] as OrderStatus[])
            .filter((status) => status !== "completed" || canCompleteOrder())
            .map((status) => (
            <button
              key={status}
              type="button"
              className="rounded-full border border-slate-200 px-3 py-2 text-xs hover:border-blue-400"
              onClick={() => {
                if (status === "completed" && !canCompleteOrder()) {
                  notify(b2.completeOnlyManager);
                  return;
                }
                if (status === "cancelled") {
                  setCancelKind(order.cancelKind ?? "voluntary");
                  setCancelOpen(true);
                  return;
                }
                setOrderStatus(order.id, status);
                void sendStatusMail(status, { ...order, status }, templates, settings, locale).then(notify);
              }}
            >
              {adminOrderStatus(locale, status)}
            </button>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(draft)}
        title={copy.orders.editTitle}
        onClose={() => setDraft(null)}
        wide
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setDraft(null)}>
              {copy.common.cancel}
            </button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => draft && save(draft, order.id)}>
              {copy.common.save}
            </button>
          </>
        }
      >
        {draft ? (
          <OrderEditFields
            order={draft}
            plans={plans}
            channelOptions={channelOptions}
            locale={locale}
            onChange={setDraft}
          />
        ) : null}
      </Modal>

      <Modal
        open={cancelOpen}
        title={b2.cancelKind}
        onClose={() => setCancelOpen(false)}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setCancelOpen(false)}>
              {copy.common.cancel}
            </button>
            <button
              type="button"
              className="cta-btn px-5 py-2.5"
              onClick={() => {
                setOrderStatus(order.id, "cancelled", { cancelKind });
                void sendStatusMail("cancelled", { ...order, status: "cancelled", cancelKind }, templates, settings, locale).then(notify);
                setCancelOpen(false);
              }}
            >
              {copy.common.save}
            </button>
          </>
        }
      >
        <label className="admin-field">
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
