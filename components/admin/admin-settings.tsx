"use client";

import { useMemo, useState } from "react";
import { LogsTable } from "@/components/admin/logs-table";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { type MockEmailTemplate, type MockStore } from "@/lib/mock/settings";
import { sendTestMail } from "@/lib/ops-notify";
import { useAdminNavStore } from "@/stores/admin-nav-store";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

export function AdminSettingsView() {
  const { settings, patchSettings, templates, patchTemplate, stores, upsertStore } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const go = useAdminNavStore((state) => state.go);
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
      <nav className="flex flex-wrap gap-2">
        {[
          ["settings-pay", "支付配置"],
          ["settings-stores", "门店管理"],
          ["settings-send", "邮件发送"],
          ["settings-mail", "邮件模板"],
          ["settings-logs", "操作日志"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-700"
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            {label}
          </button>
        ))}
      </nav>

      <section id="settings-pay" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <h2 className="font-black">支付配置</h2>
        {payments.map((item, index) => (
          <div key={item.id} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-black">{item.name}</p>
                {item.reserved ? (
                  <span className="text-xs text-[#6B7280]">预留通道，暂不开放</span>
                ) : (
                  <span className="text-xs text-emerald-600">{item.enabled ? "已启用" : "已关闭"}</span>
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
                <span>测试模式</span>
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
        <button type="button" className="cta-btn w-full px-5 py-2.5 sm:w-auto" onClick={() => notify("支付通道已保存，官网结账页只显示已开启的方式")}>
          保存配置
        </button>
      </section>

      <section id="settings-stores" className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-black">门店管理</h2>
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
            添加门店
          </button>
        </div>
        <ul className="mt-4 space-y-3">
          {stores.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <b>{item.name}</b>
                <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                  <span className="block sm:inline">{item.address}</span>
                  <span className="hidden sm:inline"> · </span>
                  <span className="block sm:inline">{item.hours}</span>
                  <span className="hidden sm:inline"> · </span>
                  <span className="block sm:inline">{item.phone}</span>
                </p>
              </div>
              <button type="button" className="self-start text-xs text-blue-600 sm:self-center" onClick={() => setStore(item)}>
                编辑
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section id="settings-send" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <h2 className="font-black">邮件发送</h2>
        <p className="text-sm leading-6 text-slate-500">
          静态站不能填邮箱密码。请到{" "}
          <a className="text-blue-600" href="https://www.emailjs.com" target="_blank" rel="noreferrer">
            emailjs.com
          </a>{" "}
          用发信箱绑定 Gmail / Outlook，模板收件人填 <code>{"{{to_email}}"}</code>、主题{" "}
          <code>{"{{subject}}"}</code>、正文 <code>{"{{message}}"}</code>。Allowed Origins 加上本站域名。客人信发到订单邮箱，店长抄送发到收件箱。
        </p>
        <label className="admin-field">
          发信箱
          <input
            className="admin-input"
            type="email"
            placeholder="book@osakakart.jp"
            value={settings.mailFrom ?? ""}
            onChange={(event) => patchSettings({ mailFrom: event.target.value })}
          />
        </label>
        <label className="admin-field">
          收件箱
          <input
            className="admin-input"
            type="email"
            placeholder="店长接收新订单和抄送"
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
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => notify("发信设置已保存")}
          >
            保存
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-slate-700 hover:border-blue-400"
            disabled={testing}
            onClick={() => {
              setTesting(true);
              void sendTestMail(useOpsStore.getState().settings)
                .then((result) => notify(result.message))
                .finally(() => setTesting(false));
            }}
          >
            {testing ? "发送中…" : "发送测试信"}
          </button>
        </div>
      </section>

      <section id="settings-mail" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <h2 className="font-black">邮件模板</h2>
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="admin-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>语言</th>
                <th>最后修改</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {templates.map((item) => (
                <tr key={item.id}>
                  <td>{item.type}</td>
                  <td>{item.locale}</td>
                  <td>{item.updated}</td>
                  <td>
                    <button type="button" className="text-xs text-blue-600" onClick={() => setTpl(item)}>
                      编辑
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
              <p className="font-black">{type}</p>
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.locale}</p>
                      <p className="text-xs text-slate-500">{item.updated}</p>
                    </div>
                    <button type="button" className="shrink-0 text-xs text-blue-600" onClick={() => setTpl(item)}>
                      编辑
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="settings-logs" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-black">操作日志</h2>
          <button type="button" className="order-ops-detail" onClick={() => go("/admin/settings/logs")}>
            详情
          </button>
        </div>
        <LogsTable limit={20} />
      </section>

      <Modal
        open={Boolean(tpl)}
        title={tpl ? `编辑邮件模板 · ${tpl.type}（${tpl.locale}）` : "编辑邮件模板"}
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
              notify("模板已保存");
            }}
          >
            保存
          </button>
        }
      >
        {tpl ? (
          <>
            <p className="break-all text-xs leading-6 text-slate-500">
              可用变量：{"{{customer_name}} {{booking_id}} {{date}} {{time}} {{plan_name}} {{riders}} {{total}}"}
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
        title="门店"
        onClose={() => setStore(null)}
        footer={
          <button
            type="button"
            className="cta-btn w-full px-5 py-2.5 sm:w-auto"
            onClick={() => {
              if (!store) return;
              upsertStore(store);
              setStore(null);
              notify("门店已保存，官网营业时间与电话会同步");
            }}
          >
            保存
          </button>
        }
      >
        {store ? (
          <>
            <label className="admin-field">
              名称
              <input className="admin-input" value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
            </label>
            <label className="admin-field">
              地址
              <input className="admin-input" value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} />
            </label>
            <label className="admin-field">
              电话
              <input className="admin-input" value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} />
            </label>
            <label className="admin-field">
              营业时间
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
