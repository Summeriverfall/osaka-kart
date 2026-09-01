"use client";

import { useMemo, useState } from "react";
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

export function AdminPermissionsView() {
  const locale = useLocale();
  const b2 = b2Copy(locale);
  const { isAdmin, isManager, record } = useAdminAccess();
  const roles = useOpsStore((state) => state.roles);
  const staff = useOpsStore((state) => state.staff);
  const upsertRole = useOpsStore((state) => state.upsertRole);
  const patchStaff = useOpsStore((state) => state.patchStaff);
  const notify = useToastStore((state) => state.notify);
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "role-admin");
  const [draft, setDraft] = useState<MockRole | null>(null);
  const current = roles.find((item) => item.id === roleId) ?? roles[0];

  const mine = useMemo(() => {
    if (isAdmin) return staff.filter((item) => item.role !== "admin");
    const sid = storeIdOf(record?.storeId);
    return staff.filter((item) => item.role === "staff" && storeIdOf(item.storeId) === sid);
  }, [isAdmin, staff, record?.storeId]);

  if (!isAdmin && !isManager) {
    return <p className="text-sm text-slate-500">{b2.permissionsLead}</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {isAdmin ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">{b2.permissions}</h2>
            <button type="button" className="cta-btn px-4 py-2 text-sm" onClick={() => setDraft(blankRole())}>
              {b2.newRole}
            </button>
          </div>
          <label className="admin-field mt-4">
            {b2.roleName}
            <select className="admin-input" value={roleId} onChange={(event) => setRoleId(event.target.value)}>
              {roles.map((item) => (
                <option key={item.id} value={item.id}>
                  {locale.startsWith("ja") ? item.nameJa : locale.startsWith("en") ? item.nameEn : item.name}
                </option>
              ))}
            </select>
          </label>
          {current ? (
            <ul className="mt-4 space-y-2">
              {PERM_MODULES.map((mod) => {
                const flags = current.perms[mod.id];
                return (
                  <li key={mod.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2">
                    <span className={cn("text-sm font-medium", mod.parent && "pl-4 text-slate-600")}>{moduleLabel(mod.id, locale)}</span>
                    <span className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-2">
                        {b2.permView}
                        <input
                          type="checkbox"
                          checked={flags.view}
                          disabled={Boolean(current.builtin === "admin")}
                          onChange={(event) => {
                            const next = {
                              ...current,
                              perms: {
                                ...current.perms,
                                [mod.id]: { ...flags, view: event.target.checked, edit: event.target.checked ? flags.edit : false },
                              },
                            };
                            upsertRole(next);
                          }}
                        />
                      </label>
                      <label className="flex items-center gap-2">
                        {b2.permEdit}
                        <input
                          type="checkbox"
                          checked={flags.edit}
                          disabled={Boolean(current.builtin === "admin")}
                          onChange={(event) => {
                            const next = {
                              ...current,
                              perms: {
                                ...current.perms,
                                [mod.id]: { view: event.target.checked || flags.view, edit: event.target.checked },
                              },
                            };
                            upsertRole(next);
                          }}
                        />
                      </label>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">{b2.assignStaff}</h2>
        <ul className="mt-4 space-y-3">
          {mine.map((person) => (
            <li key={person.id} className="rounded-xl border border-slate-100 p-3">
              <p className="text-sm font-medium">{person.name}</p>
              <p className="text-xs text-slate-500">{person.email}</p>
              <label className="admin-field mt-2">
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

      <Modal
        open={Boolean(draft)}
        title={b2.newRole}
        onClose={() => setDraft(null)}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              if (!draft?.name.trim()) return;
              upsertRole(draft);
              setRoleId(draft.id);
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
            <ul className="mt-3 space-y-2">
              {PERM_MODULES.map((mod) => (
                <li key={mod.id} className="flex items-center justify-between text-sm">
                  <span>{moduleLabel(mod.id, locale)}</span>
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
    </div>
  );
}
