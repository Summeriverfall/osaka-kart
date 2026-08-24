"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { OrderDocs } from "@/components/admin/order-docs";
import { OrderEditFields } from "@/components/admin/order-edit-fields";
import { StatusBadge } from "@/components/admin/status-badge";
import { Modal } from "@/components/ui/modal";
import { adminChannel, adminCopy, adminNation, adminOrderStatus, adminPlanName } from "@/lib/admin/copy";
import { formatYenShort } from "@/lib/format";
import { CHANNELS, type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import { sendStatusMail } from "@/lib/ops-notify";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

export function AdminOrderDetailView({ id }: { id: string }) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const go = useAdminNavStore((state) => state.go);
  const order = useOpsStore((state) => {
    const match = state.orders.find((item) => item.id === id);
    if (match) return match;
    if (id === "demo") return state.orders[0];
    return undefined;
  });
  const plans = useOpsStore((state) => state.plans);
  const upsertOrder = useOpsStore((state) => state.upsertOrder);
  const setOrderStatus = useOpsStore((state) => state.setOrderStatus);
  const templates = useOpsStore((state) => state.templates);
  const settings = useOpsStore((state) => state.settings);
  const notify = useToastStore((state) => state.notify);
  const [draft, setDraft] = useState<MockOrder | null>(null);

  const channelOptions = useMemo(() => {
    const enabled = new Set((settings.channels ?? []).filter((item) => item.enabled).map((item) => item.id));
    if (!enabled.size) return CHANNELS;
    return CHANNELS.filter((item) => enabled.has(item) || item === (draft?.channel ?? order?.channel));
  }, [settings.channels, draft?.channel, order?.channel]);

  if (!order) {
    return <p className="text-sm text-slate-500">{copy.orders.empty}</p>;
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
        <div className="mt-6">
          <OrderDocs locale={locale} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setDraft({ ...order })}>
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
    </div>
  );
}
