"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { VEHICLE_STATUS_LABEL, type MockVehicle, type VehicleStatus } from "@/lib/mock/vehicles";
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
  const { vehicles, storeId } = useStoreData();
  const { upsertVehicle } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockVehicle | null>(null);
  const [logs, setLogs] = useState<MockVehicle | null>(null);
  const repair = vehicles.filter((item) => item.status === "repair").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-amber-800">维修中 {repair} 辆，已从当日可售库存扣除。</p>
        <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setEditing({ ...BLANK, id: `v-${Date.now()}`, storeId })}>添加车辆</button>
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>编号</th>
              <th>车型</th>
              <th>状态</th>
              <th>最后维护</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((item) => (
              <tr key={item.id} className={cn(item.status !== "available" && "opacity-60")}>
                <td className="font-mono">{item.code}</td>
                <td>{item.model}</td>
                <td>{VEHICLE_STATUS_LABEL[item.status]}</td>
                <td>{item.lastService}</td>
                <td>{item.note || "—"}</td>
                <td className="space-x-2">
                  <button type="button" className="text-xs text-blue-600" onClick={() => setEditing(item)}>编辑</button>
                  <button type="button" className="text-xs text-sky-600" onClick={() => setLogs(item)}>维修记录</button>
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
            <p className="text-sm text-slate-500">{VEHICLE_STATUS_LABEL[item.status]} · {item.lastService}</p>
            <button type="button" className="mt-3 text-xs text-blue-600" onClick={() => setEditing(item)}>编辑</button>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(editing)}
        title="车辆"
        onClose={() => setEditing(null)}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              if (!editing) return;
              upsertVehicle({ ...editing, storeId: editing.storeId || storeId });
              setEditing(null);
              notify("车辆已保存");
            }}
          >
            保存
          </button>
        }
      >
        {editing ? (
          <>
            <label className="admin-field">编号<input className="admin-input" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></label>
            <label className="admin-field">
              车型
              <select className="admin-input" value={editing.model} onChange={(e) => setEditing({ ...editing, model: e.target.value })}>
                <option>Street Kart S</option>
                <option>Street Kart Pro</option>
                <option>Street Kart Lite</option>
                <option>Street Kart GT</option>
                <option>Street Kart Mini</option>
              </select>
            </label>
            <label className="admin-field">
              状态
              <select className="admin-input" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as VehicleStatus })}>
                {Object.entries(VEHICLE_STATUS_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
            <label className="admin-field">备注<textarea className="admin-input min-h-20" value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></label>
          </>
        ) : null}
      </Modal>

      <Modal open={Boolean(logs)} title={logs ? `${logs.code} 维修记录` : ""} onClose={() => setLogs(null)} footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => setLogs(null)}>关闭</button>}>
        <ul className="space-y-2 text-sm text-slate-500">
          {(logs?.logs ?? []).map((item) => <li key={item} className="rounded-xl border border-slate-200 px-3 py-2">{item}</li>)}
        </ul>
      </Modal>
    </div>
  );
}
