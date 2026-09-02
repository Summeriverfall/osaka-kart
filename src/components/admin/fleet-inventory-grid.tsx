"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { b2Copy } from "@/lib/admin/b2-copy";
import { adminCopy, adminPlanName, adminStoreName } from "@/lib/admin/copy";
import { setAdminFocusSlot } from "@/lib/admin/focus-date";
import { BOOKING_SLOTS, todayIsoDate } from "@/lib/booking/slots";
import { addDaysIso, eachIso, weekEndSunday, weekStartMonday, weekdayLabel } from "@/lib/calendar";
import {
  describeHolds,
  isDepartTick,
  mergeFleetSpans,
  occupancyRate,
  spanEndClock,
  summarizeFleetSlot,
  type FleetCell,
} from "@/lib/fleet-inventory";
import { timelineTicks } from "@/lib/mock/vehicle-timeline";
import { DEFAULT_STORE_ID, isAllStores } from "@/lib/store-id";
import { cn } from "@/lib/utils";
import { useAdminAccess } from "@/lib/admin-access";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";

const TICKS = timelineTicks();

function toneClass(cell: FleetCell) {
  if (cell.closed) return "is-idle";
  if (cell.tone === "full") return "is-low";
  if (cell.tone === "tight") return "is-tight";
  return "is-free";
}

function closedLabel(cell: FleetCell, b2: ReturnType<typeof b2Copy>) {
  if (cell.closedKind === "slot") return b2.locked;
  return b2.closed;
}

function FleetSlotButton({
  cell,
  times,
  picked,
  tightOnly,
  b2,
  onPick,
}: {
  cell: FleetCell;
  times: string[];
  picked: { date: string; time: string } | null;
  tightOnly: boolean;
  b2: ReturnType<typeof b2Copy>;
  onPick: (slot: { date: string; time: string }) => void;
}) {
  const on = Boolean(picked && picked.date === cell.date && times.includes(picked.time));
  return (
    <button
      type="button"
      className={cn(
        "fleet-cell",
        toneClass(cell),
        cell.oversold && "is-oversell",
        cell.buffer && !cell.closed && "is-buffer",
        tightOnly && cell.tone === "free" && !cell.closed && "is-dim",
        on && "is-on",
      )}
      onClick={() => onPick({ date: cell.date, time: cell.time })}
    >
      {cell.closed ? (
        <span>{closedLabel(cell, b2)}</span>
      ) : (
        <>
          <span className="fleet-num">
            {cell.left}
            <small>/{cell.total}</small>
          </span>
          {cell.races > 0 ? (
            <span className="fleet-dots" aria-hidden>
              {Array.from({ length: Math.min(cell.races, 2) }, (_, index) => (
                <i key={index} />
              ))}
            </span>
          ) : null}
        </>
      )}
    </button>
  );
}

export function FleetInventoryGrid() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const today = todayIsoDate();
  const { canEdit } = useAdminAccess();
  const go = useAdminNavStore((state) => state.go);
  const [anchor, setAnchor] = useState(weekStartMonday(today));
  const [tripStart, setTripStart] = useState(today);
  const [tightOnly, setTightOnly] = useState(false);
  const [focusStore, setFocusStore] = useState(DEFAULT_STORE_ID);
  const [picked, setPicked] = useState<{ date: string; time: string } | null>(null);
  const { vehicles, vehicleSlots, orders, specialDates, storeId, stores, plans, canSwitch } = useStoreData();
  const ensureInventory = useOpsStore((state) => state.ensureInventory);
  const addSpecialDate = useOpsStore((state) => state.addSpecialDate);
  const removeSpecialDate = useOpsStore((state) => state.removeSpecialDate);

  const days = useMemo(() => eachIso(anchor, weekEndSunday(anchor)), [anchor]);
  const tripDays = useMemo(
    () => [tripStart, addDaysIso(tripStart, 1), addDaysIso(tripStart, 2)],
    [tripStart],
  );
  const gridStore = isAllStores(storeId) ? focusStore : storeId;
  const liveOrders = useMemo(
    () => orders.filter((item) => !item.id.startsWith("FK-H-")),
    [orders],
  );

  const grid = useMemo(() => {
    ensureInventory();
    return days.map((date) =>
      TICKS.map((time) =>
        summarizeFleetSlot(date, time, vehicles, vehicleSlots, liveOrders, specialDates, gridStore, plans),
      ),
    );
  }, [days, vehicles, vehicleSlots, liveOrders, specialDates, gridStore, plans, ensureInventory]);

  const rows = useMemo(() => grid.map((cells) => mergeFleetSpans(cells)), [grid]);
  const tripGrid = useMemo(
    () =>
      tripDays.map((date) =>
        TICKS.map((time) =>
          summarizeFleetSlot(date, time, vehicles, vehicleSlots, liveOrders, specialDates, gridStore, plans),
        ),
      ),
    [tripDays, vehicles, vehicleSlots, liveOrders, specialDates, gridStore, plans],
  );
  const tripCols = useMemo(() => tripGrid.map((cells) => mergeFleetSpans(cells)), [tripGrid]);

  const oversell = grid.some((row) => row.some((cell) => cell.oversold));
  const rate = occupancyRate(
    days[0],
    days[days.length - 1],
    days,
    vehicles,
    vehicleSlots,
    liveOrders,
    specialDates,
    gridStore,
    plans,
  );

  const selected = picked
    ? summarizeFleetSlot(picked.date, picked.time, vehicles, vehicleSlots, liveOrders, specialDates, gridStore, plans)
    : null;
  const pickedSpan = picked
    ? rows[days.indexOf(picked.date)]?.find((item) => item.times.includes(picked.time)) ??
      tripCols[tripDays.indexOf(picked.date)]?.find((item) => item.times.includes(picked.time))
    : null;
  const holds = picked ? describeHolds(picked.date, picked.time, liveOrders, plans, gridStore) : [];
  const slotLocked = Boolean(selected?.closed && selected.closedKind === "slot");
  const canBook = Boolean(selected && !selected.closed && selected.left > 0);

  function toggleLock() {
    if (!picked || !canEdit("inventory")) return;
    if (slotLocked) {
      removeSpecialDate({ date: picked.date, time: picked.time, storeId: gridStore });
      return;
    }
    addSpecialDate({
      date: picked.date,
      time: picked.time,
      storeId: gridStore,
      closed: true,
      label: `${picked.date} ${picked.time}`,
    });
  }

  function createOrder() {
    if (!picked) return;
    setAdminFocusSlot(picked.date, picked.time, true);
    go("/admin/orders");
  }

  useEffect(() => {
    if (!picked) return;
    const main = document.querySelector("main");
    const mq = window.matchMedia("(max-width: 960px)");
    if (!main || !mq.matches) return;
    const previous = main.style.overflow;
    main.style.overflow = "hidden";
    return () => {
      main.style.overflow = previous;
    };
  }, [picked]);

  return (
    <section className={cn("fleet-board", selected && "is-split")}>
      <div className="fleet-main">
        <div className="fleet-chrome">
          <div className="fleet-toolbar">
            <div className="fleet-nav">
              <button type="button" className="ib-btn fleet-only-week" onClick={() => setAnchor(addDaysIso(anchor, -7))}>
                <ChevronLeft className="size-4" /> {b2.prevWeek}
              </button>
              <button
                type="button"
                className={cn("ib-btn fleet-only-week", anchor === weekStartMonday(today) && "is-on")}
                onClick={() => setAnchor(weekStartMonday(today))}
              >
                {b2.thisWeek}
              </button>
              <button type="button" className="ib-btn fleet-only-week" onClick={() => setAnchor(addDaysIso(anchor, 7))}>
                {b2.nextWeek} <ChevronRight className="size-4" />
              </button>
              <button type="button" className="ib-btn fleet-only-days" onClick={() => setTripStart(addDaysIso(tripStart, -3))}>
                <ChevronLeft className="size-4" /> {b2.prevDays}
              </button>
              <button
                type="button"
                className={cn("ib-btn fleet-only-days", tripStart === today && "is-on")}
                onClick={() => setTripStart(today)}
              >
                {b2.theseDays}
              </button>
              <button type="button" className="ib-btn fleet-only-days" onClick={() => setTripStart(addDaysIso(tripStart, 3))}>
                {b2.nextDays} <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="fleet-tools">
              <button
                type="button"
                className={cn("ib-btn", tightOnly && "is-on")}
                onClick={() => setTightOnly((value) => !value)}
              >
                {b2.tightOnly}
              </button>
              <p className="fleet-rate">
                {b2.utilization} {Math.round(rate * 100)}%
              </p>
            </div>
          </div>

          {canSwitch && isAllStores(storeId) ? (
            <div className="fleet-storebar">
              <div className="fleet-stores">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    type="button"
                    className={cn("ib-btn", focusStore === store.id && "is-on")}
                    aria-pressed={focusStore === store.id}
                    onClick={() => {
                      setFocusStore(store.id);
                      setPicked(null);
                    }}
                  >
                    {adminStoreName(locale, store.id, store.name)}
                  </button>
                ))}
              </div>
              <p className="fleet-pick">{b2.pickStore}</p>
            </div>
          ) : null}

          <ul className="fleet-legend">
            <li><i className="is-free" /> {copy.inventory.free}</li>
            <li><i className="is-tight" /> {copy.inventory.tight}</li>
            <li><i className="is-low" /> {copy.inventory.full}</li>
            <li><i className="is-idle" /> {b2.closed}</li>
            <li><span className="fleet-legend-dot" /> {b2.raceOne}</li>
            <li><span className="fleet-legend-dot" /><span className="fleet-legend-dot" /> {b2.raceTwo}</li>
          </ul>

          {oversell ? <p className="fleet-oversell">{b2.oversell}</p> : null}
        </div>

        <div className="fleet-scroll">
          <table className="fleet-table is-landscape">
            <colgroup>
              <col className="fleet-col-day" />
              {TICKS.map((time) => (
                <col key={time} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="fleet-sticky">{b2.axisDate}</th>
                {TICKS.map((time) => (
                  <th key={time} className={cn("fleet-tick-h", isDepartTick(time) && "is-depart")}>
                    <span className="fleet-tick">
                      <b>{time.slice(0, 2)}</b>
                      <small>{time.slice(3)}</small>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((date, dayIndex) => (
                <tr key={date} className={cn(date === today && "is-today")}>
                  <th className={cn("fleet-sticky", date === today && "is-today")}>
                    <span className="fleet-date">{date.slice(5)}</span>
                    <small>{weekdayLabel(date, locale)}</small>
                  </th>
                  {rows[dayIndex]?.map((span) => (
                    <td key={`${span.cell.date}-${span.cell.time}`} colSpan={span.times.length}>
                      <FleetSlotButton
                        cell={span.cell}
                        times={span.times}
                        picked={picked}
                        tightOnly={tightOnly}
                        b2={b2}
                        onPick={setPicked}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="fleet-days">
            {tripDays.map((date, dayIndex) => (
              <section key={date} className={cn("fleet-day", date === today && "is-today")}>
                <h3>
                  <span className="fleet-date">{date.slice(5)}</span>
                  <small>{weekdayLabel(date, locale)}</small>
                </h3>
                <ul>
                  {tripCols[dayIndex]?.map((span) => (
                    <li key={`${span.cell.date}-${span.cell.time}`}>
                      <span className="fleet-day-time">
                        {span.times[0]}
                        {span.times.length > 1 ? `–${spanEndClock(span.times)}` : ""}
                      </span>
                      <FleetSlotButton
                        cell={span.cell}
                        times={span.times}
                        picked={picked}
                        tightOnly={tightOnly}
                        b2={b2}
                        onPick={setPicked}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>

      {selected && picked ? (
        <>
        <button type="button" className="fleet-drawer-mask" aria-label={b2.closeDrawer} onClick={() => setPicked(null)} />
        <aside className="fleet-drawer">
          <div className="fleet-drawer-head">
            <div>
              <p className="fleet-drawer-kicker">{picked.date}</p>
              <h3>
                {picked.time}
                {pickedSpan && pickedSpan.times.length > 1 ? `–${spanEndClock(pickedSpan.times)}` : ""}
              </h3>
            </div>
            <button type="button" className="fleet-drawer-close" onClick={() => setPicked(null)} aria-label={b2.closeDrawer}>
              <X className="size-4" />
            </button>
          </div>
          <dl className="fleet-drawer-stats">
            <div>
              <dt>{b2.slotLeft}</dt>
              <dd>
                {selected.closed ? closedLabel(selected, b2) : `${selected.left}/${selected.total} ${b2.units}`}
              </dd>
            </div>
            <div>
              <dt>{b2.slotRaces}</dt>
              <dd>{selected.races}</dd>
            </div>
          </dl>
          {selected.left <= 0 && !selected.closed ? <p className="fleet-drawer-warn">{b2.raceFull}</p> : null}

          <ul className="fleet-holds">
            {holds.length === 0 ? <li className="is-empty">{b2.holdEmpty}</li> : null}
            {holds.map((hold) => (
              <li key={hold.order.id}>
                <div>
                  <p className="fleet-hold-name">{hold.order.customer}</p>
                  <p className="fleet-hold-meta">
                    {hold.start}–{hold.end} · {b2.holdMins(hold.duration)} · {b2.holdKarts(hold.karts)}
                  </p>
                  <p className="fleet-hold-meta">
                    {hold.kind === "race" ? b2.holdRace : b2.holdBuffer}
                    {hold.kind === "buffer" ? ` · ${hold.holdStart}–${hold.holdEnd}` : ""}
                    {" · "}
                    {adminPlanName(locale, plans.find((item) => item.slug === hold.order.planSlug), hold.order.planName)}
                  </p>
                </div>
                <button type="button" className="ib-btn" onClick={() => go(`/admin/orders/${hold.order.id}`)}>
                  {b2.openOrder}
                </button>
              </li>
            ))}
          </ul>

          <div className="fleet-drawer-actions">
            {canEdit("orders") ? (
              <button type="button" className="cta-btn px-4 py-2 text-sm" disabled={!canBook} onClick={createOrder}>
                {b2.newOrder}
              </button>
            ) : null}
            {canEdit("inventory") && selected.closedKind !== "day" && selected.closedKind !== "hours" ? (
              <button type="button" className="ib-btn" onClick={toggleLock}>
                {slotLocked ? b2.unlockSlot : b2.lockSlot}
              </button>
            ) : null}
          </div>
        </aside>
        </>
      ) : null}
    </section>
  );
}

export const BOOKING_SLOT_SET = BOOKING_SLOTS;
