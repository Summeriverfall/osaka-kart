"use client";

import { adminCopy } from "@/lib/admin/copy";
import { goToAppPath } from "@/lib/file-href";
import { cn } from "@/lib/utils";
import { useAdminNavStore } from "@/stores/admin-nav-store";

export function AdminLangSwitch({ locale, path }: { locale: string; path?: string }) {
  const tab = useAdminNavStore((state) => state.tab);
  const copy = adminCopy(locale);
  const dest = path || tab || "/admin/dashboard";
  const zhOn = locale.startsWith("zh");
  const jaOn = locale.startsWith("ja");

  return (
    <div className="inline-flex shrink-0 rounded-full border border-slate-200 bg-white p-0.5 text-xs">
      <button
        type="button"
        className={cn("rounded-full px-2.5 py-1", zhOn ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-500")}
        onClick={() => goToAppPath(dest, "zh-TW")}
      >
        {copy.langZh}
      </button>
      <button
        type="button"
        className={cn("rounded-full px-2.5 py-1", jaOn ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-500")}
        onClick={() => goToAppPath(dest, "ja")}
      >
        {copy.langJa}
      </button>
    </div>
  );
}
