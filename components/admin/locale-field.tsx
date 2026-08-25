"use client";

import { useState } from "react";
import type { LocaleText } from "@/lib/cms-text";

export type AdminLangKey = "zh" | "en" | "ja" | "ko";

export const ADMIN_LANG_KEYS: AdminLangKey[] = ["zh", "en", "ja", "ko"];

export function adminLangFromLocale(locale: string): AdminLangKey {
  if (locale.startsWith("ja")) return "ja";
  if (locale.startsWith("en")) return "en";
  if (locale.startsWith("ko")) return "ko";
  return "zh";
}

export type AdminLangLabels = Record<AdminLangKey, string>;

export function AdminLangSelect({
  value,
  onChange,
  labels,
  keys = ADMIN_LANG_KEYS,
  filled,
  emptyLabel,
}: {
  value: AdminLangKey;
  onChange: (lang: AdminLangKey) => void;
  labels: AdminLangLabels;
  keys?: AdminLangKey[];
  filled?: Partial<Record<AdminLangKey, boolean>>;
  emptyLabel?: string;
}) {
  return (
    <select
      className="admin-input admin-lang-select"
      value={keys.includes(value) ? value : keys[0]}
      onChange={(event) => onChange(event.target.value as AdminLangKey)}
      aria-label={labels[value]}
    >
      {keys.map((key) => (
        <option key={key} value={key}>
          {labels[key]}
          {emptyLabel && filled && !filled[key] ? ` · ${emptyLabel}` : ""}
        </option>
      ))}
    </select>
  );
}

export function LocaleField({
  label,
  value,
  onChange,
  rows,
  labels,
  locale,
  emptyLabel,
  keys = ADMIN_LANG_KEYS,
}: {
  label: string;
  value: LocaleText;
  onChange: (next: LocaleText) => void;
  rows?: number;
  labels: AdminLangLabels;
  locale: string;
  emptyLabel?: string;
  keys?: AdminLangKey[];
}) {
  const [lang, setLang] = useState<AdminLangKey>(() => {
    const next = adminLangFromLocale(locale);
    return keys.includes(next) ? next : keys[0] ?? "zh";
  });
  const active = keys.includes(lang) ? lang : keys[0] ?? "zh";
  const filled = Object.fromEntries(keys.map((key) => [key, Boolean(value[key]?.trim())])) as Partial<
    Record<AdminLangKey, boolean>
  >;

  return (
    <div className="admin-locale-field">
      <div className="admin-locale-head">
        <p>{label}</p>
        <AdminLangSelect
          value={active}
          onChange={setLang}
          labels={labels}
          keys={keys}
          filled={filled}
          emptyLabel={emptyLabel}
        />
      </div>
      {rows ? (
        <textarea
          className="admin-input min-h-[4.5rem]"
          rows={rows}
          value={value[active]}
          onChange={(event) => onChange({ ...value, [active]: event.target.value })}
        />
      ) : (
        <input
          className="admin-input"
          value={value[active]}
          onChange={(event) => onChange({ ...value, [active]: event.target.value })}
        />
      )}
    </div>
  );
}
