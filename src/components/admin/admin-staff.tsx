"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { PermTable, roleLabel } from "@/components/admin/perm-table";
import { adminCopy, adminStaffRole, adminStoreName } from "@/lib/admin/copy";
import { b2Copy } from "@/lib/admin/b2-copy";
import { useAdminAccess } from "@/lib/admin-access";
import {
  capPermsByActor,
  mergePerms,
  permDiff,
  rankFromBuiltin,
  rankOfRole,
  type PermFlags,
  type PermModule,
} from "@/lib/mock/permissions";
import { type MockStaff, type StaffRole } from "@/lib/mock/staff";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";
import { useToastStore } from "@/stores/toast-store";

const BLANK: MockStaff = {
  id: "",
  name: "",
  email: "",
  role: "staff",
  roleId: "role-staff",
  store: "难波本店",
  storeId: "namba",
  active: true,
  lastLogin: "—",
  permOverrides: {},
};

function roleIdOf(person: MockStaff) {
  return person.roleId ?? (person.role === "staff" ? "role-staff" : person.role === "admin" ? "role-admin" : "role-manager");
}

function builtinRole(next: { builtin?: string } | undefined): StaffRole {
  if (next?.builtin === "manager") return "manager";
  if (next?.builtin === "admin") return "admin";
  return "staff";
}

export function AdminStaffView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const { isAdmin, isManager, perms: actorPerms } = useAdminAccess();
  const { staff, stores, storeId, store } = useStoreData();
  const roles = useOpsStore((state) => state.roles);
  const { upsertStaff, patchStaff } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockStaff | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; kind: "reset" | "off" } | null>(null);

  const myRank = isAdmin ? 3 : isManager ? 2 : 1;

  function personRank(person: MockStaff) {
    const role = roles.find((item) => item.id === roleIdOf(person));
    return Math.max(rankOfRole(role), rankFromBuiltin(person.role));
  }

  function canManage(person: MockStaff) {
    return isAdmin || personRank(person) < myRank;
  }

  const listed = staff.filter((item) => canManage(item));
  const roleOptions = roles.filter((item) => isAdmin || rankOfRole(item) < myRank);

  function assignRole(person: MockStaff, nextId: string): MockStaff {
    const nextRole = roles.find((item) => item.id === nextId);
    if (!isAdmin && rankOfRole(nextRole) >= myRank) return person;
    return {
      ...person,
      roleId: nextId,
      role: builtinRole(nextRole),
      permOverrides: {},
    };
  }

  function patchFlags(person: MockStaff, flags: Record<PermModule, PermFlags>): MockStaff {
    const role = roles.find((item) => item.id === roleIdOf(person));
    if (!role) return person;
    const next = isAdmin ? flags : capPermsByActor(flags, actorPerms);
    return { ...person, permOverrides: permDiff(role, next) };
  }

  const editingRole = editing
    ? roles.find((item) => item.id === roleIdOf(editing)) ?? roles.find((item) => item.builtin === "staff")
    : undefined;
  const editingFlags = editing && editingRole ? mergePerms(editingRole, editing.permOverrides) : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          className="cta-btn"
          onClick={() =>
            setEditing({
              ...BLANK,
              id: `s-${Date.now()}`,
              store: store?.name ?? copy.nambaStore,
              storeId,
            })
          }
        >
          {copy.staff.add}
        </button>
      </div>
      <div className="staff-card-grid">
        {listed.map((item) => {
          const role = roles.find((row) => row.id === roleIdOf(item));
          const customized = Object.keys(item.permOverrides ?? {}).length > 0;
          return (
            <article key={item.id} className={item.active ? "staff-card" : "staff-card is-off"}>
              <div className="staff-card-top">
                <div>
                  <p className="staff-card-name">{item.name}</p>
                  <p className="staff-card-sub">
                    {role ? roleLabel(role, locale) : adminStaffRole(locale, item.role)}
                    {" · "}
                    {adminStoreName(locale, item.storeId ?? "", item.store)}
                  </p>
                </div>
                <span className={item.active ? "staff-card-badge is-on" : "staff-card-badge"}>
                  {item.active ? copy.staff.on : copy.staff.off}
                </span>
              </div>
              <dl className="staff-card-facts">
                <div>
                  <dt>{copy.staff.email}</dt>
                  <dd>{item.email || "—"}</dd>
                </div>
                <div>
                  <dt>{copy.staff.lastLogin}</dt>
                  <dd>{item.lastLogin}</dd>
                </div>
                <div>
                  <dt>{b2.assignStaff}</dt>
                  <dd>{customized ? b2.permCustomized : b2.permDefault}</dd>
                </div>
              </dl>
              <div className="staff-card-pills">
                <button type="button" className="staff-pill" onClick={() => setEditing({ ...item })}>
                  {copy.common.edit}
                </button>
                <button type="button" className="staff-pill" onClick={() => setConfirm({ id: item.id, kind: "reset" })}>
                  {copy.staff.reset}
                </button>
                <button type="button" className="staff-pill is-mute" onClick={() => setConfirm({ id: item.id, kind: "off" })}>
                  {copy.staff.off}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <Modal
        open={Boolean(editing)}
        title={copy.staff.title}
        onClose={() => setEditing(null)}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              if (!editing) return;
              if (!canManage(editing)) return;
              const nextRole = roles.find((item) => item.id === roleIdOf(editing));
              const row =
                !isAdmin && rankOfRole(nextRole) >= myRank
                  ? { ...editing, role: "staff" as const, roleId: "role-staff", permOverrides: {} }
                  : editing;
              upsertStaff(row);
              setEditing(null);
              notify(copy.staff.saved);
            }}
          >
            {copy.common.save}
          </button>
        }
      >
        {editing ? (
          <>
            <label className="admin-field">
              {copy.staff.name}
              <input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </label>
            <label className="admin-field">
              {copy.staff.email}
              <input className="admin-input" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
            </label>
            <label className="admin-field">
              {copy.staff.role}
              <select
                className="admin-input"
                value={roleIdOf(editing)}
                onChange={(e) => setEditing(assignRole(editing, e.target.value))}
              >
                {roleOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {roleLabel(item, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              {copy.staff.store}
              <select
                className="admin-input"
                value={editing.storeId ?? storeId}
                disabled={!isAdmin}
                onChange={(e) => {
                  const next = stores.find((item) => item.id === e.target.value);
                  setEditing({ ...editing, storeId: e.target.value, store: next?.name ?? editing.store });
                }}
              >
                {stores.map((item) => (
                  <option key={item.id} value={item.id}>
                    {adminStoreName(locale, item.id, item.name)}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              {copy.staff.password}
              <input className="admin-input" type="password" placeholder={copy.staff.passwordPh} />
            </label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>{copy.staff.on}</span>
              <NeonToggle checked={editing.active} onChange={(on) => setEditing({ ...editing, active: on })} />
            </div>
            {editingFlags && editingRole && canManage(editing) && editing.role !== "admin" ? (
              <div className="perm-staff-edit">
                <p className="perm-title">{b2.permCustom}</p>
                <p className="perm-hint">{b2.permInherit}</p>
                <PermTable
                  flags={editingFlags}
                  locale={locale}
                  b2={b2}
                  allow={isAdmin ? undefined : actorPerms}
                  onChange={(mod, next) => setEditing(patchFlags(editing, { ...editingFlags, [mod]: next }))}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(confirm)}
        title={confirm?.kind === "reset" ? copy.staff.resetAsk : copy.staff.offAsk}
        onClose={() => setConfirm(null)}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              if (!confirm) return;
              const target = staff.find((item) => item.id === confirm.id);
              if (target && !canManage(target)) {
                setConfirm(null);
                return;
              }
              if (confirm.kind === "off") patchStaff(confirm.id, { active: false });
              notify(confirm.kind === "reset" ? copy.staff.resetOk : copy.staff.offOk);
              setConfirm(null);
            }}
          >
            {copy.common.confirm}
          </button>
        }
      >
        <p className="text-sm text-slate-500">{copy.staff.demo}</p>
      </Modal>
    </div>
  );
}
