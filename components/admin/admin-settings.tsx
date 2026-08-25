"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import {
  adminChannel,
  adminCopy,
  adminMailLocale,
  adminMailType,
  adminPayName,
  adminStoreAddress,
  adminStoreName,
} from "@/lib/admin/copy";
import { type MockEmailTemplate, type MockStore } from "@/lib/mock/settings";
import { isBuiltinChannel } from "@/lib/channel-options";
import { sendTestMail } from "@/lib/ops-notify";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

export type SettingsSection = "pay" | "channels" | "stores" | "email";

export function AdminSettingsView({ section }: { section: SettingsSection }) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { settings, patchSettings, templates, patchTemplate, stores, upsertStore } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [tpl, setTpl] = useState<MockEmailTemplate | null>(null);
  const [store, setStore] = useState<MockStore | null>(null);
  const [testing, setTesting] = useState(false);
  const payments = settings.payments;
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
      {section === "pay" ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          {payments.map((item, index) => (
            <div key={item.id} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-black">{adminPayName(locale, item.id, item.name)}</p>
                  {item.reserved ? (
                    <span className="text-xs text-[#6B7280]">{copy.settings.reserved}</span>
                  ) : (
                    <span className="text-xs text-emerald-600">{item.enabled ? copy.settings.on : copy.settings.off}</span>
                  )}
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
              ) : null}
              {item.fieldLabel && !item.reserved ? (
                <label className="admin-field mt-3 min-w-0">
                  {item.fieldLabel}
                  <input
                    className="admin-input"
                    type="password"
                    value={item.fieldValue ?? ""}
                    onChange={(e) => {
                      const next = payments.map((row, i) => (i === index ? { ...row, fieldValue: e.target.value } : row));
                      patchSettings({ payments: next });
                    }}
                  />
                </label>
              ) : null}
            </div>
          ))}
          <button type="button" className="cta-btn w-full px-5 py-2.5 sm:w-auto" onClick={() => notify(copy.settings.paySaved)}>
            {copy.settings.savePay}
          </button>
        </section>
      ) : null}

      {section === "channels" ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(settings.channels ?? []).map((item, index) => {
            const builtin = isBuiltinChannel(item.id);
            return (
              <div key={item.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {builtin ? (
                      <p className="font-black">{adminChannel(locale, item.id)}</p>
                    ) : (
                      <label className="admin-field mt-0 min-w-0">
                        {copy.settings.channelName}
                        <input
                          className="admin-input"
                          value={item.name ?? ""}
                          placeholder={copy.settings.channelNamePh}
                          onChange={(event) => {
                            const next = (settings.channels ?? []).map((row, i) =>
                              i === index ? { ...row, name: event.target.value } : row,
                            );
                            patchSettings({ channels: next });
                          }}
                        />
                      </label>
                    )}
                    {item.locked ? (
                      <span className="text-xs text-slate-500">{copy.settings.channelLocked}</span>
                    ) : (
                      <span className={item.enabled ? "text-xs text-emerald-600" : "text-xs text-slate-500"}>
                        {item.enabled ? copy.settings.on : copy.settings.off}
                      </span>
                    )}
                  </div>
                  <div className={item.locked ? "pointer-events-none opacity-40" : undefined}>
                    <NeonToggle
                      checked={item.enabled}
                      onChange={(on) => {
                        if (item.locked) return;
                        const next = (settings.channels ?? []).map((row, i) => (i === index ? { ...row, enabled: on } : row));
                        patchSettings({ channels: next });
                      }}
                    />
                  </div>
                </div>
                <label className="admin-field mt-3 min-w-0">
                  {copy.settings.channelCut}
                  <input
                    className="admin-input"
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={Number((item.cut * 100).toFixed(1))}
                    onChange={(event) => {
                      const pct = Math.min(100, Math.max(0, Number(event.target.value) || 0));
                      const next = (settings.channels ?? []).map((row, i) => (i === index ? { ...row, cut: pct / 100 } : row));
                      patchSettings({ channels: next });
                    }}
                  />
                </label>
                {builtin ? null : (
                  <button
                    type="button"
                    className="mt-3 text-xs text-rose-600 hover:underline"
                    onClick={() => {
                      patchSettings({
                        channels: (settings.channels ?? []).filter((row) => row.id !== item.id),
                      });
                    }}
                  >
                    {copy.settings.removeChannel}
                  </button>
                )}
              </div>
            );
          })}
          <button
            type="button"
            className="flex min-h-[10.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 transition hover:border-blue-400 hover:text-blue-600"
            onClick={() => {
              patchSettings({
                channels: [
                  ...(settings.channels ?? []),
                  { id: `ch-${Date.now().toString(36)}`, name: "", enabled: true, cut: 0 },
                ],
              });
            }}
          >
            <Plus className="size-5" />
            {copy.settings.addChannel}
          </button>
          <div className="sm:col-span-2 xl:col-span-3">
            <button
              type="button"
              className="cta-btn w-full px-5 py-2.5 sm:w-auto"
              onClick={() => {
                const unnamed = (settings.channels ?? []).some((row) => !isBuiltinChannel(row.id) && !row.name?.trim());
                if (unnamed) {
                  notify(copy.settings.channelNameRequired);
                  return;
                }
                notify(copy.settings.channelSaved);
              }}
            >
              {copy.settings.saveChannels}
            </button>
          </div>
        </section>
      ) : null}

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
            <input
              className="admin-input"
              type="password"
              autoComplete="off"
              value={settings.mailPublicKey ?? ""}
              onChange={(event) => patchSettings({ mailPublicKey: event.target.value })}
            />
          </label>
          <label className="admin-field">
            Service ID
            <input
              className="admin-input"
              value={settings.mailServiceId ?? ""}
              onChange={(event) => patchSettings({ mailServiceId: event.target.value })}
            />
          </label>
          <label className="admin-field">
            Template ID
            <input
              className="admin-input"
              value={settings.mailTemplateId ?? ""}
              onChange={(event) => patchSettings({ mailTemplateId: event.target.value })}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => notify(copy.settings.sendSaved)}>
              {copy.common.save}
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-slate-700 hover:border-blue-400"
              disabled={testing}
              onClick={() => {
                setTesting(true);
                void sendTestMail(useOpsStore.getState().settings, locale)
                  .then((result) => notify(result.message))
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
            className="cta-btn w-full px-5 py-2.5 sm:w-auto"
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
            className="cta-btn w-full px-5 py-2.5 sm:w-auto"
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
