import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_ADDONS, type MockAddon } from "@/lib/mock/addons";
import { MOCK_LOGS, type LogType, type MockLog } from "@/lib/mock/logs";
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
import { MOCK_CMS, mergeCms, type CmsState } from "@/lib/mock/cms";
import { applySlotPatch, syncOrderInventory } from "@/lib/ops-inventory";
import { DEFAULT_STORE_ID, storeIdOf } from "@/lib/store-id";
import { OPS_STORAGE_KEY, opsPersistStorage } from "@/lib/ops-storage";

export type WebsiteBookingInput = {
  ref: string;
  planSlug: string;
  planName: string;
  riders: number;
  date: string;
  time: string;
  addonSlugs: string[];
  name: string;
  email: string;
  phone: string;
  passport?: string;
  nationality?: string;
  note?: string;
  totalJpy: number;
  storeId?: string;
};

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
  logs: MockLog[];
  cms: CmsState;
  upsertOrder: (order: MockOrder, fromId?: string) => void;
  patchOrder: (id: string, patch: Partial<MockOrder>) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  upsertAddon: (addon: MockAddon) => void;
  patchAddon: (id: string, patch: Partial<MockAddon>) => void;
  removeAddon: (id: string) => void;
  upsertPlan: (plan: MockPlan) => void;
  patchPlan: (id: string, patch: Partial<MockPlan>) => void;
  patchVehicleSlot: (vehicleId: string, date: string, time: string, patch: Partial<VehicleSlotCell>) => void;
  batchPatchVehicleSlots: (date: string, targets: { vehicleId: string; time: string }[], patch: Partial<VehicleSlotCell>) => void;
  clearDayInventory: (date: string, vehicleIds?: string[]) => void;
  resetDayInventory: (date: string, vehicleIds?: string[]) => void;
  patchSettings: (patch: Partial<MockSettings>) => void;
  upsertVehicle: (vehicle: MockVehicle) => void;
  patchVehicle: (id: string, patch: Partial<MockVehicle>) => void;
  upsertStaff: (row: MockStaff) => void;
  patchStaff: (id: string, patch: Partial<MockStaff>) => void;
  patchTemplate: (id: string, patch: Partial<MockEmailTemplate>) => void;
  upsertStore: (store: MockStore) => void;
  addSpecialDate: (row: MockSpecialDate) => void;
  pushLog: (entry: Omit<MockLog, "id" | "time" | "ip"> & { time?: string; ip?: string }) => void;
  commitWebsiteBooking: (input: WebsiteBookingInput) => { ok: boolean; already: boolean; order: MockOrder | null };
  patchCms: (patch: Partial<CmsState>) => void;
};

function replaceById<T extends { id: string }>(list: T[], item: T) {
  const index = list.findIndex((row) => row.id === item.id);
  if (index < 0) return [item, ...list];
  const next = [...list];
  next[index] = item;
  return next;
}

function nowStamp() {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function makeLog(
  type: LogType,
  detail: string,
  storeId?: string,
  actor = "系统",
  role = "系统",
): MockLog {
  return {
    id: `l-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    time: nowStamp(),
    actor,
    role,
    type,
    detail,
    ip: "127.0.0.1",
    storeId,
  };
}

function orderLog(action: string, note = "", actor = "后台") {
  return { time: nowStamp(), actor, action, note };
}

function toWebsiteOrder(input: WebsiteBookingInput, addons: MockAddon[]): MockOrder {
  const labels = input.addonSlugs.map(
    (slug) => addons.find((item) => item.slug === slug)?.name ?? slug,
  );
  return {
    id: input.ref,
    customer: input.name || "Guest",
    nationality: input.nationality || "—",
    email: input.email,
    phone: input.phone,
    passport: input.passport || "—",
    planName: input.planName,
    planSlug: input.planSlug,
    date: input.date,
    time: input.time,
    riders: Math.max(1, input.riders),
    male: Math.max(1, input.riders),
    female: 0,
    addons: labels,
    totalJpy: input.totalJpy,
    channel: "官网",
    status: "pending",
    paid: true,
    note: input.note || "官网支付完成，待确认。",
    logs: [orderLog("创建订单", "官网支付", "官网")],
    storeId: input.storeId || DEFAULT_STORE_ID,
  };
}

export const useOpsStore = create<OpsState>()(
  persist(
    (set, get) => ({
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
      logs: MOCK_LOGS,
      cms: MOCK_CMS,
      upsertOrder: (order, fromId) =>
        set((state) => {
          const lookup = fromId || order.id;
          const prev = state.orders.find((item) => item.id === lookup);
          const base = fromId && fromId !== order.id ? state.orders.filter((item) => item.id !== fromId) : state.orders;
          return {
            orders: replaceById(base, order),
            vehicleSlots: syncOrderInventory(state.vehicleSlots, prev, order, state.vehicles),
            logs: [
              makeLog("订单修改", `${prev ? "更新" : "新建"} ${order.id}`, order.storeId, "后台", "店长"),
              ...state.logs,
            ],
          };
        }),
      patchOrder: (id, patch) =>
        set((state) => {
          const prev = state.orders.find((item) => item.id === id);
          if (!prev) return state;
          const next = { ...prev, ...patch };
          const statusChanged = prev.status !== next.status;
          return {
            orders: state.orders.map((item) =>
              item.id === id
                ? {
                    ...next,
                    logs: statusChanged
                      ? [...next.logs, orderLog(next.status === "cancelled" ? "取消订单" : "更新状态")]
                      : next.logs,
                  }
                : item,
            ),
            vehicleSlots: syncOrderInventory(state.vehicleSlots, prev, next, state.vehicles),
            logs: statusChanged
              ? [makeLog("订单修改", `${next.id} → ${next.status}`, next.storeId, "后台", "店长"), ...state.logs]
              : state.logs,
          };
        }),
      setOrderStatus: (id, status) => get().patchOrder(id, { status }),
      upsertAddon: (addon) =>
        set((state) => ({
          addons: replaceById(state.addons, addon),
          logs: [makeLog("套餐上下架", `附加项 ${addon.name} 已保存`), ...state.logs],
        })),
      patchAddon: (id, patch) =>
        set((state) => {
          const prev = state.addons.find((item) => item.id === id);
          const detail =
            prev && patch.active !== undefined && patch.active !== prev.active
              ? `${prev.name} ${patch.active ? "上架" : "下架"}`
              : prev && patch.priceJpy !== undefined
                ? `${prev.name} 价格更新`
                : `附加项 ${id} 更新`;
          return {
            addons: state.addons.map((item) => (item.id === id ? { ...item, ...patch } : item)),
            logs: [makeLog("套餐上下架", detail), ...state.logs],
          };
        }),
      removeAddon: (id) =>
        set((state) => ({
          addons: state.addons.filter((item) => item.id !== id),
          logs: [makeLog("套餐上下架", `删除附加项 ${id}`), ...state.logs],
        })),
      upsertPlan: (plan) =>
        set((state) => ({
          plans: replaceById(state.plans, plan),
          logs: [makeLog("套餐上下架", `保存套餐 ${plan.name || plan.slug}`), ...state.logs],
        })),
      patchPlan: (id, patch) =>
        set((state) => {
          const prev = state.plans.find((item) => item.id === id);
          const detail =
            prev && patch.active !== undefined && patch.active !== prev.active
              ? `${prev.name} ${patch.active ? "上架" : "下架"}`
              : prev && patch.priceJpy !== undefined
                ? `${prev.name} 价格改为 ¥${patch.priceJpy}`
                : `更新套餐 ${prev?.name ?? id}`;
          return {
            plans: state.plans.map((item) => (item.id === id ? { ...item, ...patch } : item)),
            logs: [makeLog("套餐上下架", detail), ...state.logs],
          };
        }),
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
            logs: [makeLog("库存调整", `${date} 批量改了 ${targets.length} 个时段`), ...state.logs],
          };
        }),
      clearDayInventory: (date, vehicleIds) =>
        set((state) => ({
          vehicleSlots: state.vehicleSlots.map((item) =>
            item.date === date && (!vehicleIds || vehicleIds.includes(item.vehicleId))
              ? applySlotPatch(item, { booked: item.capacity, closed: false, customers: [] })
              : item,
          ),
          logs: [makeLog("库存调整", `${date} 清空余位`), ...state.logs],
        })),
      resetDayInventory: (date, vehicleIds) =>
        set((state) => {
          const vehicles = vehicleIds
            ? state.vehicles.filter((item) => vehicleIds.includes(item.id))
            : state.vehicles;
          const ids = new Set(vehicles.map((item) => item.id));
          const storeIds = new Set(vehicles.map((item) => storeIdOf(item.storeId)));
          const orders = state.orders.filter((item) => storeIds.has(storeIdOf(item.storeId)));
          return {
            vehicleSlots: [
              ...state.vehicleSlots.filter((item) => item.date !== date || !ids.has(item.vehicleId)),
              ...buildVehicleTimelineForDate(date, vehicles, orders),
            ],
            logs: [makeLog("库存调整", `${date} 重置库存`), ...state.logs],
          };
        }),
      patchSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
          logs: [makeLog("员工变更", "更新系统设置"), ...state.logs],
        })),
      upsertVehicle: (vehicle) => set((state) => ({ vehicles: replaceById(state.vehicles, vehicle) })),
      patchVehicle: (id, patch) =>
        set((state) => ({
          vehicles: state.vehicles.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),
      upsertStaff: (row) =>
        set((state) => ({
          staff: replaceById(state.staff, row),
          logs: [makeLog("员工变更", `保存员工 ${row.name}`), ...state.logs],
        })),
      patchStaff: (id, patch) =>
        set((state) => ({
          staff: state.staff.map((item) => (item.id === id ? { ...item, ...patch } : item)),
          logs: [makeLog("员工变更", `更新员工 ${id}`), ...state.logs],
        })),
      patchTemplate: (id, patch) =>
        set((state) => ({
          templates: state.templates.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),
      upsertStore: (store) =>
        set((state) => ({
          stores: replaceById(state.stores, store),
          logs: [makeLog("员工变更", `更新门店 ${store.name}`), ...state.logs],
        })),
      addSpecialDate: (row) =>
        set((state) => ({
          specialDates: [row, ...state.specialDates],
          logs: [makeLog("库存调整", `${row.date} ${row.label}`), ...state.logs],
        })),
      pushLog: (entry) =>
        set((state) => ({
          logs: [
            makeLog(entry.type, entry.detail, entry.storeId, entry.actor, entry.role),
            ...state.logs,
          ],
        })),
      commitWebsiteBooking: (input) => {
        const state = get();
        const existing = state.orders.find((item) => item.id === input.ref);
        if (existing) return { ok: true, already: true, order: existing };
        const order = toWebsiteOrder(input, state.addons);
        set({
          orders: [order, ...state.orders],
          vehicleSlots: syncOrderInventory(state.vehicleSlots, undefined, order, state.vehicles),
          logs: [
            makeLog(
              "订单修改",
              `官网预订 ${order.id} ${order.planName} ${order.date} ${order.time}`,
              order.storeId,
              "官网",
              "系统",
            ),
            ...state.logs,
          ],
        });
        return { ok: true, already: false, order };
      },
      patchCms: (patch) =>
        set((state) => ({
          cms: { ...state.cms, ...patch },
        })),
    }),
    {
      name: OPS_STORAGE_KEY,
      version: 3,
      storage: opsPersistStorage,
      partialize: (state) => ({
        orders: state.orders,
        addons: state.addons,
        plans: state.plans,
        vehicleSlots: state.vehicleSlots,
        specialDates: state.specialDates,
        settings: state.settings,
        vehicles: state.vehicles,
        staff: state.staff,
        templates: state.templates,
        stores: state.stores,
        logs: state.logs.slice(0, 200),
        cms: state.cms,
      }),
      merge: (persisted, current) => {
        const extra = (persisted ?? {}) as Partial<OpsState>;
        return {
          ...current,
          ...extra,
          logs: extra.logs ?? current.logs,
          orders: extra.orders ?? current.orders,
          plans: (extra.plans ?? current.plans).map((row) => {
            const seed =
              MOCK_PLANS.find((item) => item.id === row.id) ??
              MOCK_PLANS.find((item) => item.slug === row.slug);
            if (!seed) return row;
            return {
              ...seed,
              ...row,
              coverImage: row.coverImage,
              detailImage: row.detailImage,
              description: row.description,
              descriptionEn: row.descriptionEn,
              descriptionJa: row.descriptionJa,
              descriptionKo: row.descriptionKo,
              highlights: row.highlights,
              highlightsEn: row.highlightsEn,
              highlightsJa: row.highlightsJa,
              highlightsKo: row.highlightsKo,
            };
          }),
          addons: extra.addons ?? current.addons,
          vehicleSlots: extra.vehicleSlots ?? current.vehicleSlots,
          settings: {
            ...MOCK_SETTINGS,
            ...extra.settings,
            channels: extra.settings?.channels?.length ? extra.settings.channels : MOCK_SETTINGS.channels,
          },
          cms: mergeCms(MOCK_CMS, extra.cms),
        };
      },
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === OPS_STORAGE_KEY) {
      void useOpsStore.persist.rehydrate();
    }
  });
}
