"use client";

import { useEffect } from "react";
import { AdminCalendarView } from "@/components/admin/admin-calendar";
import { AdminDashboardView } from "@/components/admin/admin-dashboard";
import { AdminInventoryView } from "@/components/admin/admin-inventory";
import { AdminLogsView } from "@/components/admin/admin-logs";
import { AdminOrderDetailView } from "@/components/admin/admin-order-detail";
import { AdminOrdersView } from "@/components/admin/admin-orders";
import { AdminPageFrame } from "@/components/admin/admin-page-frame";
import { AdminAddonsView } from "@/components/admin/admin-addons";
import { AdminPermissionsView } from "@/components/admin/admin-permissions";
import { AdminPlansView } from "@/components/admin/admin-plans";
import { AdminReportsView } from "@/components/admin/admin-reports";
import { AdminAnalyticsView } from "@/components/admin/admin-analytics";
import { AdminRoleGate } from "@/components/admin/admin-role-gate";
import { AdminSettingsView } from "@/components/admin/admin-settings";
import { AdminStaffView } from "@/components/admin/admin-staff";
import { AdminVehiclesView } from "@/components/admin/admin-vehicles";
import { AdminCmsView } from "@/components/admin/admin-cms";
import { AdminAffiliatesView } from "@/components/admin/admin-affiliates";
import { ADMIN_PAGE_META, adminTabFromLocation, BOOKING_HOME, CONTENT_HOME, normalizeAdminTab, REPORT_HOME, SETTINGS_HOME } from "@/lib/admin/nav";
import { b2Copy } from "@/lib/admin/b2-copy";
import { adminCopy } from "@/lib/admin/copy";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";

function metaFor(tab: string, locale: string) {
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  if (tab.startsWith("/admin/orders/") && tab !== "/admin/orders") {
    const id = tab.slice("/admin/orders/".length);
    return { title: copy.orderDetail, lead: copy.orderLead(id) };
  }
  if (tab === "/admin/addons") return { title: b2.addonsMenu, lead: b2.addonsLead };
  if (tab === "/admin/permissions") return { title: b2.permissions, lead: b2.permissionsLead };
  if (tab === "/admin/settings/refund") return { title: b2.refundPolicy, lead: b2.refundPolicyLead };
  if (tab === "/admin/inventory") {
    const page = copy.pages[tab] ?? ADMIN_PAGE_META[tab];
    return { title: page?.title ?? copy.nav[tab] ?? "库存管理", lead: b2.inventoryLead };
  }
  if (tab === "/admin/plans") {
    const page = copy.pages[tab] ?? ADMIN_PAGE_META[tab];
    return { title: page?.title ?? copy.nav[tab] ?? "套餐管理", lead: b2.plansLead };
  }
  return copy.pages[tab] ?? copy.pages["/admin/dashboard"] ?? ADMIN_PAGE_META[tab] ?? ADMIN_PAGE_META["/admin/dashboard"];
}

function viewFor(tab: string) {
  if (tab.startsWith("/admin/orders/") && tab !== "/admin/orders") {
    return <AdminOrderDetailView id={tab.slice("/admin/orders/".length)} />;
  }
  if (tab.startsWith("/admin/affiliates/") && tab !== "/admin/affiliates") {
    return <AdminAffiliatesView id={tab.slice("/admin/affiliates/".length)} />;
  }
  switch (tab) {
    case "/admin/orders":
      return <AdminOrdersView />;
    case "/admin/calendar":
      return <AdminCalendarView />;
    case "/admin/inventory":
      return <AdminInventoryView />;
    case "/admin/vehicles":
      return <AdminVehiclesView />;
    case "/admin/plans":
      return <AdminPlansView />;
    case "/admin/addons":
      return <AdminAddonsView />;
    case "/admin/permissions":
      return (
        <AdminRoleGate allow={["admin", "manager"]}>
          <AdminPermissionsView />
        </AdminRoleGate>
      );
    case "/admin/content/videos":
      return <AdminCmsView section="videos" />;
    case "/admin/content/reviews":
      return <AdminCmsView section="reviews" />;
    case "/admin/content/faq":
      return <AdminCmsView section="faq" />;
    case "/admin/content/press":
      return <AdminCmsView section="press" />;
    case "/admin/content/meetup":
      return <AdminCmsView section="meetup" />;
    case "/admin/affiliates":
      return <AdminAffiliatesView />;
    case "/admin/bookings/how":
    case "/admin/settings/booking":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminCmsView section="how" />
        </AdminRoleGate>
      );
    case "/admin/site":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminCmsView section="site" />
        </AdminRoleGate>
      );
    case "/admin/reports":
    case "/admin/reports/overview":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminReportsView />
        </AdminRoleGate>
      );
    case "/admin/reports/analytics":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminAnalyticsView />
        </AdminRoleGate>
      );
    case "/admin/staff":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminStaffView />
        </AdminRoleGate>
      );
    case "/admin/settings":
    case "/admin/settings/pay":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminSettingsView section="pay" />
        </AdminRoleGate>
      );
    case "/admin/settings/channels":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminSettingsView section="channels" />
        </AdminRoleGate>
      );
    case "/admin/settings/stores":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminSettingsView section="stores" />
        </AdminRoleGate>
      );
    case "/admin/settings/email":
    case "/admin/settings/send":
    case "/admin/settings/mail":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminSettingsView section="email" />
        </AdminRoleGate>
      );
    case "/admin/settings/refund":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminSettingsView section="refund" />
        </AdminRoleGate>
      );
    case "/admin/settings/logs":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminLogsView />
        </AdminRoleGate>
      );
    default:
      return <AdminDashboardView />;
  }
}

export function AdminWorkspace() {
  const pathname = usePathname() ?? "";
  const locale = useLocale();
  const override = useAdminNavStore((state) => state.tab);
  const go = useAdminNavStore((state) => state.go);
  const syncFromWindow = useAdminNavStore((state) => state.syncFromWindow);

  useEffect(() => {
    syncFromWindow();
  }, [pathname, syncFromWindow]);

  useEffect(() => {
    const loc = adminTabFromLocation();
    if (loc === "/admin/bookings") go(BOOKING_HOME);
    if (loc === "/admin/content") go(CONTENT_HOME);
    if (loc === "/admin/reports") go(REPORT_HOME);
    if (loc === "/admin/settings") go(SETTINGS_HOME);
    if (loc === "/admin/bookings/how") go("/admin/settings/booking");
    if (loc === "/admin/settings/send" || loc === "/admin/settings/mail") go("/admin/settings/email");
  }, [pathname, go]);

  const tab = normalizeAdminTab(override ?? adminTabFromLocation() ?? (pathname || "/admin/dashboard"));
  const meta = metaFor(tab, locale);

  return (
    <AdminPageFrame key={tab} title={meta.title} lead={meta.lead}>
      {viewFor(tab)}
    </AdminPageFrame>
  );
}
