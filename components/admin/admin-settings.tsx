"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { MOCK_LOGS, type LogType } from "@/lib/mock/logs";
import { type MockEmailTemplate, type MockStore } from "@/lib/mock/settings";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

export function AdminSettingsView() {
  const { settings, patchSettings, templates, patchTemplate, stores, upsertStore } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [tpl, setTpl] = useState<MockEmailTemplate | null>(null);
  const [store, setStore] = useState<MockStore | null>(null);
  const [actor, setActor] = useState("all");
  const [type, setType] = useState<LogType | "all">("all");
  const payments = settings.payments;
  const logs = useMemo(() => {
    return MOCK_LOGS.filter((item) => {
      if (actor !== "all" && item.actor !== actor) return false;
      if (type !== "all" && item.type !== type) return false;
      return true;
    });
  }, [actor, type]);

  return (
    <div className="grid gap-6">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-black">支付配置</h2>
        {payments.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black">{item.name}</p>
                {item.reserved ? <span className="text-xs text-[#6B7280]">预留通道，暂不开放</span> : <span className="text-xs text-emerald-600">{item.enabled ? "已启用" : "已关闭"}</span>}
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
              <div className="mt-3 flex items-center justify-between text-sm">
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
              <label className="admin-field mt-3">
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
        <button type="button" className="cta-btn px-5 py-2.5" onClick={() => notify("保存成功")}>保存配置</button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-black">邮件模板</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>类型</th><th>语言</th><th>最后修改</th><th /></tr></thead>
            <tbody>
              {templates.map((item) => (
                <tr key={item.id}>
                  <td>{item.type}</td>
                  <td>{item.locale}</td>
                  <td>{item.updated}</td>
                  <td><button type="button" className="text-xs text-blue-600" onClick={() => setTpl(item)}>编辑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-black">操作日志</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <select className="admin-input max-w-40" value={actor} onChange={(e) => setActor(e.target.value)}>
            <option value="all">全部操作人</option>
            {[...new Set(MOCK_LOGS.map((item) => item.actor))].map((name) => <option key={name}>{name}</option>)}
          </select>
          <select className="admin-input max-w-40" value={type} onChange={(e) => setType(e.target.value as LogType | "all")}>
            <option value="all">全部类型</option>
            {["登录", "登出", "订单修改", "库存调整", "套餐上下架", "员工变更"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>时间</th><th>操作人</th><th>角色</th><th>类型</th><th>详情</th><th>IP</th></tr></thead>
            <tbody>
              {logs.map((item) => (
                <tr key={item.id}>
                  <td>{item.time}</td>
                  <td>{item.actor}</td>
                  <td>{item.role}</td>
                  <td>{item.type}</td>
                  <td>{item.detail}</td>
                  <td className="font-mono text-xs">{item.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-black">门店管理</h2>
          <button type="button" className="cta-btn px-4 py-2 text-sm" onClick={() => setStore({ id: `st-${Date.now()}`, name: "", address: "", phone: "", hours: "10:00 – 21:00", maps: "", status: "预留", created: "2026-08-20" })}>添加门店</button>
        </div>
        <ul className="mt-4 space-y-3">
          {stores.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <b>{item.name}</b>
                <p className="text-sm text-slate-500">{item.address} · {item.hours} · {item.phone}</p>
              </div>
              <button type="button" className="text-xs text-blue-600" onClick={() => setStore(item)}>编辑</button>
            </li>
          ))}
        </ul>
      </section>

      <Modal open={Boolean(tpl)} title="编辑邮件模板" onClose={() => setTpl(null)} footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!tpl) return; patchTemplate(tpl.id, tpl); setTpl(null); notify("模板已保存"); }}>保存</button>}>
        {tpl ? (
          <>
            <p className="text-xs text-slate-500">可用变量：{"{{customer_name}} {{booking_id}} {{date}} {{time}}"}</p>
            <textarea className="admin-input min-h-40" value={tpl.body} onChange={(e) => setTpl({ ...tpl, body: e.target.value })} />
          </>
        ) : null}
      </Modal>

      <Modal open={Boolean(store)} title="门店" onClose={() => setStore(null)} footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!store) return; upsertStore(store); setStore(null); notify("门店已保存"); }}>保存</button>}>
        {store ? (
          <>
            <label className="admin-field">名称<input className="admin-input" value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} /></label>
            <label className="admin-field">地址<input className="admin-input" value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} /></label>
            <label className="admin-field">电话<input className="admin-input" value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} /></label>
            <label className="admin-field">营业时间<input className="admin-input" value={store.hours} onChange={(e) => setStore({ ...store, hours: e.target.value })} /></label>
            <label className="admin-field">Google Maps<input className="admin-input" value={store.maps} onChange={(e) => setStore({ ...store, maps: e.target.value })} /></label>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
