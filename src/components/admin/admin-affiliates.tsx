"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { blankAffiliate, type MockAffiliate } from "@/lib/mock/affiliates";
import { formatYenShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

function copyOf(locale: string) {
  if (locale.startsWith("ja")) {
    return {
      add: "代理を追加",
      name: "名前",
      code: "コード",
      channel: "流入元",
      pct: "手数料%",
      status: "状態",
      on: "有効",
      off: "停止",
      orders: "予約",
      cut: "手数料",
      edit: "編集",
      open: "詳細",
      link: "紹介リンク",
      note: "メモ",
      save: "保存",
      saved: "保存しました",
      back: "一覧へ",
      empty: "この代理の予約はまだありません。",
      info: "紹介情報",
      fees: "手数料明細",
    };
  }
  if (locale.startsWith("en")) {
    return {
      add: "Add agent",
      name: "Name",
      code: "Code",
      channel: "Channel",
      pct: "Cut %",
      status: "Status",
      on: "Active",
      off: "Paused",
      orders: "Orders",
      cut: "Commission",
      edit: "Edit",
      open: "Open",
      link: "Promo link",
      note: "Notes",
      save: "Save",
      saved: "Saved",
      back: "Back to list",
      empty: "No bookings attributed to this agent yet.",
      info: "Promo details",
      fees: "Commission",
    };
  }
  return {
    add: "新增推广员",
    name: "姓名",
    code: "推广码",
    channel: "渠道",
    pct: "抽成 %",
    status: "状态",
    on: "启用",
    off: "停用",
    orders: "订单",
    cut: "抽成",
    edit: "编辑",
    open: "查看",
    link: "推广链接",
    note: "备注",
    save: "保存",
    saved: "已保存",
    back: "返回列表",
    empty: "这个推广员还没有带来订单。",
    info: "推广信息",
    fees: "抽成费用",
  };
}

function promoHref(code: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = `${base}/zh-TW/?ref=${encodeURIComponent(code)}`;
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

function statsOf(affiliate: MockAffiliate, orders: { channel: string; totalJpy: number; date: string; id: string; customer: string }[]) {
  const related = orders.filter((item) => item.channel === affiliate.channel);
  const cut = related.reduce((sum, item) => sum + (item.totalJpy * affiliate.commissionPct) / 100, 0);
  return { related, cut };
}

export function AdminAffiliatesView({ id }: { id?: string }) {
  const locale = useLocale();
  const copy = copyOf(locale);
  const go = useAdminNavStore((state) => state.go);
  const affiliates = useOpsStore((state) => state.affiliates);
  const orders = useOpsStore((state) => state.orders);
  const channels = useOpsStore((state) => state.settings.channels);
  const upsertAffiliate = useOpsStore((state) => state.upsertAffiliate);
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockAffiliate | null>(null);

  const current = id ? affiliates.find((item) => item.id === id) : undefined;

  const channelOptions = useMemo(() => {
    const ids = channels.map((item) => item.id);
    if (editing?.channel && !ids.includes(editing.channel)) ids.unshift(editing.channel);
    return ids;
  }, [channels, editing?.channel]);

  function save(row: MockAffiliate) {
    const next: MockAffiliate = {
      ...row,
      name: row.name.trim() || row.code.trim() || "Agent",
      code: row.code.trim().toUpperCase() || row.id.slice(-6).toUpperCase(),
      commissionPct: Math.min(80, Math.max(0, Number(row.commissionPct) || 0)),
    };
    upsertAffiliate(next);
    setEditing(null);
    notify(copy.saved);
  }

  if (current) {
    const { related, cut } = statsOf(current, orders);
    return (
      <div className="space-y-5">
        <button type="button" className="text-sm text-blue-600" onClick={() => go("/admin/affiliates")}>
          ← {copy.back}
        </button>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">{current.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {current.code} · {current.channel} · {current.commissionPct}%
              </p>
            </div>
            <button type="button" className="text-sm text-blue-600" onClick={() => setEditing(current)}>
              {copy.edit}
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs tracking-wide text-slate-500 uppercase">{copy.info}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{current.note || "—"}</p>
              <p className="mt-3 text-xs text-slate-500">{copy.link}</p>
              <a className="mt-1 block break-all text-sm text-blue-600" href={promoHref(current.code)}>
                {promoHref(current.code)}
              </a>
            </article>
            <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs tracking-wide text-slate-500 uppercase">{copy.fees}</p>
              <p className="mt-2 text-3xl font-black">{formatYenShort(cut)}</p>
              <p className="mt-1 text-sm text-slate-500">
                {related.length} {copy.orders} · {current.commissionPct}%
              </p>
            </article>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-black">{copy.orders}</h3>
          {related.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">{copy.empty}</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {related.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <span>
                    {order.date} · {order.customer} · {order.id}
                  </span>
                  <span className="font-semibold">
                    {formatYenShort(order.totalJpy)} → {formatYenShort((order.totalJpy * current.commissionPct) / 100)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        {editing ? (
          <AffiliateEditor
            copy={copy}
            value={editing}
            channels={channelOptions}
            onClose={() => setEditing(null)}
            onSave={save}
            onChange={setEditing}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className="cta-btn" onClick={() => setEditing(blankAffiliate())}>
          {copy.add}
        </button>
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{copy.name}</th>
              <th>{copy.code}</th>
              <th>{copy.channel}</th>
              <th>{copy.pct}</th>
              <th>{copy.orders}</th>
              <th>{copy.cut}</th>
              <th>{copy.status}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {affiliates.map((item) => {
              const { related, cut } = statsOf(item, orders);
              return (
                <tr key={item.id} className={item.status === "active" ? "" : "opacity-50"}>
                  <td>{item.name}</td>
                  <td className="font-mono text-xs">{item.code}</td>
                  <td>{item.channel}</td>
                  <td>{item.commissionPct}%</td>
                  <td>{related.length}</td>
                  <td>{formatYenShort(cut)}</td>
                  <td>{item.status === "active" ? copy.on : copy.off}</td>
                  <td className="space-x-2">
                    <button type="button" className="text-xs text-blue-600" onClick={() => setEditing(item)}>
                      {copy.edit}
                    </button>
                    <button type="button" className="text-xs text-sky-600" onClick={() => go(`/admin/affiliates/${item.id}`)}>
                      {copy.open}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {affiliates.map((item) => {
          const { related, cut } = statsOf(item, orders);
          return (
            <article key={item.id} className={cn("rounded-2xl border border-slate-200 bg-white p-4", item.status !== "active" && "opacity-60")}>
              <p className="font-black">{item.name}</p>
              <p className="text-sm text-slate-500">
                {item.code} · {item.channel} · {item.commissionPct}%
              </p>
              <p className="mt-1 text-sm">
                {related.length} {copy.orders} · {formatYenShort(cut)}
              </p>
              <div className="mt-3 flex gap-3">
                <button type="button" className="text-xs text-blue-600" onClick={() => setEditing(item)}>
                  {copy.edit}
                </button>
                <button type="button" className="text-xs text-sky-600" onClick={() => go(`/admin/affiliates/${item.id}`)}>
                  {copy.open}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {editing ? (
        <AffiliateEditor
          copy={copy}
          value={editing}
          channels={channelOptions}
          onClose={() => setEditing(null)}
          onSave={save}
          onChange={setEditing}
        />
      ) : null}
    </div>
  );
}

function AffiliateEditor({
  copy,
  value,
  channels,
  onClose,
  onSave,
  onChange,
}: {
  copy: ReturnType<typeof copyOf>;
  value: MockAffiliate;
  channels: string[];
  onClose: () => void;
  onSave: (row: MockAffiliate) => void;
  onChange: (row: MockAffiliate) => void;
}) {
  return (
    <Modal open title={value.name || copy.add} onClose={onClose} footer={
      <button type="button" className="cta-btn" onClick={() => onSave(value)}>
        {copy.save}
      </button>
    }>
      <label className="grid gap-1 text-sm text-white">
        {copy.name}
        <input className="rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} />
      </label>
      <label className="grid gap-1 text-sm text-white">
        {copy.code}
        <input className="rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={value.code} onChange={(event) => onChange({ ...value, code: event.target.value })} />
      </label>
      <label className="grid gap-1 text-sm text-white">
        {copy.channel}
        <select className="rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={value.channel} onChange={(event) => onChange({ ...value, channel: event.target.value })}>
          {channels.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm text-white">
        {copy.pct}
        <input type="number" min={0} max={80} className="rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={value.commissionPct} onChange={(event) => onChange({ ...value, commissionPct: Number(event.target.value) })} />
      </label>
      <label className="grid gap-1 text-sm text-white">
        {copy.status}
        <select className="rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={value.status} onChange={(event) => onChange({ ...value, status: event.target.value as MockAffiliate["status"] })}>
          <option value="active">{copy.on}</option>
          <option value="paused">{copy.off}</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm text-white">
        {copy.note}
        <textarea className="min-h-24 rounded-lg border border-white/15 bg-black/30 px-3 py-2" value={value.note} onChange={(event) => onChange({ ...value, note: event.target.value })} />
      </label>
    </Modal>
  );
}
