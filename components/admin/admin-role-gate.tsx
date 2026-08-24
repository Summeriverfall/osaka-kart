"use client";

import { useLocale } from "next-intl";
import { adminCopy } from "@/lib/admin/copy";
import { useAdminStore } from "@/stores/admin-store";
import type { AdminRole } from "@/stores/admin-store";

export function AdminRoleGate({ allow, children }: { allow: AdminRole[]; children: React.ReactNode }) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const role = useAdminStore((state) => state.role);
  if (role && allow.includes(role)) return <>{children}</>;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <h2 className="text-xl font-black text-slate-900">{copy.roleGate.title}</h2>
      <p className="mt-2 text-sm text-slate-500">{copy.roleGate.lead}</p>
    </div>
  );
}
