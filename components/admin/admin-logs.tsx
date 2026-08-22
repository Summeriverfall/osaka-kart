"use client";

import { LogsTable } from "@/components/admin/logs-table";
import { useAdminNavStore } from "@/stores/admin-nav-store";

export function AdminLogsView() {
  const go = useAdminNavStore((state) => state.go);

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-black">全部操作日志</h2>
        <button
          type="button"
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-blue-400"
          onClick={() => go("/admin/settings")}
        >
          返回系统设置
        </button>
      </div>
      <LogsTable />
    </section>
  );
}
