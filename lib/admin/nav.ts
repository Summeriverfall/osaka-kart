import type { AdminRole } from "@/stores/admin-store";

export type AdminNavItem = {
  href: string;
  label: string;
  roles: AdminRole[];
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "仪表盘", roles: ["admin", "manager"] },
  { href: "/admin/orders", label: "订单管理", roles: ["admin", "manager"] },
  { href: "/admin/calendar", label: "日历", roles: ["admin", "manager"] },
  { href: "/admin/inventory", label: "库存管理", roles: ["admin", "manager"] },
  { href: "/admin/vehicles", label: "车辆管理", roles: ["admin", "manager"] },
  { href: "/admin/plans", label: "套餐管理", roles: ["admin", "manager"] },
  { href: "/admin/reports", label: "财务报表", roles: ["admin"] },
  { href: "/admin/staff", label: "员工管理", roles: ["admin"] },
  { href: "/admin/settings", label: "系统设置", roles: ["admin"] },
];

export const ADMIN_PAGE_META: Record<string, { title: string; lead: string }> = {
  "/admin/dashboard": { title: "仪表盘", lead: "今日订单、营收、待确认和空余车位。" },
  "/admin/orders": { title: "订单管理", lead: "列表可搜索。点行看详情，点编辑改状态。" },
  "/admin/calendar": { title: "日历", lead: "月 → 周 → 日。点格子下钻到该日订单。" },
  "/admin/inventory": { title: "库存管理", lead: "车辆时间轴。色块看出松紧，点击或拖拽即可改库存。" },
  "/admin/vehicles": { title: "车辆管理", lead: "10 辆车。维修中的会从当日库存扣除。" },
  "/admin/plans": { title: "套餐管理", lead: "上下架、价格、时长。勾选该套餐可购买的附加项。" },
  "/admin/reports": { title: "财务报表", lead: "营收趋势、渠道占比、用户画像。" },
  "/admin/staff": { title: "员工管理", lead: "超管可添加、改角色、重置密码和停用。" },
  "/admin/settings": { title: "系统设置", lead: "支付开关、邮件模板、操作日志、门店。" },
};

export function navForRole(role: AdminRole) {
  return ADMIN_NAV.filter((item) => item.roles.includes(role));
}

export function normalizeAdminTab(href: string) {
  const path = href.split("?")[0].replace(/\/$/, "");
  if (path.startsWith("/admin")) return path || "/admin/dashboard";
  return `/admin${path.startsWith("/") ? path : `/${path}`}`;
}
