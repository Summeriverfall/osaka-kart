import { BOOKING_SLOTS } from "@/lib/booking/slots";

export type MockSlotStock = {
  date: string;
  time: string;
  remaining: number;
  capacity: number;
  closed: boolean;
};

export type MockSpecialDate = {
  date: string;
  label: string;
  closed: boolean;
  storeId?: string;
};

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

export const MOCK_SPECIAL_DATES: MockSpecialDate[] = [
  { date: "2026-08-22", label: "夏季夜跑加场", closed: false, storeId: "namba" },
  { date: "2026-08-25", label: "台风预警，全天休业", closed: true, storeId: "namba" },
  { date: "2026-08-31", label: "包场活动", closed: true, storeId: "namba" },
  { date: "2026-08-28", label: "心斋桥施工绕行", closed: false, storeId: "shinsaibashi" },
];
