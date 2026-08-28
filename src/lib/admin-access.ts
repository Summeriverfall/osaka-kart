"use client";

import { useMemo } from "react";
import { useAdminStore } from "@/stores/admin-store";
import { useOpsStore } from "@/stores/ops-store";
import {
  mergePerms,
  moduleFromHref,
  type PermFlags,
  type PermModule,
} from "@/lib/mock/permissions";
import { MOCK_STAFF } from "@/lib/mock/staff";

export function useAdminAccess() {
  const email = useAdminStore((state) => state.email);
  const sessionRole = useAdminStore((state) => state.role);
  const staff = useOpsStore((state) => state.staff);
  const roles = useOpsStore((state) => state.roles);

  return useMemo(() => {
    const record =
      staff.find((item) => item.email.toLowerCase() === email.trim().toLowerCase()) ??
      MOCK_STAFF.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    const roleId = record?.roleId ?? (record?.role === "admin" ? "role-admin" : record?.role === "staff" ? "role-staff" : "role-manager");
    const role = roles.find((item) => item.id === roleId) ?? roles.find((item) => item.builtin === record?.role);
    const perms = mergePerms(role, record?.permOverrides);
    const isAdmin = sessionRole === "admin" || record?.role === "admin";
    const isManager = sessionRole === "manager" || record?.role === "manager";

    function flags(module: PermModule): PermFlags {
      if (isAdmin) return { view: true, edit: true };
      return perms[module] ?? { view: false, edit: false };
    }

    function canView(module: PermModule | string) {
      const key = (module.includes("/") ? moduleFromHref(module) : module) as PermModule;
      return flags(key).view;
    }

    function canEdit(module: PermModule | string) {
      const key = (module.includes("/") ? moduleFromHref(module) : module) as PermModule;
      return flags(key).edit;
    }

    function canCompleteOrder() {
      return isAdmin || isManager;
    }

    return { record, role, perms, isAdmin, isManager, flags, canView, canEdit, canCompleteOrder };
  }, [email, sessionRole, staff, roles]);
}
