"use client";

import { adminCopy } from "@/lib/admin/copy";
import { goToAppPath } from "@/lib/file-href";
import { cn } from "@/lib/utils";
import { useAdminNavStore } from "@/stores/admin-nav-store";

const LANGS = [
  { id: "zh-TW", key: "langZh" as const, active: (locale: string) => locale.startsWith("zh") },
  { id: "en", key: "langEn" as const, active: (locale: string) => locale.startsWith("en") },
  { id: "ja", key: "langJa" as const, active: (locale: string) => locale.startsWith("ja") },
];

export function AdminLangSwitch({ locale, path }: { locale: string; path?: string }) {
  const tab = useAdminNavStore((state) => state.tab);
  const copy = adminCopy(locale);
  const dest = path || tab || "/admin/dashboard";

  return (
    <div className="inline-flex max-w-full shrink-0 overflow-x-auto rounded-full border border-slate-200 bg-white p-0.5 text-xs">
      {LANGS.map((item) => {
        const on = item.active(locale);
        return (
          <button
            key={item.id}
            type="button"
            className={cn("rounded-full px-2.5 py-1", on ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-500")}
            onClick={() => goToAppPath(dest, item.id)}
          >
            {copy[item.key]}
          </button>
        );
      })}
    </div>
  );
}
