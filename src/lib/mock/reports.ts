import { BOOKING_DAYPARTS } from "@/lib/booking/slots";
import { addDaysIso } from "@/lib/calendar";
import { adminChannel, adminDaypart, adminGender, adminNation, adminPlanName } from "@/lib/admin/copy";
import { MOCK_PLANS } from "@/lib/mock/plans";
import { type MockOrder } from "@/lib/mock/orders";

export const REPORT_CHANNELS = [
  { name: "Klook", value: 32, fill: "#38BDF8", orders: 86, revenue: 1284000, cut: 0.18 },
  { name: "官网", value: 20, fill: "#34D399", orders: 54, revenue: 802000, cut: 0 },
  { name: "Instagram", value: 12, fill: "#E1306C", orders: 22, revenue: 286000, cut: 0 },
  { name: "TikTok", value: 10, fill: "#69C9D0", orders: 18, revenue: 214000, cut: 0 },
  { name: "携程", value: 11, fill: "#287DFA", orders: 21, revenue: 355000, cut: 0.15 },
  { name: "微信", value: 8, fill: "#F59E0B", orders: 17, revenue: 256000, cut: 0.05 },
  { name: "WhatsApp", value: 4, fill: "#9CA3AF", orders: 9, revenue: 128000, cut: 0 },
  { name: "线下", value: 3, fill: "#FF2E93", orders: 6, revenue: 89000, cut: 0 },
];

export const REPORT_AGES = [
  { band: "18-25", people: 42 },
  { band: "26-35", people: 68 },
  { band: "36-45", people: 37 },
  { band: "46-55", people: 18 },
  { band: "56+", people: 9 },
];

export const REPORT_NATIONS = [
  { name: "美国", value: 30, fill: "#FF2E93" },
  { name: "中国", value: 25, fill: "#A855F7" },
  { name: "日本", value: 20, fill: "#22D3EE" },
  { name: "英国", value: 10, fill: "#34D399" },
  { name: "韩国", value: 8, fill: "#F59E0B" },
  { name: "其他", value: 7, fill: "#9CA3AF" },
];

export const REPORT_GENDER = [
  { name: "男", value: 58, fill: "#22D3EE" },
  { name: "女", value: 42, fill: "#FF2E93" },
];

const DAYPART_PEOPLE: Record<string, number> = {
  "10:00": 13,
  "11:30": 15,
  "13:00": 22,
  "14:30": 24,
  "16:00": 20,
  "17:30": 19,
  "19:00": 22,
};

export const REPORT_DAYPART = BOOKING_DAYPARTS.map((part) => ({
  band: part.label,
  range: part.range,
  people: part.slots.reduce((sum, slot) => sum + (DAYPART_PEOPLE[slot] ?? 0), 0),
}));

export const REPORT_PLANS = [
  { name: "难波 60", sold: 64, revenue: 819200 },
  { name: "通天阁 90", sold: 51, revenue: 805800 },
  { name: "大阪城 120", sold: 38, revenue: 714400 },
  { name: "黄昏湾岸 45", sold: 29, revenue: 145000 },
  { name: "夜间霓虹 90", sold: 22, revenue: 330000 },
];

function dayIso(offset: number) {
  const date = new Date(2026, 7, 20);
  date.setDate(date.getDate() - 29 + offset);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export const REPORT_TREND_30D = Array.from({ length: 30 }, (_, index) => {
  const wave = Math.sin(index / 4.2) * 18000 + 42000;
  const weekendBoost = index % 7 === 5 || index % 7 === 6 ? 16000 : 0;
  const current = Math.round(wave + weekendBoost + (index % 5) * 2200);
  const previous = Math.round(current * 0.82 + 8000);
  return {
    day: dayIso(index).slice(5),
    iso: dayIso(index),
    current,
    previous,
  };
});

export const REPORT_WEEK_7D = REPORT_TREND_30D.slice(-7).map((item) => ({
  day: item.day,
  orders: Math.round(item.current / 6200),
}));

export const REPORT_SUMMARY = {
  revenue: 3200000,
  orders: 215,
  avg: 14883,
  refunds: 34600,
};

export type ReportRange = { from: string; to: string };
export type RangeKind = "today" | "week" | "month" | "custom";

const CHANNEL_CUT: Record<string, number> = {
  Klook: 0.18,
  官网: 0,
  Instagram: 0,
  TikTok: 0,
  携程: 0.15,
  微信: 0.05,
  WhatsApp: 0,
  线下: 0,
};

const CHANNEL_FILL: Record<string, string> = {
  Klook: "#38BDF8",
  官网: "#34D399",
  Instagram: "#E1306C",
  TikTok: "#69C9D0",
  携程: "#287DFA",
  微信: "#F59E0B",
  WhatsApp: "#9CA3AF",
  线下: "#FF2E93",
};

const NATION_FILL: Record<string, string> = {
  USA: "#FF2E93",
  TW: "#A855F7",
  CN: "#C084FC",
  JP: "#22D3EE",
  KR: "#F59E0B",
  UK: "#34D399",
};

export function resolveReportRange(kind: RangeKind, today: string, custom: ReportRange): ReportRange {
  if (kind === "today") return { from: today, to: today };
  if (kind === "week") return { from: addDaysIso(today, -6), to: today };
  if (kind === "month") return { from: `${today.slice(0, 7)}-01`, to: today };
  const from = custom.from || addDaysIso(today, -13);
  const to = custom.to || today;
  return from <= to ? { from, to } : { from: to, to: from };
}

function eachIso(from: string, to: string) {
  const days: string[] = [];
  if (!from || !to || from > to) return days;
  for (let cursor = from; cursor <= to; cursor = addDaysIso(cursor, 1)) {
    days.push(cursor);
  }
  return days;
}

export function reportsFromOrders(
  orders: MockOrder[],
  range?: ReportRange,
  locale = "zh-TW",
  cuts?: Record<string, number>,
) {
  const scoped = range ? orders.filter((item) => item.date >= range.from && item.date <= range.to) : orders;
  const billed = scoped.filter((item) => item.status === "completed");
  const pending = scoped.filter((item) => item.status === "pending");
  const cancelled = scoped.filter((item) => item.status === "cancelled");
  const revenue = billed.reduce((sum, item) => sum + item.totalJpy, 0);
  const refunds = cancelled.reduce((sum, item) => sum + item.totalJpy, 0);
  const summary = {
    revenue,
    orders: billed.length,
    avg: billed.length ? Math.round(revenue / billed.length) : 0,
    refunds,
    pending: pending.length,
    cancelled: cancelled.length,
  };

  const channelMap = new Map<string, { orders: number; revenue: number }>();
  for (const item of billed) {
    const current = channelMap.get(item.channel) ?? { orders: 0, revenue: 0 };
    current.orders += 1;
    current.revenue += item.totalJpy;
    channelMap.set(item.channel, current);
  }
  const channels = [...channelMap.entries()].map(([key, found]) => {
    const cut = cuts?.[key] ?? CHANNEL_CUT[key] ?? 0;
    return {
      id: key,
      name: adminChannel(locale, key),
      fill: CHANNEL_FILL[key] ?? "#9CA3AF",
      cut,
      orders: found.orders,
      revenue: found.revenue,
      net: Math.round(found.revenue * (1 - cut)),
      value: found.orders,
    };
  });

  const planMap = new Map<string, { sold: number; revenue: number }>();
  for (const item of billed) {
    const seed = MOCK_PLANS.find((plan) => plan.slug === item.planSlug);
    const name = adminPlanName(locale, seed, item.planName);
    const current = planMap.get(name) ?? { sold: 0, revenue: 0 };
    current.sold += 1;
    current.revenue += item.totalJpy;
    planMap.set(name, current);
  }
  const plans = [...planMap.entries()].map(([name, value]) => ({ name, ...value }));

  const nationMap = new Map<string, { value: number; fill: string }>();
  for (const item of billed) {
    const name = adminNation(locale, item.nationality);
    const fill = NATION_FILL[item.nationality] ?? "#9CA3AF";
    const current = nationMap.get(name) ?? { value: 0, fill };
    current.value += item.riders;
    nationMap.set(name, current);
  }
  const nations = [...nationMap.entries()].map(([name, found]) => ({
    name,
    value: found.value,
    fill: found.fill,
  }));

  const male = billed.reduce((sum, item) => sum + item.male, 0);
  const female = billed.reduce((sum, item) => sum + item.female, 0);
  const gender = [
    { name: adminGender(locale, "male"), value: male, fill: "#22D3EE" },
    { name: adminGender(locale, "female"), value: female, fill: "#FF2E93" },
  ].filter((item) => item.value > 0);

  const daypart = BOOKING_DAYPARTS.map((part) => ({
    band: adminDaypart(locale, part.id),
    range: part.range,
    id: part.id,
    people: billed
      .filter((item) => (part.slots as readonly string[]).includes(item.time))
      .reduce((sum, item) => sum + item.riders, 0),
  }));

  const days = range ? eachIso(range.from, range.to) : [];
  const span = Math.max(days.length, 1);
  const trendSource = days.length ? days : [...new Set(billed.map((item) => item.date))].sort();
  const trend = trendSource.map((iso) => {
    const current = billed.filter((order) => order.date === iso).reduce((sum, order) => sum + order.totalJpy, 0);
    const prevIso = addDaysIso(iso, -span);
    const previous = orders
      .filter((order) => order.date === prevIso && order.status === "completed")
      .reduce((sum, order) => sum + order.totalJpy, 0);
    return { day: iso.slice(5), iso, current, previous };
  });

  const scale = Math.max(billed.reduce((sum, item) => sum + item.riders, 0), 1) / 174;
  const ages = REPORT_AGES.map((item) => ({ ...item, people: Math.round(item.people * scale) }));

  return {
    summary,
    channels,
    plans,
    nations,
    gender,
    daypart,
    trend,
    ages,
    pendingList: pending.slice(0, 10),
    cancelledList: cancelled.slice(0, 10),
  };
}
