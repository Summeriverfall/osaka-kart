"use client";

import { LogsTable } from "@/components/admin/logs-table";

export function AdminLogsView() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <LogsTable />
    </section>
  );
}
