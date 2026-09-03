import { BOOKING_SLOTS } from "@/lib/booking/slots";
import { isAllStores, storeIdOf } from "@/lib/store-id";
import type { MockOrder } from "@/lib/mock/orders";
import { MOCK_PLANS, type MockPlan } from "@/lib/mock/plans";
import type { MockSpecialDate } from "@/lib/mock/inventory";
import type { MockVehicle } from "@/lib/mock/vehicles";
import { timelineTicks, type OccupancyTone, type VehicleSlotCell } from "@/lib/mock/vehicle-timeline";

export type FleetCell = {
  date: string;
  time: string;
  total: number;
  left: number;
  booked: number;
  riders: number;
  races: number;
  buffer: boolean;
  depart: boolean;
  closed: boolean;
  closedKind?: "day" | "slot" | "hours";
  oversold: boolean;
  tone: OccupancyTone;
  occupyKey: string;
};

const DEPART_TICKS = new Set<string>(BOOKING_SLOTS);

export const RACE_BUFFER_MIN = 0;
export const MAX_CONCURRENT_RACES = 2;
export const STAFF_KARTS = 2;
export const GUEST_CAP = 8;
export const TICK_MIN = 30;

export function guestCapacity(kartsReady: number) {
  if (kartsReady <= 0) return 0;
  if (kartsReady <= STAFF_KARTS) return kartsReady;
  return Math.min(GUEST_CAP, kartsReady - STAFF_KARTS);
}

const OPEN_TICKS = new Set(timelineTicks());

function fleetStoreId(storeId?: string) {
  if (!storeId || isAllStores(storeId)) return "";
  return storeIdOf(storeId);
}

export function parseClockMinutes(time: string) {
  const hour = Number(time.slice(0, 2)) || 0;
  const minute = Number(time.slice(3, 5)) || 0;
  return hour * 60 + minute;
}

export function orderDurationMinutes(order: Pick<MockOrder, "planSlug" | "planName">, plans: MockPlan[] = MOCK_PLANS) {
  const plan = plans.find((item) => item.slug === order.planSlug);
  if (plan?.durationMinutes) return plan.durationMinutes;
  const match = order.planName.match(/(\d+)\s*分钟|(\d+)\s*min|(\d+)\s*分/i);
  return Number(match?.[1] || match?.[2] || match?.[3]) || 60;
}

export function formatClockMinutes(mins: number) {
  const wrapped = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`;
}

export function isDepartTick(time: string) {
  return DEPART_TICKS.has(time);
}

export function fleetSpanKey(cell: FleetCell) {
  if (cell.closed) return `closed:${cell.closedKind ?? "hours"}`;
  if (!cell.occupyKey) return `open:${cell.time}`;
  return `booked:${cell.occupyKey}`;
}

export function mergeFleetSpans(cells: FleetCell[]) {
  const spans: { cell: FleetCell; times: string[] }[] = [];
  for (const cell of cells) {
    const last = spans.at(-1);
    if (last && fleetSpanKey(last.cell) === fleetSpanKey(cell)) {
      last.times.push(cell.time);
      continue;
    }
    spans.push({ cell, times: [cell.time] });
  }
  return spans;
}

export function spanEndClock(times: string[]) {
  const last = times[times.length - 1] ?? times[0] ?? "00:00";
  return formatClockMinutes(parseClockMinutes(last) + TICK_MIN);
}

function raceWindow(order: Pick<MockOrder, "time" | "planSlug" | "planName">, plans: MockPlan[], buffer = false) {
  const start = parseClockMinutes(order.time);
  const duration = orderDurationMinutes(order, plans);
  const pad = buffer ? RACE_BUFFER_MIN : 0;
  return { from: start - pad, to: start + duration + pad };
}

export type FleetHold = {
  order: MockOrder;
  kind: "race" | "buffer";
  duration: number;
  karts: number;
  start: string;
  end: string;
  holdStart: string;
  holdEnd: string;
};

export function describeHolds(
  date: string,
  time: string,
  orders: MockOrder[],
  plans: MockPlan[] = MOCK_PLANS,
  storeId?: string,
): FleetHold[] {
  return occupyingOrders(date, time, orders, plans, storeId, false).map((order) => {
    const race = raceWindow(order, plans, false);
    const hold = raceWindow(order, plans, true);
    const inRace = tickOverlaps(parseClockMinutes(time), race.from, race.to);
    return {
      order,
      kind: inRace ? "race" : "buffer",
      duration: orderDurationMinutes(order, plans),
      karts: Math.max(0, order.riders),
      start: formatClockMinutes(race.from),
      end: formatClockMinutes(race.to),
      holdStart: formatClockMinutes(hold.from),
      holdEnd: formatClockMinutes(hold.to),
    };
  });
}

function tickOverlaps(tickStart: number, from: number, to: number) {
  return tickStart < to && tickStart + TICK_MIN > from;
}

function isActiveRace(order: MockOrder, date: string, storeId?: string) {
  if (order.date !== date || order.status === "cancelled") return false;
  const sid = fleetStoreId(storeId);
  if (sid && storeIdOf(order.storeId) !== sid) return false;
  return true;
}

export function occupyingOrders(
  date: string,
  time: string,
  orders: MockOrder[],
  plans: MockPlan[] = MOCK_PLANS,
  storeId?: string,
  buffer = false,
) {
  const tick = parseClockMinutes(time);
  return orders.filter((order) => {
    if (!isActiveRace(order, date, storeId)) return false;
    const window = raceWindow(order, plans, buffer);
    return tickOverlaps(tick, window.from, window.to);
  });
}

export function fleetTone(
  cell: Pick<FleetCell, "closed" | "left" | "total" | "oversold" | "races">,
): OccupancyTone {
  if (cell.closed || cell.total <= 0) return "idle";
  if (cell.oversold || cell.left <= 0 || cell.races >= 2) return "full";
  if (cell.races >= 1 || cell.left <= 2 || cell.left / cell.total <= 0.35) return "tight";
  return "free";
}

export function isStoreDayClosed(date: string, specialDates: MockSpecialDate[], storeId?: string) {
  const sid = fleetStoreId(storeId);
  return specialDates.some((row) => dateClosedForStore(row, date, sid));
}

function dateClosedForStore(row: MockSpecialDate, date: string, sid: string) {
  if (row.date !== date || !row.closed) return false;
  if (row.time) return false;
  if (!sid) return !row.storeId;
  return !row.storeId || storeIdOf(row.storeId) === sid;
}

function slotClosedForStore(row: MockSpecialDate, date: string, time: string, sid: string) {
  if (row.date !== date || !row.closed || row.time !== time) return false;
  if (!sid) return !row.storeId;
  return !row.storeId || storeIdOf(row.storeId) === sid;
}

export function isStoreSlotLocked(date: string, time: string, specialDates: MockSpecialDate[], storeId?: string) {
  const sid = fleetStoreId(storeId);
  return specialDates.some((row) => slotClosedForStore(row, date, time, sid));
}

export type InventoryLockSpan = { from: string; to: string; kind: "day" | "slot" };

export function inventoryLockSpans(date: string, specialDates: MockSpecialDate[], storeId?: string): InventoryLockSpan[] {
  const ticks = timelineTicks();
  if (!ticks.length) return [];
  if (isStoreDayClosed(date, specialDates, storeId)) {
    const last = ticks[ticks.length - 1];
    return [{ from: ticks[0], to: formatClockMinutes(parseClockMinutes(last) + TICK_MIN), kind: "day" }];
  }
  const spans: InventoryLockSpan[] = [];
  for (const time of ticks) {
    if (!isStoreSlotLocked(date, time, specialDates, storeId)) continue;
    const end = formatClockMinutes(parseClockMinutes(time) + TICK_MIN);
    const last = spans.at(-1);
    if (last && last.kind === "slot" && last.to === time) {
      last.to = end;
    } else {
      spans.push({ from: time, to: end, kind: "slot" });
    }
  }
  return spans;
}

export function summarizeFleetSlot(
  date: string,
  time: string,
  vehicles: MockVehicle[],
  slots: VehicleSlotCell[],
  orders: MockOrder[],
  specialDates: MockSpecialDate[],
  storeId?: string,
  plans: MockPlan[] = MOCK_PLANS,
): FleetCell {
  const sid = fleetStoreId(storeId);
  const pool = sid ? vehicles.filter((item) => storeIdOf(item.storeId) === sid) : vehicles;
  const available = pool.filter((item) => item.status === "available");
  const closedIds = new Set(
    slots
      .filter((cell) => cell.date === date && cell.time === time && cell.closed)
      .map((cell) => cell.vehicleId),
  );
  const kartsReady = available.filter((item) => !closedIds.has(item.id)).length;
  const total = guestCapacity(kartsReady);
  const dayClosed = specialDates.some((row) => dateClosedForStore(row, date, sid));
  const slotClosed = specialDates.some((row) => slotClosedForStore(row, date, time, sid));
  const racing = occupyingOrders(date, time, orders, plans, storeId, false);
  const booked = racing.reduce((sum, order) => sum + Math.max(0, order.riders), 0);
  const riders = booked;
  const races = racing.length;
  const occupyKey = racing
    .map((order) => order.id)
    .sort()
    .join("|");
  const buffer = false;
  const depart = isDepartTick(time);

  const emptyClosed = races === 0 && (dayClosed || slotClosed || !OPEN_TICKS.has(time) || total === 0);
  if (emptyClosed) {
    return {
      date,
      time,
      total,
      left: 0,
      booked: 0,
      riders,
      races,
      occupyKey,
      buffer,
      depart,
      closed: true,
      closedKind: dayClosed ? "day" : slotClosed ? "slot" : "hours",
      oversold: false,
      tone: "idle",
    };
  }

  const left = slotClosed || dayClosed ? 0 : Math.max(0, total - booked);
  const oversold = booked > total;
  const row: FleetCell = {
    date,
    time,
    total,
    left,
    booked,
    riders,
    races,
    occupyKey,
    buffer,
    depart,
    closed: false,
    oversold,
    tone: "free",
  };
  row.tone = fleetTone(row);
  return row;
}

export function slotBookableLeft(cell: FleetCell) {
  if (cell.closed) return 0;
  return cell.left;
}

export function occupancyRate(
  from: string,
  to: string,
  days: string[],
  vehicles: MockVehicle[],
  slots: VehicleSlotCell[],
  orders: MockOrder[],
  specialDates: MockSpecialDate[],
  storeId?: string,
  plans: MockPlan[] = MOCK_PLANS,
) {
  let booked = 0;
  let capacity = 0;
  for (const date of days) {
    if (date < from || date > to) continue;
    for (const time of OPEN_TICKS) {
      const cell = summarizeFleetSlot(date, time, vehicles, slots, orders, specialDates, storeId, plans);
      if (cell.closed || cell.total <= 0) continue;
      capacity += cell.total;
      booked += Math.min(cell.total, cell.booked);
    }
  }
  if (!capacity) return 0;
  return booked / capacity;
}

export type InventoryBlockReason = "day" | "lock" | "hours" | "guests" | "races";

export function resolveOrderStoreId(storeId?: string, fallback?: string) {
  const pick = [storeId, fallback].find((id) => id && !isAllStores(id));
  return storeIdOf(pick);
}

export function orderCoveredTicks(
  order: Pick<MockOrder, "time" | "planSlug" | "planName">,
  plans: MockPlan[] = MOCK_PLANS,
) {
  const start = parseClockMinutes(order.time.slice(0, 5));
  const duration = orderDurationMinutes(order, plans);
  const ticks: string[] = [];
  for (let mins = start; mins < start + duration; mins += TICK_MIN) {
    ticks.push(formatClockMinutes(mins));
  }
  return ticks;
}

export function inventoryBlockForOrder(
  order: Pick<MockOrder, "id" | "date" | "time" | "riders" | "storeId" | "planSlug" | "planName" | "status">,
  vehicles: MockVehicle[],
  slots: VehicleSlotCell[],
  orders: MockOrder[],
  specialDates: MockSpecialDate[],
  plans: MockPlan[] = MOCK_PLANS,
): { ok: true } | { ok: false; reason: InventoryBlockReason } {
  if (order.status === "cancelled") return { ok: true };
  const sid = resolveOrderStoreId(order.storeId);
  const prev = orders.find((item) => item.id && item.id === order.id);
  if (isStoreDayClosed(order.date, specialDates, sid) && prev?.date !== order.date) {
    return { ok: false, reason: "day" };
  }
  const prevTicks = prev ? new Set(orderCoveredTicks(prev, plans)) : new Set<string>();
  const others = orders.filter((item) => item.id !== order.id);
  const riders = Math.max(0, order.riders);
  for (const time of orderCoveredTicks(order, plans)) {
    const cell = summarizeFleetSlot(order.date, time, vehicles, slots, others, specialDates, sid, plans);
    if (cell.closedKind === "day" && prev?.date !== order.date) return { ok: false, reason: "day" };
    if (cell.closedKind === "hours" || !OPEN_TICKS.has(time)) return { ok: false, reason: "hours" };
    if (cell.closedKind === "slot" && !prevTicks.has(time)) return { ok: false, reason: "lock" };
    if (cell.closed && cell.closedKind !== "day" && cell.closedKind !== "slot") return { ok: false, reason: "hours" };
    if (cell.races >= MAX_CONCURRENT_RACES) return { ok: false, reason: "races" };
    if (cell.left < riders) return { ok: false, reason: "guests" };
  }
  return { ok: true };
}
