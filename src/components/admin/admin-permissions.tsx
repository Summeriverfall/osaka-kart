"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { Modal } from "@/components/ui/modal";
import { b2Copy } from "@/lib/admin/b2-copy";
import { useAdminAccess } from "@/lib/admin-access";
import { blankRole, PERM_MODULES, type MockRole, type PermModule } from "@/lib/mock/permissions";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";
import { storeIdOf } from "@/lib/store-id";
import { cn } from "@/lib/utils";

type PermPane = "roles" | "staff";

function moduleLabel(id: PermModule, locale: string) {
  const map: Record<PermModule, { zh: string; en: string; ja: string }> = {
    dashboard: { zh: "仪表盘", en: "Dashboard", ja: "ダッシュボード" },
    orders: { zh: "订单", en: "Orders", ja: "注文" },
    calendar: { zh: "日历", en: "Calendar", ja: "カレンダー" },
    inventory: { zh: "库存", en: "Inventory", ja: "在庫" },
    vehicles: { zh: "车辆", en: "Vehicles", ja: "車両" },
    plans: { zh: "套餐", en: "Plans", ja: "コース" },
    addons: { zh: "附加项", en: "Add-ons", ja: "オプション" },
    content: { zh: "内容", en: "Content", ja: "コンテンツ" },
    affiliates: { zh: "推广代理", en: "Affiliates", ja: "アフィリエイト" },
    reports: { zh: "报表", en: "Reports", ja: "レポート" },
    staff: { zh: "员工", en: "Staff", ja: "スタッフ" },
    settings: { zh: "系统设置", en: "Settings", ja: "設定" },
    site: { zh: "全站配置", en: "Site", ja: "サイト設定" },
    permissions: { zh: "权限", en: "Permissions", ja: "権限" },
  };
  if (locale.startsWith("ja")) return map[id].ja;
  if (locale.startsWith("en")) return map[id].en;
  return map[id].zh;
}

function roleLabel(item: MockRole, locale: string) {
  if (locale.startsWith("ja")) return item.nameJa || item.name;
  if (locale.startsWith("en")) return item.nameEn || item.name;
  return item.name;
}

function cloneRole(row: MockRole): MockRole {
  return {
    ...row,
    perms: Object.fromEntries(PERM_MODULES.map((mod) => [mod.id, { ...row.perms[mod.id] }])) as MockRole["perms"],
  };
}

function RolePicker({
  roles,
  value,
  locale,
  removeLabel,
  onChange,
  onDelete,
}: {
  roles: MockRole[];
  value: string;
  locale: string;
  removeLabel: string;
  onChange: (id: string) => void;
  onDelete: (row: MockRole) => void;
}) {
  return (
    <ul className="role-pick-menu is-static" role="listbox">
      {roles.map((item) => {
        const custom = !item.builtin;
        return (
          <li key={item.id} className={cn("role-pick-row", item.id === value && "is-on")}>
            <button
              type="button"
              className="role-pick-name"
              role="option"
              aria-selected={item.id === value}
              onClick={() => onChange(item.id)}
            >
              {roleLabel(item, locale)}
            </button>
            {custom ? (
              <button type="button" className="cta-btn-danger role-pick-del" onClick={() => onDelete(item)}>
                {removeLabel}
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function AdminPermissionsView() {
  const locale = useLocale();
  const b2 = b2Copy(locale);
  const { isAdmin, isManager, record } = useAdminAccess();
  const roles = useOpsStore((state) => state.roles);
  const staff = useOpsStore((state) => state.staff);
  const upsertRole = useOpsStore((state) => state.upsertRole);
  const removeRole = useOpsStore((state) => state.removeRole);
  const patchStaff = useOpsStore((state) => state.patchStaff);
  const notify = useToastStore((state) => state.notify);
  const [pane, setPane] = useState<PermPane>(isAdmin ? "roles" : "staff");
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "role-admin");
  const [draft, setDraft] = useState<MockRole | null>(null);
  const [working, setWorking] = useState<MockRole | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MockRole | null>(null);
  const locked = Boolean(working?.builtin === "admin");

  useEffect(() => {
    if (!isAdmin) setPane("staff");
  }, [isAdmin]);

  useEffect(() => {
    const row = roles.find((item) => item.id === roleId) ?? roles[0];
    setWorking(row ? cloneRole(row) : null);
  }, [roleId, roles]);

  const mine = useMemo(() => {
    if (isAdmin) return staff.filter((item) => item.role !== "admin");
    const sid = storeIdOf(record?.storeId);
    return staff.filter((item) => item.role === "staff" && storeIdOf(item.storeId) === sid);
  }, [isAdmin, staff, record?.storeId]);

  function saveWorking() {
    if (!working?.name.trim()) return;
    upsertRole({
      ...working,
      name: working.name.trim(),
      nameEn: working.nameEn.trim() || working.name.trim(),
      nameJa: working.nameJa.trim() || working.name.trim(),
    });
    notify(b2.permSaved);
  }

  function deletePending() {
    if (!pendingDelete || pendingDelete.builtin) {
      notify(b2.builtinNoDelete);
      return;
    }
    const fallback = roles.find((item) => item.id === "role-staff")?.id ?? roles[0]?.id;
    removeRole(pendingDelete.id);
    if (roleId === pendingDelete.id) setRoleId(fallback ?? "role-staff");
    setPendingDelete(null);
    notify(b2.roleDeleted);
  }

  if (!isAdmin && !isManager) {
    return <p className="admin-page-lead">{b2.permissionsLead}</p>;
  }

  const showRoles = isAdmin && pane === "roles";
  const showStaff = pane === "staff" || !isAdmin;

  return (
    <div className="perm-page">
      {isAdmin ? (
        <div className="perm-tabs" role="tablist" aria-label={b2.permissions}>
          <button
            type="button"
            role="tab"
            aria-selected={pane === "roles"}
            className={cn("perm-tab", pane === "roles" && "is-on")}
            onClick={() => setPane("roles")}
          >
            {b2.rolePermsTab}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pane === "staff"}
            className={cn("perm-tab", pane === "staff" && "is-on")}
            onClick={() => setPane("staff")}
          >
            {b2.staffPermsTab}
          </button>
        </div>
      ) : null}

      {showRoles ? (
        <section className="perm-card">
          <div className="perm-card-head">
            <p className="perm-hint">{b2.rolePermsLead}</p>
            <button type="button" className="cta-btn" onClick={() => setDraft(blankRole())}>
              {b2.newRole}
            </button>
          </div>
          <div className="admin-field perm-roles">
            <span className="perm-label">{b2.roleName}</span>
            <RolePicker
              roles={roles}
              value={roleId}
              locale={locale}
              removeLabel={b2.deleteRole}
              onChange={setRoleId}
              onDelete={setPendingDelete}
            />
          </div>
          {working ? (
            <table className="perm-table">
              <thead>
                <tr>
                  <th>{b2.permModCol}</th>
                  <th>{b2.permView}</th>
                  <th>{b2.permEdit}</th>
                </tr>
              </thead>
              <tbody>
                {PERM_MODULES.map((mod) => {
                  const flags = working.perms[mod.id];
                  return (
                    <tr key={mod.id}>
                      <td>{moduleLabel(mod.id, locale)}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={flags.view}
                          disabled={locked}
                          aria-label={`${moduleLabel(mod.id, locale)} ${b2.permView}`}
                          onChange={(event) => {
                            setWorking({
                              ...working,
                              perms: {
                                ...working.perms,
                                [mod.id]: { ...flags, view: event.target.checked, edit: event.target.checked ? flags.edit : false },
                              },
                            });
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={flags.edit}
                          disabled={locked}
                          aria-label={`${moduleLabel(mod.id, locale)} ${b2.permEdit}`}
                          onChange={(event) => {
                            setWorking({
                              ...working,
                              perms: {
                                ...working.perms,
                                [mod.id]: { view: event.target.checked || flags.view, edit: event.target.checked },
                              },
                            });
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
          {working && !locked ? (
            <div className="perm-save">
              <button type="button" className="cta-btn" onClick={saveWorking}>
                {b2.savePerms}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {showStaff ? (
        <section className="perm-card">
          <p className="perm-hint">{b2.staffPermsLead}</p>
          <ul className="perm-staff">
            {mine.map((person) => (
              <li key={person.id}>
                <p className="perm-staff-name">{person.name}</p>
                <p className="perm-staff-mail">{person.email}</p>
                <label className="admin-field">
                  {b2.roleName}
                  <select
                    className="admin-input"
                    value={person.roleId ?? (person.role === "staff" ? "role-staff" : "role-manager")}
                    onChange={(event) => {
                      const nextRole = roles.find((item) => item.id === event.target.value);
                      patchStaff(person.id, {
                        roleId: event.target.value,
                        role: nextRole?.builtin === "manager" ? "manager" : nextRole?.builtin === "admin" ? "admin" : "staff",
                      });
                      notify(b2.permSaved);
                    }}
                  >
                    {roles
                      .filter((item) => isAdmin || item.builtin !== "admin")
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {locale.startsWith("ja") ? item.nameJa : locale.startsWith("en") ? item.nameEn : item.name}
                        </option>
                      ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Modal
        open={Boolean(draft)}
        title={b2.newRole}
        onClose={() => setDraft(null)}
        footer={
          <button
            type="button"
            className="cta-btn"
            onClick={() => {
              if (!draft?.name.trim()) return;
              const saved = {
                ...draft,
                name: draft.name.trim(),
                nameEn: draft.nameEn.trim() || draft.name.trim(),
                nameJa: draft.nameJa.trim() || draft.name.trim(),
              };
              upsertRole(saved);
              setRoleId(saved.id);
              setDraft(null);
              notify(b2.permSaved);
            }}
          >
            {b2.savePerms}
          </button>
        }
      >
        {draft ? (
          <>
            <label className="admin-field">
              {b2.roleName}
              <input className="admin-input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value, nameEn: event.target.value, nameJa: event.target.value })} />
            </label>
            <ul className="perm-mods is-modal">
              {PERM_MODULES.map((mod) => (
                <li key={mod.id} className="perm-mod">
                  <span className="perm-mod-name">{moduleLabel(mod.id, locale)}</span>
                  <NeonToggle
                    checked={draft.perms[mod.id].view}
                    onChange={(on) =>
                      setDraft({
                        ...draft,
                        perms: { ...draft.perms, [mod.id]: { view: on, edit: on } },
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        title={b2.deleteRole}
        onClose={() => setPendingDelete(null)}
        footer={
          <button type="button" className="cta-btn" onClick={deletePending}>
            {b2.deleteRole}
          </button>
        }
      >
        <p className="perm-hint">{b2.deleteRoleAsk}</p>
      </Modal>
    </div>
  );
}
