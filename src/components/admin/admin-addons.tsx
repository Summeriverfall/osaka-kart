"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Camera, Image as ImageIcon, Shield, Shirt, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { adminCopy } from "@/lib/admin/copy";
import { b2Copy } from "@/lib/admin/b2-copy";
import { AdminLangSelect, adminLangFromLocale, type AdminLangKey } from "@/components/admin/locale-field";
import { formatYenShort } from "@/lib/format";
import { type AddonSlug, type MockAddon } from "@/lib/mock/addons";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

const ICONS = {
  gopro: Camera,
  costume: Shirt,
  photos: ImageIcon,
  insurance: Shield,
} as const;

const BLANK: MockAddon = {
  id: "",
  slug: "gopro",
  name: "",
  nameEn: "",
  nameJa: "",
  description: "",
  priceJpy: 1000,
  unit: "person",
  unitLabel: "/ 人",
  maxQty: 2,
  active: true,
  stock: 8,
};

export function AdminAddonsView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const { addons, patchAddon, upsertAddon, removeAddon } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockAddon | null>(null);
  const [removing, setRemoving] = useState<MockAddon | null>(null);
  const [nameLang, setNameLang] = useState<AdminLangKey>(() => adminLangFromLocale(locale));
  const nameKeys: AdminLangKey[] = ["zh", "en", "ja"];
  const activeNameLang = nameKeys.includes(nameLang) ? nameLang : "zh";
  const nameValue =
    !editing ? "" : activeNameLang === "en" ? editing.nameEn : activeNameLang === "ja" ? editing.nameJa : editing.name;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
          <button type="button" className="cta-btn" onClick={() => { setNameLang(adminLangFromLocale(locale)); setEditing({ ...BLANK, id: `addon-${Date.now()}` }); }}>
          {copy.addons.add}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {addons.map((addon) => {
          const Icon = ICONS[addon.slug] ?? Camera;
          return (
            <article
              key={addon.id}
              className={cn(
                "rounded-2xl border bg-white p-6 transition hover:shadow-md",
                addon.active ? "border-slate-200" : "border-slate-100 opacity-50",
              )}
            >
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">{locale.startsWith("ja") && addon.nameJa ? addon.nameJa : addon.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{addon.nameEn} · {addon.nameJa}</p>
              <p className="mt-3 min-h-12 text-sm text-slate-500">
                {locale.startsWith("ja") && addon.descriptionJa ? addon.descriptionJa : addon.description}
              </p>
              <p className="mt-4 text-2xl font-black text-blue-600">
                {formatYenShort(addon.priceJpy)}
                <span className="ml-1 text-sm font-medium text-slate-500">{addon.unitLabel}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">{copy.addons.max(addon.maxQty)}</p>
              <div className="mt-5 flex items-center justify-between">
                <NeonToggle checked={addon.active} onChange={(on) => patchAddon(addon.id, { active: on })} />
                <div className="flex gap-2">
                  <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs hover:border-blue-400" onClick={() => { setNameLang(adminLangFromLocale(locale)); setEditing(addon); }}>
                    {copy.common.edit}
                  </button>
                  <button type="button" className="rounded-full border border-slate-200 p-1.5 hover:border-rose-400" onClick={() => setRemoving(addon)} aria-label="delete">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Modal
        open={Boolean(editing)}
        title={editing?.name ? copy.addons.editTitle : copy.addons.addTitle}
        onClose={() => setEditing(null)}
        footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!editing) return; upsertAddon(editing); setEditing(null); notify(copy.addons.saved); }}>{copy.common.save}</button>}
      >
        {editing ? (
          <>
            <div className="admin-locale-field">
              <div className="admin-locale-head">
                <p>{copy.plans.name}</p>
                <AdminLangSelect
                  value={activeNameLang}
                  onChange={setNameLang}
                  keys={nameKeys}
                  labels={{ zh: copy.plans.zh, en: copy.plans.en, ja: copy.plans.ja, ko: copy.plans.ko }}
                  emptyLabel={copy.plans.unfilled}
                  filled={
                    editing
                      ? {
                          zh: Boolean(editing.name.trim()),
                          en: Boolean(editing.nameEn.trim()),
                          ja: Boolean(editing.nameJa.trim()),
                        }
                      : undefined
                  }
                />
              </div>
              <input
                className="admin-input"
                value={nameValue}
                onChange={(e) => {
                  if (!editing) return;
                  const next = e.target.value;
                  if (activeNameLang === "en") setEditing({ ...editing, nameEn: next });
                  else if (activeNameLang === "ja") setEditing({ ...editing, nameJa: next });
                  else setEditing({ ...editing, name: next });
                }}
              />
            </div>
            <label className="admin-field">{copy.addons.desc}<textarea className="admin-input min-h-20" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
            <label className="admin-field">{copy.addons.price}<input className="admin-input" type="number" value={editing.priceJpy} onChange={(e) => setEditing({ ...editing, priceJpy: Number(e.target.value) })} /></label>
            <label className="admin-field">{copy.addons.maxQty}<input className="admin-input" type="number" value={editing.maxQty} onChange={(e) => setEditing({ ...editing, maxQty: Number(e.target.value) })} /></label>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm">{b2.active}</span>
              <NeonToggle checked={editing.active} onChange={(on) => setEditing({ ...editing, active: on })} />
            </div>
            <label className="admin-field">
              {copy.addons.icon}
              <select className="admin-input" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value as AddonSlug })}>
                <option value="gopro">{copy.addons.camera}</option>
                <option value="costume">{copy.addons.costume}</option>
                <option value="photos">{copy.addons.photos}</option>
                <option value="insurance">{copy.addons.insurance}</option>
              </select>
            </label>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(removing)}
        title={copy.addons.delAsk}
        onClose={() => setRemoving(null)}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setRemoving(null)}>{copy.addons.think}</button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!removing) return; removeAddon(removing.id); setRemoving(null); notify(copy.addons.deleted); }}>{copy.addons.del}</button>
          </>
        }
      >
        <p className="text-sm text-slate-500">{copy.addons.delLead}</p>
      </Modal>
    </div>
  );
}
