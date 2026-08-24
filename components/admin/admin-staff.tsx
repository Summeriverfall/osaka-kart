"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { adminCopy, adminStaffRole, adminStoreName } from "@/lib/admin/copy";
import { type MockStaff, type StaffRole } from "@/lib/mock/staff";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";
import { useToastStore } from "@/stores/toast-store";

const BLANK: MockStaff = {
  id: "",
  name: "",
  email: "",
  role: "staff",
  store: "难波本店",
  storeId: "namba",
  active: true,
  lastLogin: "—",
};

export function AdminStaffView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { staff, stores, storeId, store } = useStoreData();
  const { upsertStaff, patchStaff } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockStaff | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; kind: "reset" | "off" } | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setEditing({ ...BLANK, id: `s-${Date.now()}`, store: store?.name ?? copy.nambaStore, storeId })}>{copy.staff.add}</button>
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{copy.staff.name}</th>
              <th>{copy.staff.email}</th>
              <th>{copy.staff.role}</th>
              <th>{copy.staff.store}</th>
              <th>{copy.staff.status}</th>
              <th>{copy.staff.lastLogin}</th>
              <th>{copy.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((item) => (
              <tr key={item.id} className={item.active ? "" : "opacity-50"}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{adminStaffRole(locale, item.role)}</td>
                <td>{adminStoreName(locale, item.storeId ?? "", item.store)}</td>
                <td>{item.active ? copy.staff.on : copy.staff.off}</td>
                <td>{item.lastLogin}</td>
                <td className="space-x-2">
                  <button type="button" className="text-xs text-blue-600" onClick={() => setEditing(item)}>{copy.common.edit}</button>
                  <button type="button" className="text-xs text-sky-600" onClick={() => setConfirm({ id: item.id, kind: "reset" })}>{copy.staff.reset}</button>
                  <button type="button" className="text-xs text-slate-500" onClick={() => setConfirm({ id: item.id, kind: "off" })}>{copy.staff.off}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {staff.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-black">{item.name}</p>
            <p className="text-sm text-slate-500">{adminStaffRole(locale, item.role)} · {adminStoreName(locale, item.storeId ?? "", item.store)}</p>
            <button type="button" className="mt-3 text-xs text-blue-600" onClick={() => setEditing(item)}>{copy.common.edit}</button>
          </article>
        ))}
      </div>

      <Modal open={Boolean(editing)} title={copy.staff.title} onClose={() => setEditing(null)} footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!editing) return; upsertStaff(editing); setEditing(null); notify(copy.staff.saved); }}>{copy.common.save}</button>}>
        {editing ? (
          <>
            <label className="admin-field">{copy.staff.name}<input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
            <label className="admin-field">{copy.staff.email}<input className="admin-input" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></label>
            <label className="admin-field">
              {copy.staff.role}
              <select className="admin-input" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as StaffRole })}>
                {Object.keys(copy.staffRole).map((key) => <option key={key} value={key}>{copy.staffRole[key]}</option>)}
              </select>
            </label>
            <label className="admin-field">
              {copy.staff.store}
              <select
                className="admin-input"
                value={editing.storeId ?? storeId}
                onChange={(e) => {
                  const next = stores.find((item) => item.id === e.target.value);
                  setEditing({ ...editing, storeId: e.target.value, store: next?.name ?? editing.store });
                }}
              >
                {stores.map((item) => <option key={item.id} value={item.id}>{adminStoreName(locale, item.id, item.name)}</option>)}
              </select>
            </label>
            <label className="admin-field">{copy.staff.password}<input className="admin-input" type="password" placeholder={copy.staff.passwordPh} /></label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>{copy.staff.on}</span>
              <NeonToggle checked={editing.active} onChange={(on) => setEditing({ ...editing, active: on })} />
            </div>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(confirm)}
        title={confirm?.kind === "reset" ? copy.staff.resetAsk : copy.staff.offAsk}
        onClose={() => setConfirm(null)}
        footer={
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => {
            if (!confirm) return;
            if (confirm.kind === "off") patchStaff(confirm.id, { active: false });
            notify(confirm.kind === "reset" ? copy.staff.resetOk : copy.staff.offOk);
            setConfirm(null);
          }}>{copy.common.confirm}</button>
        }
      >
        <p className="text-sm text-slate-500">{copy.staff.demo}</p>
      </Modal>
    </div>
  );
}
