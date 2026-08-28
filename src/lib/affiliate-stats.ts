import type { MockAffiliate } from "@/lib/mock/affiliates";
import type { MockOrder } from "@/lib/mock/orders";

export function ordersOfAffiliate(affiliateId: string, orders: MockOrder[]) {
  return orders.filter((item) => item.affiliateId === affiliateId);
}

export function affiliateStats(affiliate: MockAffiliate, orders: MockOrder[]) {
  const related = ordersOfAffiliate(affiliate.id, orders);
  const live = related.filter((item) => item.status !== "cancelled");
  const completed = related.filter((item) => item.status === "completed");
  const amount = completed.reduce((sum, item) => sum + item.totalJpy, 0);
  const cut = (amount * affiliate.commissionPct) / 100;
  return { related: live, all: related, completed, amount, cut, orderCount: live.length };
}

export function affiliateReportRows(affiliates: MockAffiliate[], orders: MockOrder[]) {
  return affiliates
    .map((item) => {
      const stats = affiliateStats(item, orders);
      return { affiliate: item, ...stats };
    })
    .sort((a, b) => b.cut - a.cut);
}
