"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { downloadAffiliatePoster, downloadQrPng, POSTER_TEMPLATES } from "@/lib/affiliate-poster";
import { affiliateStats } from "@/lib/affiliate-stats";
import { b3Copy } from "@/lib/admin/b3-copy";
import { formatYenShort } from "@/lib/format";
import { AFFILIATE_DEMO_PASSWORD, blankAffiliate, generateAffiliateCode, type MockAffiliate } from "@/lib/mock/affiliates";
import { promoHref, qrImageSrc } from "@/lib/promo";
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

type SortKey = "name" | "email" | "phone" | "code" | "pct" | "orders" | "cut" | "status";
type StatusFilter = "all" | "active" | "paused";

function posterName(locale: string, id: string) {
  const row = POSTER_TEMPLATES.find((item) => item.id === id);
  if (!row) return id;
  if (locale.startsWith("ja")) return row.nameJa;
  if (locale.startsWith("en")) return row.nameEn;
  return row.name;
}

export function AdminAffiliatesView({ id }: { id?: string }) {
  const locale = useLocale();
  const copy = copyOf(locale);
  const b3 = b3Copy(locale);
  const go = useAdminNavStore((state) => state.go);
  const affiliates = useOpsStore((state) => state.affiliates);
  const orders = useOpsStore((state) => state.orders);
  const channels = useOpsStore((state) => state.settings.channels);
  const upsertAffiliate = useOpsStore((state) => state.upsertAffiliate);
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockAffiliate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("cut");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const current = id ? affiliates.find((item) => item.id === id) : undefined;

  const channelOptions = useMemo(() => {
    const ids = channels.map((item) => item.id);
    if (editing?.channel && !ids.includes(editing.channel)) ids.unshift(editing.channel);
    return ids;
  }, [channels, editing?.channel]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = affiliates.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      return [item.name, item.email, item.phone, item.code].some((field) => field.toLowerCase().includes(q));
    });
    return [...filtered].sort((a, b) => {
      const sa = affiliateStats(a, orders);
      const sb = affiliateStats(b, orders);
      const av =
        sortKey === "name"
          ? a.name
          : sortKey === "email"
            ? a.email
            : sortKey === "phone"
              ? a.phone
              : sortKey === "code"
                ? a.code
                : sortKey === "pct"
                  ? a.commissionPct
                  : sortKey === "orders"
                    ? sa.orderCount
                    : sortKey === "cut"
                      ? sa.cut
                      : a.status;
      const bv =
        sortKey === "name"
          ? b.name
          : sortKey === "email"
            ? b.email
            : sortKey === "phone"
              ? b.phone
              : sortKey === "code"
                ? b.code
                : sortKey === "pct"
                  ? b.commissionPct
                  : sortKey === "orders"
                    ? sb.orderCount
                    : sortKey === "cut"
                      ? sb.cut
                      : b.status;
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), locale);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [affiliates, orders, query, status, sortKey, sortDir, locale]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" || key === "email" || key === "phone" || key === "code" ? "asc" : "desc");
    }
  }

  function sortMark(key: SortKey) {
    if (sortKey !== key) return "↕";
    return sortDir === "desc" ? "↓" : "↑";
  }

  function save(row: MockAffiliate) {
    const code = row.code.trim().toUpperCase() || generateAffiliateCode(row.name || row.id);
    const next: MockAffiliate = {
      ...row,
      name: row.name.trim() || row.code.trim() || "Agent",
      email: row.email.trim(),
      phone: row.phone.trim(),
      password: row.password.trim() || AFFILIATE_DEMO_PASSWORD,
      code,
      commissionPct: Math.min(80, Math.max(0, Number(row.commissionPct) || 0)),
    };
    upsertAffiliate(next);
    setEditing(null);
    setIsNew(false);
    notify(copy.saved);
  }

  function openNew() {
    const row = blankAffiliate();
    row.code = generateAffiliateCode("AGENT");
    setIsNew(true);
    setEditing(row);
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      notify(b3.copied);
    } catch {
      notify(text);
    }
  }

  if (current) {
    const stats = affiliateStats(current, orders);
    const link = promoHref(current.code, locale);
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
                {current.code} · {current.email} · {current.phone} · {current.commissionPct}%
              </p>
            </div>
            <button type="button" className="text-sm text-blue-600" onClick={() => { setIsNew(false); setEditing(current); }}>
              {copy.edit}
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs tracking-wide text-slate-500 uppercase">{copy.info}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{current.note || "—"}</p>
              <p className="mt-3 text-xs text-slate-500">{copy.link}</p>
              <a className="mt-1 block break-all text-sm text-blue-600" href={link}>
                {link}
              </a>
              <button type="button" className="mt-2 text-xs text-blue-600" onClick={() => copyText(link)}>
                {b3.copyLink}
              </button>
            </article>
            <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs tracking-wide text-slate-500 uppercase">{copy.fees}</p>
              <p className="mt-2 text-3xl font-black">{formatYenShort(stats.cut)}</p>
              <p className="mt-1 text-sm text-slate-500">
                {stats.orderCount} {copy.orders} · {current.commissionPct}%
              </p>
            </article>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[160px_1fr]">
            <div>
              <p className="text-xs tracking-wide text-slate-500 uppercase">{b3.qr}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mt-2 size-40 rounded-xl border border-slate-200 bg-white p-2" src={qrImageSrc(link, 280)} alt={current.code} />
              <button type="button" className="mt-2 text-xs text-blue-600" onClick={() => downloadQrPng(current.code, link)}>
                {b3.downloadQr}
              </button>
            </div>
            <div>
              <p className="text-xs tracking-wide text-slate-500 uppercase">{b3.posters}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {POSTER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left text-sm hover:border-blue-400"
                    onClick={() =>
                      downloadAffiliatePoster({
                        template: tpl,
                        name: current.name,
                        code: current.code,
                        link,
                        cut: current.commissionPct,
                      })
                    }
                  >
                    <span className="block font-semibold">{posterName(locale, tpl.id)}</span>
                    <span className="mt-1 block text-xs text-slate-500">{tpl.hint}</span>
                    <span className="mt-2 block text-xs text-blue-600">{b3.posterDl}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled
                className="mt-3 w-full cursor-not-allowed rounded-xl border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-400"
              >
                {b3.posterCustom}
              </button>
              <p className="mt-1 text-xs leading-5 text-slate-400">{b3.posterCustomHint}</p>
            </div>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-black">{copy.orders}</h3>
          {stats.related.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">{copy.empty}</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {stats.related.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <span>
                    {order.date} · {order.customer} · {order.id}
                  </span>
                  <span className="font-semibold">
                    {formatYenShort(order.totalJpy)}
                    {order.status === "completed"
                      ? ` → ${formatYenShort((order.totalJpy * current.commissionPct) / 100)}`
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        {editing ? (
          <AffiliateEditor
            copy={copy}
            b3={b3}
            value={editing}
            isNew={isNew}
            channels={channelOptions}
            onClose={() => { setEditing(null); setIsNew(false); }}
            onSave={save}
            onChange={setEditing}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="order-toolbar">
        <div className="order-toolbar-main">
          <label className="order-toolbar-search">
            <Search />
            <input
              type="search"
              value={query}
              placeholder={b3.searchAffiliate}
              aria-label={b3.searchAffiliate}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <select
            className="order-toolbar-status"
            aria-label={copy.status}
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
          >
            <option value="all">{b3.statusAll}</option>
            <option value="active">{copy.on}</option>
            <option value="paused">{copy.off}</option>
          </select>
          <button type="button" className="cta-btn order-toolbar-add" onClick={openNew}>
            <Plus className="size-4" />
            {copy.add}
          </button>
        </div>
      </section>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              {([
                ["name", copy.name],
                ["email", b3.email],
                ["phone", b3.phone],
                ["code", copy.code],
                ["pct", copy.pct],
                ["orders", copy.orders],
                ["cut", b3.commission],
                ["status", copy.status],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th key={key}>
                  <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => toggleSort(key)}>
                    {label} {sortMark(key)}
                  </button>
                </th>
              ))}
              <th>{copy.open}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">{b3.emptyList}</td>
              </tr>
            ) : (
              rows.map((item) => {
                const stats = affiliateStats(item, orders);
                return (
                  <tr key={item.id} className={item.status === "active" ? "" : "opacity-50"}>
                    <td>{item.name}</td>
                    <td className="text-sm">{item.email}</td>
                    <td className="text-sm">{item.phone || "—"}</td>
                    <td className="font-mono text-xs">{item.code}</td>
                    <td>{item.commissionPct}%</td>
                    <td>{stats.orderCount}</td>
                    <td>{formatYenShort(stats.cut)}</td>
                    <td>{item.status === "active" ? copy.on : copy.off}</td>
                    <td className="space-x-2">
                      <button type="button" className="text-xs text-blue-600" onClick={() => { setIsNew(false); setEditing(item); }}>
                        {copy.edit}
                      </button>
                      <button type="button" className="text-xs text-sky-600" onClick={() => go(`/admin/affiliates/${item.id}`)}>
                        {copy.open}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {rows.length === 0 ? <p className="text-sm text-slate-500">{b3.emptyList}</p> : null}
        {rows.map((item) => {
          const stats = affiliateStats(item, orders);
          return (
            <article key={item.id} className={cn("rounded-2xl border border-slate-200 bg-white p-4", item.status !== "active" && "opacity-60")}>
              <p className="font-black">{item.name}</p>
              <p className="text-sm text-slate-500">
                {item.email} · {item.phone || "—"}
              </p>
              <p className="mt-1 text-sm">
                {item.code} · {item.commissionPct}% · {stats.orderCount} {copy.orders} · {formatYenShort(stats.cut)}
              </p>
              <div className="mt-3 flex gap-3">
                <button type="button" className="text-xs text-blue-600" onClick={() => { setIsNew(false); setEditing(item); }}>
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
          b3={b3}
          value={editing}
          isNew={isNew}
          channels={channelOptions}
          onClose={() => { setEditing(null); setIsNew(false); }}
          onSave={save}
          onChange={setEditing}
        />
      ) : null}
    </div>
  );
}

function AffiliateEditor({
  copy,
  b3,
  value,
  isNew,
  channels,
  onClose,
  onSave,
  onChange,
}: {
  copy: ReturnType<typeof copyOf>;
  b3: ReturnType<typeof b3Copy>;
  value: MockAffiliate;
  isNew: boolean;
  channels: string[];
  onClose: () => void;
  onSave: (row: MockAffiliate) => void;
  onChange: (row: MockAffiliate) => void;
}) {
  return (
    <Modal
      open
      title={value.name || copy.add}
      onClose={onClose}
      footer={
        <button type="button" className="cta-btn" onClick={() => onSave(value)}>
          {copy.save}
        </button>
      }
    >
      <label className="admin-field">
        {copy.name}
        <input
          className="admin-input"
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
        />
      </label>
      <label className="admin-field">
        {b3.email}
        <input className="admin-input" type="email" value={value.email} onChange={(event) => onChange({ ...value, email: event.target.value })} />
      </label>
      <label className="admin-field">
        {b3.phone}
        <input className="admin-input" value={value.phone} onChange={(event) => onChange({ ...value, phone: event.target.value })} />
      </label>
      <label className="admin-field">
        {b3.password}
        <input className="admin-input" value={value.password} onChange={(event) => onChange({ ...value, password: event.target.value })} />
        <span className="text-xs font-normal text-slate-400">{b3.passwordHint}</span>
      </label>
      <label className="admin-field">
        {copy.code}
        <input className="admin-input font-mono uppercase" value={value.code} readOnly={isNew} onChange={(event) => onChange({ ...value, code: event.target.value.toUpperCase() })} />
        {isNew ? <span className="text-xs font-normal text-slate-400">{b3.autoCode}</span> : null}
      </label>
      <label className="admin-field">
        {copy.channel}
        <select className="admin-input" value={value.channel} onChange={(event) => onChange({ ...value, channel: event.target.value })}>
          {channels.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        {copy.pct}
        <input type="number" min={0} max={80} className="admin-input" value={value.commissionPct} onChange={(event) => onChange({ ...value, commissionPct: Number(event.target.value) })} />
      </label>
      <label className="admin-field">
        {copy.status}
        <select className="admin-input" value={value.status} onChange={(event) => onChange({ ...value, status: event.target.value as MockAffiliate["status"] })}>
          <option value="active">{copy.on}</option>
          <option value="paused">{copy.off}</option>
        </select>
      </label>
      <label className="admin-field">
        {copy.note}
        <textarea className="admin-input min-h-24" value={value.note} onChange={(event) => onChange({ ...value, note: event.target.value })} />
      </label>
    </Modal>
  );
}
