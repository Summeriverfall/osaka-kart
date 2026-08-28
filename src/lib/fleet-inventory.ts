import { BOOKING_SLOTS } from "@/lib/booking/slots";
import { storeIdOf } from "@/lib/store-id";
import type { MockOrder } from "@/lib/mock/orders";
import type { MockSpecialDate } from "@/lib/mock/inventory";
import type { MockVehicle } from "@/lib/mock/vehicles";
import type { OccupancyTone, VehicleSlotCell } from "@/lib/mock/vehicle-timeline";

export type FleetCell = {
  date: string;
  time: string;
  total: number;
  left: number;
  booked: number;
  riders: number;
  closed: boolean;
  oversold: boolean;
  tone: OccupancyTone;
};

const BOOKABLE = new Set<string>(BOOKING_SLOTS);

export function fleetTone(cell: Pick<FleetCell, "closed" | "left" | "total" | "oversold">): OccupancyTone {
  if (cell.closed || cell.total <= 0) return "idle";
  if (cell.oversold || cell.left <= 0) return "full";
  if (cell.left / cell.total <= 0.35) return "tight";
  return "free";
}

export function summarizeFleetSlot(
  date: string,
  time: string,
  vehicles: MockVehicle[],
  slots: VehicleSlotCell[],
  orders: MockOrder[],
  specialDates: MockSpecialDate[],
  storeId?: string,
): FleetCell {
  const sid = storeId ? storeIdOf(storeId) : "";
  const pool = sid
    ? vehicles.filter((item) => storeIdOf(item.storeId) === sid)
    : vehicles;
  const available = pool.filter((item) => item.status === "available");
  const total = available.length;
  const dayClosed = specialDates.some(
    (row) => row.date === date && row.closed && (!sid || storeIdOf(row.storeId) === sid || !row.storeId),
  );
  const bookable = BOOKABLE.has(time);
  const riders = orders
    .filter(
      (order) =>
        order.date === date &&
        order.time === time &&
        order.status !== "cancelled" &&
        (!sid || storeIdOf(order.storeId) === sid),
    )
    .reduce((sum, order) => sum + Math.max(0, order.riders), 0);

  if (!bookable || dayClosed || total === 0) {
    return {
      date,
      time,
      total,
      left: 0,
      booked: 0,
      riders,
      closed: true,
      oversold: false,
      tone: "idle",
    };
  }

  const ids = new Set(available.map((item) => item.id));
  const cells = slots.filter((cell) => cell.date === date && cell.time === time && ids.has(cell.vehicleId));
  const open = cells.filter((cell) => !cell.closed);
  const source = open.length ? open : cells;
  const left = source.length
    ? source.filter((cell) => cell.remaining > 0).length
    : Math.max(0, total - riders);
  const cap = source.length || total;
  const booked = Math.max(0, cap - left);
  const oversold = riders > cap || booked > cap;
  const row = { date, time, total: cap, left, booked, riders, closed: false, oversold, tone: "free" as OccupancyTone };
  row.tone = fleetTone(row);
  return row;
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
) {
  let booked = 0;
  let capacity = 0;
  for (const date of days) {
    if (date < from || date > to) continue;
    for (const time of BOOKING_SLOTS) {
      const cell = summarizeFleetSlot(date, time, vehicles, slots, orders, specialDates, storeId);
      if (cell.closed || cell.total <= 0) continue;
      capacity += cell.total;
      booked += Math.min(cell.total, cell.booked || cell.riders);
    }
  }
  if (!capacity) return 0;
  return booked / capacity;
}
