"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { adminCopy, adminDaypart, adminVehicleStatus } from "@/lib/admin/copy";
import { BOOKING_DAYPARTS, BOOKING_SLOTS } from "@/lib/booking/slots";
import { type MockVehicle, type VehicleStatus } from "@/lib/mock/vehicles";
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
import { useStoreData } from "@/lib/use-store-data";
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

function toneLabel(tone: OccupancyTone, copy: ReturnType<typeof adminCopy>) {
  if (tone === "free") return copy.inventory.free;
  if (tone === "tight") return copy.inventory.tight;
  if (tone === "full") return copy.inventory.full;
  return copy.inventory.idle;
}

export function InventoryTimeline() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const {
    addSpecialDate,
    patchVehicleSlot,
    batchPatchVehicleSlots,
    clearDayInventory,
    resetDayInventory,
  } = useOpsStore();
  const { vehicles, vehicleSlots, specialDates, storeId } = useStoreData();
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
              {group.tone === "idle" ? copy.inventory.idle : copy.inventory.remain(group.cell.remaining, group.cell.capacity)}
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
        <button type="button" className={cn("ib-btn", picked === addIsoDays(TODAY, -1) && "is-on")} onClick={() => setPicked(addIsoDays(TODAY, -1))}>{copy.inventory.yest}</button>
        <button type="button" className={cn("ib-btn", picked === TODAY && "is-on")} onClick={() => setPicked(TODAY)}>{copy.inventory.today}</button>
        <button type="button" className={cn("ib-btn", picked === addIsoDays(TODAY, 1) && "is-on")} onClick={() => setPicked(addIsoDays(TODAY, 1))}>{copy.inventory.tom}</button>
        <input className="ib-input" type="date" value={picked} onChange={(event) => setPicked(event.target.value)} />
        <div className="ib-filter">
          <button
            type="button"
            className={cn("ib-btn", (filterOpen || filterActive) && "is-on")}
            onClick={() => setFilterOpen((open) => !open)}
          >
            {copy.inventory.filter}{filterActive ? copy.inventory.filtered : ""}
          </button>
          {filterOpen ? (
            <>
              <button type="button" className="ib-filter-mask" aria-label={copy.inventory.closeFilter} onClick={() => setFilterOpen(false)} />
              <div className="ib-filter-panel">
                <input
                  className="ib-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.inventory.vehiclePh}
                />
                <select className="ib-select" value={status} onChange={(event) => setStatus(event.target.value as VehicleStatus | "all")}>
                  <option value="all">{copy.inventory.allStatus}</option>
                  <option value="available">{copy.inventory.stAvail}</option>
                  <option value="repair">{copy.inventory.stRepair}</option>
                  <option value="retired">{copy.inventory.stRetired}</option>
                </select>
              </div>
            </>
          ) : null}
        </div>
        <span className="ib-toolbar-spacer" />
        <button type="button" className="ib-btn" onClick={() => setSpecialOpen(true)}>{copy.inventory.special}</button>
        <button type="button" className="ib-btn ib-btn-ghost" onClick={() => setConfirm("clear")}>{copy.inventory.clearToday}</button>
        <button type="button" className="ib-btn" onClick={() => setConfirm("reset")}>{copy.inventory.reset}</button>
      </div>

      <div className="inventory-scroller hidden md:block">
          <div className="inventory-grid">
            <div className="inventory-axis">
              <div className="ib-sticky">{copy.inventory.vehicle}</div>
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
                  <p className="ib-model">{adminVehicleStatus(locale, vehicle.status)} · {vehicle.model}</p>
                </div>
                {renderBlocks(vehicle, vehicleIndex)}
              </div>
            ))}
          </div>
      </div>

      <div className="space-y-2 p-3 md:hidden">
        {rows.map((vehicle) => {
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
                  <span className="ml-2 text-xs text-slate-500">{adminVehicleStatus(locale, vehicle.status)}</span>
                </span>
                <span className="text-xs text-slate-500">{open ? copy.inventory.collapse : copy.inventory.expand}</span>
              </button>
              {open ? (
                <div className="ib-vaxis">
                  {BOOKING_DAYPARTS.map((part) => (
                    <div key={part.id} className="ib-vaxis-part">
                      <p className="ib-vaxis-label">
                        <span>{adminDaypart(locale, part.id)}</span>
                        <small>{part.range}</small>
                      </p>
                      <div className="ib-vaxis-list">
                        {part.slots.map((time) => {
                          const cell =
                            cellOf(vehicle.id, time) ?? {
                              vehicleId: vehicle.id,
                              date: picked,
                              time,
                              capacity: 2,
                              booked: 0,
                              remaining: 2,
                              closed: false,
                              customers: [],
                            };
                          const tone = occupancyTone(cell);
                          const fill = cell.closed ? 0 : Math.round((cell.remaining / Math.max(cell.capacity, 1)) * 100);
                          return (
                            <button
                              key={time}
                              type="button"
                              className={cn("ib-vaxis-row", tone)}
                              onClick={() => openEditor(vehicle.id, time, time)}
                            >
                              <span className="ib-vaxis-time">{time}</span>
                              <span className="ib-vaxis-track" aria-hidden>
                                <span className="ib-vaxis-fill" style={{ width: `${fill}%` }} />
                              </span>
                              <span className="ib-vaxis-stat">
                                {tone === "idle" ? copy.inventory.idle : copy.inventory.remain(cell.remaining, cell.capacity)}
                                <small>{toneLabel(tone, copy)}</small>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="inventory-legend">
        <span><i className="free" />{copy.inventory.free}</span>
        <span><i className="tight" />{copy.inventory.tight}</span>
        <span><i className="full" />{copy.inventory.full}</span>
        <span><i className="idle" />{copy.inventory.idleLong}</span>
        <span>{copy.inventory.mergeHint}</span>
      </div>

      {tip ? (
        <div className="ib-tip" style={{ left: tip.x, top: tip.y }}>
          <p>{tip.vehicle.code} · {tip.range}</p>
          <p>{copy.inventory.tipCap(tip.cell.capacity, tip.cell.booked, tip.cell.remaining, toneLabel(occupancyTone(tip.cell), copy))}</p>
          <p>{tip.cell.closed ? copy.inventory.tipClosed : copy.inventory.tipGuests(tip.cell.customers.join("、") || copy.inventory.noGuests)}</p>
        </div>
      ) : null}

      <Modal
        open={Boolean(edit)}
        title={edit ? copy.inventory.editTitle(vehicles.find((item) => item.id === edit.vehicleId)?.code ?? "") : ""}
        onClose={() => setEdit(null)}
        footer={
          <div className="ib-form-actions">
            <button type="button" className="ib-office-btn" onClick={() => setEdit(null)}>{copy.common.cancel}</button>
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
                notify(copy.inventory.saved);
              }}
            >
              {copy.common.save}
            </button>
          </div>
        }
      >
        {edit ? (
          <div className="ib-form">
            <label className="admin-field">{copy.inventory.slot}<input className="admin-input" value={edit.range} readOnly /></label>
            <label className="admin-field">
              {copy.inventory.seats}
              <input className="admin-input" type="number" min={1} value={edit.capacity} onChange={(event) => setEdit({ ...edit, capacity: Number(event.target.value) })} />
            </label>
            <label className="admin-field">
              {copy.inventory.booked}
              <input className="admin-input" type="number" min={0} value={edit.booked} onChange={(event) => setEdit({ ...edit, booked: Number(event.target.value) })} />
            </label>
            <label className="admin-field">
              {copy.inventory.status}
              <select className="admin-input" value={edit.closed ? "closed" : "open"} onChange={(event) => setEdit({ ...edit, closed: event.target.value === "closed" })}>
                <option value="open">{copy.inventory.open}</option>
                <option value="closed">{copy.inventory.closed}</option>
              </select>
            </label>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(batch)}
        title={copy.inventory.batchTitle(batch?.keys.length ?? 0)}
        onClose={() => setBatch(null)}
        footer={
          <div className="ib-form-actions">
            <button type="button" className="ib-office-btn" onClick={() => setBatch(null)}>{copy.common.cancel}</button>
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
                notify(copy.inventory.saved);
              }}
            >
              {copy.inventory.setRepair}
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
                notify(copy.inventory.saved);
              }}
            >
              {copy.inventory.setOpen}
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-500">{copy.inventory.batchLead}</p>
      </Modal>

      <Modal
        open={Boolean(confirm)}
        title={confirm === "clear" ? copy.inventory.clearAsk : copy.inventory.resetAsk}
        onClose={() => setConfirm(null)}
        footer={
          <div className="ib-form-actions">
            <button type="button" className="ib-office-btn" onClick={() => setConfirm(null)}>{copy.common.cancel}</button>
            <button
              type="button"
              className={confirm === "clear" ? "ib-office-btn danger" : "ib-office-btn primary"}
              onClick={() => {
                if (confirm === "clear") clearDayInventory(picked, vehicles.map((item) => item.id));
                if (confirm === "reset") resetDayInventory(picked, vehicles.map((item) => item.id));
                setConfirm(null);
                notify(copy.inventory.saved);
              }}
            >
              {confirm === "clear" ? copy.inventory.clearOk : copy.inventory.resetOk}
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-500">
          {confirm === "clear" ? copy.inventory.clearLead : copy.inventory.resetLead}
        </p>
      </Modal>

      {specialOpen ? (
        <>
          <button type="button" className="ib-drawer-mask" aria-label={copy.inventory.closeSpecial} onClick={() => setSpecialOpen(false)} />
          <aside className="ib-drawer">
            <div className="ib-drawer-head">
              <h2 className="text-base font-semibold">{copy.inventory.special}</h2>
              <button type="button" className="ib-office-btn" onClick={() => setSpecialOpen(false)}>{copy.common.close}</button>
            </div>
            <div className="ib-drawer-body">
              <form
                className="ib-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!specialForm.label.trim()) return;
                  addSpecialDate({ ...specialForm, storeId });
                  setSpecialForm({ date: "2026-08-26", label: "", closed: true });
                  notify(copy.inventory.specialAdded);
                }}
              >
                <label className="admin-field">{copy.inventory.date}<input className="admin-input" type="date" value={specialForm.date} onChange={(event) => setSpecialForm({ ...specialForm, date: event.target.value })} /></label>
                <label className="admin-field">{copy.inventory.reason}<input className="admin-input" value={specialForm.label} onChange={(event) => setSpecialForm({ ...specialForm, label: event.target.value })} placeholder={copy.inventory.reasonPh} /></label>
                <label className="admin-field">
                  {copy.inventory.type}
                  <select className="admin-input" value={specialForm.closed ? "close" : "open"} onChange={(event) => setSpecialForm({ ...specialForm, closed: event.target.value === "close" })}>
                    <option value="close">{copy.inventory.closeDay}</option>
                    <option value="open">{copy.inventory.extra}</option>
                  </select>
                </label>
                <div className="ib-form-actions">
                  <button type="submit" className="ib-office-btn primary">{copy.common.add}</button>
                </div>
              </form>
              <div className="mt-4">
                {specialDates.map((item) => (
                  <div key={`${item.date}-${item.label}`} className="ib-special-row">
                    <b>{item.date}</b>
                    <span className="text-slate-600">{item.label}</span>
                    <span className={item.closed ? "text-slate-400" : "text-emerald-600"}>{item.closed ? copy.inventory.closeDay : copy.inventory.extra}</span>
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
