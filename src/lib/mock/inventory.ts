import { BOOKING_SLOTS, todayIsoDate } from "@/lib/booking/slots";
import { addDaysIso } from "@/lib/calendar";

export type MockSlotStock = {
  date: string;
  time: string;
  remaining: number;
  capacity: number;
  closed: boolean;
};

export type MockSpecialDate = {
  date: string;
  time?: string;
  label: string;
  closed: boolean;
  storeId?: string;
  seed?: boolean;
};

const SEED_SPECIAL_LABELS = new Set([
  "夏季夜跑加场",
  "夜间加场",
  "台风预警，全天休业",
  "包场活动",
  "心斋桥施工绕行",
  "车辆保养日",
]);

export function isSeedSpecialDate(row: MockSpecialDate) {
  return row.seed === true || SEED_SPECIAL_LABELS.has(row.label);
}

/** 相对今天滚一批测试日历：休业 / 加场，方便预约页看出可约、跟团、不可约。 */
export function buildDemoSpecialDates(today = todayIsoDate()): MockSpecialDate[] {
  return [
    { date: addDaysIso(today, 5), label: "台风预警，全天休业", closed: true, storeId: "namba", seed: true },
    { date: addDaysIso(today, 12), label: "夜间加场", closed: false, storeId: "namba", seed: true },
    { date: addDaysIso(today, 18), label: "包场活动", closed: true, storeId: "namba", seed: true },
    { date: addDaysIso(today, 22), label: "心斋桥施工绕行", closed: false, storeId: "shinsaibashi", seed: true },
    { date: addDaysIso(today, 28), label: "车辆保养日", closed: true, storeId: "namba", seed: true },
  ];
}

export function mergeFreshSpecialDates(rows: MockSpecialDate[], today = todayIsoDate()): MockSpecialDate[] {
  const custom = rows.filter((row) => !isSeedSpecialDate(row));
  return [...buildDemoSpecialDates(today), ...custom];
}

export function buildMonthInventory(): MockSlotStock[] {
  const rows: MockSlotStock[] = [];
  for (let day = 1; day <= 30; day += 1) {
    const date = `2026-08-${String(day).padStart(2, "0")}`;
    const closedDay = day === 25;
    BOOKING_SLOTS.forEach((time, index) => {
      const capacity = 8;
      const booked = closedDay ? capacity : (day + index * 3) % 9;
      rows.push({
        date,
        time,
        capacity,
        remaining: Math.max(0, capacity - booked),
        closed: closedDay || (day === 31),
      });
    });
  }
  return rows;
}

export function defaultSlotStock() {
  return buildMonthInventory().filter((item) => item.date === "2026-08-20");
}

export const MOCK_SPECIAL_DATES: MockSpecialDate[] = buildDemoSpecialDates();
