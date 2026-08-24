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
  "/admin/dashboard": { title: "仪表盘", lead: "超管默认看全店合计，点分店可下钻。店长只看自己的店。" },
  "/admin/orders": { title: "订单管理", lead: "列表处理订单。点状态可直接改，不必进详情。" },
  "/admin/calendar": { title: "日历", lead: "月 / 周 / 日看订单分布。点日期下钻到当天列表。" },
  "/admin/inventory": { title: "库存管理", lead: "车辆时间轴。色块看出松紧，点击或拖拽即可改库存。" },
  "/admin/vehicles": { title: "车辆管理", lead: "10 辆车。维修中的会从当日库存扣除。" },
  "/admin/plans": { title: "套餐管理", lead: "编辑前台卡片：标题图、说明图、介绍与亮点，以及价格、时长和附加项。" },
  "/admin/reports": { title: "财务报表", lead: "营收趋势、渠道占比、用户画像。" },
  "/admin/staff": { title: "员工管理", lead: "超管可添加、改角色、重置密码和停用。" },
  "/admin/settings": { title: "系统设置", lead: "点标签跳到对应区块。手机上表格改成卡片，避免左右撑破。" },
  "/admin/settings/logs": { title: "操作日志详情", lead: "查看全部后台操作记录。" },
};

export function navForRole(role: AdminRole) {
  return ADMIN_NAV.filter((item) => item.roles.includes(role));
}

export function adminTabFromHref(href: string) {
  const path = decodeURIComponent((href.split("#")[0] ?? "").split("?")[0] ?? "")
    .replace(/\\/g, "/")
    .replace(/index\.html$/i, "")
    .replace(/\/$/, "");
  const match = path.match(/\/admin(?:\/(.*))?$/);
  if (!match) return null;
  const rest = (match[1] ?? "").replace(/\/$/, "");
  if (!rest) return "/admin/dashboard";
  return `/admin/${rest}`;
}

export function adminTabFromLocation() {
  if (typeof window === "undefined") return null;
  return adminTabFromHref(window.location.pathname);
}

export function normalizeAdminTab(href: string) {
  return adminTabFromHref(href) ?? "/admin/dashboard";
}
