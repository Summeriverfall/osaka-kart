"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { StoreSwitcher } from "@/components/admin/store-switcher";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { navForRole, normalizeAdminTab } from "@/lib/admin/nav";
import { appPageHref, goToAppPath } from "@/lib/file-href";
import { cn } from "@/lib/utils";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { ROLE_LABEL, useAdminStore } from "@/stores/admin-store";
import { ToastHost } from "@/components/ui/toast-host";

function isAdminLoginPath(pathname: string) {
  return /(?:^|\/)admin\/login(?:\/|$|\/index\.html)/.test(pathname);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const locale = useLocale();
  const { role, email, logout, lockBoundStore } = useAdminStore();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState("");
  const tab = useAdminNavStore((state) => state.tab);
  const go = useAdminNavStore((state) => state.go);
  const setLocale = useAdminNavStore((state) => state.setLocale);
  const syncFromWindow = useAdminNavStore((state) => state.syncFromWindow);

  const isLogin = isAdminLoginPath(pathname) || isAdminLoginPath(href);
  const current = normalizeAdminTab(tab ?? (pathname || "/admin/dashboard"));

  useEffect(() => {
    setReady(true);
    setHref(window.location.pathname);
  }, [pathname]);

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  useEffect(() => {
    if (!ready || isLogin) return;
    if (!role) goToAppPath("/admin/login", locale);
  }, [ready, isLogin, role, locale]);

  useEffect(() => {
    setOpen(false);
    const main = document.querySelector(".admin-app main");
    if (main) main.scrollTop = 0;
  }, [current]);

  useEffect(() => {
    if (role === "manager") lockBoundStore();
  }, [role, email, lockBoundStore]);

  useEffect(() => {
    window.addEventListener("popstate", syncFromWindow);
    return () => window.removeEventListener("popstate", syncFromWindow);
  }, [syncFromWindow]);

  if (isLogin) return <div className="admin-app">{children}</div>;
  if (!ready || !role) {
    return (
      <div className="admin-app flex min-h-dvh items-center justify-center bg-[#f5f6f8] px-4">
        {children ?? (
          <p className="text-sm text-slate-500">
            正在进入登录…
            <a className="ml-2 text-blue-600" href={appPageHref("/admin/login", locale)}>
              去登录
            </a>
          </p>
        )}
      </div>
    );
  }

  const items = navForRole(role);

  return (
    <div className="admin-app flex h-dvh overflow-hidden bg-[#f5f6f8] text-[#111827]">
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
          "fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform md:static md:h-full md:translate-x-0",
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

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/90 px-3 backdrop-blur md:gap-3 md:px-6">
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-400 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <p className="hidden min-w-0 shrink-0 text-sm text-slate-500 md:block">大阪卡丁车运营后台</p>
          <span className="hidden text-slate-300 md:inline" aria-hidden>
            ·
          </span>
          <StoreSwitcher />
          <div className="ml-auto flex min-w-0 items-center gap-2 md:gap-3">
            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 sm:hidden">
              {ROLE_LABEL[role]}
            </span>
            <span className="hidden max-w-[9.5rem] truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 sm:inline md:max-w-none">
              {ROLE_LABEL[role]} · {email}
            </span>
            <button
              type="button"
              className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-blue-400 hover:text-slate-900"
              onClick={() => {
                logout();
                useAdminNavStore.getState().reset();
                goToAppPath("/admin/login", locale);
              }}
            >
              退出
            </button>
          </div>
        </header>
        <main className="min-h-0 min-w-0 flex-1 overflow-auto p-4 md:p-6">
          <AdminWorkspace />
        </main>
        <ToastHost light />
      </div>
    </div>
  );
}
