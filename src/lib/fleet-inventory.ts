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

  if (!OPEN_TICKS.has(time) || dayClosed || slotClosed || total === 0) {
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

  const left = Math.max(0, total - booked);
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
