"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { navForRole, normalizeAdminTab } from "@/lib/admin/nav";
import { withSlash } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { ROLE_LABEL, useAdminStore } from "@/stores/admin-store";
import { ToastHost } from "@/components/ui/toast-host";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { role, email, logout } = useAdminStore();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const tab = useAdminNavStore((state) => state.tab);
  const go = useAdminNavStore((state) => state.go);
  const setLocale = useAdminNavStore((state) => state.setLocale);
  const syncFromWindow = useAdminNavStore((state) => state.syncFromWindow);

  const isLogin = pathname.replace(/\/$/, "").endsWith("/admin/login");
  const current = normalizeAdminTab(tab ?? pathname);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  useEffect(() => {
    if (!ready || isLogin) return;
    if (!role) router.replace(withSlash("/admin/login"));
  }, [ready, isLogin, role, router]);

  useEffect(() => {
    setOpen(false);
    const main = document.querySelector(".admin-app main");
    if (main) main.scrollTop = 0;
  }, [current]);

  useEffect(() => {
    window.addEventListener("popstate", syncFromWindow);
    return () => window.removeEventListener("popstate", syncFromWindow);
  }, [syncFromWindow]);

  if (isLogin) return <div className="admin-app">{children}</div>;
  if (!ready || !role) {
    return <div className="admin-app min-h-dvh bg-[#f5f6f8]" />;
  }

  const items = navForRole(role);

  return (
    <div className="admin-app flex min-h-dvh bg-[#f5f6f8] text-[#111827]">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 border-r border-slate-200 bg-white p-4 transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <p className="px-3 pt-2 text-xs font-semibold tracking-[0.18em] text-blue-600 uppercase">
          Furture Kart
        </p>
        <p className="px-3 pb-4 text-sm text-slate-500">管理后台</p>
        <nav className="grid gap-1">
          {items.map((item) => {
            const active = current === item.href || current.startsWith(`${item.href}/`);
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-left text-sm transition",
                  active
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-400 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <p className="hidden text-sm text-slate-500 md:block">大阪卡丁车运营后台</p>
          <div className="ml-auto flex items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              {ROLE_LABEL[role]} · {email}
            </span>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-blue-400 hover:text-slate-900"
              onClick={() => {
                logout();
                useAdminNavStore.getState().reset();
                router.replace(withSlash("/admin/login"));
              }}
            >
              退出
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <AdminWorkspace />
        </main>
        <ToastHost light />
      </div>
    </div>
  );
}
