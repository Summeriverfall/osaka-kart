"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { formatYenShort } from "@/lib/format";
import { coverOf, planImage, planRoute } from "@/lib/media";
import { MOCK_PLANS, type MockPlan } from "@/lib/mock/plans";
import { readLocalImage } from "@/lib/read-local-image";
import { adminCopy } from "@/lib/admin/copy";
import { AdminLangSelect, adminLangFromLocale, type AdminLangKey } from "@/components/admin/locale-field";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";
import { useToastStore } from "@/stores/toast-store";
import { useLocale } from "next-intl";

function toggleAddon(plan: MockPlan, addonId: string): MockPlan {
  const current = plan.allowedAddonIds ?? [];
  const on = current.includes(addonId);
  return {
    ...plan,
    allowedAddonIds: on ? current.filter((id) => id !== addonId) : [...current, addonId],
  };
}

function toLines(items?: string[]) {
  return (items ?? []).join("\n");
}

function fromLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function withCopyDefaults(plan: MockPlan): MockPlan {
  const seed =
    MOCK_PLANS.find((item) => item.id === plan.id) ?? MOCK_PLANS.find((item) => item.slug === plan.slug);
  if (!seed) return plan;
  return {
    ...plan,
    nameKo: plan.nameKo ?? seed.nameKo ?? "",
    description: plan.description ?? seed.description ?? "",
    descriptionEn: plan.descriptionEn ?? seed.descriptionEn ?? "",
    descriptionJa: plan.descriptionJa ?? seed.descriptionJa ?? "",
    descriptionKo: plan.descriptionKo ?? seed.descriptionKo ?? "",
    highlights: plan.highlights?.length ? plan.highlights : (seed.highlights ?? []),
    highlightsEn: plan.highlightsEn?.length ? plan.highlightsEn : (seed.highlightsEn ?? []),
    highlightsJa: plan.highlightsJa?.length ? plan.highlightsJa : (seed.highlightsJa ?? []),
    highlightsKo: plan.highlightsKo?.length ? plan.highlightsKo : (seed.highlightsKo ?? []),
    includes: plan.includes?.length ? plan.includes : seed.includes,
  };
}

type CopyLang = {
  lang: "zh" | "en" | "ja" | "ko";
  get: (plan: MockPlan) => string;
  set: (plan: MockPlan, value: string) => MockPlan;
};

type CopyGroup = {
  key: "name" | "intro" | "highlights";
  hint?: boolean;
  lines?: boolean;
  preview: (plan: MockPlan) => string;
  langs: CopyLang[];
};

const COPY_GROUPS: CopyGroup[] = [
  {
    key: "name",
    preview: (plan) => plan.name,
    langs: [
      { lang: "zh", get: (plan) => plan.name, set: (plan, value) => ({ ...plan, name: value }) },
      { lang: "en", get: (plan) => plan.nameEn, set: (plan, value) => ({ ...plan, nameEn: value }) },
      { lang: "ja", get: (plan) => plan.nameJa, set: (plan, value) => ({ ...plan, nameJa: value }) },
      { lang: "ko", get: (plan) => plan.nameKo ?? "", set: (plan, value) => ({ ...plan, nameKo: value }) },
    ],
  },
  {
    key: "intro",
    lines: true,
    preview: (plan) => plan.description ?? "",
    langs: [
      { lang: "zh", get: (plan) => plan.description ?? "", set: (plan, value) => ({ ...plan, description: value }) },
      { lang: "en", get: (plan) => plan.descriptionEn ?? "", set: (plan, value) => ({ ...plan, descriptionEn: value }) },
      { lang: "ja", get: (plan) => plan.descriptionJa ?? "", set: (plan, value) => ({ ...plan, descriptionJa: value }) },
      { lang: "ko", get: (plan) => plan.descriptionKo ?? "", set: (plan, value) => ({ ...plan, descriptionKo: value }) },
    ],
  },
  {
    key: "highlights",
    hint: true,
    lines: true,
    preview: (plan) => toLines(plan.highlights),
    langs: [
      { lang: "zh", get: (plan) => toLines(plan.highlights), set: (plan, value) => ({ ...plan, highlights: fromLines(value) }) },
      { lang: "en", get: (plan) => toLines(plan.highlightsEn), set: (plan, value) => ({ ...plan, highlightsEn: fromLines(value) }) },
      { lang: "ja", get: (plan) => toLines(plan.highlightsJa), set: (plan, value) => ({ ...plan, highlightsJa: fromLines(value) }) },
      { lang: "ko", get: (plan) => toLines(plan.highlightsKo), set: (plan, value) => ({ ...plan, highlightsKo: fromLines(value) }) },
    ],
  },
];

function previewOf(text: string, empty: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return empty;
  return compact.length > 28 ? `${compact.slice(0, 28)}…` : compact;
}

function planImageError(copy: ReturnType<typeof adminCopy>["plans"], code: string) {
  if (code === "size") return copy.errSize;
  if (code === "small") return copy.errSmall;
  if (code === "large") return copy.errLarge;
  if (code === "type") return copy.errType;
  return copy.errFail;
}

function PlanImageField({
  label,
  hint,
  value,
  fallback,
  emptyText,
  uploadLabel,
  removeLabel,
  onChange,
  onError,
  errorOf,
}: {
  label: string;
  hint: string;
  value?: string;
  fallback?: string;
  emptyText?: string;
  uploadLabel: string;
  removeLabel?: string;
  onChange: (next: string | undefined) => void;
  onError: (message: string) => void;
  errorOf: (code: string) => string;
}) {
  const src = value?.trim() || fallback || "";
  return (
    <div>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p>
      {src ? (
        <img
          src={src}
          alt=""
          className="mt-2 h-36 w-full rounded-xl border border-slate-200 object-cover"
        />
      ) : (
        <div className="mt-2 flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-xs text-slate-400">
          {emptyText}
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        <label className="cta-btn cursor-pointer px-4 py-2 text-sm">
          {uploadLabel}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              try {
                onChange(await readLocalImage(file));
              } catch (error) {
                const code = error instanceof Error ? error.message : "";
                onError(errorOf(code));
              }
            }}
          />
        </label>
        {value?.trim() ? (
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-blue-400"
            onClick={() => onChange("")}
          >
            {removeLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function AdminPlansView() {
  const locale = useLocale();
  const copy = adminCopy(locale).plans;
  const { addons, patchPlan, upsertPlan } = useOpsStore();
  const { plans, storeId } = useStoreData();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockPlan | null>(null);
  const [copyOpen, setCopyOpen] = useState(-1);
  const [copyLang, setCopyLang] = useState<AdminLangKey>(() => adminLangFromLocale(locale));

  function openEditor(plan: MockPlan) {
    setEditing(plan);
    setCopyOpen(-1);
    setCopyLang(adminLangFromLocale(locale));
  }

  const groupLabel = {
    name: copy.name,
    intro: copy.intro,
    highlights: copy.highlights,
  };
  const langLabel = {
    zh: copy.zh,
    en: copy.en,
    ja: copy.ja,
    ko: copy.ko,
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="cta-btn"
        onClick={() =>
          openEditor({
            id: `plan-${Date.now()}`,
            slug: "new-plan",
            name: "",
            nameEn: "",
            nameJa: "",
            nameKo: "",
            durationMinutes: 60,
            distanceKm: 8,
            priceJpy: 12800,
            active: true,
            maxRiders: 4,
            includes: ["头盔", "赛车朝", "保险", "坑导"],
            allowedAddonIds: addons.map((item) => item.id),
            storeIds: [storeId],
            coverImage: undefined,
            detailImage: undefined,
            description: "",
            descriptionEn: "",
            descriptionJa: "",
            descriptionKo: "",
            highlights: [],
            highlightsEn: [],
            highlightsJa: [],
            highlightsKo: [],
          })
        }
      >
        {copy.add}
      </button>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`min-w-0 rounded-2xl border bg-white p-4 ${plan.active ? "border-slate-200" : "border-slate-100 opacity-50"}`}
          >
            <img
              src={coverOf({ slug: plan.slug, cover_image: plan.coverImage })}
              alt=""
              className="mb-3 h-24 w-full rounded-xl object-cover"
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">{plan.name}</h3>
                <p className="mt-1 text-blue-600">{formatYenShort(plan.priceJpy)}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {plan.durationMinutes} {copy.minutes}
                  {plan.distanceKm != null ? ` · ${plan.distanceKm} ${copy.km}` : ""}
                </p>
              </div>
              <NeonToggle checked={plan.active} onChange={(on) => patchPlan(plan.id, { active: on })} />
            </div>

            <p className="mt-4 text-xs text-slate-500">
              {copy.addons} {(plan.allowedAddonIds ?? []).length}/{addons.length}
            </p>

            <button
              type="button"
              className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-blue-400"
              onClick={() => openEditor(withCopyDefaults(plan))}
            >
              {copy.edit}
            </button>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(editing)}
        title={editing?.name ? copy.edit : copy.add}
        wide
        onClose={() => {
          setEditing(null);
          setCopyOpen(-1);
        }}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              if (!editing) return;
              upsertPlan(editing);
              setEditing(null);
              notify(copy.saved);
            }}
          >
            {copy.save}
          </button>
        }
      >
        {editing ? (
          <>
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
              {copy.copyHint}
            </p>
            <PlanImageField
              label={copy.cover}
              hint={`${copy.coverHint} ${copy.limitHint}`}
              value={editing.coverImage}
              fallback={planImage(editing.slug)}
              emptyText={copy.notUploaded}
              uploadLabel={copy.upload}
              removeLabel={copy.restore}
              onChange={(coverImage) => setEditing({ ...editing, coverImage })}
              onError={notify}
              errorOf={(code) => planImageError(copy, code)}
            />
            <PlanImageField
              label={copy.route}
              hint={`${copy.routeHint} ${copy.limitHint}`}
              value={editing.detailImage}
              fallback={planRoute(editing.slug) || undefined}
              emptyText={copy.routeEmpty}
              uploadLabel={copy.upload}
              removeLabel={planRoute(editing.slug) ? copy.restore : copy.remove}
              onChange={(detailImage) => setEditing({ ...editing, detailImage })}
              onError={notify}
              errorOf={(code) => planImageError(copy, code)}
            />

            <div>
              <div className="admin-locale-head">
                <p className="text-sm font-semibold text-slate-700">{copy.copy}</p>
                <AdminLangSelect
                  value={copyLang}
                  onChange={setCopyLang}
                  labels={langLabel}
                  emptyLabel={copy.unfilled}
                  filled={
                    editing
                      ? {
                          zh: Boolean(editing.name.trim() || (editing.description ?? "").trim() || (editing.highlights ?? []).length),
                          en: Boolean(editing.nameEn.trim() || (editing.descriptionEn ?? "").trim() || (editing.highlightsEn ?? []).length),
                          ja: Boolean(editing.nameJa.trim() || (editing.descriptionJa ?? "").trim() || (editing.highlightsJa ?? []).length),
                          ko: Boolean((editing.nameKo ?? "").trim() || (editing.descriptionKo ?? "").trim() || (editing.highlightsKo ?? []).length),
                        }
                      : undefined
                  }
                />
              </div>
              <ol className="admin-copy-list">
                {COPY_GROUPS.map((group, index) => {
                  const open = copyOpen === index;
                  const activeLang = group.langs.find((item) => item.lang === copyLang) ?? group.langs[0];
                  return (
                    <li key={group.key} className={cn("admin-copy-row", open && "is-open")}>
                      <button
                        type="button"
                        className="admin-copy-head"
                        onClick={() => setCopyOpen(open ? -1 : index)}
                      >
                        <span className="admin-copy-n">{index + 1}</span>
                        <span className="min-w-0 flex-1 text-left">
                          <span className="block text-sm text-slate-800">{groupLabel[group.key]}</span>
                          {!open ? (
                            <span className="mt-0.5 block truncate text-xs text-slate-400">
                              {previewOf(group.preview(editing), copy.unfilled)}
                            </span>
                          ) : null}
                        </span>
                        <ChevronDown className={cn("size-4 shrink-0 text-slate-400 transition", open && "rotate-180")} />
                      </button>
                      {open && activeLang ? (
                        <div className="admin-copy-body">
                          <label className="admin-field">
                            {langLabel[activeLang.lang]}
                            {group.lines ? (
                              <textarea
                                className="admin-input min-h-20"
                                value={activeLang.get(editing)}
                                onChange={(event) => setEditing(activeLang.set(editing, event.target.value))}
                              />
                            ) : (
                              <input
                                className="admin-input"
                                value={activeLang.get(editing)}
                                onChange={(event) => setEditing(activeLang.set(editing, event.target.value))}
                              />
                            )}
                          </label>
                          {group.hint ? <p className="mt-2 text-xs text-slate-500">{copy.highlightHint}</p> : null}
                          {index < COPY_GROUPS.length - 1 ? (
                            <button
                              type="button"
                              className="mt-3 rounded-full border border-blue-200 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50"
                              onClick={() => setCopyOpen(index + 1)}
                            >
                              {copy.next}
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>

            <label className="admin-field">
              {copy.slug}
              <input
                className="admin-input"
                value={editing.slug}
                onChange={(event) => setEditing({ ...editing, slug: event.target.value.trim() })}
              />
            </label>
            <label className="admin-field">
              {copy.price}
              <input
                className="admin-input"
                type="number"
                value={editing.priceJpy}
                onChange={(event) => setEditing({ ...editing, priceJpy: Number(event.target.value) })}
              />
            </label>
            <label className="admin-field">
              {copy.duration}
              <input
                className="admin-input"
                type="number"
                value={editing.durationMinutes}
                onChange={(event) => setEditing({ ...editing, durationMinutes: Number(event.target.value) })}
              />
            </label>
            <label className="admin-field">
              {copy.distance}
              <input
                className="admin-input"
                type="number"
                value={editing.distanceKm}
                onChange={(event) => setEditing({ ...editing, distanceKm: Number(event.target.value) })}
              />
            </label>

            <div>
              <p className="text-sm text-slate-600">{copy.addons}</p>
              <p className="mt-1 text-xs text-slate-500">{copy.addonsHint}</p>
              <ul className="mt-2 space-y-1">
                {addons.map((addon) => {
                  const allowed = (editing.allowedAddonIds ?? []).includes(addon.id);
                  return (
                    <li key={addon.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={allowed}
                          onChange={() => setEditing(toggleAddon(editing, addon.id))}
                          className="size-4 accent-blue-600"
                        />
                        <span className={cn("flex-1 text-sm", allowed ? "text-slate-800" : "text-slate-400")}>
                          {addon.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatYenShort(addon.priceJpy)} {addon.unitLabel}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm">{copy.listed}</span>
              <NeonToggle checked={editing.active} onChange={(on) => setEditing({ ...editing, active: on })} />
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
