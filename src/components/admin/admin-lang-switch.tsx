"use client";

import { adminCopy } from "@/lib/admin/copy";
import { appPageHref } from "@/lib/file-href";
import { adminTabFromLocation, normalizeAdminTab } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";
import { usePathname } from "@/i18n/navigation";
import { useAdminNavStore } from "@/stores/admin-nav-store";

const LANGS = [
  { id: "zh-TW", key: "langZh" as const, short: "中", active: (locale: string) => locale.startsWith("zh") },
  { id: "en", key: "langEn" as const, short: "EN", active: (locale: string) => locale.startsWith("en") },
  { id: "ja", key: "langJa" as const, short: "日", active: (locale: string) => locale.startsWith("ja") },
];

export function AdminLangSwitch({ locale, path }: { locale: string; path?: string }) {
  const tab = useAdminNavStore((state) => state.tab);
  const pathname = usePathname() ?? "";
  const copy = adminCopy(locale);
  const raw = path || tab || adminTabFromLocation() || pathname || "/admin/dashboard";
  const dest = /(?:^|\/)login(?:\/|$)/.test(raw) ? "/admin/login" : normalizeAdminTab(raw);

  return (
    <nav className="admin-lang-switch" aria-label="Language">
      {LANGS.map((item) => {
        const on = item.active(locale);
        return (
          <a
            key={item.id}
            href={appPageHref(dest, item.id)}
            aria-current={on ? "page" : undefined}
            className={cn("admin-lang-chip", on && "is-on")}
            onClick={(event) => {
              if (on) event.preventDefault();
            }}
          >
            <span className="md:hidden">{item.short}</span>
            <span className="hidden md:inline">{copy[item.key]}</span>
          </a>
        );
      })}
    </nav>
  );
}
