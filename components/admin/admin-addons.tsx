"use client";

import { useState } from "react";
import { Camera, Image as ImageIcon, Shield, Shirt, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { NeonToggle } from "@/components/ui/neon-toggle";
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
  const { addons, patchAddon, upsertAddon, removeAddon } = useOpsStore();
  const notify = useToastStore((state) => state.notify);
  const [editing, setEditing] = useState<MockAddon | null>(null);
  const [removing, setRemoving] = useState<MockAddon | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button type="button" className="cta-btn px-5 py-2.5" onClick={() => setEditing({ ...BLANK, id: `addon-${Date.now()}` })}>
          添加附加项
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
              <h3 className="text-lg font-black text-slate-900">{addon.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{addon.nameEn} · {addon.nameJa}</p>
              <p className="mt-3 min-h-12 text-sm text-slate-500">{addon.description}</p>
              <p className="mt-4 text-2xl font-black text-blue-600">
                {formatYenShort(addon.priceJpy)}
                <span className="ml-1 text-sm font-medium text-slate-500">{addon.unitLabel}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">最多 {addon.maxQty} 件</p>
              <div className="mt-5 flex items-center justify-between">
                <NeonToggle checked={addon.active} onChange={(on) => patchAddon(addon.id, { active: on })} />
                <div className="flex gap-2">
                  <button type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs hover:border-blue-400" onClick={() => setEditing(addon)}>
                    编辑
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
        title={editing?.name ? "编辑附加项" : "添加附加项"}
        onClose={() => setEditing(null)}
        footer={<button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!editing) return; upsertAddon(editing); setEditing(null); notify("附加项已保存，官网加项价格会同步"); }}>保存</button>}
      >
        {editing ? (
          <>
            <label className="admin-field">中文名<input className="admin-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
            <label className="admin-field">English<input className="admin-input" value={editing.nameEn} onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })} /></label>
            <label className="admin-field">日本語<input className="admin-input" value={editing.nameJa} onChange={(e) => setEditing({ ...editing, nameJa: e.target.value })} /></label>
            <label className="admin-field">描述<textarea className="admin-input min-h-20" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
            <label className="admin-field">价格<input className="admin-input" type="number" value={editing.priceJpy} onChange={(e) => setEditing({ ...editing, priceJpy: Number(e.target.value) })} /></label>
            <label className="admin-field">数量上限<input className="admin-input" type="number" value={editing.maxQty} onChange={(e) => setEditing({ ...editing, maxQty: Number(e.target.value) })} /></label>
            <label className="admin-field">
              图标类型
              <select className="admin-input" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value as AddonSlug })}>
                <option value="gopro">相机</option>
                <option value="costume">服装</option>
                <option value="photos">照片</option>
                <option value="insurance">保险</option>
              </select>
            </label>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(removing)}
        title="确认删除？"
        onClose={() => setRemoving(null)}
        footer={
          <>
            <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm" onClick={() => setRemoving(null)}>再想想</button>
            <button type="button" className="cta-btn px-5 py-2.5" onClick={() => { if (!removing) return; removeAddon(removing.id); setRemoving(null); notify("附加项已删除"); }}>删除</button>
          </>
        }
      >
        <p className="text-sm text-slate-500">删除后官网加项列表会立刻少这一项。</p>
      </Modal>
    </div>
  );
}
