import type { AdminRole } from "@/stores/admin-store";

export type AdminNavItem = {
  href: string;
  label: string;
  roles: AdminRole[];
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "仪表盘", roles: ["admin", "manager", "staff"] },
  { href: "/admin/bookings", label: "预约管理", roles: ["admin", "manager", "staff"] },
  { href: "/admin/inventory", label: "库存管理", roles: ["admin", "manager", "staff"] },
  { href: "/admin/vehicles", label: "车辆管理", roles: ["admin", "manager", "staff"] },
  { href: "/admin/plans", label: "套餐管理", roles: ["admin", "manager", "staff"] },
  { href: "/admin/content", label: "内容管理", roles: ["admin", "manager", "staff"] },
  { href: "/admin/affiliates", label: "推广代理", roles: ["admin", "manager", "staff"] },
  { href: "/admin/reports", label: "财务报表", roles: ["admin"] },
  { href: "/admin/staff", label: "员工管理", roles: ["admin"] },
  { href: "/admin/permissions", label: "权限配置", roles: ["admin", "manager"] },
  { href: "/admin/settings", label: "系统设置", roles: ["admin"] },
  { href: "/admin/site", label: "全站配置", roles: ["admin"] },
];

export const ADMIN_BOOKING_NAV: AdminNavItem[] = [
  { href: "/admin/orders", label: "订单列表", roles: ["admin", "manager", "staff"] },
  { href: "/admin/calendar", label: "日历", roles: ["admin", "manager", "staff"] },
];

export const ADMIN_CONTENT_NAV: AdminNavItem[] = [
  { href: "/admin/content/videos", label: "视频管理", roles: ["admin", "manager", "staff"] },
  { href: "/admin/content/reviews", label: "用户评价", roles: ["admin", "manager", "staff"] },
  { href: "/admin/content/faq", label: "FAQ", roles: ["admin", "manager", "staff"] },
  { href: "/admin/content/press", label: "新闻报道", roles: ["admin", "manager", "staff"] },
  { href: "/admin/content/meetup", label: "集合地点", roles: ["admin", "manager", "staff"] },
];

export const ADMIN_REPORT_NAV: AdminNavItem[] = [
  { href: "/admin/reports/overview", label: "营收报表", roles: ["admin"] },
  { href: "/admin/reports/analytics", label: "数据分析", roles: ["admin"] },
];

export const ADMIN_SETTINGS_NAV: AdminNavItem[] = [
  { href: "/admin/settings/pay", label: "支付配置", roles: ["admin"] },
  { href: "/admin/settings/channels", label: "渠道设置", roles: ["admin"] },
  { href: "/admin/settings/booking", label: "预约开关设置", roles: ["admin"] },
  { href: "/admin/settings/stores", label: "门店管理", roles: ["admin"] },
  { href: "/admin/settings/email", label: "邮件设置", roles: ["admin"] },
  { href: "/admin/settings/refund", label: "退款政策", roles: ["admin"] },
  { href: "/admin/settings/logs", label: "操作日志", roles: ["admin"] },
];

export const SETTINGS_HOME = "/admin/settings/pay";
export const BOOKING_HOME = "/admin/orders";
export const CONTENT_HOME = "/admin/content/videos";
export const REPORT_HOME = "/admin/reports/overview";

export const ADMIN_PAGE_META: Record<string, { title: string; lead: string }> = {
  "/admin/dashboard": { title: "仪表盘", lead: "超管默认看全店合计，点分店可下钻。店长只看自己的店。" },
  "/admin/bookings": { title: "订单列表", lead: "列表处理订单。点状态可直接改，不必进详情。" },
  "/admin/orders": { title: "订单列表", lead: "列表处理订单。点状态可直接改，不必进详情。" },
  "/admin/calendar": { title: "日历", lead: "月 / 周 / 日看订单分布。点日期更新下方列表，点色块打开订单详情。" },
  "/admin/inventory": { title: "库存管理", lead: "点格子看占车详情，可建单或锁定时段。" },
  "/admin/vehicles": { title: "车辆管理", lead: "10 辆车。维修中的会从当日库存扣除。" },
  "/admin/plans": { title: "套餐管理", lead: "编辑套餐卡片、价格和时长。附加项在套餐编辑里添加、删除，并用开关标记内置项。" },
  "/admin/addons": { title: "套餐管理", lead: "附加项已并入套餐编辑。" },
  "/admin/content": { title: "视频管理", lead: "管理前台各处视频。可上传本地文件，或贴 YouTube 链接。" },
  "/admin/content/videos": { title: "视频管理", lead: "管理前台各处视频。可上传本地文件，或贴 YouTube 链接。" },
  "/admin/content/reviews": { title: "用户评价", lead: "对应前台「用户评价」。可改文案、姓名与照片。" },
  "/admin/content/faq": { title: "FAQ 管理", lead: "首页只显示勾了「首页」的条目，FAQ 页显示全部上架问题。" },
  "/admin/content/press": { title: "新闻报道", lead: "首页新闻区块最多显示 3 条上架内容。" },
  "/admin/content/meetup": { title: "集合地点", lead: "前台 Access 区块的集合文案。门牌细节预订后发送，这里写客人能看到的指引。" },
  "/admin/affiliates": { title: "推广代理", lead: "查看推广员、编辑资料。点进详情看推广链接和抽成。" },
  "/admin/bookings/how": { title: "预约开关设置", lead: "开关预约入口，并填写 WhatsApp、电话、邮件、LINE 链接。关掉的渠道不会出现在官网。" },
  "/admin/settings/booking": { title: "预约开关设置", lead: "开关预约入口，并填写 WhatsApp、电话、邮件、LINE 链接。关掉的渠道不会出现在官网。" },
  "/admin/site": { title: "全站配置", lead: "公司名称、Logo、电话邮箱和页脚社交媒体。" },
  "/admin/reports": { title: "营收报表", lead: "营收趋势与套餐销量。" },
  "/admin/reports/overview": { title: "营收报表", lead: "营收趋势与套餐销量。" },
  "/admin/reports/analytics": { title: "数据分析", lead: "本周对比上周、本月对比上月、本月对比去年同期。渠道分析、性别、国籍和时段一并统计。" },
  "/admin/staff": { title: "员工管理", lead: "超管可添加、改角色、重置密码和停用。" },
  "/admin/permissions": { title: "权限配置", lead: "超管建角色并分配查看/编辑权限。店长可给本店员工调配权限。" },
  "/admin/settings": { title: "支付配置", lead: "开关支付方式。官网结账页只显示已开启的方式。" },
  "/admin/settings/pay": { title: "支付配置", lead: "开关支付方式。官网结账页只显示已开启的方式。" },
  "/admin/settings/channels": { title: "渠道设置", lead: "渠道只记在后台，前台不展示。OTA 抽成用于报表的门店实收。" },
  "/admin/settings/stores": { title: "门店管理", lead: "电话、地址和营业时间会同步到官网。" },
  "/admin/settings/email": { title: "邮件设置", lead: "绑定发信箱，并按客人语言编辑确认、提醒和退款文案。" },
  "/admin/settings/refund": { title: "退款政策", lead: "填写退款说明文本。具体扣款逻辑稍后接入。" },
  "/admin/settings/send": { title: "邮件设置", lead: "绑定发信箱，并按客人语言编辑确认、提醒和退款文案。" },
  "/admin/settings/mail": { title: "邮件设置", lead: "绑定发信箱，并按客人语言编辑确认、提醒和退款文案。" },
  "/admin/settings/logs": { title: "操作日志", lead: "查看全部后台操作记录。" },
};

export function navForRole(role: AdminRole) {
  return ADMIN_NAV.filter((item) => item.roles.includes(role));
}

export function bookingNavForRole(role: AdminRole) {
  return ADMIN_BOOKING_NAV.filter((item) => item.roles.includes(role));
}

export function settingsNavForRole(role: AdminRole) {
  return ADMIN_SETTINGS_NAV.filter((item) => item.roles.includes(role));
}

export function contentNavForRole(role: AdminRole) {
  return ADMIN_CONTENT_NAV.filter((item) => item.roles.includes(role));
}

export function reportNavForRole(role: AdminRole) {
  return ADMIN_REPORT_NAV.filter((item) => item.roles.includes(role));
}

export function isBookingPath(href: string) {
  return (
    href === "/admin/bookings" ||
    href === "/admin/orders" ||
    href.startsWith("/admin/orders/") ||
    href === "/admin/calendar" ||
    href.startsWith("/admin/calendar/")
  );
}

export function isContentPath(href: string) {
  return href === "/admin/content" || href.startsWith("/admin/content/");
}

export function isSettingsPath(href: string) {
  return href === "/admin/settings" || href.startsWith("/admin/settings/");
}

export function isReportPath(href: string) {
  return href === "/admin/reports" || href.startsWith("/admin/reports/");
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
  const hash = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
  if (hash.startsWith("admin")) return adminTabFromHref(`/${hash}`);
  return adminTabFromHref(window.location.pathname);
}

export function normalizeAdminTab(href: string) {
  const tab = adminTabFromHref(href) ?? "/admin/dashboard";
  if (tab === "/admin/bookings") return BOOKING_HOME;
  if (tab === "/admin/content") return CONTENT_HOME;
  if (tab === "/admin/reports") return REPORT_HOME;
  if (tab === "/admin/settings") return SETTINGS_HOME;
  if (tab === "/admin/addons") return "/admin/plans";
  if (tab === "/admin/bookings/how") return "/admin/settings/booking";
  if (tab === "/admin/settings/send" || tab === "/admin/settings/mail") return "/admin/settings/email";
  return tab;
}
