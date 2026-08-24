"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { formatYenShort } from "@/lib/format";
import { coverOf, planImage, planRoute } from "@/lib/media";
import { MOCK_PLANS, type MockPlan } from "@/lib/mock/plans";
import { planImageLimitHint, readLocalImage, readLocalImageErrorMessage } from "@/lib/read-local-image";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";
import { useToastStore } from "@/stores/toast-store";

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
  label: string;
  get: (plan: MockPlan) => string;
  set: (plan: MockPlan, value: string) => MockPlan;
};

type CopyGroup = {
  label: string;
  hint?: string;
  lines?: boolean;
  preview: (plan: MockPlan) => string;
  langs: CopyLang[];
};

const COPY_GROUPS: CopyGroup[] = [
  {
    label: "名称",
    preview: (plan) => plan.name,
    langs: [
      { label: "中文", get: (plan) => plan.name, set: (plan, value) => ({ ...plan, name: value }) },
      { label: "英文", get: (plan) => plan.nameEn, set: (plan, value) => ({ ...plan, nameEn: value }) },
      { label: "日文", get: (plan) => plan.nameJa, set: (plan, value) => ({ ...plan, nameJa: value }) },
      { label: "韩文", get: (plan) => plan.nameKo ?? "", set: (plan, value) => ({ ...plan, nameKo: value }) },
    ],
  },
  {
    label: "介绍",
    lines: true,
    preview: (plan) => plan.description ?? "",
    langs: [
      { label: "中文", get: (plan) => plan.description ?? "", set: (plan, value) => ({ ...plan, description: value }) },
      { label: "英文", get: (plan) => plan.descriptionEn ?? "", set: (plan, value) => ({ ...plan, descriptionEn: value }) },
      { label: "日文", get: (plan) => plan.descriptionJa ?? "", set: (plan, value) => ({ ...plan, descriptionJa: value }) },
      { label: "韩文", get: (plan) => plan.descriptionKo ?? "", set: (plan, value) => ({ ...plan, descriptionKo: value }) },
    ],
  },
  {
    label: "亮点",
    hint: "每种语言每行一条，前台最多显示 3 条。",
    lines: true,
    preview: (plan) => toLines(plan.highlights),
    langs: [
      { label: "中文", get: (plan) => toLines(plan.highlights), set: (plan, value) => ({ ...plan, highlights: fromLines(value) }) },
      { label: "英文", get: (plan) => toLines(plan.highlightsEn), set: (plan, value) => ({ ...plan, highlightsEn: fromLines(value) }) },
      { label: "日文", get: (plan) => toLines(plan.highlightsJa), set: (plan, value) => ({ ...plan, highlightsJa: fromLines(value) }) },
      { label: "韩文", get: (plan) => toLines(plan.highlightsKo), set: (plan, value) => ({ ...plan, highlightsKo: fromLines(value) }) },
    ],
  },
];

function previewOf(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return "未填写";
  return compact.length > 28 ? `${compact.slice(0, 28)}…` : compact;
}

function PlanImageField({
  label,
  hint,
  value,
  fallback,
  emptyText,
  removeLabel,
  onChange,
  onError,
}: {
  label: string;
  hint: string;
  value?: string;
  fallback?: string;
  emptyText?: string;
  removeLabel?: string;
  onChange: (next: string | undefined) => void;
  onError: (message: string) => void;
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
          {emptyText || "尚未上传"}
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        <label className="cta-btn cursor-pointer px-4 py-2 text-sm">
          上传图片
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
                onError(readLocalImageErrorMessage(code));
              }
            }}
          />
        </label>
        {value?.trim() ? (
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-blue-400"
            onClick={() => onChange(undefined)}
          >
            {removeLabel || "移除"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function AdminPlansView() {
  const { addons, patchPlan, upsertPlan } = useOpsStore();
  const { plans, storeId } = useStoreData();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockPlan | null>(null);
  const [copyOpen, setCopyOpen] = useState(-1);

  function openEditor(plan: MockPlan) {
    setEditing(plan);
    setCopyOpen(-1);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="cta-btn px-5 py-2.5"
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
            includes: ["头盔", "赛车服", "保险", "向导"],
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
        添加套餐
      </button>
      <div className="grid gap-4 xl:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.id} className={`rounded-2xl border bg-white p-5 ${plan.active ? "border-slate-200" : "border-slate-100 opacity-50"}`}>
            <img
              src={coverOf({ slug: plan.slug, cover_image: plan.coverImage })}
              alt=""
              className="mb-4 h-32 w-full rounded-xl object-cover"
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">{plan.name}</h3>
                <p className="mt-1 text-blue-600">{formatYenShort(plan.priceJpy)}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {plan.durationMinutes} 分钟
                  {plan.distanceKm != null ? ` · ${plan.distanceKm} 公里` : ""}
                </p>
              </div>
              <NeonToggle checked={plan.active} onChange={(on) => patchPlan(plan.id, { active: on })} />
            </div>

            <p className="mt-5 text-xs font-semibold tracking-wide text-slate-500 uppercase">可购附加项</p>
            <ul className="mt-2 space-y-1">
              {addons.map((addon) => {
                const allowed = (plan.allowedAddonIds ?? []).includes(addon.id);
                return (
                  <li key={addon.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={allowed}
                        onChange={() => patchPlan(plan.id, toggleAddon(plan, addon.id))}
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

            <button
              type="button"
              className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-blue-400"
              onClick={() => openEditor(withCopyDefaults(plan))}
            >
              编辑套餐
            </button>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(editing)}
        title={editing?.name ? "编辑套餐" : "添加套餐"}
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
              notify("套餐已保存。图片存在本机浏览器（localStorage），换电脑或清缓存需重新上传。");
            }}
          >
            保存
          </button>
        }
      >
        {editing ? (
          <>
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
              收起时只显示名称、介绍、亮点。点开某一项，在里面一次填中文、英文、日文、韩文。
            </p>
            <PlanImageField
              label="标题图片"
              hint={`套餐卡顶部大图，建议 16:9（约 1600×900）。${planImageLimitHint()}不上传则用默认街景。`}
              value={editing.coverImage}
              fallback={planImage(editing.slug)}
              removeLabel="恢复默认"
              onChange={(coverImage) => setEditing({ ...editing, coverImage })}
              onError={notify}
            />
            <PlanImageField
              label="说明图片（路线图）"
              hint={`套餐卡底部路线图。${planImageLimitHint()}难波、通天阁、大阪城三个原套餐有自带路线图，不上传就用自带的。其他套餐不上传则前台不显示。`}
              value={editing.detailImage}
              fallback={planRoute(editing.slug) || undefined}
              emptyText="未上传。前台不会显示路线图。"
              removeLabel={planRoute(editing.slug) ? "恢复默认" : "移除"}
              onChange={(detailImage) => setEditing({ ...editing, detailImage })}
              onError={notify}
            />

            <div>
              <p className="text-sm font-semibold text-slate-700">文案</p>
              <ol className="admin-copy-list">
                {COPY_GROUPS.map((group, index) => {
                  const open = copyOpen === index;
                  return (
                    <li key={group.label} className={cn("admin-copy-row", open && "is-open")}>
                      <button
                        type="button"
                        className="admin-copy-head"
                        onClick={() => setCopyOpen(open ? -1 : index)}
                      >
                        <span className="admin-copy-n">{index + 1}</span>
                        <span className="min-w-0 flex-1 text-left">
                          <span className="block text-sm text-slate-800">{group.label}</span>
                          {!open ? (
                            <span className="mt-0.5 block truncate text-xs text-slate-400">
                              {previewOf(group.preview(editing))}
                            </span>
                          ) : null}
                        </span>
                        <ChevronDown className={cn("size-4 shrink-0 text-slate-400 transition", open && "rotate-180")} />
                      </button>
                      {open ? (
                        <div className="admin-copy-body">
                          <div className="space-y-3">
                            {group.langs.map((lang) => (
                              <label key={lang.label} className="admin-field">
                                {lang.label}
                                {group.lines ? (
                                  <textarea
                                    className="admin-input min-h-20"
                                    value={lang.get(editing)}
                                    onChange={(e) => setEditing(lang.set(editing, e.target.value))}
                                  />
                                ) : (
                                  <input
                                    className="admin-input"
                                    value={lang.get(editing)}
                                    onChange={(e) => setEditing(lang.set(editing, e.target.value))}
                                  />
                                )}
                              </label>
                            ))}
                          </div>
                          {group.hint ? <p className="mt-2 text-xs text-slate-500">{group.hint}</p> : null}
                          {index < COPY_GROUPS.length - 1 ? (
                            <button
                              type="button"
                              className="mt-3 rounded-full border border-blue-200 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50"
                              onClick={() => setCopyOpen(index + 1)}
                            >
                              下一项
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
              网址代号
              <input className="admin-input" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.trim() })} />
            </label>
            <label className="admin-field">
              价格（日元）
              <input
                className="admin-input"
                type="number"
                value={editing.priceJpy}
                onChange={(e) => setEditing({ ...editing, priceJpy: Number(e.target.value) })}
              />
            </label>
            <label className="admin-field">
              时长（分钟）
              <input
                className="admin-input"
                type="number"
                value={editing.durationMinutes}
                onChange={(e) => setEditing({ ...editing, durationMinutes: Number(e.target.value) })}
              />
            </label>
            <label className="admin-field">
              距离（公里）
              <input
                className="admin-input"
                type="number"
                value={editing.distanceKm}
                onChange={(e) => setEditing({ ...editing, distanceKm: Number(e.target.value) })}
              />
            </label>

            <div>
              <p className="text-sm text-slate-600">可购附加项</p>
              <p className="mt-1 text-xs text-slate-500">勾选后，前台预订该套餐时才能买这一项。</p>
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
              <span className="text-sm">上架</span>
              <NeonToggle checked={editing.active} onChange={(on) => setEditing({ ...editing, active: on })} />
            </div>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
