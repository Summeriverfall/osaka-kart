"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { Modal } from "@/components/ui/modal";
import { PermTable, cloneRole, moduleLabel, roleLabel } from "@/components/admin/perm-table";
import { b2Copy } from "@/lib/admin/b2-copy";
import { useAdminAccess } from "@/lib/admin-access";
import { blankRole, PERM_MODULES, type MockRole } from "@/lib/mock/permissions";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

export function AdminPermissionsView() {
  const locale = useLocale();
  const b2 = b2Copy(locale);
  const { isAdmin } = useAdminAccess();
  const roles = useOpsStore((state) => state.roles);
  const upsertRole = useOpsStore((state) => state.upsertRole);
  const removeRole = useOpsStore((state) => state.removeRole);
  const notify = useToastStore((state) => state.notify);
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "role-admin");
  const [draft, setDraft] = useState<MockRole | null>(null);
  const [working, setWorking] = useState<MockRole | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MockRole | null>(null);
  const locked = Boolean(working?.builtin === "admin");

  useEffect(() => {
    const row = roles.find((item) => item.id === roleId) ?? roles[0];
    setWorking(row ? cloneRole(row) : null);
  }, [roleId, roles]);

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

  if (!isAdmin) {
    return <p className="admin-page-lead">{b2.staffPermsInStaff}</p>;
  }

  return (
    <div className="perm-page">
      <section className="perm-card">
        <div className="perm-card-head">
          <div>
            <h2 className="perm-title">{b2.rolePermsTab}</h2>
            <p className="perm-hint">{b2.rolePermsLead}</p>
          </div>
          <button type="button" className="cta-btn" onClick={() => setDraft(blankRole())}>
            {b2.newRole}
          </button>
        </div>
        <ul className="perm-role-chips">
          {roles.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={cn("perm-chip", item.id === roleId && "is-on")}
                onClick={() => setRoleId(item.id)}
              >
                {roleLabel(item, locale)}
              </button>
              {!item.builtin ? (
                <button type="button" className="perm-chip-del" onClick={() => setPendingDelete(item)}>
                  {b2.deleteRole}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {working ? (
          <PermTable
            flags={working.perms}
            locked={locked}
            locale={locale}
            b2={b2}
            onChange={(mod, next) =>
              setWorking({
                ...working,
                perms: { ...working.perms, [mod]: next },
              })
            }
          />
        ) : null}
        {working && !locked ? (
          <div className="perm-save">
            <button type="button" className="cta-btn" onClick={saveWorking}>
              {b2.savePerms}
            </button>
          </div>
        ) : null}
      </section>

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
