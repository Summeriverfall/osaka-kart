import { japanAppointmentPassed } from "@/lib/japan-time";
import type { MockOrder } from "@/lib/mock/orders";

function stamp(now = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function confirmDueOrders(orders: MockOrder[], now = Date.now()) {
  let changed = 0;
  const next = orders.map((item) => {
    if (item.status !== "pending") return item;
    if (!japanAppointmentPassed(item.date, item.time, now)) return item;
    changed += 1;
    return {
      ...item,
      status: "confirmed" as const,
      paid: true,
      logs: [...item.logs, { time: stamp(), actor: "系统", action: "自动确认", note: "日本时间已过预约开始时间" }],
    };
  });
  return { orders: next, changed };
}
