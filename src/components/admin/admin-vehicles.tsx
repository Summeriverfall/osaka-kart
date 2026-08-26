"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { adminCopy, adminVehicleStatus } from "@/lib/admin/copy";
import { type MockVehicle, type VehicleStatus } from "@/lib/mock/vehicles";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";
import { useToastStore } from "@/stores/toast-store";

const BLANK: MockVehicle = {
  id: "",
  code: "",
  model: "Street Kart S",
  status: "available",
  lastService: "2026-08-20",
  note: "",
  logs: [],
  storeId: "namba",
};

export function AdminVehiclesView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { vehicles, storeId } = useStoreData();
  const { upsertVehicle } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockVehicle | null>(null);
  const [logs, setLogs] = useState<MockVehicle | null>(null);
  const repair = vehicles.filter((item) => item.status === "repair").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-amber-800">{copy.vehicles.repairNote(repair)}</p>
        <button type="button" className="cta-btn" onClick={() => setEditing({ ...BLANK, id: `v-${Date.now()}`, storeId })}>{copy.vehicles.add}</button>
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{copy.vehicles.code}</th>
              <th>{copy.vehicles.model}</th>
              <th>{copy.vehicles.status}</th>
              <th>{copy.vehicles.service}</th>
              <th>{copy.vehicles.note}</th>
              <th>{copy.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((item) => (
              <tr key={item.id} className={cn(item.status !== "available" && "opacity-60")}>
                <td className="font-mono">{item.code}</td>
                <td>{item.model}</td>
                <td>{adminVehicleStatus(locale, item.status)}</td>
                <td>{item.lastService}</td>
                <td>{item.note || "—"}</td>
                <td className="space-x-2">
                  <button type="button" className="text-xs text-blue-600" onClick={() => setEditing(item)}>{copy.common.edit}</button>
                  <button type="button" className="text-xs text-sky-600" onClick={() => setLogs(item)}>{copy.vehicles.logs}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {vehicles.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-mono text-blue-600">{item.code}</p>
            <p className="font-black">{item.model}</p>
            <p className="text-sm text-slate-500">{adminVehicleStatus(locale, item.status)} · {item.lastService}</p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              <button type="button" className="text-xs text-blue-600" onClick={() => setEditing(item)}>{copy.common.edit}</button>
              <button type="button" className="text-xs text-sky-600" onClick={() => setLogs(item)}>{copy.vehicles.logs}</button>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(editing)}
        title={copy.vehicles.title}
        onClose={() => setEditing(null)}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              if (!editing) return;
              upsertVehicle({ ...editing, storeId: editing.storeId || storeId });
              setEditing(null);
              notify(copy.vehicles.saved);
            }}
          >
            {copy.common.save}
          </button>
        }
      >
        {editing ? (
          <>
            <label className="admin-field">{copy.vehicles.code}<input className="admin-input" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></label>
            <label className="admin-field">
              {copy.vehicles.model}
              <select className="admin-input" value={editing.model} onChange={(e) => setEditing({ ...editing, model: e.target.value })}>
                <option>Street Kart S</option>
                <option>Street Kart Pro</option>
                <option>Street Kart Lite</option>
                <option>Street Kart GT</option>
                <option>Street Kart Mini</option>
              </select>
            </label>
            <label className="admin-field">
              {copy.vehicles.status}
              <select className="admin-input" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as VehicleStatus })}>
                {Object.keys(copy.vehicleStatus).map((key) => <option key={key} value={key}>{copy.vehicleStatus[key]}</option>)}
              </select>
            </label>
            <label className="admin-field">{copy.vehicles.note}<textarea className="admin-input min-h-20" value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          </>
        ) : null}
      </Modal>

      <Modal open={Boolean(logs)} title={logs ? copy.vehicles.logsTitle(logs.code) : ""} onClose={() => setLogs(null)} footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => setLogs(null)}>{copy.common.close}</button>}>
        <ul className="space-y-2 text-sm text-slate-500">
          {(logs?.logs ?? []).map((item) => <li key={item} className="rounded-xl border border-slate-200 px-3 py-2">{item}</li>)}
        </ul>
      </Modal>
    </div>
  );
}
