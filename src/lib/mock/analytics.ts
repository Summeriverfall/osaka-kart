import { addDaysIso, addMonthsIso, addYearsIso, eachIso, monthStartIso, weekEndSunday, weekStartMonday } from "@/lib/calendar";
import { adminChannel, adminDaypart, adminGender, adminNation, adminPlanName } from "@/lib/admin/copy";
import { BOOKING_DAYPARTS } from "@/lib/booking/slots";
import { MOCK_PLANS } from "@/lib/mock/plans";
import { REPORT_AGES } from "@/lib/mock/reports";
import { withAnalyticsHistory } from "@/lib/mock/history-orders";
import type { MockOrder } from "@/lib/mock/orders";

export type CompareMode = "week" | "month" | "year";
export type DateRange = { from: string; to: string };

export type AnalyticsKpi = {
  bookings: number;
  completed: number;
  cancelled: number;
  revenue: number;
  profit: number;
  aov: number;
};

export type AnalyticsDelta = {
  label: string;
  tone: "up" | "down" | "flat";
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

export function defaultAnalyticsRange(mode: CompareMode, today: string): DateRange {
  if (mode === "week") {
    const from = weekStartMonday(today);
    return { from, to: weekEndSunday(today) };
  }
  return { from: monthStartIso(today), to: today };
}

export function shiftRange(range: DateRange, mode: CompareMode): DateRange {
  if (mode === "week") {
    return { from: addDaysIso(range.from, -7), to: addDaysIso(range.to, -7) };
  }
  if (mode === "year") {
    return { from: addYearsIso(range.from, -1), to: addYearsIso(range.to, -1) };
  }
  return { from: addMonthsIso(range.from, -1), to: addMonthsIso(range.to, -1) };
}

export function clampRange(range: DateRange, today: string): DateRange {
  const from = range.from || today;
  const to = range.to || today;
  return from <= to ? { from, to } : { from: to, to: from };
}

export function formatDelta(current: number, previous: number, fresh = "新"): AnalyticsDelta {
  if (previous === 0) {
    if (current === 0) return { label: "—", tone: "flat" };
    return { label: fresh, tone: "up" };
  }
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 0.05) return { label: "0%", tone: "flat" };
  const sign = pct > 0 ? "+" : "";
  return {
    label: `${sign}${pct.toFixed(1)}%`,
    tone: pct > 0 ? "up" : "down",
  };
}

function inRange(date: string, range: DateRange) {
  return date >= range.from && date <= range.to;
}

function billedOf(orders: MockOrder[]) {
  return orders.filter((item) => item.status === "completed");
}

function summarize(orders: MockOrder[], cuts: Record<string, number>): AnalyticsKpi {
  const billed = billedOf(orders);
  const revenue = billed.reduce((sum, item) => sum + item.totalJpy, 0);
  const profit = billed.reduce((sum, item) => {
    const cut = cuts[item.channel] ?? 0;
    return sum + Math.round(item.totalJpy * (1 - cut));
  }, 0);
  return {
    bookings: orders.length,
    completed: billed.length,
    cancelled: orders.filter((item) => item.status === "cancelled").length,
    revenue,
    profit,
    aov: billed.length ? Math.round(revenue / billed.length) : 0,
  };
}

function dailyMap(orders: MockOrder[]) {
  const map = new Map<string, { bookings: number; revenue: number }>();
  for (const item of orders) {
    const row = map.get(item.date) ?? { bookings: 0, revenue: 0 };
    row.bookings += 1;
    if (item.status === "completed") row.revenue += item.totalJpy;
    map.set(item.date, row);
  }
  return map;
}

function mixFromOrders(orders: MockOrder[], locale: string) {
  const live = billedOf(orders);

  const planMap = new Map<string, { sold: number; revenue: number }>();
  for (const item of live) {
    const seed = MOCK_PLANS.find((plan) => plan.slug === item.planSlug);
    const name = adminPlanName(locale, seed, item.planName);
    const row = planMap.get(name) ?? { sold: 0, revenue: 0 };
    row.sold += 1;
    row.revenue += item.totalJpy;
    planMap.set(name, row);
  }
  const plans = [...planMap.entries()]
    .map(([name, value]) => ({ name, ...value }))
    .sort((a, b) => b.sold - a.sold);

  const channelMap = new Map<string, { orders: number; revenue: number }>();
  for (const item of live) {
    const row = channelMap.get(item.channel) ?? { orders: 0, revenue: 0 };
    row.orders += 1;
    row.revenue += item.totalJpy;
    channelMap.set(item.channel, row);
  }
  const channels = [...channelMap.entries()]
    .map(([id, value]) => ({
      id,
      name: adminChannel(locale, id),
      fill: CHANNEL_FILL[id] ?? "#9CA3AF",
      ...value,
    }))
    .sort((a, b) => b.orders - a.orders);

  const nationMap = new Map<string, { value: number; fill: string }>();
  for (const item of live) {
    const name = adminNation(locale, item.nationality);
    const fill = NATION_FILL[item.nationality] ?? "#9CA3AF";
    const row = nationMap.get(name) ?? { value: 0, fill };
    row.value += item.riders;
    nationMap.set(name, row);
  }
  const nations = [...nationMap.entries()]
    .map(([name, found]) => ({ name, ...found }))
    .sort((a, b) => b.value - a.value);

  const male = live.reduce((sum, item) => sum + item.male, 0);
  const female = live.reduce((sum, item) => sum + item.female, 0);
  const gender = [
    { name: adminGender(locale, "male"), value: male, fill: "#22D3EE" },
    { name: adminGender(locale, "female"), value: female, fill: "#FF2E93" },
  ].filter((item) => item.value > 0);

  const daypart = BOOKING_DAYPARTS.map((part) => ({
    band: adminDaypart(locale, part.id),
    range: part.range,
    id: part.id,
    people: live
      .filter((item) => (part.slots as readonly string[]).includes(item.time))
      .reduce((sum, item) => sum + item.riders, 0),
  }));

  const scale = Math.max(live.reduce((sum, item) => sum + item.riders, 0), 1) / 174;
  const ages = REPORT_AGES.map((item) => ({ ...item, people: Math.round(item.people * scale) }));

  return { plans, channels, nations, gender, daypart, ages };
}

export function analyticsFromOrders(
  orders: MockOrder[],
  currentRange: DateRange,
  previousRange: DateRange,
  locale = "zh-TW",
  cuts: Record<string, number> = {},
  storeId?: string,
  freshLabel = "新",
) {
  const pool = withAnalyticsHistory(orders, storeId);
  const currentOrders = pool.filter((item) => inRange(item.date, currentRange));
  const previousOrders = pool.filter((item) => inRange(item.date, previousRange));
  const current = summarize(currentOrders, cuts);
  const previous = summarize(previousOrders, cuts);

  const currentDays = eachIso(currentRange.from, currentRange.to);
  const previousDays = eachIso(previousRange.from, previousRange.to);
  const currentDaily = dailyMap(currentOrders);
  const previousDaily = dailyMap(previousOrders);
  const length = Math.max(currentDays.length, previousDays.length, 1);
  const mix = mixFromOrders(currentOrders, locale);
  const cancelled = currentOrders.filter((item) => item.status === "cancelled");
  const allDaily = dailyMap(pool);

  const trend = Array.from({ length }, (_, index) => {
    const currentIso = currentDays[index];
    const previousIso = previousDays[index];
    const now = currentIso ? currentDaily.get(currentIso) : undefined;
    const was = previousIso ? previousDaily.get(previousIso) : undefined;
    const lastYearIso = currentIso ? addYearsIso(currentIso, -1) : "";
    const lastYear = lastYearIso ? allDaily.get(lastYearIso) : undefined;
    return {
      day: (currentIso ?? previousIso ?? "").slice(5),
      iso: currentIso ?? previousIso ?? "",
      bookings: now?.bookings ?? 0,
      bookingsPrev: was?.bookings ?? 0,
      revenue: now?.revenue ?? 0,
      revenuePrev: was?.revenue ?? 0,
      revenueLastYear: lastYear?.revenue ?? 0,
      bookingsLastYear: lastYear?.bookings ?? 0,
    };
  });

  return {
    current,
    previous,
    deltas: {
      bookings: formatDelta(current.bookings, previous.bookings, freshLabel),
      completed: formatDelta(current.completed, previous.completed, freshLabel),
      cancelled: formatDelta(current.cancelled, previous.cancelled, freshLabel),
      revenue: formatDelta(current.revenue, previous.revenue, freshLabel),
      profit: formatDelta(current.profit, previous.profit, freshLabel),
      aov: formatDelta(current.aov, previous.aov, freshLabel),
    },
    trend,
    cancelSplit: {
      voluntary: cancelled.filter((item) => item.cancelKind !== "noshow").length,
      noshow: cancelled.filter((item) => item.cancelKind === "noshow").length,
    },
    ...mix,
  };
}
