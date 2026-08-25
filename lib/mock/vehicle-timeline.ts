import { BOOKING_SLOTS, todayIsoDate } from "@/lib/booking/slots";
import { eachIso, monthEndIso, monthStartIso, addMonthsIso } from "@/lib/calendar";
import { MOCK_ORDERS, type MockOrder } from "@/lib/mock/orders";
import { MOCK_VEHICLES, type MockVehicle } from "@/lib/mock/vehicles";

export const TIMELINE_START_HOUR = 9;
export const TIMELINE_END_HOUR = 20;
export const SLOT_SPAN_TICKS = 3;

export type VehicleSlotCell = {
  vehicleId: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
  remaining: number;
  closed: boolean;
  customers: string[];
};

export type OccupancyTone = "free" | "tight" | "full" | "idle";

const CAPACITY_CYCLE = [2, 4, 8, 4, 2, 8, 4, 2, 8, 4];

export function padTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function timelineTicks() {
  const ticks: string[] = [];
  for (let hour = TIMELINE_START_HOUR; hour < TIMELINE_END_HOUR; hour += 1) {
    ticks.push(padTime(hour, 0), padTime(hour, 30));
  }
  return ticks;
}

export function slotSpan(time: string) {
  return time === "19:00" ? 2 : SLOT_SPAN_TICKS;
}

export function maskCustomer(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "—";
  if (/\s/.test(trimmed)) {
    const [first, second] = trimmed.split(/\s+/);
    return `${first} ${second?.[0] ?? ""}.`.trim();
  }
  const chars = [...trimmed];
  if (chars.length === 1) return "*";
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}*${chars[chars.length - 1]}`;
}

export function occupancyTone(cell: VehicleSlotCell): OccupancyTone {
  if (cell.closed) return "idle";
  const ratio = cell.remaining / Math.max(cell.capacity, 1);
  if (cell.remaining <= 1 || cell.booked >= cell.capacity) return "full";
  if (ratio <= 0.5) return "tight";
  return "free";
}

export function addIsoDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function hash(input: string) {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 33 + input.charCodeAt(index)) >>> 0;
  }
  return value;
}

function capacityFor(vehicle: MockVehicle, vehicleIndex: number) {
  return CAPACITY_CYCLE[vehicleIndex % CAPACITY_CYCLE.length] ?? 4;
}

export function timelineSpan(today = todayIsoDate()) {
  return {
    from: monthStartIso(addMonthsIso(today, -1)),
    to: monthEndIso(addMonthsIso(today, 1)),
  };
}

export function buildVehicleTimeline(
  vehicles: MockVehicle[] = MOCK_VEHICLES,
  orders: MockOrder[] = MOCK_ORDERS,
  today = todayIsoDate(),
): VehicleSlotCell[] {
  const { from, to } = timelineSpan(today);
  return eachIso(from, to).flatMap((date) => buildVehicleTimelineForDate(date, vehicles, orders));
}

export function buildVehicleTimelineForDate(
  date: string,
  vehicles: MockVehicle[] = MOCK_VEHICLES,
  orders: MockOrder[] = MOCK_ORDERS,
): VehicleSlotCell[] {
  return vehicles.flatMap((vehicle, vehicleIndex) =>
    BOOKING_SLOTS.map((time, slotIndex) => {
      const forcedClosed = vehicle.status !== "available";
      const capacity = capacityFor(vehicle, vehicleIndex);
      const slotOrders = orders.filter(
        (order) => order.date === date && order.time === time && order.status !== "cancelled",
      );
      const seed = hash(`${date}|${time}|${vehicle.id}`);
      const roll = seed % 10;
      let booked = 0;
      if (!forcedClosed) {
        if (roll <= 3) booked = Math.max(0, Math.floor(capacity * 0.15) + (seed % 2));
        else if (roll <= 6) booked = Math.min(capacity - 1, Math.ceil(capacity * 0.55) + (slotIndex % 2));
        else if (roll <= 8) booked = Math.max(capacity - 1, Math.floor(capacity * 0.85));
        else booked = capacity;
        booked = Math.min(capacity, Math.max(0, booked));
      }
      const customers = slotOrders
        .filter((_, index) => index % Math.max(vehicles.length, 1) === vehicleIndex)
        .map((order) => maskCustomer(order.customer));
      return {
        vehicleId: vehicle.id,
        date,
        time,
        capacity,
        booked,
        remaining: forcedClosed ? 0 : Math.max(0, capacity - booked),
        closed: forcedClosed,
        customers,
      };
    }),
  );
}

export type SlotGroup = {
  startTime: string;
  endTime: string;
  startSlotIndex: number;
  endSlotIndex: number;
  tickSpan: number;
  cell: VehicleSlotCell;
  tone: OccupancyTone;
};

export function mergeSlotGroups(cells: VehicleSlotCell[]): SlotGroup[] {
  const groups: SlotGroup[] = [];
  for (let index = 0; index < cells.length; index += 1) {
    const cell = cells[index];
    const tone = occupancyTone(cell);
    const prev = groups[groups.length - 1];
    if (prev && prev.tone === tone) {
      prev.endTime = cell.time;
      prev.endSlotIndex = index;
      prev.tickSpan += slotSpan(cell.time);
      continue;
    }
    groups.push({
      startTime: cell.time,
      endTime: cell.time,
      startSlotIndex: index,
      endSlotIndex: index,
      tickSpan: slotSpan(cell.time),
      cell,
      tone,
    });
  }
  return groups;
}
