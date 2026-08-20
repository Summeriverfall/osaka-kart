"use client";

import { useAdminStore } from "@/stores/admin-store";
import type { AdminRole } from "@/stores/admin-store";

export function AdminRoleGate({ allow, children }: { allow: AdminRole[]; children: React.ReactNode }) {
  const role = useAdminStore((state) => state.role);
  if (role && allow.includes(role)) return <>{children}</>;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <h2 className="text-xl font-black text-slate-900">仅超管可查看</h2>
      <p className="mt-2 text-sm text-slate-500">请用 admin@test.com 登录后再打开这一页。店长账号请回仪表盘处理今日订单。</p>
    </div>
  );
}
