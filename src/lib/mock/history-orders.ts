import { addDaysIso, addYearsIso, eachIso, monthStartIso, parseIsoDate } from "@/lib/calendar";
import { todayIsoDate } from "@/lib/booking/slots";
import { MOCK_PLANS } from "@/lib/mock/plans";
import type { MockOrder, OrderStatus } from "@/lib/mock/orders";
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
  "Oliver Grant",
  "林诗涵",
  "伊藤 直人",
  "Sofia Marino",
  "김서연",
];

const NATIONS = ["USA", "TW", "CN", "JP", "KR", "UK", "SG", "AU"];
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
const CHANNELS = ["官网", "Klook", "Viator", "携程", "Instagram", "TikTok", "微信", "WhatsApp", "线下", "GetYourGuide"];

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value = Math.imul(value ^ input.charCodeAt(index), 16777619);
  }
  return value >>> 0;
}

export function isHistoryOrder(order: Pick<MockOrder, "id">) {
  return order.id.startsWith("FK-H-");
}

function statusOf(mix: number, date: string, today: string): OrderStatus {
  if (date >= addDaysIso(today, -2)) return mix % 5 === 0 ? "pending" : "confirmed";
  if (mix % 12 === 0) return "cancelled";
  return "completed";
}

export function buildHistoryOrders(today = todayIsoDate()): MockOrder[] {
  const plans = MOCK_PLANS.filter((plan) => plan.active);
  if (!plans.length) return [];
  const from = monthStartIso(addYearsIso(today, -1));
  const to = addDaysIso(today, -7);
  if (from > to) return [];
  const rows: MockOrder[] = [];

  for (const date of eachIso(from, to)) {
    const seed = hash(date);
    const month = Number(date.slice(5, 7));
    const lastYear = date <= addYearsIso(today, -1);
    const weekend = [0, 6].includes(parseIsoDate(date).getDay());
    let count = 1 + (seed % (weekend ? 3 : 2));
    if (month >= 7 && month <= 9) count += 1;
    if (month === 1 || month === 2) count = Math.max(1, count - 1);
    if (lastYear && seed % 4 === 0) count = Math.max(1, count - 1);

    for (let index = 0; index < count; index += 1) {
      const mix = hash(`${date}:${index}`);
      const plan = plans[mix % plans.length];
      const riders = 1 + (mix % 4);
      const male = mix % (riders + 1);
      const status = statusOf(mix, date, today);
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
        cancelKind: status === "cancelled" ? (mix % 2 === 0 ? "noshow" : "voluntary") : undefined,
      });
    }
  }

  return rows;
}

let cached: { today: string; rows: MockOrder[] } | null = null;

export function historyOrders(today = todayIsoDate()) {
  if (cached?.today === today) return cached.rows;
  cached = { today, rows: buildHistoryOrders(today) };
  return cached.rows;
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
