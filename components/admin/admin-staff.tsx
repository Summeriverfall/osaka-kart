"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { STAFF_ROLE_LABEL, type MockStaff, type StaffRole } from "@/lib/mock/staff";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

const BLANK: MockStaff = {
  id: "",
  name: "",
  email: "",
  role: "staff",
  store: "难波本店",
  active: true,
  lastLogin: "—",
};

export function AdminStaffView() {
  const { staff, upsertStaff, patchStaff } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockStaff | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; kind: "reset" | "off" } | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setEditing({ ...BLANK, id: `s-${Date.now()}` })}>添加员工</button>
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>门店</th>
              <th>状态</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((item) => (
              <tr key={item.id} className={item.active ? "" : "opacity-50"}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{STAFF_ROLE_LABEL[item.role]}</td>
                <td>{item.store}</td>
                <td>{item.active ? "在职" : "停用"}</td>
                <td>{item.lastLogin}</td>
                <td className="space-x-2">
                  <button type="button" className="text-xs text-blue-600" onClick={() => setEditing(item)}>编辑</button>
                  <button type="button" className="text-xs text-sky-600" onClick={() => setConfirm({ id: item.id, kind: "reset" })}>重置密码</button>
                  <button type="button" className="text-xs text-slate-500" onClick={() => setConfirm({ id: item.id, kind: "off" })}>停用</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {staff.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-black">{item.name}</p>
            <p className="text-sm text-slate-500">{STAFF_ROLE_LABEL[item.role]} · {item.store}</p>
            <button type="button" className="mt-3 text-xs text-blue-600" onClick={() => setEditing(item)}>编辑</button>
          </article>
        ))}
      </div>

      <Modal open={Boolean(editing)} title="员工" onClose={() => setEditing(null)} footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!editing) return; upsertStaff(editing); setEditing(null); notify("员工已保存"); }}>保存</button>}>
        {editing ? (
          <>
            <label className="admin-field">姓名<input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
            <label className="admin-field">邮箱<input className="admin-input" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></label>
            <label className="admin-field">
              角色
              <select className="admin-input" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as StaffRole })}>
                {Object.entries(STAFF_ROLE_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
            <label className="admin-field">
              门店
              <select className="admin-input" value={editing.store} onChange={(e) => setEditing({ ...editing, store: e.target.value })}>
                <option>难波本店</option>
                <option>预留·心斋桥</option>
                <option>预留·梅田</option>
              </select>
            </label>
            <label className="admin-field">初始密码<input className="admin-input" type="password" placeholder="演示环境任意密码" /></label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>在职</span>
              <NeonToggle checked={editing.active} onChange={(on) => setEditing({ ...editing, active: on })} />
            </div>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(confirm)}
        title={confirm?.kind === "reset" ? "重置密码？" : "停用该账号？"}
        onClose={() => setConfirm(null)}
        footer={
          <button type="button" className="cta-btn px-5 py-2.5" onClick={() => {
            if (!confirm) return;
            if (confirm.kind === "off") patchStaff(confirm.id, { active: false });
            notify(confirm.kind === "reset" ? "密码已重置为临时口令" : "账号已停用");
            setConfirm(null);
          }}>确认</button>
        }
      >
        <p className="text-sm text-slate-500">演示环境只改内存状态，不会发真实邮件。</p>
      </Modal>
    </div>
  );
}
