"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { StatusBadge } from "@/components/admin/status-badge";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { adminChannel, adminCopy, adminNation, adminOrderStatus, adminPlanName } from "@/lib/admin/copy";
import { formatYenShort } from "@/lib/format";
import { type OrderStatus } from "@/lib/mock/orders";
import { sendStatusMail } from "@/lib/ops-notify";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

export function AdminOrderDetailView({ id }: { id: string }) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const order = useOpsStore((state) => {
    const match = state.orders.find((item) => item.id === id);
    if (match) return match;
    if (id === "demo") return state.orders[0];
    return undefined;
  });
  const plans = useOpsStore((state) => state.plans);
  const patchOrder = useOpsStore((state) => state.patchOrder);
  const setOrderStatus = useOpsStore((state) => state.setOrderStatus);
  const templates = useOpsStore((state) => state.templates);
  const settings = useOpsStore((state) => state.settings);
  const notify = useToastStore((state) => state.notify);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(order?.note ?? "");

  if (!order) {
    return <p className="text-sm text-slate-500">{copy.orders.empty}</p>;
  }

  const seed = plans.find((item) => item.slug === order.planSlug);
  const planName = adminPlanName(locale, seed, order.planName);

  return (
    <div className="space-y-4">
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
          <div>{copy.orders.channel}：{adminChannel(locale, order.channel)}</div>
          <div>{copy.orders.amount}：{formatYenShort(order.totalJpy)} · {order.paid ? copy.common.paid : copy.common.unpaid}</div>
          <div className="sm:col-span-2">{copy.orders.addons}：{order.addons.join("、") || copy.common.none}</div>
          <div className="sm:col-span-2">{copy.orders.note}：{order.note || "—"}</div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setOpen(true)}>
            {copy.orders.editTitle}
          </button>
          {(["pending", "confirmed", "cancelled", "completed"] as OrderStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              className="rounded-full border border-slate-200 px-3 py-2 text-xs hover:border-blue-400"
              onClick={() => {
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
        open={open}
        title={copy.orders.editTitle}
        onClose={() => setOpen(false)}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              patchOrder(order.id, { note });
              setOpen(false);
              notify(copy.orders.saved);
            }}
          >
            {copy.common.save}
          </button>
        }
      >
        <label className="admin-field">
          {copy.orders.note}
          <textarea className="admin-input min-h-28" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm">{copy.orderStatus.confirmed}</span>
          <NeonToggle
            checked={order.status === "confirmed" || order.status === "completed"}
            onChange={(on) => {
              const status = on ? "confirmed" : "pending";
              setOrderStatus(order.id, status);
              void sendStatusMail(status, { ...order, status }, templates, settings, locale).then(notify);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
