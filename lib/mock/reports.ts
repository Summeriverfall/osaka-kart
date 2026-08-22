import { BOOKING_DAYPARTS } from "@/lib/booking/slots";
import { type MockOrder } from "@/lib/mock/orders";

export const REPORT_CHANNELS = [
  { name: "Klook", value: 40, fill: "#38BDF8", orders: 86, revenue: 1284000, cut: 0.18 },
  { name: "官网", value: 25, fill: "#34D399", orders: 54, revenue: 802000, cut: 0 },
  { name: "Viator", value: 20, fill: "#A855F7", orders: 43, revenue: 641000, cut: 0.2 },
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

const NATION_LABEL: Record<string, string> = {
  USA: "美国",
  TW: "台湾",
  CN: "中国",
  JP: "日本",
  KR: "韩国",
  UK: "英国",
  DE: "其他",
  FR: "其他",
  AU: "其他",
  SG: "其他",
  IT: "其他",
  HK: "其他",
};

const NATION_FILL: Record<string, string> = {
  美国: "#FF2E93",
  台湾: "#A855F7",
  中国: "#A855F7",
  日本: "#22D3EE",
  英国: "#34D399",
  韩国: "#F59E0B",
  其他: "#9CA3AF",
};

export function reportsFromOrders(orders: MockOrder[]) {
  const live = orders.filter((item) => item.status !== "cancelled");
  const cancelled = orders.filter((item) => item.status === "cancelled");
  const revenue = live.reduce((sum, item) => sum + item.totalJpy, 0);
  const refunds = cancelled.reduce((sum, item) => sum + item.totalJpy, 0);
  const summary = {
    revenue,
    orders: orders.length,
    avg: live.length ? Math.round(revenue / live.length) : 0,
    refunds,
  };

  const channelMap = new Map<string, { orders: number; revenue: number }>();
  for (const item of live) {
    const current = channelMap.get(item.channel) ?? { orders: 0, revenue: 0 };
    current.orders += 1;
    current.revenue += item.totalJpy;
    channelMap.set(item.channel, current);
  }
  const channels = REPORT_CHANNELS.map((item) => {
    const found = channelMap.get(item.name) ?? { orders: 0, revenue: 0 };
    return {
      ...item,
      orders: found.orders,
      revenue: found.revenue,
      value: found.orders,
    };
  }).filter((item) => item.orders > 0);

  const planMap = new Map<string, { sold: number; revenue: number }>();
  for (const item of live) {
    const current = planMap.get(item.planName) ?? { sold: 0, revenue: 0 };
    current.sold += 1;
    current.revenue += item.totalJpy;
    planMap.set(item.planName, current);
  }
  const plans = [...planMap.entries()].map(([name, value]) => ({ name, ...value }));

  const nationMap = new Map<string, number>();
  for (const item of live) {
    const name = NATION_LABEL[item.nationality] ?? "其他";
    nationMap.set(name, (nationMap.get(name) ?? 0) + item.riders);
  }
  const nations = [...nationMap.entries()].map(([name, value]) => ({
    name,
    value,
    fill: NATION_FILL[name] ?? "#9CA3AF",
  }));

  const male = live.reduce((sum, item) => sum + item.male, 0);
  const female = live.reduce((sum, item) => sum + item.female, 0);
  const gender = [
    { name: "男", value: male, fill: "#22D3EE" },
    { name: "女", value: female, fill: "#FF2E93" },
  ].filter((item) => item.value > 0);

  const daypart = BOOKING_DAYPARTS.map((part) => ({
    band: part.label,
    range: part.range,
    people: live
      .filter((item) => (part.slots as readonly string[]).includes(item.time))
      .reduce((sum, item) => sum + item.riders, 0),
  }));

  const trend = REPORT_TREND_30D.map((item) => {
    const dayOrders = orders.filter((order) => order.date === item.iso && order.status !== "cancelled");
    const current = dayOrders.reduce((sum, order) => sum + order.totalJpy, 0);
    return { ...item, current, previous: Math.round(current * 0.8) };
  });

  const scale = Math.max(live.reduce((sum, item) => sum + item.riders, 0), 1) / 174;
  const ages = REPORT_AGES.map((item) => ({ ...item, people: Math.round(item.people * scale) }));

  return { summary, channels, plans, nations, gender, daypart, trend, ages };
}
