"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { BOOKING_SLOTS } from "@/lib/booking/slots";
import { VEHICLE_STATUS_LABEL, type MockVehicle, type VehicleStatus } from "@/lib/mock/vehicles";
import {
  addIsoDays,
  mergeSlotGroups,
  occupancyTone,
  timelineTicks,
  type OccupancyTone,
  type VehicleSlotCell,
} from "@/lib/mock/vehicle-timeline";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

const TICKS = timelineTicks();
const TODAY = "2026-08-20";

type EditTarget = {
  vehicleId: string;
  time: string;
  range: string;
  capacity: number;
  booked: number;
  closed: boolean;
};

function cellKey(vehicleId: string, time: string) {
  return `${vehicleId}__${time}`;
}

function toneLabel(tone: OccupancyTone) {
  if (tone === "free") return "宽松";
  if (tone === "tight") return "紧张";
  if (tone === "full") return "爆满";
  return "休";
}

export function InventoryTimeline() {
  const {
    vehicles,
    vehicleSlots,
    specialDates,
    addSpecialDate,
    patchVehicleSlot,
    batchPatchVehicleSlots,
    clearDayInventory,
    resetDayInventory,
  } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [picked, setPicked] = useState(TODAY);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VehicleStatus | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [specialOpen, setSpecialOpen] = useState(false);
  const [specialForm, setSpecialForm] = useState({ date: "2026-08-26", label: "", closed: true });
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [edit, setEdit] = useState<EditTarget | null>(null);
  const [batch, setBatch] = useState<{ keys: string[] } | null>(null);
  const [confirm, setConfirm] = useState<"clear" | "reset" | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; cell: VehicleSlotCell; vehicle: MockVehicle; range: string } | null>(null);
  const [drag, setDrag] = useState<{
    startV: number;
    startS: number;
    endV: number;
    endS: number;
    moved: boolean;
  } | null>(null);

  const rows = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (status !== "all" && vehicle.status !== status) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return `${vehicle.code} ${vehicle.model}`.toLowerCase().includes(q);
    });
  }, [vehicles, query, status]);

  const dayCells = useMemo(() => {
    const map = new Map<string, VehicleSlotCell>();
    for (const cell of vehicleSlots) {
      if (cell.date !== picked) continue;
      map.set(cellKey(cell.vehicleId, cell.time), cell);
    }
    return map;
  }, [vehicleSlots, picked]);

  function cellOf(vehicleId: string, time: string) {
    return dayCells.get(cellKey(vehicleId, time));
  }

  function selectedKeys() {
    if (!drag) return new Set<string>();
    const v0 = Math.min(drag.startV, drag.endV);
    const v1 = Math.max(drag.startV, drag.endV);
    const s0 = Math.min(drag.startS, drag.endS);
    const s1 = Math.max(drag.startS, drag.endS);
    const keys = new Set<string>();
    for (let v = v0; v <= v1; v += 1) {
      for (let s = s0; s <= s1; s += 1) {
        const vehicle = rows[v];
        const time = BOOKING_SLOTS[s];
        if (vehicle && time) keys.add(cellKey(vehicle.id, time));
      }
    }
    return keys;
  }

  const selected = selectedKeys();

  function openEditor(vehicleId: string, time: string, range: string) {
    const cell = cellOf(vehicleId, time);
    if (!cell) return;
    setEdit({
      vehicleId,
      time,
      range,
      capacity: cell.capacity,
      booked: cell.booked,
      closed: cell.closed,
    });
  }

  function finishDrag() {
    if (!drag) return;
    const keys = [...selectedKeys()];
    const moved = drag.moved && keys.length > 1;
    const startVehicle = rows[drag.startV];
    const startTime = BOOKING_SLOTS[drag.startS];
    setDrag(null);
    if (moved) {
      setBatch({ keys });
      return;
    }
    if (startVehicle && startTime) openEditor(startVehicle.id, startTime, startTime);
  }

  function renderBlocks(vehicle: MockVehicle, vehicleIndex: number) {
    const cells = BOOKING_SLOTS.map((time) => {
      return (
        cellOf(vehicle.id, time) ?? {
          vehicleId: vehicle.id,
          date: picked,
          time,
          capacity: 2,
          booked: 0,
          remaining: 2,
          closed: false,
          customers: [],
        }
      );
    });
    const groups = mergeSlotGroups(cells);
    const leading = TICKS.filter((tick) => tick < "10:00").map((tick) => <div key={tick} className="ib-cell" />);
    return [
      ...leading,
      ...groups.map((group) => {
        const on = BOOKING_SLOTS.slice(group.startSlotIndex, group.endSlotIndex + 1).some((time) =>
          selected.has(cellKey(vehicle.id, time)),
        );
        const range = group.startTime === group.endTime ? group.startTime : `${group.startTime}–${group.endTime}`;
        return (
          <div key={`${vehicle.id}-${group.startTime}`} className="ib-cell" style={{ gridColumn: `span ${group.tickSpan}` }}>
            <button
              type="button"
              className={cn("ib-block", group.tone, on && "is-on")}
              onMouseDown={(event) => {
                event.preventDefault();
                setDrag({
                  startV: vehicleIndex,
                  startS: group.startSlotIndex,
                  endV: vehicleIndex,
                  endS: group.endSlotIndex,
                  moved: false,
                });
              }}
              onMouseEnter={(event) => {
                setDrag((current) =>
                  current
                    ? { ...current, endV: vehicleIndex, endS: group.endSlotIndex, moved: true }
                    : current,
                );
                setTip({ x: event.clientX + 14, y: event.clientY + 14, cell: group.cell, vehicle, range });
              }}
              onMouseMove={(event) => {
                setTip((current) =>
                  current ? { ...current, x: event.clientX + 14, y: event.clientY + 14, cell: group.cell, vehicle, range } : current,
                );
              }}
              onMouseLeave={() => setTip(null)}
            >
              {group.tone === "idle" ? "休" : `剩 ${group.cell.remaining}/${group.cell.capacity}`}
            </button>
          </div>
        );
      }),
    ];
  }

  const filterActive = Boolean(query.trim()) || status !== "all";

  return (
    <section className="inventory-board" onMouseUp={finishDrag} onMouseLeave={() => drag && finishDrag()}>
      <div className="inventory-toolbar">
        <button type="button" className={cn("ib-btn", picked === addIsoDays(TODAY, -1) && "is-on")} onClick={() => setPicked(addIsoDays(TODAY, -1))}>昨</button>
        <button type="button" className={cn("ib-btn", picked === TODAY && "is-on")} onClick={() => setPicked(TODAY)}>今</button>
        <button type="button" className={cn("ib-btn", picked === addIsoDays(TODAY, 1) && "is-on")} onClick={() => setPicked(addIsoDays(TODAY, 1))}>明</button>
        <input className="ib-input" type="date" value={picked} onChange={(event) => setPicked(event.target.value)} />
        <div className="ib-filter">
          <button
            type="button"
            className={cn("ib-btn", (filterOpen || filterActive) && "is-on")}
            onClick={() => setFilterOpen((open) => !open)}
          >
            筛选{filterActive ? " · 已筛" : ""}
          </button>
          {filterOpen ? (
            <>
              <button type="button" className="ib-filter-mask" aria-label="关闭筛选" onClick={() => setFilterOpen(false)} />
              <div className="ib-filter-panel">
                <input
                  className="ib-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="车辆编号 / 车型"
                />
                <select className="ib-select" value={status} onChange={(event) => setStatus(event.target.value as VehicleStatus | "all")}>
                  <option value="all">全部状态</option>
                  <option value="available">空闲/可用</option>
                  <option value="repair">维修</option>
                  <option value="retired">停驶</option>
                </select>
              </div>
            </>
          ) : null}
        </div>
        <span className="ib-toolbar-spacer" />
        <button type="button" className="ib-btn" onClick={() => setSpecialOpen(true)}>特殊日期</button>
        <button type="button" className="ib-btn ib-btn-ghost" onClick={() => setConfirm("clear")}>一键清空今日库存</button>
        <button type="button" className="ib-btn" onClick={() => setConfirm("reset")}>恢复默认库存</button>
      </div>

      <div className="inventory-scroller hidden md:block">
          <div className="inventory-grid">
            <div className="inventory-axis">
              <div className="ib-sticky">车辆</div>
              {TICKS.map((tick) => (
                <span key={tick}>{tick.endsWith(":00") ? tick : ""}</span>
              ))}
            </div>
            {rows.map((vehicle, vehicleIndex) => (
              <div key={vehicle.id} className="inventory-row">
                <div className="ib-sticky">
                  <p className="ib-code">
                    <i className={cn("ib-dot", vehicle.status === "available" ? "ok" : vehicle.status === "repair" ? "repair" : "off")} />
                    {vehicle.code}
                  </p>
                  <p className="ib-model">{VEHICLE_STATUS_LABEL[vehicle.status]} · {vehicle.model}</p>
                </div>
                {renderBlocks(vehicle, vehicleIndex)}
              </div>
            ))}
          </div>
      </div>

      <div className="space-y-2 p-3 md:hidden">
        {rows.map((vehicle, vehicleIndex) => {
          const open = openIds.includes(vehicle.id);
          return (
            <article key={vehicle.id} className="ib-mobile-card">
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-3 text-left"
                onClick={() =>
                  setOpenIds((current) =>
                    current.includes(vehicle.id) ? current.filter((id) => id !== vehicle.id) : [...current, vehicle.id],
                  )
                }
              >
                <span>
                  <b className="ib-code">
                    <i className={cn("ib-dot", vehicle.status === "available" ? "ok" : vehicle.status === "repair" ? "repair" : "off")} />
                    {vehicle.code}
                  </b>
                  <span className="ml-2 text-xs text-slate-500">{VEHICLE_STATUS_LABEL[vehicle.status]}</span>
                </span>
                <span className="text-xs text-slate-500">{open ? "收起" : "展开"}</span>
              </button>
              {open ? (
                <div className="ib-mobile-scroll pb-3">
                  <div className="inventory-grid">
                    <div className="inventory-axis">
                      <div className="ib-sticky">车辆</div>
                      {TICKS.map((tick) => (
                        <span key={tick}>{tick.endsWith(":00") ? tick : ""}</span>
                      ))}
                    </div>
                    <div className="inventory-row">
                      <div className="ib-sticky">
                        <p className="ib-code">{vehicle.code}</p>
                      </div>
                      {renderBlocks(vehicle, vehicleIndex)}
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="inventory-legend">
        <span><i className="free" />宽松</span>
        <span><i className="tight" />紧张</span>
        <span><i className="full" />爆满</span>
        <span><i className="idle" />维修 / 停驶</span>
        <span>相邻同状态会合并成长条，可拖拽批量修改</span>
      </div>

      {tip ? (
        <div className="ib-tip" style={{ left: tip.x, top: tip.y }}>
          <p>{tip.vehicle.code} · {tip.range}</p>
          <p>总座位 {tip.cell.capacity} · 已订 {tip.cell.booked} · 剩余 {tip.cell.remaining}（{toneLabel(occupancyTone(tip.cell))}）</p>
          <p>{tip.cell.closed ? "状态：维修 / 停驶" : `客人：${tip.cell.customers.join("、") || "暂无"}`}</p>
        </div>
      ) : null}

      <Modal
        open={Boolean(edit)}
        title={edit ? `编辑库存 · ${vehicles.find((item) => item.id === edit.vehicleId)?.code ?? ""}` : ""}
        onClose={() => setEdit(null)}
        footer={
          <div className="ib-form-actions">
            <button type="button" className="ib-office-btn" onClick={() => setEdit(null)}>取消</button>
            <button
              type="button"
              className="ib-office-btn primary"
              onClick={() => {
                if (!edit) return;
                patchVehicleSlot(edit.vehicleId, picked, edit.time, {
                  capacity: edit.capacity,
                  booked: edit.booked,
                  closed: edit.closed,
                  customers: edit.closed ? [] : cellOf(edit.vehicleId, edit.time)?.customers ?? [],
                });
                setEdit(null);
                notify("保存成功");
              }}
            >
              保存
            </button>
          </div>
        }
      >
        {edit ? (
          <div className="ib-form">
            <label className="admin-field">时段<input className="admin-input" value={edit.range} readOnly /></label>
            <label className="admin-field">
              总座位数
              <input className="admin-input" type="number" min={1} value={edit.capacity} onChange={(event) => setEdit({ ...edit, capacity: Number(event.target.value) })} />
            </label>
            <label className="admin-field">
              已预订数
              <input className="admin-input" type="number" min={0} value={edit.booked} onChange={(event) => setEdit({ ...edit, booked: Number(event.target.value) })} />
            </label>
            <label className="admin-field">
              状态
              <select className="admin-input" value={edit.closed ? "closed" : "open"} onChange={(event) => setEdit({ ...edit, closed: event.target.value === "closed" })}>
                <option value="open">可预订</option>
                <option value="closed">维修 / 停驶</option>
              </select>
            </label>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(batch)}
        title={`批量修改 ${batch?.keys.length ?? 0} 个时段`}
        onClose={() => setBatch(null)}
        footer={
          <div className="ib-form-actions">
            <button type="button" className="ib-office-btn" onClick={() => setBatch(null)}>取消</button>
            <button
              type="button"
              className="ib-office-btn"
              onClick={() => {
                if (!batch) return;
                batchPatchVehicleSlots(
                  picked,
                  batch.keys.map((key) => {
                    const [vehicleId, time] = key.split("__");
                    return { vehicleId, time };
                  }),
                  { closed: true, booked: 0 },
                );
                setBatch(null);
                notify("保存成功");
              }}
            >
              设为维修
            </button>
            <button
              type="button"
              className="ib-office-btn primary"
              onClick={() => {
                if (!batch) return;
                batchPatchVehicleSlots(
                  picked,
                  batch.keys.map((key) => {
                    const [vehicleId, time] = key.split("__");
                    return { vehicleId, time };
                  }),
                  { closed: false, booked: 0 },
                );
                setBatch(null);
                notify("保存成功");
              }}
            >
              恢复可订
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-500">已选中连续时段，可统一设为维修或恢复可订。</p>
      </Modal>

      <Modal
        open={Boolean(confirm)}
        title={confirm === "clear" ? "确认清空今日库存？" : "确认恢复默认库存？"}
        onClose={() => setConfirm(null)}
        footer={
          <div className="ib-form-actions">
            <button type="button" className="ib-office-btn" onClick={() => setConfirm(null)}>取消</button>
            <button
              type="button"
              className={confirm === "clear" ? "ib-office-btn danger" : "ib-office-btn primary"}
              onClick={() => {
                if (confirm === "clear") clearDayInventory(picked);
                if (confirm === "reset") resetDayInventory(picked);
                setConfirm(null);
                notify("保存成功");
              }}
            >
              {confirm === "clear" ? "确认清空" : "确认恢复"}
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-500">
          {confirm === "clear"
            ? "此操作会把当日所有车辆时段标为已满，无法继续预订。请确认后再执行。"
            : "将按当前车辆状态和订单重新生成当日时间轴。"}
        </p>
      </Modal>

      {specialOpen ? (
        <>
          <button type="button" className="ib-drawer-mask" aria-label="关闭特殊日期" onClick={() => setSpecialOpen(false)} />
          <aside className="ib-drawer">
            <div className="ib-drawer-head">
              <h2 className="text-base font-semibold">特殊日期</h2>
              <button type="button" className="ib-office-btn" onClick={() => setSpecialOpen(false)}>关闭</button>
            </div>
            <div className="ib-drawer-body">
              <form
                className="ib-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!specialForm.label.trim()) return;
                  addSpecialDate(specialForm);
                  setSpecialForm({ date: "2026-08-26", label: "", closed: true });
                  notify("特殊日期已添加");
                }}
              >
                <label className="admin-field">日期<input className="admin-input" type="date" value={specialForm.date} onChange={(event) => setSpecialForm({ ...specialForm, date: event.target.value })} /></label>
                <label className="admin-field">原因<input className="admin-input" value={specialForm.label} onChange={(event) => setSpecialForm({ ...specialForm, label: event.target.value })} placeholder="如：夏季夜跑加场" /></label>
                <label className="admin-field">
                  类型
                  <select className="admin-input" value={specialForm.closed ? "close" : "open"} onChange={(event) => setSpecialForm({ ...specialForm, closed: event.target.value === "close" })}>
                    <option value="close">全天休业</option>
                    <option value="open">加开</option>
                  </select>
                </label>
                <div className="ib-form-actions">
                  <button type="submit" className="ib-office-btn primary">添加</button>
                </div>
              </form>
              <div className="mt-4">
                {specialDates.map((item) => (
                  <div key={`${item.date}-${item.label}`} className="ib-special-row">
                    <b>{item.date}</b>
                    <span className="text-slate-600">{item.label}</span>
                    <span className={item.closed ? "text-slate-400" : "text-emerald-600"}>{item.closed ? "休业" : "加开"}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </section>
  );
}
