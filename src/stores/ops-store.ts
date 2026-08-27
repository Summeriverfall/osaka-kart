import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_ADDONS, type MockAddon } from "@/lib/mock/addons";
import { MOCK_LOGS, type LogType, type MockLog } from "@/lib/mock/logs";
import { MOCK_ORDERS, buildWeekDemoOrders, isWebsiteLiveOrder, mergeFreshDemoOrders, type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import { MOCK_AFFILIATES, type MockAffiliate } from "@/lib/mock/affiliates";
import { MOCK_PLANS, type MockPlan } from "@/lib/mock/plans";
import { MOCK_SPECIAL_DATES, type MockSpecialDate } from "@/lib/mock/inventory";
import {
  buildVehicleTimeline,
  buildVehicleTimelineForDate,
  type VehicleSlotCell,
} from "@/lib/mock/vehicle-timeline";
import { MOCK_SETTINGS, MOCK_EMAIL_TEMPLATES, MOCK_STORES, refreshBundledChannels, type MockSettings, type MockEmailTemplate, type MockStore } from "@/lib/mock/settings";
import { MOCK_VEHICLES, type MockVehicle } from "@/lib/mock/vehicles";
import { MOCK_STAFF, type MockStaff } from "@/lib/mock/staff";
import { MOCK_CMS, mergeCms, refreshBundledVideos, type CmsState } from "@/lib/mock/cms";
import { applySlotPatch, syncOrderInventory } from "@/lib/ops-inventory";
import { DEFAULT_STORE_ID, storeIdOf } from "@/lib/store-id";
import { OPS_STORAGE_KEY, loadPersistedSlots, opsPersistStorage, savePersistedSlots } from "@/lib/ops-storage";

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
  affiliates: MockAffiliate[];
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
  batchPatchVehicleRange: (dates: string[], vehicleIds: string[], patch: Partial<VehicleSlotCell>) => void;
  clearDayInventory: (date: string, vehicleIds?: string[]) => void;
  resetDayInventory: (date: string, vehicleIds?: string[]) => void;
  patchSettings: (patch: Partial<MockSettings>) => void;
  upsertVehicle: (vehicle: MockVehicle) => void;
  patchVehicle: (id: string, patch: Partial<MockVehicle>) => void;
  upsertStaff: (row: MockStaff) => void;
  patchStaff: (id: string, patch: Partial<MockStaff>) => void;
  upsertAffiliate: (row: MockAffiliate) => void;
  patchAffiliate: (id: string, patch: Partial<MockAffiliate>) => void;
  patchTemplate: (id: string, patch: Partial<MockEmailTemplate>) => void;
  upsertStore: (store: MockStore) => void;
  addSpecialDate: (row: MockSpecialDate) => void;
  pushLog: (entry: Omit<MockLog, "id" | "time" | "ip"> & { time?: string; ip?: string }) => void;
  commitWebsiteBooking: (input: WebsiteBookingInput) => { ok: boolean; already: boolean; order: MockOrder | null };
  patchCms: (patch: Partial<CmsState>) => void;
  ensureInventory: () => void;
  ensureDemoOrders: () => void;
};

function readSlots(state: { vehicleSlots: VehicleSlotCell[]; vehicles: MockVehicle[]; orders: MockOrder[] }, buildIfMissing: boolean) {
  if (state.vehicleSlots.length) return state.vehicleSlots;
  const cached = loadPersistedSlots() as VehicleSlotCell[];
  if (cached.length) return cached;
  if (!buildIfMissing) return state.vehicleSlots;
  return buildVehicleTimeline(state.vehicles, state.orders);
}

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
      vehicleSlots: [] as VehicleSlotCell[],
      specialDates: MOCK_SPECIAL_DATES,
      settings: MOCK_SETTINGS,
      vehicles: MOCK_VEHICLES,
      staff: MOCK_STAFF,
      affiliates: MOCK_AFFILIATES,
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
            vehicleSlots: syncOrderInventory(readSlots(state, true), prev, order, state.vehicles),
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
            vehicleSlots: syncOrderInventory(readSlots(state, true), prev, next, state.vehicles),
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
          vehicleSlots: readSlots(state, true).map((item) =>
            item.vehicleId === vehicleId && item.date === date && item.time === time
              ? applySlotPatch(item, patch)
              : item,
          ),
        })),
      batchPatchVehicleSlots: (date, targets, patch) =>
        set((state) => {
          const keys = new Set(targets.map((item) => `${item.vehicleId}__${item.time}`));
          return {
            vehicleSlots: readSlots(state, true).map((item) =>
              item.date === date && keys.has(`${item.vehicleId}__${item.time}`)
                ? applySlotPatch(item, patch)
                : item,
            ),
            logs: [makeLog("库存调整", `${date} 批量改了 ${targets.length} 个时段`), ...state.logs],
          };
        }),
      batchPatchVehicleRange: (dates, vehicleIds, patch) =>
        set((state) => {
          const dateSet = new Set(dates);
          const idSet = new Set(vehicleIds);
          let slots = readSlots(state, true);
          const vehicles = state.vehicles.filter((item) => idSet.has(item.id));
          for (const date of dates) {
            const missing = vehicles.filter((vehicle) => !slots.some((cell) => cell.date === date && cell.vehicleId === vehicle.id));
            if (missing.length) {
              slots = [...slots, ...buildVehicleTimelineForDate(date, missing, state.orders)];
            }
          }
          return {
            vehicleSlots: slots.map((item) =>
              dateSet.has(item.date) && idSet.has(item.vehicleId) ? applySlotPatch(item, patch) : item,
            ),
            logs: [makeLog("库存调整", `批量改了 ${dates.length} 天 · ${vehicleIds.length} 辆车`), ...state.logs],
          };
        }),
      clearDayInventory: (date, vehicleIds) =>
        set((state) => ({
          vehicleSlots: readSlots(state, true).map((item) =>
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
          const slots = readSlots(state, true);
          return {
            vehicleSlots: [
              ...slots.filter((item) => item.date !== date || !ids.has(item.vehicleId)),
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
      upsertAffiliate: (row) =>
        set((state) => ({
          affiliates: replaceById(state.affiliates, row),
          logs: [makeLog("员工变更", `保存推广代理 ${row.name || row.code}`), ...state.logs],
        })),
      patchAffiliate: (id, patch) =>
        set((state) => ({
          affiliates: state.affiliates.map((item) => (item.id === id ? { ...item, ...patch } : item)),
          logs: [makeLog("员工变更", `更新推广代理 ${id}`), ...state.logs],
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
          vehicleSlots: state.vehicleSlots.length
            ? syncOrderInventory(state.vehicleSlots, undefined, order, state.vehicles)
            : state.vehicleSlots,
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
      ensureInventory: () =>
        set((state) => {
          if (state.vehicleSlots.length) return state;
          return { vehicleSlots: readSlots(state, true) };
        }),
      ensureDemoOrders: () =>
        set((state) => ({
          orders: mergeFreshDemoOrders(state.orders),
        })),
    }),
    {
      name: OPS_STORAGE_KEY,
      version: 13,
      skipHydration: true,
      storage: opsPersistStorage,
      migrate: (persisted, version) => {
        const state = { ...((persisted ?? {}) as Partial<OpsState>) };
        if (version < 4) {
          const live = (state.orders ?? []).filter(isWebsiteLiveOrder);
          const demo = buildWeekDemoOrders();
          const kept = new Set(live.map((item) => item.id));
          state.orders = [...live, ...demo.filter((item) => !kept.has(item.id))];
        }
        if (version < 6) {
          const cms = mergeCms(MOCK_CMS, state.cms);
          state.cms = {
            ...cms,
            videos: refreshBundledVideos(MOCK_CMS.videos, state.cms?.videos),
            labels: {
              ...cms.labels,
              videosTitle: MOCK_CMS.labels.videosTitle,
              videosLead: MOCK_CMS.labels.videosLead,
              experienceTitle: MOCK_CMS.labels.experienceTitle,
              experienceLead: MOCK_CMS.labels.experienceLead,
            },
          };
        }
        if (version < 8) {
          state.settings = {
            ...MOCK_SETTINGS,
            ...state.settings,
            channels: refreshBundledChannels(
              MOCK_SETTINGS.channels,
              state.settings?.channels,
              state.settings?.removedChannelIds,
            ),
            removedChannelIds: state.settings?.removedChannelIds ?? MOCK_SETTINGS.removedChannelIds,
          };
          state.orders = (state.orders ?? []).map((order) =>
            order.channel === "Viator" ? { ...order, channel: "Instagram" } : order,
          );
        }
        if (version < 9) {
          state.cms = mergeCms(MOCK_CMS, state.cms);
        }
        if (version < 10) {
          state.settings = {
            ...MOCK_SETTINGS,
            ...state.settings,
            channels: refreshBundledChannels(
              MOCK_SETTINGS.channels,
              state.settings?.channels,
              state.settings?.removedChannelIds,
            ),
            removedChannelIds: state.settings?.removedChannelIds ?? MOCK_SETTINGS.removedChannelIds,
          };
        }
        if (version < 11 && Array.isArray(state.vehicleSlots) && state.vehicleSlots.length) {
          savePersistedSlots(state.vehicleSlots);
        }
        if (version < 12) {
          const cms = mergeCms(MOCK_CMS, state.cms);
          state.cms = {
            ...cms,
            meetup: MOCK_CMS.meetup,
            site: {
              ...cms.site,
              brandName: MOCK_CMS.site.brandName,
              brandShort: MOCK_CMS.site.brandShort,
              footerCompany: MOCK_CMS.site.footerCompany,
            },
            faqs: (cms.faqs ?? []).map((item) =>
              item.id === "f3" ? (MOCK_CMS.faqs.find((row) => row.id === "f3") ?? item) : item,
            ),
          };
          state.orders = mergeFreshDemoOrders(state.orders ?? []);
          state.affiliates = state.affiliates?.length ? state.affiliates : MOCK_AFFILIATES;
          state.stores = (state.stores ?? MOCK_STORES).map((store) =>
            store.id === "namba"
              ? { ...store, address: MOCK_STORES[0].address, maps: MOCK_STORES[0].maps }
              : store,
          );
        }
        if (version < 13) {
          const cms = mergeCms(MOCK_CMS, state.cms);
          const prevFaqs = cms.faqs ?? [];
          const seedFaqIds = new Set(MOCK_CMS.faqs.map((item) => item.id));
          state.cms = {
            ...cms,
            site: { ...cms.site, hours: MOCK_CMS.site.hours },
            meetup: {
              ...cms.meetup,
              title: { ...cms.meetup.title, ja: MOCK_CMS.meetup.title.ja },
              lead: { ...cms.meetup.lead, ja: MOCK_CMS.meetup.lead.ja },
              address: { ...cms.meetup.address, ja: MOCK_CMS.meetup.address.ja },
              station: { ...cms.meetup.station, ja: MOCK_CMS.meetup.station.ja },
              walk: { ...cms.meetup.walk, ja: MOCK_CMS.meetup.walk.ja },
            },
            labels: {
              ...cms.labels,
              faqLead: { ...cms.labels.faqLead, ja: MOCK_CMS.labels.faqLead.ja },
              reviewsLead: { ...cms.labels.reviewsLead, ja: MOCK_CMS.labels.reviewsLead.ja },
              reviewsTitle: { ...cms.labels.reviewsTitle, ja: MOCK_CMS.labels.reviewsTitle.ja },
              videosTitle: { ...cms.labels.videosTitle, ja: MOCK_CMS.labels.videosTitle.ja },
              videosLead: { ...cms.labels.videosLead, ja: MOCK_CMS.labels.videosLead.ja },
              experienceTitle: { ...cms.labels.experienceTitle, ja: MOCK_CMS.labels.experienceTitle.ja },
              experienceLead: { ...cms.labels.experienceLead, ja: MOCK_CMS.labels.experienceLead.ja },
              faqTitle: { ...cms.labels.faqTitle, ja: MOCK_CMS.labels.faqTitle.ja },
              pressTitle: { ...cms.labels.pressTitle, ja: MOCK_CMS.labels.pressTitle.ja },
            },
            faqs: [
              ...MOCK_CMS.faqs.map((seed) => {
                const prev = prevFaqs.find((item) => item.id === seed.id);
                return prev ? { ...prev, q: { ...prev.q, ja: seed.q.ja }, a: { ...prev.a, ja: seed.a.ja } } : seed;
              }),
              ...prevFaqs.filter((item) => !seedFaqIds.has(item.id)),
            ],
            reviews: MOCK_CMS.reviews.map((seed) => {
              const prev = (cms.reviews ?? []).find((item) => item.id === seed.id);
              return prev ? { ...prev, quote: { ...prev.quote, ja: seed.quote.ja } } : seed;
            }),
            press: (cms.press ?? []).map((item) => {
              const seed = MOCK_CMS.press.find((row) => row.id === item.id);
              return seed
                ? { ...item, title: { ...item.title, ja: seed.title.ja }, source: { ...item.source, ja: seed.source.ja } }
                : item;
            }),
          };
          state.plans = (state.plans ?? MOCK_PLANS).map((row) => {
            const seed =
              MOCK_PLANS.find((item) => item.id === row.id) ?? MOCK_PLANS.find((item) => item.slug === row.slug);
            if (!seed) return row;
            return {
              ...row,
              nameJa: seed.nameJa,
              descriptionJa: seed.descriptionJa,
              highlightsJa: seed.highlightsJa,
              includesJa: seed.includesJa,
            };
          });
          state.addons = (state.addons ?? MOCK_ADDONS).map((row) => {
            const seed =
              MOCK_ADDONS.find((item) => item.id === row.id) ?? MOCK_ADDONS.find((item) => item.slug === row.slug);
            if (!seed) return row;
            return { ...row, nameJa: seed.nameJa, descriptionJa: seed.descriptionJa };
          });
          state.stores = (state.stores ?? MOCK_STORES).map((store) =>
            store.id === "namba" ? { ...store, hours: MOCK_STORES[0].hours } : store,
          );
        }
        delete state.vehicleSlots;
        return state as OpsState;
      },
      partialize: (state) => ({
        orders: state.orders,
        addons: state.addons,
        plans: state.plans,
        specialDates: state.specialDates,
        settings: state.settings,
        vehicles: state.vehicles,
        staff: state.staff,
        affiliates: state.affiliates,
        templates: state.templates,
        stores: state.stores,
        logs: state.logs.slice(0, 200),
        cms: state.cms,
      }),
      merge: (persisted, current) => {
        const extra = { ...((persisted ?? {}) as Partial<OpsState>) };
        delete extra.vehicleSlots;
        return {
          ...current,
          ...extra,
          vehicleSlots: current.vehicleSlots,
          logs: extra.logs ?? current.logs,
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
              descriptionJa: row.descriptionJa || seed.descriptionJa,
              descriptionKo: row.descriptionKo,
              highlights: row.highlights,
              highlightsEn: row.highlightsEn,
              highlightsJa: row.highlightsJa?.length ? row.highlightsJa : seed.highlightsJa,
              highlightsKo: row.highlightsKo,
              includesJa: row.includesJa?.length ? row.includesJa : seed.includesJa,
              includesEn: row.includesEn?.length ? row.includesEn : seed.includesEn,
            };
          }),
          addons: (extra.addons ?? current.addons).map((row) => {
            const seed = MOCK_ADDONS.find((item) => item.id === row.id) ?? MOCK_ADDONS.find((item) => item.slug === row.slug);
            if (!seed) return row;
            return {
              ...seed,
              ...row,
              descriptionJa: row.descriptionJa || seed.descriptionJa,
              descriptionEn: row.descriptionEn || seed.descriptionEn,
              nameJa: row.nameJa || seed.nameJa,
            };
          }),
          orders: mergeFreshDemoOrders(
            (extra.orders ?? current.orders).map((order) =>
              order.channel === "Viator" ? { ...order, channel: "Instagram" } : order,
            ),
          ),
          affiliates: extra.affiliates?.length ? extra.affiliates : current.affiliates,
          settings: {
            ...MOCK_SETTINGS,
            ...extra.settings,
            channels: refreshBundledChannels(
              MOCK_SETTINGS.channels,
              extra.settings?.channels,
              extra.settings?.removedChannelIds,
            ),
            removedChannelIds: extra.settings?.removedChannelIds ?? MOCK_SETTINGS.removedChannelIds,
          },
          cms: mergeCms(MOCK_CMS, extra.cms),
        };
      },
    },
  ),
);

let hydrateStarted = false;
let hydrateScheduled = false;

export function rehydrateOpsStore() {
  const run = () => {
    useOpsStore.getState().ensureDemoOrders();
  };
  if (hydrateStarted) {
    return Promise.resolve(useOpsStore.persist.rehydrate()).then(run);
  }
  hydrateStarted = true;
  return Promise.resolve(useOpsStore.persist.rehydrate()).then(run);
}

export function scheduleOpsRehydrate(urgent = false) {
  if (typeof window === "undefined") return;
  if (useOpsStore.persist.hasHydrated()) return;
  if (urgent) {
    void rehydrateOpsStore();
    return;
  }
  if (hydrateStarted || hydrateScheduled) return;
  hydrateScheduled = true;
  const start = () => {
    void rehydrateOpsStore();
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(start, { timeout: 1200 });
    return;
  }
  window.setTimeout(start, 0);
}

if (typeof window !== "undefined") {
  useOpsStore.subscribe((state, prev) => {
    if (!prev || state.vehicleSlots === prev.vehicleSlots || !state.vehicleSlots.length) return;
    savePersistedSlots(state.vehicleSlots);
  });
  window.addEventListener("storage", (event) => {
    if (event.key === OPS_STORAGE_KEY) {
      hydrateStarted = false;
      void rehydrateOpsStore();
    }
  });
}
