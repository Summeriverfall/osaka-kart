"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Camera, Image as ImageIcon, Shield, Shirt, Trash2 } from "lucide-react";
import { AddonEditorFields, blankAddon } from "@/components/admin/admin-addon-form";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { adminCopy } from "@/lib/admin/copy";
import { formatYenShort } from "@/lib/format";
import { type MockAddon } from "@/lib/mock/addons";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

const ICONS = {
  gopro: Camera,
  costume: Shirt,
  photos: ImageIcon,
  insurance: Shield,
} as const;

export function AdminAddonsView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { addons, patchAddon, upsertAddon, removeAddon } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockAddon | null>(null);
  const [removing, setRemoving] = useState<MockAddon | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
          <button type="button" className="cta-btn" onClick={() => setEditing(blankAddon())}>
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
                  <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs hover:border-blue-400" onClick={() => setEditing(addon)}>
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
        {editing ? <AddonEditorFields addon={editing} onChange={setEditing} /> : null}
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
