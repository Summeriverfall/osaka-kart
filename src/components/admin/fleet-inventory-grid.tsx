"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { OrderEditFields } from "@/components/admin/order-edit-fields";
import { Modal } from "@/components/ui/modal";
import { b2Copy } from "@/lib/admin/b2-copy";
import { adminCopy, adminPlanName, adminStoreName } from "@/lib/admin/copy";
import { liveChannelIds } from "@/lib/channel-options";
import { BOOKING_SLOTS, todayIsoDate } from "@/lib/booking/slots";
import { addDaysIso, eachIso, weekEndSunday, weekStartMonday, weekdayLabel } from "@/lib/calendar";
import {
  describeHolds,
  formatClockMinutes,
  isDepartTick,
  mergeFleetSpans,
  occupancyRate,
  parseClockMinutes,
  summarizeFleetSlot,
  type FleetCell,
  type FleetHold,
} from "@/lib/fleet-inventory";
import { type MockOrder } from "@/lib/mock/orders";
import { type MockPlan } from "@/lib/mock/plans";
import { timelineTicks } from "@/lib/mock/vehicle-timeline";
import { DEFAULT_STORE_ID, isAllStores } from "@/lib/store-id";
import { cn } from "@/lib/utils";
import { useAdminAccess } from "@/lib/admin-access";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";
import { useToastStore } from "@/stores/toast-store";

const TICKS = timelineTicks();

type SlotRange = { date: string; start: string; end: string };

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

function tickSlice(start: string, end: string) {
  const a = TICKS.indexOf(start);
  const b = TICKS.indexOf(end);
  if (a < 0 || b < 0) return [];
  return TICKS.slice(Math.min(a, b), Math.max(a, b) + 1);
}

function rangeLabel(range: SlotRange) {
  const times = tickSlice(range.start, range.end);
  const first = times[0] ?? range.start;
  const last = times[times.length - 1] ?? range.end;
  return `${first}–${formatClockMinutes(parseClockMinutes(last) + 30)}`;
}

function inRange(range: SlotRange | null, date: string, time: string) {
  return Boolean(range && range.date === date && tickSlice(range.start, range.end).includes(time));
}

function planForMinutes(plans: MockPlan[], minutes: number) {
  if (!plans.length) return undefined;
  return plans.reduce((best, plan) =>
    Math.abs(plan.durationMinutes - minutes) < Math.abs(best.durationMinutes - minutes) ? plan : best,
  );
}

function emptyDraft(date: string, time: string, storeId: string, plans: MockPlan[], minutes: number): MockOrder {
  const plan = planForMinutes(plans, minutes) ?? plans[0];
  return {
    id: "",
    customer: "",
    nationality: "USA",
    email: "",
    phone: "",
    passport: "",
    planName: plan?.name ?? "",
    planSlug: plan?.slug ?? "",
    date,
    time,
    riders: 1,
    male: 1,
    female: 0,
    addons: [],
    totalJpy: plan?.priceJpy ?? 0,
    channel: "官网",
    status: "pending",
    paid: false,
    note: "",
    logs: [],
    storeId,
  };
}

function FleetSlotButton({
  cell,
  selected,
  tightOnly,
  firstClosed,
  booked,
  wide,
  b2,
  onPointerDown,
  onPointerEnter,
}: {
  cell: FleetCell;
  selected: boolean;
  tightOnly: boolean;
  firstClosed: boolean;
  booked: boolean;
  wide: boolean;
  b2: ReturnType<typeof b2Copy>;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerEnter: () => void;
}) {
  return (
    <button
      type="button"
      data-fleet-cell={`${cell.date}|${cell.time}`}
      className={cn(
        "fleet-cell",
        toneClass(cell),
        cell.oversold && "is-oversell",
        cell.buffer && !cell.closed && "is-buffer",
        tightOnly && cell.tone === "free" && !cell.closed && "is-dim",
        booked && "is-booked",
        wide && "is-span",
        selected && "is-on",
      )}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
    >
      {cell.closed ? (
        firstClosed ? <span>{closedLabel(cell, b2)}</span> : <span className="fleet-cell-blank">·</span>
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
  const notify = useToastStore((state) => state.notify);
  const [anchor, setAnchor] = useState(weekStartMonday(today));
  const [tightOnly, setTightOnly] = useState(false);
  const [focusStore, setFocusStore] = useState(DEFAULT_STORE_ID);
  const [range, setRange] = useState<SlotRange | null>(null);
  const [dragging, setDragging] = useState(false);
  const [askCancel, setAskCancel] = useState(false);
  const [draft, setDraft] = useState<MockOrder | null>(null);
  const { vehicles, vehicleSlots, orders, specialDates, storeId, stores, plans, canSwitch } = useStoreData();
  const ensureInventory = useOpsStore((state) => state.ensureInventory);
  const addSpecialDate = useOpsStore((state) => state.addSpecialDate);
  const removeSpecialDate = useOpsStore((state) => state.removeSpecialDate);
  const setOrderStatus = useOpsStore((state) => state.setOrderStatus);
  const upsertOrder = useOpsStore((state) => state.upsertOrder);
  const settings = useOpsStore((state) => state.settings);

  const days = useMemo(() => eachIso(anchor, weekEndSunday(anchor)), [anchor]);
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

  const selectedTimes = useMemo(
    () => (range ? tickSlice(range.start, range.end) : []),
    [range],
  );
  const selectedCells = useMemo(() => {
    if (!range) return [];
    const row = grid[days.indexOf(range.date)];
    if (!row) return [];
    return selectedTimes
      .map((time) => row.find((cell) => cell.time === time))
      .filter((cell): cell is FleetCell => Boolean(cell));
  }, [grid, days, range, selectedTimes]);

  const startCell = selectedCells[0] ?? null;
  const holds = useMemo(() => {
    if (!range) return [] as FleetHold[];
    const map = new Map<string, FleetHold>();
    for (const time of selectedTimes) {
      for (const hold of describeHolds(range.date, time, liveOrders, plans, gridStore)) {
        map.set(hold.order.id, hold);
      }
    }
    return [...map.values()];
  }, [range, selectedTimes, liveOrders, plans, gridStore]);

  const liveHolds = holds.filter((hold) => hold.order.status !== "cancelled" && hold.order.status !== "completed");
  const slotLocked = selectedCells.length > 0 && selectedCells.every((cell) => cell.closed && cell.closedKind === "slot");
  const dayClosed = selectedCells.some((cell) => cell.closedKind === "day" || cell.closedKind === "hours");
  const canBook = Boolean(startCell && !startCell.closed && startCell.left > 0);

  function pickSpan(date: string, times: string[], extend: boolean) {
    const first = times[0];
    const last = times[times.length - 1];
    if (!first || !last) return;
    setRange((prev) => {
      if (!extend || !prev || prev.date !== date) {
        return { date, start: first, end: last };
      }
      const marks = [prev.start, prev.end, first, last]
        .map((time) => TICKS.indexOf(time))
        .filter((index) => index >= 0);
      return {
        date,
        start: TICKS[Math.min(...marks)],
        end: TICKS[Math.max(...marks)],
      };
    });
  }

  function toggleLock() {
    if (!range || !canEdit("inventory") || dayClosed) return;
    for (const time of selectedTimes) {
      const cell = selectedCells.find((item) => item.time === time);
      if (cell?.closedKind === "day" || cell?.closedKind === "hours") continue;
      if (slotLocked) {
        removeSpecialDate({ date: range.date, time, storeId: gridStore });
      } else if (!cell?.closed) {
        addSpecialDate({
          date: range.date,
          time,
          storeId: gridStore,
          closed: true,
          label: `${range.date} ${time}`,
        });
      }
    }
  }

  function createOrder() {
    if (!range || !startCell) return;
    setDraft(emptyDraft(range.date, startCell.time, gridStore, plans, selectedTimes.length * 30));
  }

  function saveDraft() {
    if (!draft) return;
    const id = draft.id.trim() || `FK-${Date.now().toString(36).toUpperCase()}`;
    const male = Math.max(0, draft.male);
    const female = Math.max(0, draft.female);
    const next: MockOrder = {
      ...draft,
      id,
      male,
      female,
      riders: male + female,
      time: draft.time.slice(0, 5),
      totalJpy: Math.max(0, draft.totalJpy),
      storeId: draft.storeId || gridStore,
    };
    const taken = useOpsStore.getState().orders.some((item) => item.id === next.id);
    if (taken) {
      notify(copy.orders.idTaken);
      return;
    }
    upsertOrder(next);
    setDraft(null);
    notify(copy.orders.saved);
  }

  function cancelSelected() {
    if (!canEdit("orders") || liveHolds.length === 0) {
      notify(b2.rangeEmpty);
      setAskCancel(false);
      return;
    }
    for (const hold of liveHolds) {
      setOrderStatus(hold.order.id, "cancelled", { cancelKind: "voluntary" });
    }
    notify(b2.cancelledN(liveHolds.length));
    setAskCancel(false);
  }

  useEffect(() => {
    function stopDrag() {
      setDragging(false);
    }
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
    return () => {
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, []);

  useEffect(() => {
    if (!range) return;
    const main = document.querySelector("main");
    const mq = window.matchMedia("(max-width: 960px)");
    if (!main || !mq.matches) return;
    const previous = main.style.overflow;
    main.style.overflow = "hidden";
    return () => {
      main.style.overflow = previous;
    };
  }, [range]);

  return (
    <section className={cn("fleet-board", startCell && "is-split")}>
      <div className="fleet-main">
        <div className="fleet-chrome">
          <div className="fleet-toolbar">
            <div className="fleet-nav">
              <button type="button" className="ib-btn" onClick={() => setAnchor(addDaysIso(anchor, -7))}>
                <ChevronLeft className="size-4" /> {b2.prevWeek}
              </button>
              <button
                type="button"
                className={cn("ib-btn", anchor === weekStartMonday(today) && "is-on")}
                onClick={() => setAnchor(weekStartMonday(today))}
              >
                {b2.thisWeek}
              </button>
              <button type="button" className="ib-btn" onClick={() => setAnchor(addDaysIso(anchor, 7))}>
                {b2.nextWeek} <ChevronRight className="size-4" />
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
                      setRange(null);
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

        <div className={cn("fleet-scroll", dragging && "is-picking")}>
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
                  {(grid[dayIndex] ? mergeFleetSpans(grid[dayIndex]) : []).map((span) => {
                    const { cell, times } = span;
                    const selected = times.every((time) => inRange(range, cell.date, time));
                    const booked = cell.races > 0 && !cell.closed;
                    return (
                      <td
                        key={`${cell.date}-${times[0]}`}
                        colSpan={times.length}
                        className={booked ? "is-gap" : undefined}
                      >
                        <FleetSlotButton
                          cell={cell}
                          selected={selected}
                          tightOnly={tightOnly}
                          firstClosed={cell.closed}
                          booked={booked}
                          wide={times.length > 1}
                          b2={b2}
                          onPointerDown={(event) => {
                            if (event.button !== 0) return;
                            event.preventDefault();
                            setDragging(true);
                            pickSpan(cell.date, times, false);
                          }}
                          onPointerEnter={() => {
                            if (dragging) pickSpan(cell.date, times, true);
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {startCell && range ? (
        <>
        <button type="button" className="fleet-drawer-mask" aria-label={b2.closeDrawer} onClick={() => setRange(null)} />
        <aside className="fleet-drawer">
          <div className="fleet-drawer-head">
            <div>
              <p className="fleet-drawer-kicker">{range.date}</p>
              <h3>{rangeLabel(range)}</h3>
            </div>
            <button type="button" className="fleet-drawer-close" onClick={() => setRange(null)} aria-label={b2.closeDrawer}>
              <X className="size-4" />
            </button>
          </div>
          <dl className="fleet-drawer-stats">
            <div>
              <dt>{b2.slotLeft}</dt>
              <dd>
                {startCell.closed ? closedLabel(startCell, b2) : `${startCell.left}/${startCell.total} ${b2.units}`}
              </dd>
            </div>
            <div>
              <dt>{b2.slotRaces}</dt>
              <dd>{holds.length}</dd>
            </div>
          </dl>
          {startCell.left <= 0 && !startCell.closed ? <p className="fleet-drawer-warn">{b2.raceFull}</p> : null}

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
            {canEdit("orders") && liveHolds.length > 0 ? (
              <button type="button" className="ib-btn" onClick={() => setAskCancel(true)}>
                {b2.cancelRange}
              </button>
            ) : null}
            {canEdit("inventory") && !dayClosed ? (
              <button type="button" className="ib-btn" onClick={toggleLock}>
                {slotLocked ? b2.unlockSlot : b2.lockSlot}
              </button>
            ) : null}
          </div>
        </aside>
        </>
      ) : null}

      <Modal
        open={Boolean(draft)}
        title={copy.orders.addTitle}
        onClose={() => setDraft(null)}
        wide
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setDraft(null)}>
              {copy.common.cancel}
            </button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={saveDraft}>
              {copy.common.save}
            </button>
          </>
        }
      >
        {draft ? (
          <OrderEditFields
            order={draft}
            plans={plans}
            channelOptions={liveChannelIds(settings.channels, draft.channel)}
            locale={locale}
            onChange={setDraft}
          />
        ) : null}
      </Modal>

      <Modal
        open={askCancel}
        title={b2.cancelRange}
        onClose={() => setAskCancel(false)}
        footer={
          <button type="button" className="cta-btn" onClick={cancelSelected}>
            {b2.cancelRange}
          </button>
        }
      >
        <p className="perm-hint">{b2.cancelRangeAsk(liveHolds.length)}</p>
      </Modal>
    </section>
  );
}

export const BOOKING_SLOT_SET = BOOKING_SLOTS;
