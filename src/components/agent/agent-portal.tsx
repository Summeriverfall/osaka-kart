"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { downloadAffiliatePoster, downloadQrPng, POSTER_TEMPLATES } from "@/lib/affiliate-poster";
import { affiliateStats } from "@/lib/affiliate-stats";
import { b3Copy } from "@/lib/admin/b3-copy";
import { SITE_BRAND } from "@/lib/brand";
import { appPageHref, goToAppPath } from "@/lib/file-href";
import { formatYenShort } from "@/lib/format";
import { findAffiliateByLogin, type MockAffiliate } from "@/lib/mock/affiliates";
import type { MockOrder } from "@/lib/mock/orders";
import { promoHref, qrImageSrc } from "@/lib/promo";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/stores/agent-store";
import { scheduleOpsRehydrate, rehydrateOpsStore, useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";
import { ToastHost } from "@/components/ui/toast-host";

const LANGS = [
  { id: "zh-TW", short: "中", active: (locale: string) => locale.startsWith("zh") },
  { id: "en", short: "EN", active: (locale: string) => locale.startsWith("en") },
  { id: "ja", short: "日", active: (locale: string) => locale.startsWith("ja") },
];

export function AgentLangSwitch({ locale, path }: { locale: string; path: string }) {
  return (
    <nav className="admin-lang-switch" aria-label="Language">
      {LANGS.map((item) => {
        const on = item.active(locale);
        return (
          <a
            key={item.id}
            href={appPageHref(path, item.id)}
            aria-current={on ? "page" : undefined}
            className={cn("admin-lang-chip", on && "is-on")}
            onClick={(event) => {
              if (on) event.preventDefault();
            }}
          >
            {item.short}
          </a>
        );
      })}
    </nav>
  );
}

export function AgentLoginForm() {
  const locale = useLocale();
  const b3 = b3Copy(locale);
  const affiliates = useOpsStore((state) => state.affiliates);
  const login = useAgentStore((state) => state.login);
  const affiliateId = useAgentStore((state) => state.affiliateId);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    scheduleOpsRehydrate(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !affiliateId) return;
    const live = affiliates.find((item) => item.id === affiliateId && item.status === "active");
    if (live) goToAppPath("/agent", locale);
  }, [ready, affiliateId, affiliates, locale]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await rehydrateOpsStore();
    const row = findAffiliateByLogin(useOpsStore.getState().affiliates, email, password);
    if (!row) {
      setError(b3.loginFail);
      return;
    }
    login(row.id);
    goToAppPath("/agent", locale);
  }

  return (
    <div className="admin-app flex min-h-dvh items-center justify-center bg-[#f5f6f8] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase">Affiliate</p>
          <AgentLangSwitch locale={locale} path="/agent/login" />
        </div>
        <h1 className="mt-3 text-2xl font-black text-slate-900">{SITE_BRAND}</h1>
        <p className="mt-2 text-sm text-slate-500">{b3.agentLead}</p>
        <label className="mt-8 block text-sm text-slate-600">
          {b3.email}
          <input
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setError(""); }}
            required
            autoComplete="username"
            className="admin-input mt-2 h-11"
            placeholder="yuki@agent.test"
          />
        </label>
        <label className="mt-4 block text-sm text-slate-600">
          {b3.password}
          <input
            type="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setError(""); }}
            required
            autoComplete="current-password"
            className="admin-input mt-2 h-11"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
        <p className="mt-4 text-xs text-slate-500">{b3.agentHint}</p>
        <button type="submit" className="cta-btn mt-6 h-11 w-full text-sm">
          {b3.agentLogin}
        </button>
      </form>
    </div>
  );
}

export function AgentHome() {
  const locale = useLocale();
  const b3 = b3Copy(locale);
  const affiliates = useOpsStore((state) => state.affiliates);
  const orders = useOpsStore((state) => state.orders);
  const affiliateId = useAgentStore((state) => state.affiliateId);
  const logout = useAgentStore((state) => state.logout);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    scheduleOpsRehydrate(true);
    setReady(true);
  }, []);

  const me = useMemo(
    () => affiliates.find((item) => item.id === affiliateId && item.status === "active"),
    [affiliates, affiliateId],
  );

  useEffect(() => {
    if (!ready) return;
    if (!me) goToAppPath("/agent/login", locale);
  }, [ready, me, locale]);

  if (!ready || !me) {
    return (
      <div className="admin-app flex min-h-dvh items-center justify-center bg-[#f5f6f8] text-sm text-slate-500">
        …
      </div>
    );
  }

  return (
    <AgentDesk
      locale={locale}
      b3={b3}
      me={me}
      orders={orders}
      onLogout={() => {
        logout();
        goToAppPath("/agent/login", locale);
      }}
    />
  );
}

function AgentDesk({
  locale,
  b3,
  me,
  orders,
  onLogout,
}: {
  locale: string;
  b3: ReturnType<typeof b3Copy>;
  me: MockAffiliate;
  orders: MockOrder[];
  onLogout: () => void;
}) {
  const stats = affiliateStats(me, orders);
  const link = promoHref(me.code, locale);
  const notify = useToastStore((state) => state.notify);

  return (
    <div className="admin-app flex min-h-dvh flex-col bg-[#f5f6f8]">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-wide text-blue-600 uppercase">{b3.agentHome}</p>
          <p className="truncate font-black text-slate-900">{SITE_BRAND}</p>
        </div>
        <AgentLangSwitch locale={locale} path="/agent" />
        <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600" onClick={onLogout}>
          {b3.logout}
        </button>
      </header>
      <main className="min-h-0 flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto grid max-w-5xl gap-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-black">{b3.myInfo}</h2>
            <p className="mt-2 text-lg font-black">{me.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {me.email} · {me.phone} · {me.code} · {me.commissionPct}%
            </p>
            <p className="mt-3 break-all text-sm text-blue-600">{link}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                className="text-xs text-blue-600"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(link);
                    notify(b3.copied);
                  } catch {
                    notify(link);
                  }
                }}
              >
                {b3.copyLink}
              </button>
              <button type="button" className="text-xs text-blue-600" onClick={() => downloadQrPng(me.code, link)}>
                {b3.downloadQr}
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mt-4 size-40 rounded-xl border border-slate-200 bg-white p-2" src={qrImageSrc(link, 280)} alt={me.code} />
          </section>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{b3.reportOrders}</p>
              <p className="mt-2 text-2xl font-black">{stats.orderCount}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{b3.orderAmount}</p>
              <p className="mt-2 text-2xl font-black">{formatYenShort(stats.amount)}</p>
            </article>
            <article className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 md:col-span-1">
              <p className="text-xs text-slate-500">{b3.cutDue}</p>
              <p className="mt-2 text-2xl font-black">{formatYenShort(stats.cut)}</p>
            </article>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-black">{b3.posters}</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {POSTER_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  className="rounded-xl border border-slate-200 px-3 py-3 text-left text-sm hover:border-blue-400"
                  onClick={() =>
                    downloadAffiliatePoster({
                      template: tpl,
                      name: me.name,
                      code: me.code,
                      link,
                      cut: me.commissionPct,
                    })
                  }
                >
                  <span className="block font-semibold">
                    {locale.startsWith("ja") ? tpl.nameJa : locale.startsWith("en") ? tpl.nameEn : tpl.name}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">{tpl.hint}</span>
                </button>
              ))}
            </div>
            <button type="button" disabled className="mt-3 w-full cursor-not-allowed rounded-xl border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-400">
              {b3.posterCustom}
            </button>
            <p className="mt-1 text-xs text-slate-400">{b3.posterCustomHint}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-black">{b3.myCut}</h2>
            {stats.related.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">{b3.noOrders}</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {stats.related.map((order) => (
                  <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                    <span>
                      {order.date} {order.time} · {order.customer} · {order.id}
                    </span>
                    <span className="font-semibold">
                      {formatYenShort(order.totalJpy)}
                      {order.status === "completed" ? ` → ${formatYenShort((order.totalJpy * me.commissionPct) / 100)}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <ToastHost light />
    </div>
  );
}
