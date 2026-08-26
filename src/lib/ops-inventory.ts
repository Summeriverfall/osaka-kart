import { storeIdOf } from "@/lib/store-id";
import type { MockOrder } from "@/lib/mock/orders";
import type { MockVehicle } from "@/lib/mock/vehicles";
import { maskCustomer, type VehicleSlotCell } from "@/lib/mock/vehicle-timeline";

export function applySlotPatch(cell: VehicleSlotCell, patch: Partial<VehicleSlotCell>): VehicleSlotCell {
  const next = { ...cell, ...patch };
  next.booked = Math.max(0, next.booked);
  next.capacity = Math.max(1, next.capacity);
  if (next.closed) {
    next.remaining = 0;
  } else {
    next.remaining = Math.max(0, next.capacity - next.booked);
  }
  return next;
}

export function vehicleIdsForStore(vehicles: MockVehicle[], storeId?: string) {
  const sid = storeIdOf(storeId);
  const ids = vehicles.filter((item) => storeIdOf(item.storeId) === sid).map((item) => item.id);
  return ids.length ? ids : vehicles.map((item) => item.id);
}

function slotActive(order: Pick<MockOrder, "status">) {
  return order.status !== "cancelled";
}

export function allocateSeats(
  slots: VehicleSlotCell[],
  order: Pick<MockOrder, "date" | "time" | "riders" | "customer" | "storeId">,
  vehicles: MockVehicle[],
): VehicleSlotCell[] {
  const ids = new Set(vehicleIdsForStore(vehicles, order.storeId));
  let left = Math.max(0, order.riders);
  if (left <= 0) return slots;
  const next = slots.map((cell) => ({ ...cell }));
  const ranked = next
    .map((cell, index) => ({ cell, index }))
    .filter(
      ({ cell }) =>
        cell.date === order.date &&
        cell.time === order.time &&
        ids.has(cell.vehicleId) &&
        !cell.closed &&
        cell.remaining > 0,
    )
    .sort((a, b) => b.cell.remaining - a.cell.remaining);

  for (const row of ranked) {
    if (left <= 0) break;
    const take = Math.min(left, row.cell.remaining);
    left -= take;
    next[row.index] = applySlotPatch(row.cell, {
      booked: row.cell.booked + take,
      customers: [...row.cell.customers, maskCustomer(order.customer)],
    });
  }
  return next;
}

export function restoreSeats(
  slots: VehicleSlotCell[],
  order: Pick<MockOrder, "date" | "time" | "riders" | "storeId">,
  vehicles: MockVehicle[],
): VehicleSlotCell[] {
  const ids = new Set(vehicleIdsForStore(vehicles, order.storeId));
  let left = Math.max(0, order.riders);
  if (left <= 0) return slots;
  const next = slots.map((cell) => ({ ...cell }));
  const ranked = next
    .map((cell, index) => ({ cell, index }))
    .filter(
      ({ cell }) =>
        cell.date === order.date &&
        cell.time === order.time &&
        ids.has(cell.vehicleId) &&
        cell.booked > 0,
    )
    .sort((a, b) => b.cell.booked - a.cell.booked);

  for (const row of ranked) {
    if (left <= 0) break;
    const give = Math.min(left, row.cell.booked);
    left -= give;
    next[row.index] = applySlotPatch(row.cell, {
      booked: row.cell.booked - give,
    });
  }
  return next;
}

export function syncOrderInventory(
  slots: VehicleSlotCell[],
  prev: MockOrder | undefined,
  next: MockOrder,
  vehicles: MockVehicle[],
): VehicleSlotCell[] {
  let current = slots;
  const scheduleChanged =
    Boolean(prev) &&
    (prev!.date !== next.date || prev!.time !== next.time || prev!.riders !== next.riders);
  if (prev && slotActive(prev) && (!slotActive(next) || scheduleChanged)) {
    current = restoreSeats(current, prev, vehicles);
  }
  if (slotActive(next) && (!prev || !slotActive(prev) || scheduleChanged)) {
    current = allocateSeats(current, next, vehicles);
  }
  return current;
}
