"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { formatYenShort } from "@/lib/format";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/mock/orders";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

export function AdminOrderDetailView({ id }: { id: string }) {
  const order = useOpsStore((state) => {
    const match = state.orders.find((item) => item.id === id);
    if (match) return match;
    if (id === "demo") return state.orders[0];
    return undefined;
  });
  const patchOrder = useOpsStore((state) => state.patchOrder);
  const notify = useToastStore((state) => state.notify);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(order?.note ?? "");

  if (!order) {
    return <p className="text-sm text-slate-500">找不到这笔订单。它可能是新加的动态单，请从列表里用弹窗查看。</p>;
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
          <div>国籍：{order.nationality}</div>
          <div>邮箱：{order.email}</div>
          <div>电话：{order.phone}</div>
          <div>套餐：{order.planName}</div>
          <div>
            日期：{order.date} {order.time}
          </div>
          <div>证件：{order.passport}</div>
          <div>人数：{order.riders}（{order.male}男/{order.female}女）</div>
          <div>渠道：{order.channel}</div>
          <div>金额：{formatYenShort(order.totalJpy)} · {order.paid ? "已支付" : "未支付"}</div>
          <div className="sm:col-span-2">附加项：{order.addons.join("、") || "无"}</div>
          <div className="sm:col-span-2">备注：{order.note || "—"}</div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setOpen(true)}>
            编辑订单
          </button>
          {(["pending", "confirmed", "cancelled", "completed"] as OrderStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              className="rounded-full border border-slate-200 px-3 py-2 text-xs hover:border-blue-400"
              onClick={() => {
                patchOrder(order.id, { status });
                notify(`已改为${ORDER_STATUS_LABEL[status]}`);
              }}
            >
              {ORDER_STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        title="编辑订单"
        onClose={() => setOpen(false)}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              patchOrder(order.id, { note });
              setOpen(false);
              notify("订单已保存");
            }}
          >
            保存
          </button>
        }
      >
        <label className="admin-field">
          备注
          <textarea className="admin-input min-h-28" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm">已到店确认</span>
          <NeonToggle
            checked={order.status === "confirmed" || order.status === "completed"}
            onChange={(on) => patchOrder(order.id, { status: on ? "confirmed" : "pending" })}
          />
        </div>
      </Modal>
    </div>
  );
}
