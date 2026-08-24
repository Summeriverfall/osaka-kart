"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { adminCopy } from "@/lib/admin/copy";
import { isReportPath, reportNavForRole } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/stores/admin-store";

export function AdminReportNav({
  current,
  role,
  copy,
  onGo,
}: {
  current: string;
  role: AdminRole;
  copy: ReturnType<typeof adminCopy>;
  onGo: (href: string) => void;
}) {
  const inReports = isReportPath(current);
  const [open, setOpen] = useState(inReports);
  const children = reportNavForRole(role);

  useEffect(() => {
    if (inReports) setOpen(true);
  }, [inReports]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition",
          inReports
            ? "font-semibold text-blue-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )}
        aria-expanded={open}
      >
        <span>{copy.nav["/admin/reports"]}</span>
        <ChevronDown className={cn("size-4 shrink-0 transition", open ? "rotate-180" : "")} />
      </button>
      {open ? (
        <div className="mb-1 ml-3 grid gap-0.5 border-l border-slate-200 pl-2">
          {children.map((item) => {
            const active = current === item.href;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => onGo(item.href)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-left text-[0.8125rem] transition",
                  active
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {copy.nav[item.href] ?? item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
