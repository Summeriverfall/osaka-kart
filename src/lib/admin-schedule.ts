import { storeIdOf, isAllStores } from "@/lib/store-id";
import type { MockOrder } from "@/lib/mock/orders";

export function isHistoryOrderId(id: string) {
  return id.startsWith("FK-H-");
}

/** 订单列表 / 日历名单：不含历史演示单 */
export function adminListedOrders(orders: MockOrder[]) {
  return orders.filter((item) => !isHistoryOrderId(item.id));
}

/** 顶栏为全部店铺时，跟库存一样落到所选门店，三处数据对齐 */
export function adminShopOrders(orders: MockOrder[], storeId: string, focusStore: string) {
  const listed = adminListedOrders(orders);
  if (!isAllStores(storeId)) return listed;
  const sid = storeIdOf(focusStore);
  return listed.filter((item) => storeIdOf(item.storeId) === sid);
}

/** 库存占用 / 日历色块：未取消的名单订单 */
export function adminScheduleOrders(orders: MockOrder[]) {
  return adminListedOrders(orders).filter((item) => item.status !== "cancelled");
}
