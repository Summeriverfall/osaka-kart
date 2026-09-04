"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { adminChannel, adminCopy } from "@/lib/admin/copy";
import { b3Copy } from "@/lib/admin/b3-copy";
import { isBuiltinChannel, isOfficialChannel } from "@/lib/channel-options";
import { type ChannelKind, type MockBookChannel } from "@/lib/mock/settings";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

type SortKey = "order" | "name" | "kind" | "contact" | "cut" | "status";
type StatusFilter = "all" | "on" | "off";

const KINDS: ChannelKind[] = ["ota", "hotel", "social", "direct", "other"];

function kindLabel(copy: ReturnType<typeof b3Copy>, kind?: ChannelKind) {
  if (kind === "ota") return copy.kindOta;
  if (kind === "hotel") return copy.kindHotel;
  if (kind === "social") return copy.kindSocial;
  if (kind === "direct") return copy.kindDirect;
  return copy.kindOther;
}

function displayName(locale: string, item: MockBookChannel) {
  if (isBuiltinChannel(item.id)) return adminChannel(locale, item.id);
  return item.name?.trim() || item.id;
}

function blankChannel(sort: number): MockBookChannel {
  return {
    id: `ch-${Date.now().toString(36)}`,
    name: "",
    kind: "other",
    contact: "",
    enabled: true,
    cut: 0,
    sort,
  };
}

function pinned(item: MockBookChannel) {
  return Boolean(item.locked || isOfficialChannel(item.id));
}

export function AdminChannelsView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b3 = b3Copy(locale);
  const settings = useOpsStore((state) => state.settings);
  const patchSettings = useOpsStore((state) => state.patchSettings);
  const notify = useToastStore((state) => state.notify);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ChannelKind | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("order");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [reorder, setReorder] = useState(false);
  const [editing, setEditing] = useState<MockBookChannel | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const channels = useMemo(() => settings.channels ?? [], [settings.channels]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = channels.filter((item) => {
      const name = displayName(locale, item).toLowerCase();
      const contact = (item.contact ?? "").toLowerCase();
      if (q && !name.includes(q) && !contact.includes(q)) return false;
      if (kind !== "all" && (item.kind ?? "other") !== kind) return false;
      if (status === "on" && !item.enabled) return false;
      if (status === "off" && item.enabled) return false;
      return true;
    });
    const indexed = filtered.map((item) => ({ item, index: channels.indexOf(item) }));
    indexed.sort((a, b) => {
      const pin = Number(pinned(a.item)) - Number(pinned(b.item));
      if (pin) return -pin;
      if (sortKey === "order") {
        return (a.item.sort ?? a.index) - (b.item.sort ?? b.index);
      }
      const av =
        sortKey === "name"
          ? displayName(locale, a.item)
          : sortKey === "kind"
            ? a.item.kind ?? "other"
            : sortKey === "contact"
              ? a.item.contact ?? ""
              : sortKey === "cut"
                ? a.item.cut
                : a.item.enabled
                  ? 1
                  : 0;
      const bv =
        sortKey === "name"
          ? displayName(locale, b.item)
          : sortKey === "kind"
            ? b.item.kind ?? "other"
            : sortKey === "contact"
              ? b.item.contact ?? ""
              : sortKey === "cut"
                ? b.item.cut
                : b.item.enabled
                  ? 1
                  : 0;
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), locale);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return indexed;
  }, [channels, query, kind, status, sortKey, sortDir, locale]);

  function toggleReorder() {
    setReorder((on) => {
      const next = !on;
      if (next) {
        setSortKey("order");
        setSortDir("asc");
      }
      return next;
    });
  }

  function toggleSort(key: SortKey) {
    if (reorder) return;
    if (key === "order") {
      setSortKey("order");
      setSortDir("asc");
      return;
    }
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "cut" ? "desc" : "asc");
    }
  }

  function sortMark(key: SortKey) {
    if (sortKey !== key) return "↕";
    if (key === "order") return "↑";
    return sortDir === "desc" ? "↓" : "↑";
  }

  function saveList(next: MockBookChannel[]) {
    patchSettings({
      channels: next.map((item, index) => ({
        ...item,
        locked: pinned(item),
        enabled: pinned(item) ? true : item.enabled,
        sort: pinned(item) ? 0 : index,
      })),
    });
  }

  function moveRow(id: string, dir: -1 | 1) {
    const locked = channels.filter((item) => pinned(item));
    const rest = channels.filter((item) => !pinned(item));
    const i = rest.findIndex((item) => item.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= rest.length) return;
    const next = [...rest];
    [next[i], next[j]] = [next[j], next[i]];
    saveList([...locked, ...next]);
    setSortKey("order");
  }

  function patchRow(index: number, patch: Partial<MockBookChannel>) {
    const current = channels[index];
    if (!current || pinned(current)) return;
    saveList(channels.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function saveEditor() {
    if (!editing) return;
    if (!isBuiltinChannel(editing.id) && !editing.name?.trim()) {
      notify(copy.settings.channelNameRequired);
      return;
    }
    const row: MockBookChannel = {
      ...editing,
      name: editing.name?.trim() || editing.id,
      contact: editing.contact?.trim() ?? "",
      cut: Math.min(1, Math.max(0, Number(editing.cut) || 0)),
      kind: editing.kind ?? "other",
      locked: pinned(editing),
      enabled: pinned(editing) ? true : editing.enabled,
    };
    if (editingIndex >= 0) {
      saveList(channels.map((item, i) => (i === editingIndex ? row : item)));
    } else {
      saveList([...channels, row]);
    }
    setEditing(null);
    setEditingIndex(-1);
    notify(copy.settings.channelSaved);
  }

  function removeRow(item: MockBookChannel) {
    if (pinned(item)) return;
    const removed = new Set(settings.removedChannelIds ?? []);
    if (isBuiltinChannel(item.id)) removed.add(item.id);
    patchSettings({
      channels: channels.filter((row) => row.id !== item.id),
      removedChannelIds: [...removed],
    });
  }

  function moveable(item: MockBookChannel) {
    if (!reorder || pinned(item) || sortKey !== "order") return { up: false, down: false };
    const rest = channels.filter((row) => !pinned(row));
    const i = rest.findIndex((row) => row.id === item.id);
    return { up: i > 0, down: i >= 0 && i < rest.length - 1 };
  }

  const nextSort = Math.max(0, ...channels.map((item) => item.sort ?? 0)) + 1;

  return (
    <div className="space-y-4">
      <section className="order-toolbar">
        <div className="order-toolbar-main">
          <label className="order-toolbar-search">
            <Search />
            <input
              type="search"
              value={query}
              placeholder={b3.searchChannel}
              aria-label={b3.searchChannel}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <select
            className="order-toolbar-status"
            aria-label={b3.channelKind}
            value={kind}
            onChange={(event) => setKind(event.target.value as ChannelKind | "all")}
          >
            <option value="all">{b3.kindAll}</option>
            {KINDS.map((id) => (
              <option key={id} value={id}>
                {kindLabel(b3, id)}
              </option>
            ))}
          </select>
          <select
            className="order-toolbar-status"
            aria-label={b3.channelStatus}
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
          >
            <option value="all">{copy.common.all}</option>
            <option value="on">{copy.settings.on}</option>
            <option value="off">{copy.settings.off}</option>
          </select>
          <button
            type="button"
            className={cn("channel-sort-btn", reorder && "is-on")}
            aria-pressed={reorder}
            aria-label={b3.reorder}
            onClick={toggleReorder}
          >
            {b3.reorder}
          </button>
          <button
            type="button"
            className="cta-btn order-toolbar-add"
            onClick={() => {
              setEditing(blankChannel(nextSort));
              setEditingIndex(-1);
            }}
          >
            <Plus className="size-4" />
            {copy.settings.addChannel}
          </button>
        </div>
      </section>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              {([
                ...(reorder ? [["order", b3.channelOrder] as [SortKey, string]] : []),
                ["name", copy.settings.channelName],
                ["kind", b3.channelKind],
                ["contact", b3.channelContact],
                ["cut", copy.settings.channelCut],
                ["status", b3.channelStatus],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th key={key}>
                  {reorder ? (
                    label
                  ) : (
                    <button type="button" className="inline-flex items-center gap-1 font-semibold" onClick={() => toggleSort(key)}>
                      {label} {sortMark(key)}
                    </button>
                  )}
                </th>
              ))}
              <th>{copy.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={reorder ? 7 : 6} className="py-8 text-center text-slate-500">{b3.emptyList}</td>
              </tr>
            ) : (
              rows.map(({ item, index }) => {
                const can = moveable(item);
                return (
                  <tr key={item.id} className={item.enabled ? "" : "opacity-50"}>
                    {reorder ? (
                      <td>
                        {pinned(item) ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : (
                          <span className="inline-flex gap-1">
                            <button
                              type="button"
                              className="rounded border border-slate-200 p-1 text-slate-600 disabled:opacity-30"
                              aria-label={b3.moveUp}
                              disabled={!can.up}
                              onClick={() => moveRow(item.id, -1)}
                            >
                              <ChevronUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              className="rounded border border-slate-200 p-1 text-slate-600 disabled:opacity-30"
                              aria-label={b3.moveDown}
                              disabled={!can.down}
                              onClick={() => moveRow(item.id, 1)}
                            >
                              <ChevronDown className="size-3.5" />
                            </button>
                          </span>
                        )}
                      </td>
                    ) : null}
                    <td className="font-semibold">{displayName(locale, item)}</td>
                    <td>{kindLabel(b3, item.kind)}</td>
                    <td>{item.contact || "—"}</td>
                    <td>{Number((item.cut * 100).toFixed(1))}%</td>
                    <td>
                      {pinned(item) ? (
                        <span className="text-xs text-slate-500">{copy.settings.channelLocked}</span>
                      ) : (
                        <span className={item.enabled ? "text-xs text-emerald-600" : "text-xs text-slate-500"}>
                          {item.enabled ? copy.settings.on : copy.settings.off}
                        </span>
                      )}
                    </td>
                    <td className="space-x-2">
                      <button type="button" className="text-xs text-blue-600" onClick={() => { setEditing({ ...item }); setEditingIndex(index); }}>
                        {copy.common.edit}
                      </button>
                      {pinned(item) ? null : (
                        <button type="button" className="text-xs text-rose-600" onClick={() => removeRow(item)}>
                          {copy.settings.removeChannel}
                        </button>
                      )}
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
        {rows.map(({ item, index }) => {
          const can = moveable(item);
          return (
            <article key={item.id} className={cn("rounded-2xl border border-slate-200 bg-white p-4", !item.enabled && "opacity-60")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black">{displayName(locale, item)}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {kindLabel(b3, item.kind)} · {item.contact || "—"} · {Number((item.cut * 100).toFixed(1))}%
                  </p>
                </div>
                {pinned(item) ? null : (
                  <NeonToggle checked={item.enabled} onChange={(on) => patchRow(index, { enabled: on })} />
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {reorder && !pinned(item) ? (
                  <>
                    <button type="button" className="text-xs text-slate-600 disabled:opacity-30" disabled={!can.up} onClick={() => moveRow(item.id, -1)}>
                      {b3.moveUp}
                    </button>
                    <button type="button" className="text-xs text-slate-600 disabled:opacity-30" disabled={!can.down} onClick={() => moveRow(item.id, 1)}>
                      {b3.moveDown}
                    </button>
                  </>
                ) : null}
                <button type="button" className="text-xs text-blue-600" onClick={() => { setEditing({ ...item }); setEditingIndex(index); }}>
                  {copy.common.edit}
                </button>
                {pinned(item) ? null : (
                  <button type="button" className="text-xs text-rose-600" onClick={() => removeRow(item)}>
                    {copy.settings.removeChannel}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <Modal
        open={Boolean(editing)}
        title={editingIndex >= 0 ? b3.editChannel : copy.settings.addChannel}
        onClose={() => { setEditing(null); setEditingIndex(-1); }}
        footer={
          <button type="button" className="cta-btn" onClick={saveEditor}>
            {copy.settings.saveChannels}
          </button>
        }
      >
        {editing ? (
          <>
            <label className="admin-field">
              {copy.settings.channelName}
              <input
                className="admin-input"
                value={isBuiltinChannel(editing.id) ? displayName(locale, editing) : (editing.name ?? "")}
                disabled={isBuiltinChannel(editing.id)}
                placeholder={copy.settings.channelNamePh}
                onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              />
            </label>
            <label className="admin-field">
              {b3.channelKind}
              <select
                className="admin-input"
                value={editing.kind ?? "other"}
                disabled={pinned(editing)}
                onChange={(event) => setEditing({ ...editing, kind: event.target.value as ChannelKind })}
              >
                {KINDS.map((id) => (
                  <option key={id} value={id}>{kindLabel(b3, id)}</option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              {b3.channelContact}
              <input
                className="admin-input"
                value={editing.contact ?? ""}
                onChange={(event) => setEditing({ ...editing, contact: event.target.value })}
              />
            </label>
            <label className="admin-field">
              {copy.settings.channelCut}
              <input
                className="admin-input"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={Number((editing.cut * 100).toFixed(1))}
                onChange={(event) => {
                  const pct = Math.min(100, Math.max(0, Number(event.target.value) || 0));
                  setEditing({ ...editing, cut: pct / 100 });
                }}
              />
            </label>
            {pinned(editing) ? (
              <p className="text-sm text-slate-500">{copy.settings.channelLocked}</p>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span>{copy.settings.on}</span>
                <NeonToggle checked={editing.enabled} onChange={(on) => setEditing({ ...editing, enabled: on })} />
              </div>
            )}
          </>
        ) : null}
      </Modal>
    </div>
  );
}
