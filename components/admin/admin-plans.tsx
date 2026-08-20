"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { formatYenShort } from "@/lib/format";
import { type MockPlan } from "@/lib/mock/plans";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

function toggleAddon(plan: MockPlan, addonId: string): MockPlan {
  const current = plan.allowedAddonIds ?? [];
  const on = current.includes(addonId);
  return {
    ...plan,
    allowedAddonIds: on ? current.filter((id) => id !== addonId) : [...current, addonId],
  };
}

export function AdminPlansView() {
  const { plans, addons, patchPlan, upsertPlan } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockPlan | null>(null);

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="cta-btn px-5 py-2.5"
        onClick={() =>
          setEditing({
            id: `plan-${Date.now()}`,
            slug: "new-plan",
            name: "",
            nameEn: "",
            nameJa: "",
            durationMinutes: 60,
            distanceKm: 8,
            priceJpy: 12800,
            active: true,
            maxRiders: 4,
            includes: ["头盔", "赛车服", "保险", "向导"],
            allowedAddonIds: addons.map((item) => item.id),
          })
        }
      >
        添加套餐
      </button>
      <div className="grid gap-4 xl:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.id} className={`rounded-2xl border bg-white p-5 ${plan.active ? "border-slate-200" : "border-slate-100 opacity-50"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">{plan.name}</h3>
                <p className="mt-1 text-blue-600">{formatYenShort(plan.priceJpy)}</p>
                <p className="mt-1 text-sm text-slate-500">{plan.durationMinutes} 分钟 · 最多 {plan.maxRiders} 人</p>
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
              onClick={() => setEditing(plan)}
            >
              编辑套餐
            </button>
          </article>
        ))}
      </div>

      <Modal
        open={Boolean(editing)}
        title={editing?.name ? "编辑套餐" : "添加套餐"}
        onClose={() => setEditing(null)}
        footer={
          <button
            type="button"
            className="cta-btn px-5 py-2.5"
            onClick={() => {
              if (!editing) return;
              upsertPlan(editing);
              setEditing(null);
              notify("套餐已保存");
            }}
          >
            保存
          </button>
        }
      >
        {editing ? (
          <>
            <label className="admin-field">
              名称
              <input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
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
