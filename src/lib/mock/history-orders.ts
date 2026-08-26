import { eachIso, parseIsoDate } from "@/lib/calendar";
import { MOCK_PLANS } from "@/lib/mock/plans";
import { CHANNELS, type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import { ALL_STORES_ID } from "@/lib/store-id";

const NAMES = [
  "Nina Cole",
  "陈一凡",
  "佐藤 葵",
  "Emma Blake",
  "박지훈",
  "Luis Ortega",
  "周启明",
  "Hannah Cole",
  "高橋 蓮",
  "Maya Singh",
];

const NATIONS = ["USA", "TW", "CN", "JP", "KR", "UK"];
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
const STATUSES: OrderStatus[] = [
  "completed",
  "completed",
  "completed",
  "confirmed",
  "cancelled",
  "pending",
];

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value = Math.imul(value ^ input.charCodeAt(index), 16777619);
  }
  return value >>> 0;
}

const HISTORY_RANGES: [string, string][] = [
  ["2025-08-01", "2025-08-31"],
  ["2026-07-01", "2026-07-31"],
  ["2026-08-01", "2026-08-12"],
];

export function buildHistoryOrders(): MockOrder[] {
  const plans = MOCK_PLANS.filter((plan) => plan.active);
  if (!plans.length) return [];
  const rows: MockOrder[] = [];

  for (const [from, to] of HISTORY_RANGES) {
    for (const date of eachIso(from, to)) {
      const seed = hash(date);
      const weekend = [0, 6].includes(parseIsoDate(date).getDay());
      const count = 1 + (seed % (weekend ? 4 : 3));
      for (let index = 0; index < count; index += 1) {
        const mix = hash(`${date}:${index}`);
        const plan = plans[mix % plans.length];
        const riders = 1 + (mix % 4);
        const male = mix % (riders + 1);
        const status = STATUSES[mix % STATUSES.length];
        const channel = CHANNELS[mix % CHANNELS.length];
        const extra = mix % 5 === 0 ? 2500 : mix % 7 === 0 ? 1500 : 0;
        const storeId = mix % 11 === 0 ? "shinsaibashi" : mix % 13 === 0 ? "umeda" : "namba";
        const compact = date.replace(/-/g, "");
        rows.push({
          id: `FK-H-${compact}-${index + 1}`,
          customer: NAMES[mix % NAMES.length],
          nationality: NATIONS[mix % NATIONS.length],
          email: `history.${compact}.${index}@example.com`,
          phone: "+81-6-7771-0100",
          passport: `HX${String(mix).slice(0, 7)}`,
          planName: plan.name,
          planSlug: plan.slug,
          date,
          time: SLOTS[mix % SLOTS.length],
          riders,
          male,
          female: riders - male,
          addons: extra ? ["GoPro 租赁"] : [],
          totalJpy: plan.priceJpy * riders + extra,
          channel,
          status,
          paid: status !== "cancelled",
          note: "",
          logs: [],
          storeId,
        });
      }
    }
  }

  return rows;
}

let cached: MockOrder[] | null = null;

export function historyOrders() {
  cached ??= buildHistoryOrders();
  return cached;
}

export function withAnalyticsHistory(orders: MockOrder[], storeId?: string) {
  const seen = new Set(orders.map((item) => item.id));
  return orders.concat(
    historyOrders().filter((item) => {
      if (seen.has(item.id)) return false;
      if (!storeId || storeId === ALL_STORES_ID) return true;
      return (item.storeId || "namba") === storeId;
    }),
  );
}
