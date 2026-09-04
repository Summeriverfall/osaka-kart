import type { MockAffiliate } from "@/lib/mock/affiliates";
import type { MockBookChannel } from "@/lib/mock/settings";
import type { MockOrder, OrderStatus } from "@/lib/mock/orders";

export function isBilledOrder(order: Pick<MockOrder, "status">) {
  return order.status === "confirmed" || order.status === "completed";
}

export function cutsFromChannels(channels?: MockBookChannel[]) {
  const map: Record<string, number> = {};
  for (const row of channels ?? []) map[row.id] = row.cut;
  return map;
}

export function orderNetJpy(
  order: Pick<MockOrder, "totalJpy" | "channel" | "affiliateId">,
  cuts: Record<string, number> = {},
  affiliates: Pick<MockAffiliate, "id" | "commissionPct">[] = [],
) {
  const cut = Math.min(1, Math.max(0, cuts[order.channel] ?? 0));
  const afterChannel = order.totalJpy * (1 - cut);
  const agent = order.affiliateId
    ? affiliates.find((item) => item.id === order.affiliateId)
    : undefined;
  const commission = agent ? (order.totalJpy * agent.commissionPct) / 100 : 0;
  return Math.max(0, Math.round(afterChannel - commission));
}

export function sumOrderNet(
  orders: MockOrder[],
  cuts: Record<string, number> = {},
  affiliates: Pick<MockAffiliate, "id" | "commissionPct">[] = [],
) {
  return orders
    .filter(isBilledOrder)
    .reduce((sum, item) => sum + orderNetJpy(item, cuts, affiliates), 0);
}

export const BILLED_STATUSES: OrderStatus[] = ["confirmed", "completed"];
