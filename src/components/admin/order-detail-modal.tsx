"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ChannelBadge } from "@/components/admin/channel-badge";
import { OrderDocs } from "@/components/admin/order-docs";
import { OrderEditFields } from "@/components/admin/order-edit-fields";
import { StatusBadge } from "@/components/admin/status-badge";
import { Modal } from "@/components/ui/modal";
import { adminCopy, adminNation, adminOrderStatus, adminPlanName } from "@/lib/admin/copy";
import { liveChannelIds } from "@/lib/channel-options";
import { formatYenShort } from "@/lib/format";
import { type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import { sendStatusMail } from "@/lib/ops-notify";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

export function OrderDetailModal({
  orderId,
  onClose,
  onOrderIdChange,
}: {
  orderId: string | null;
  onClose: () => void;
  onOrderIdChange?: (id: string) => void;
}) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const order = useOpsStore((state) => (orderId ? state.orders.find((item) => item.id === orderId) : undefined));
  const plans = useOpsStore((state) => state.plans);
  const upsertOrder = useOpsStore((state) => state.upsertOrder);
  const setOrderStatus = useOpsStore((state) => state.setOrderStatus);
  const templates = useOpsStore((state) => state.templates);
  const settings = useOpsStore((state) => state.settings);
  const notify = useToastStore((state) => state.notify);
  const [draft, setDraft] = useState<MockOrder | null>(null);

  useEffect(() => {
    setDraft(null);
  }, [orderId]);

  const channelOptions = useMemo(
    () => liveChannelIds(settings.channels, draft?.channel ?? order?.channel),
    [settings.channels, draft?.channel, order?.channel],
  );

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
    if (saved.id !== fromId) onOrderIdChange?.(saved.id);
    if (prev && prev.status !== saved.status) {
      void sendStatusMail(saved.status, saved, templates, settings, locale).then(notify);
      return;
    }
    notify(copy.orders.saved);
  }

  const seed = order ? plans.find((item) => item.slug === order.planSlug) : undefined;
  const planName = order ? adminPlanName(locale, seed, order.planName) : "";

  return (
    <Modal
      open={Boolean(order)}
      title={order ? copy.orders.detailTitle(order.id) : ""}
      onClose={() => {
        setDraft(null);
        onClose();
      }}
      wide
      footer={
        draft && order ? (
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setDraft(null)}>
              {copy.common.cancel}
            </button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => save(draft, order.id)}>
              {copy.common.save}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={onClose}>
              {copy.common.close}
            </button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => order && setDraft({ ...order })}>
              {copy.common.edit}
            </button>
          </>
        )
      }
    >
      {order && draft ? (
        <OrderEditFields
          order={draft}
          plans={plans}
          channelOptions={channelOptions}
          locale={locale}
          onChange={setDraft}
        />
      ) : order ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-blue-600">{order.id}</p>
              <h3 className="mt-1 text-xl font-black text-slate-900">{order.customer}</h3>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <dl className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>{copy.orders.nationality}：{adminNation(locale, order.nationality)}</div>
            <div>{copy.orders.email}：{order.email}</div>
            <div>{copy.orders.phone}：{order.phone}</div>
            <div>{copy.orders.plan}：{planName}</div>
            <div>
              {copy.orders.date}：{order.date} {order.time}
            </div>
            <div>{copy.orders.passport}：{order.passport}</div>
            <div>
              {copy.orders.riders}：{order.riders}
              {copy.orders.mf(order.male, order.female)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {copy.orders.channel}：<ChannelBadge channel={order.channel} />
            </div>
            <div>
              {copy.orders.amount}：{formatYenShort(order.totalJpy)} · {order.paid ? copy.common.paid : copy.common.unpaid}
            </div>
            <div>
              {copy.orders.status}：{adminOrderStatus(locale, order.status)}
            </div>
            <div className="sm:col-span-2">{copy.orders.addons}：{order.addons.join("、") || copy.common.none}</div>
            <div className="sm:col-span-2">{copy.orders.note}：{order.note || "—"}</div>
          </dl>
          <OrderDocs locale={locale} />
          <div className="flex flex-wrap gap-2">
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
      ) : null}
    </Modal>
  );
}
