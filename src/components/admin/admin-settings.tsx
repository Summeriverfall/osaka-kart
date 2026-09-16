"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import {
  adminCopy,
  adminMailLocale,
  adminMailType,
  adminPayName,
  adminStoreAddress,
  adminStoreName,
} from "@/lib/admin/copy";
import { type MockEmailTemplate, type MockStore } from "@/lib/mock/settings";
import { b2Copy } from "@/lib/admin/b2-copy";
import { writePayEnabled } from "@/lib/pay-enabled";
import { sendTestMail } from "@/lib/ops-notify";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";
import { AdminChannelsView } from "@/components/admin/admin-channels";

export type SettingsSection = "pay" | "channels" | "stores" | "email" | "refund";

function livePay(id: string) {
  return id === "stripe";
}

export function AdminSettingsView({ section }: { section: SettingsSection }) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const { settings, patchSettings, templates, patchTemplate, stores, upsertStore } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [tpl, setTpl] = useState<MockEmailTemplate | null>(null);
  const [store, setStore] = useState<MockStore | null>(null);
  const [testing, setTesting] = useState(false);
  const [mailDraft, setMailDraft] = useState({ publicKey: "", serviceId: "", templateId: "" });
  const [mailReplace, setMailReplace] = useState({ publicKey: false, serviceId: false, templateId: false });
  const payments = settings.payments;
  useEffect(() => {
    if (section === "pay") writePayEnabled(payments);
  }, [section, payments]);
  const templateGroups = useMemo(() => {
    const map = new Map<string, MockEmailTemplate[]>();
    for (const item of templates) {
      const list = map.get(item.type) ?? [];
      list.push(item);
      map.set(item.type, list);
    }
    return [...map.entries()];
  }, [templates]);

  return (
    <div className="grid min-w-0 gap-6">
      {section === "refund" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <p className="text-sm text-slate-500">{b2.refundPolicyLead}</p>
          <label className="admin-field">
            {b2.refundPolicy}
            <textarea
              className="admin-input min-h-40"
              placeholder={b2.refundPolicyPh}
              value={settings.refundPolicy ?? ""}
              onChange={(event) => patchSettings({ refundPolicy: event.target.value })}
            />
          </label>
          <button type="button" className="cta-btn" onClick={() => notify(b2.refundSaved)}>
            {copy.common.save}
          </button>
        </section>
      ) : null}

      {section === "pay" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <p className="text-sm leading-6 text-slate-500">{b2.payKeyHint}</p>
          {payments.map((item, index) => (
            <div key={item.id} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-black">{adminPayName(locale, item.id, item.name)}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {item.reserved ? (
                      <span className="text-xs text-[#6B7280]">{copy.settings.reserved}</span>
                    ) : livePay(item.id) ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">{b2.payLive}</span>
                    ) : (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">{b2.payDemo}</span>
                    )}
                    {item.reserved ? null : (
                      <span className={item.enabled ? "text-xs text-emerald-600" : "text-xs text-slate-500"}>
                        {item.enabled ? copy.settings.on : copy.settings.off}
                      </span>
                    )}
                  </div>
                  {item.reserved ? null : <p className="mt-2 text-xs leading-5 text-slate-500">{b2.paySwitchHint}</p>}
                </div>
                <NeonToggle
                  checked={item.enabled}
                  onChange={(on) => {
                    if (item.reserved) return;
                    const next = payments.map((row, i) => (i === index ? { ...row, enabled: on } : row));
                    patchSettings({ payments: next });
                  }}
                />
              </div>
              {item.id === "stripe" ? (
                <>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span>{copy.settings.testMode}</span>
                    <NeonToggle
                      checked={Boolean(item.testMode)}
                      onChange={(on) => {
                        const next = payments.map((row, i) => (i === index ? { ...row, testMode: on } : row));
                        patchSettings({ payments: next });
                      }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600">{b2.payConfigured}</span>
                    <a
                      className="text-blue-600"
                      href="https://dashboard.stripe.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {b2.payStripeDash}
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          ))}
          <button type="button" className="cta-btn" onClick={() => notify(copy.settings.paySaved)}>
            {copy.settings.savePay}
          </button>
        </section>
      ) : null}

      {section === "channels" ? <AdminChannelsView /> : null}

      {section === "stores" ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="cta-btn px-4 py-2 text-sm"
              onClick={() =>
                setStore({
                  id: `st-${Date.now()}`,
                  name: "",
                  address: "",
                  phone: "",
                  hours: "10:00 – 21:00",
                  maps: "",
                  status: "预留",
                  created: "2026-08-20",
                })
              }
            >
              {copy.settings.addStore}
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {stores.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <b>{adminStoreName(locale, item.id, item.name)}</b>
                  <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                    <span className="block sm:inline">{adminStoreAddress(locale, item.id, item.address)}</span>
                    <span className="hidden sm:inline"> · </span>
                    <span className="block sm:inline">{item.hours === "待定" ? copy.common.undecided : item.hours}</span>
                    <span className="hidden sm:inline"> · </span>
                    <span className="block sm:inline">{/待开通/.test(item.phone) ? copy.common.notOpen : item.phone}</span>
                  </p>
                </div>
                <button type="button" className="self-start text-xs text-blue-600 sm:self-center" onClick={() => setStore(item)}>
                  {copy.common.edit}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {section === "email" ? (
        <>
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="font-black">{copy.settings.send}</h2>
          <p className="text-sm leading-6 text-slate-500">
            {copy.settings.sendLead}{" "}
            <a className="text-blue-600" href="https://www.emailjs.com" target="_blank" rel="noreferrer">
              emailjs.com
            </a>
          </p>
          <label className="admin-field">
            {copy.settings.mailFrom}
            <input
              className="admin-input"
              type="email"
              placeholder="book@osakakart.jp"
              value={settings.mailFrom ?? ""}
              onChange={(event) => patchSettings({ mailFrom: event.target.value })}
            />
          </label>
          <label className="admin-field">
            {copy.settings.mailTo}
            <input
              className="admin-input"
              type="email"
              placeholder={copy.settings.mailToPh}
              value={settings.mailTo ?? ""}
              onChange={(event) => patchSettings({ mailTo: event.target.value })}
            />
          </label>
          <label className="admin-field">
            EmailJS Public Key
            {settings.mailPublicKey && !mailReplace.publicKey ? (
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{b2.payConfigured}</span>
                <button
                  type="button"
                  className="text-xs text-blue-600"
                  onClick={() => setMailReplace((cur) => ({ ...cur, publicKey: true }))}
                >
                  {b2.mailReplace}
                </button>
              </div>
            ) : (
              <input
                className="admin-input"
                type="password"
                autoComplete="off"
                placeholder={b2.mailReplacePh}
                value={mailDraft.publicKey}
                onChange={(event) => setMailDraft((cur) => ({ ...cur, publicKey: event.target.value }))}
              />
            )}
          </label>
          <label className="admin-field">
            Service ID
            {settings.mailServiceId && !mailReplace.serviceId ? (
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{b2.payConfigured}</span>
                <button
                  type="button"
                  className="text-xs text-blue-600"
                  onClick={() => setMailReplace((cur) => ({ ...cur, serviceId: true }))}
                >
                  {b2.mailReplace}
                </button>
              </div>
            ) : (
              <input
                className="admin-input"
                autoComplete="off"
                placeholder={b2.mailReplacePh}
                value={mailDraft.serviceId}
                onChange={(event) => setMailDraft((cur) => ({ ...cur, serviceId: event.target.value }))}
              />
            )}
          </label>
          <label className="admin-field">
            Template ID
            {settings.mailTemplateId && !mailReplace.templateId ? (
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{b2.payConfigured}</span>
                <button
                  type="button"
                  className="text-xs text-blue-600"
                  onClick={() => setMailReplace((cur) => ({ ...cur, templateId: true }))}
                >
                  {b2.mailReplace}
                </button>
              </div>
            ) : (
              <input
                className="admin-input"
                autoComplete="off"
                placeholder={b2.mailReplacePh}
                value={mailDraft.templateId}
                onChange={(event) => setMailDraft((cur) => ({ ...cur, templateId: event.target.value }))}
              />
            )}
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="cta-btn px-5 py-2.5"
              onClick={() => {
                patchSettings({
                  ...(mailDraft.publicKey.trim() ? { mailPublicKey: mailDraft.publicKey.trim() } : {}),
                  ...(mailDraft.serviceId.trim() ? { mailServiceId: mailDraft.serviceId.trim() } : {}),
                  ...(mailDraft.templateId.trim() ? { mailTemplateId: mailDraft.templateId.trim() } : {}),
                });
                setMailDraft({ publicKey: "", serviceId: "", templateId: "" });
                setMailReplace({ publicKey: false, serviceId: false, templateId: false });
                notify(copy.settings.sendSaved);
              }}
            >
              {copy.common.save}
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-slate-700 hover:border-blue-400"
              disabled={testing}
              onClick={() => {
                setTesting(true);
                const next = {
                  ...useOpsStore.getState().settings,
                  mailPublicKey: mailDraft.publicKey.trim() || useOpsStore.getState().settings.mailPublicKey,
                  mailServiceId: mailDraft.serviceId.trim() || useOpsStore.getState().settings.mailServiceId,
                  mailTemplateId: mailDraft.templateId.trim() || useOpsStore.getState().settings.mailTemplateId,
                };
                void sendTestMail(next, locale)
                  .then((result) => {
                    if (result.ok) notify(result.message);
                    else notify(b2.mailTestFail(result.message), "err");
                  })
                  .catch((error) => {
                    const detail = error instanceof Error && error.message ? error.message : "network";
                    notify(b2.mailTestFail(detail), "err");
                  })
                  .finally(() => setTesting(false));
              }}
            >
              {testing ? copy.settings.testing : copy.settings.testSend}
            </button>
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="font-black">{copy.settings.templates}</h2>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{copy.settings.type}</th>
                  <th>{copy.settings.locale}</th>
                  <th>{copy.settings.updated}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {templates.map((item) => (
                  <tr key={item.id}>
                    <td>{adminMailType(locale, item.type)}</td>
                    <td>{adminMailLocale(locale, item.locale)}</td>
                    <td>{item.updated}</td>
                    <td>
                      <button type="button" className="text-xs text-blue-600" onClick={() => setTpl(item)}>
                        {copy.common.edit}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 md:hidden">
            {templateGroups.map(([type, items]) => (
              <article key={type} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-black">{adminMailType(locale, type)}</p>
                <ul className="mt-3 space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{adminMailLocale(locale, item.locale)}</p>
                        <p className="text-xs text-slate-500">{item.updated}</p>
                      </div>
                      <button type="button" className="shrink-0 text-xs text-blue-600" onClick={() => setTpl(item)}>
                        {copy.common.edit}
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        </>
      ) : null}

      <Modal
        open={Boolean(tpl)}
        title={tpl ? copy.settings.tplTitle(adminMailType(locale, tpl.type), adminMailLocale(locale, tpl.locale)) : copy.settings.tplEdit}
        onClose={() => setTpl(null)}
        wide
        footer={
          <button
            type="button"
            className="cta-btn"
            onClick={() => {
              if (!tpl) return;
              patchTemplate(tpl.id, tpl);
              setTpl(null);
              notify(copy.settings.tplSaved);
            }}
          >
            {copy.common.save}
          </button>
        }
      >
        {tpl ? (
          <>
            <p className="break-all text-xs leading-6 text-slate-500">
              {copy.settings.tplVars}
            </p>
            <textarea
              className="admin-input mt-3 min-h-52 font-mono text-sm leading-relaxed sm:min-h-80"
              value={tpl.body}
              onChange={(e) => setTpl({ ...tpl, body: e.target.value })}
            />
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(store)}
        title={copy.settings.storeTitle}
        onClose={() => setStore(null)}
        footer={
          <button
            type="button"
            className="cta-btn"
            onClick={() => {
              if (!store) return;
              upsertStore(store);
              setStore(null);
              notify(copy.settings.storeSaved);
            }}
          >
            {copy.common.save}
          </button>
        }
      >
        {store ? (
          <>
            <label className="admin-field">
              {copy.settings.storeName}
              <input className="admin-input" value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
            </label>
            <label className="admin-field">
              {copy.settings.address}
              <input className="admin-input" value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} />
            </label>
            <label className="admin-field">
              {copy.settings.phone}
              <input className="admin-input" value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} />
            </label>
            <label className="admin-field">
              {copy.settings.hours}
              <input className="admin-input" value={store.hours} onChange={(e) => setStore({ ...store, hours: e.target.value })} />
            </label>
            <label className="admin-field">
              Google Maps
              <input className="admin-input" value={store.maps} onChange={(e) => setStore({ ...store, maps: e.target.value })} />
            </label>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
