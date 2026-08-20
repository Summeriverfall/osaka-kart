import { create } from "zustand";
import { MOCK_ADDONS, type MockAddon } from "@/lib/mock/addons";
import { MOCK_ORDERS, type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import { MOCK_PLANS, type MockPlan } from "@/lib/mock/plans";
import { MOCK_SPECIAL_DATES, type MockSpecialDate } from "@/lib/mock/inventory";
import {
  buildVehicleTimeline,
  buildVehicleTimelineForDate,
  type VehicleSlotCell,
} from "@/lib/mock/vehicle-timeline";
import { MOCK_SETTINGS, MOCK_EMAIL_TEMPLATES, MOCK_STORES, type MockSettings, type MockEmailTemplate, type MockStore } from "@/lib/mock/settings";
import { MOCK_VEHICLES, type MockVehicle } from "@/lib/mock/vehicles";
import { MOCK_STAFF, type MockStaff } from "@/lib/mock/staff";

type OpsState = {
  orders: MockOrder[];
  addons: MockAddon[];
  plans: MockPlan[];
  vehicleSlots: VehicleSlotCell[];
  specialDates: MockSpecialDate[];
  settings: MockSettings;
  vehicles: MockVehicle[];
  staff: MockStaff[];
  templates: MockEmailTemplate[];
  stores: MockStore[];
  upsertOrder: (order: MockOrder) => void;
  patchOrder: (id: string, patch: Partial<MockOrder>) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  upsertAddon: (addon: MockAddon) => void;
  patchAddon: (id: string, patch: Partial<MockAddon>) => void;
  removeAddon: (id: string) => void;
  upsertPlan: (plan: MockPlan) => void;
  patchPlan: (id: string, patch: Partial<MockPlan>) => void;
  patchVehicleSlot: (vehicleId: string, date: string, time: string, patch: Partial<VehicleSlotCell>) => void;
  batchPatchVehicleSlots: (date: string, targets: { vehicleId: string; time: string }[], patch: Partial<VehicleSlotCell>) => void;
  clearDayInventory: (date: string) => void;
  resetDayInventory: (date: string) => void;
  patchSettings: (patch: Partial<MockSettings>) => void;
  upsertVehicle: (vehicle: MockVehicle) => void;
  patchVehicle: (id: string, patch: Partial<MockVehicle>) => void;
  upsertStaff: (row: MockStaff) => void;
  patchStaff: (id: string, patch: Partial<MockStaff>) => void;
  patchTemplate: (id: string, patch: Partial<MockEmailTemplate>) => void;
  upsertStore: (store: MockStore) => void;
  addSpecialDate: (row: MockSpecialDate) => void;
};

function applySlotPatch(cell: VehicleSlotCell, patch: Partial<VehicleSlotCell>): VehicleSlotCell {
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

function replaceById<T extends { id: string }>(list: T[], item: T) {
  const index = list.findIndex((row) => row.id === item.id);
  if (index < 0) return [item, ...list];
  const next = [...list];
  next[index] = item;
  return next;
}

export const useOpsStore = create<OpsState>((set) => ({
  orders: MOCK_ORDERS,
  addons: MOCK_ADDONS,
  plans: MOCK_PLANS,
  vehicleSlots: buildVehicleTimeline(),
  specialDates: MOCK_SPECIAL_DATES,
  settings: MOCK_SETTINGS,
  vehicles: MOCK_VEHICLES,
  staff: MOCK_STAFF,
  templates: MOCK_EMAIL_TEMPLATES,
  stores: MOCK_STORES,
  upsertOrder: (order) => set((state) => ({ orders: replaceById(state.orders, order) })),
  patchOrder: (id, patch) =>
    set((state) => ({
      orders: state.orders.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  setOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((item) => (item.id === id ? { ...item, status } : item)),
    })),
  upsertAddon: (addon) => set((state) => ({ addons: replaceById(state.addons, addon) })),
  patchAddon: (id, patch) =>
    set((state) => ({
      addons: state.addons.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeAddon: (id) => set((state) => ({ addons: state.addons.filter((item) => item.id !== id) })),
  upsertPlan: (plan) => set((state) => ({ plans: replaceById(state.plans, plan) })),
  patchPlan: (id, patch) =>
    set((state) => ({
      plans: state.plans.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  patchVehicleSlot: (vehicleId, date, time, patch) =>
    set((state) => ({
      vehicleSlots: state.vehicleSlots.map((item) =>
        item.vehicleId === vehicleId && item.date === date && item.time === time
          ? applySlotPatch(item, patch)
          : item,
      ),
    })),
  batchPatchVehicleSlots: (date, targets, patch) =>
    set((state) => {
      const keys = new Set(targets.map((item) => `${item.vehicleId}__${item.time}`));
      return {
        vehicleSlots: state.vehicleSlots.map((item) =>
          item.date === date && keys.has(`${item.vehicleId}__${item.time}`)
            ? applySlotPatch(item, patch)
            : item,
        ),
      };
    }),
  clearDayInventory: (date) =>
    set((state) => ({
      vehicleSlots: state.vehicleSlots.map((item) =>
        item.date === date ? applySlotPatch(item, { booked: item.capacity, closed: false, customers: [] }) : item,
      ),
    })),
  resetDayInventory: (date) =>
    set((state) => ({
      vehicleSlots: [
        ...state.vehicleSlots.filter((item) => item.date !== date),
        ...buildVehicleTimelineForDate(date, state.vehicles, state.orders),
      ],
    })),
  patchSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
  upsertVehicle: (vehicle) => set((state) => ({ vehicles: replaceById(state.vehicles, vehicle) })),
  patchVehicle: (id, patch) =>
    set((state) => ({
      vehicles: state.vehicles.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  upsertStaff: (row) => set((state) => ({ staff: replaceById(state.staff, row) })),
  patchStaff: (id, patch) =>
    set((state) => ({
      staff: state.staff.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  patchTemplate: (id, patch) =>
    set((state) => ({
      templates: state.templates.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  upsertStore: (store) => set((state) => ({ stores: replaceById(state.stores, store) })),
  addSpecialDate: (row) => set((state) => ({ specialDates: [row, ...state.specialDates] })),
}));
