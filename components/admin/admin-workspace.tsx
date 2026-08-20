"use client";

import { AdminDashboardView } from "@/components/admin/admin-dashboard";
import { AdminInventoryView } from "@/components/admin/admin-inventory";
import { AdminOrderDetailView } from "@/components/admin/admin-order-detail";
import { AdminOrdersView } from "@/components/admin/admin-orders";
import { AdminPageFrame } from "@/components/admin/admin-page-frame";
import { AdminPlansView } from "@/components/admin/admin-plans";
import { AdminReportsView } from "@/components/admin/admin-reports";
import { AdminRoleGate } from "@/components/admin/admin-role-gate";
import { AdminSettingsView } from "@/components/admin/admin-settings";
import { AdminStaffView } from "@/components/admin/admin-staff";
import { AdminVehiclesView } from "@/components/admin/admin-vehicles";
import { ADMIN_PAGE_META, normalizeAdminTab } from "@/lib/admin/nav";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { usePathname } from "@/i18n/navigation";

function metaFor(tab: string) {
  if (tab.startsWith("/admin/orders/") && tab !== "/admin/orders") {
    const id = tab.slice("/admin/orders/".length);
    return { title: "订单详情", lead: `预约号 ${id}` };
  }
  return ADMIN_PAGE_META[tab] ?? ADMIN_PAGE_META["/admin/dashboard"];
}

function viewFor(tab: string) {
  if (tab.startsWith("/admin/orders/") && tab !== "/admin/orders") {
    return <AdminOrderDetailView id={tab.slice("/admin/orders/".length)} />;
  }
  switch (tab) {
    case "/admin/orders":
      return <AdminOrdersView />;
    case "/admin/calendar":
      return <AdminOrdersView />;
    case "/admin/inventory":
      return <AdminInventoryView />;
    case "/admin/vehicles":
      return <AdminVehiclesView />;
    case "/admin/plans":
    case "/admin/addons":
      return <AdminPlansView />;
    case "/admin/reports":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminReportsView />
        </AdminRoleGate>
      );
    case "/admin/staff":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminStaffView />
        </AdminRoleGate>
      );
    case "/admin/settings":
      return (
        <AdminRoleGate allow={["admin"]}>
          <AdminSettingsView />
        </AdminRoleGate>
      );
    default:
      return <AdminDashboardView />;
  }
}

export function AdminWorkspace() {
  const pathname = usePathname();
  const override = useAdminNavStore((state) => state.tab);
  const tab = normalizeAdminTab(override ?? pathname);

  const meta = metaFor(tab);
  return (
    <AdminPageFrame key={tab} title={meta.title} lead={meta.lead}>
      {viewFor(tab)}
    </AdminPageFrame>
  );
}
