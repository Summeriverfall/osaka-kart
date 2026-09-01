"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { adminCopy } from "@/lib/admin/copy";
import { b2Copy } from "@/lib/admin/b2-copy";
import { AdminLangSelect, adminLangFromLocale, type AdminLangKey } from "@/components/admin/locale-field";
import { type AddonSlug, type MockAddon } from "@/lib/mock/addons";

export const BLANK_ADDON: MockAddon = {
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

export function blankAddon(): MockAddon {
  return { ...BLANK_ADDON, id: `addon-${Date.now()}` };
}

export function AddonEditorFields({
  addon,
  onChange,
}: {
  addon: MockAddon;
  onChange: (next: MockAddon) => void;
}) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const [nameLang, setNameLang] = useState<AdminLangKey>(() => adminLangFromLocale(locale));
  const nameKeys: AdminLangKey[] = ["zh", "en", "ja"];
  const activeNameLang = nameKeys.includes(nameLang) ? nameLang : "zh";
  const nameValue =
    activeNameLang === "en" ? addon.nameEn : activeNameLang === "ja" ? addon.nameJa : addon.name;

  return (
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
            filled={{
              zh: Boolean(addon.name.trim()),
              en: Boolean(addon.nameEn.trim()),
              ja: Boolean(addon.nameJa.trim()),
            }}
          />
        </div>
        <input
          className="admin-input"
          value={nameValue}
          onChange={(event) => {
            const next = event.target.value;
            if (activeNameLang === "en") onChange({ ...addon, nameEn: next });
            else if (activeNameLang === "ja") onChange({ ...addon, nameJa: next });
            else onChange({ ...addon, name: next });
          }}
        />
      </div>
      <label className="admin-field">
        {copy.addons.desc}
        <textarea
          className="admin-input min-h-20"
          value={addon.description}
          onChange={(event) => onChange({ ...addon, description: event.target.value })}
        />
      </label>
      <label className="admin-field">
        {copy.addons.price}
        <input
          className="admin-input"
          type="number"
          value={addon.priceJpy}
          onChange={(event) => onChange({ ...addon, priceJpy: Number(event.target.value) })}
        />
      </label>
      <label className="admin-field">
        {copy.addons.maxQty}
        <input
          className="admin-input"
          type="number"
          value={addon.maxQty}
          onChange={(event) => onChange({ ...addon, maxQty: Number(event.target.value) })}
        />
      </label>
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-sm">{b2.active}</span>
        <NeonToggle checked={addon.active} onChange={(on) => onChange({ ...addon, active: on })} />
      </div>
      <label className="admin-field">
        {copy.addons.icon}
        <select
          className="admin-input"
          value={addon.slug}
          onChange={(event) => onChange({ ...addon, slug: event.target.value as AddonSlug })}
        >
          <option value="gopro">{copy.addons.camera}</option>
          <option value="costume">{copy.addons.costume}</option>
          <option value="photos">{copy.addons.photos}</option>
          <option value="insurance">{copy.addons.insurance}</option>
        </select>
      </label>
    </>
  );
}
