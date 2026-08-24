import type { PersistStorage, StorageValue } from "zustand/middleware";
import type { CmsState } from "@/lib/mock/cms";
import type { MockPlan } from "@/lib/mock/plans";
import {
  applyCmsBlobs,
  cmsHasInline,
  getAllCmsBlobs,
  slimCms,
  stashCmsBlobs,
} from "@/lib/cms-media-db";
import {
  applyPlanMedia,
  getAllPlanMedia,
  plansHaveInlineImages,
  slimPlanImages,
  stashPlanImages,
} from "@/lib/plan-media-db";

export const OPS_STORAGE_KEY = "osaka-kart-ops";

type OpsPersist = {
  plans?: MockPlan[];
  logs?: unknown[];
  cms?: CmsState;
  [key: string]: unknown;
};

async function hydratePlans(state: OpsPersist) {
  const plans = Array.isArray(state.plans) ? state.plans : [];
  let migrated = false;
  if (plansHaveInlineImages(plans)) {
    await stashPlanImages(plans);
    state.plans = plans.map(slimPlanImages);
    migrated = true;
  }
  if (Array.isArray(state.logs) && state.logs.length > 200) {
    state.logs = state.logs.slice(0, 200);
    migrated = true;
  }
  const media = await getAllPlanMedia();
  state.plans = applyPlanMedia((state.plans ?? []).map(slimPlanImages), media);
  return migrated;
}

async function hydrateCms(state: OpsPersist) {
  const cms = state.cms;
  if (!cms) return false;
  let migrated = false;
  if (cmsHasInline(cms)) {
    await stashCmsBlobs(cms);
    state.cms = slimCms(cms);
    migrated = true;
  }
  const blobs = await getAllCmsBlobs().catch(() => ({} as Record<string, string>));
  state.cms = applyCmsBlobs(slimCms(state.cms as CmsState), blobs);
  return migrated;
}

export const opsPersistStorage: PersistStorage<OpsPersist> = {
  getItem: async (name) => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as StorageValue<OpsPersist>;
      const state = (parsed.state ?? {}) as OpsPersist;
      const migratedPlans = await hydratePlans(state);
      const migratedCms = await hydrateCms(state);
      parsed.state = state;
      if (migratedPlans || migratedCms) {
        localStorage.setItem(name, JSON.stringify({
          ...parsed,
          state: {
            ...state,
            plans: (state.plans ?? []).map(slimPlanImages),
            cms: state.cms ? slimCms(state.cms) : state.cms,
          },
        }));
      }
      return parsed;
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    if (typeof window === "undefined") return;
    const state = { ...(value.state ?? {}) } as OpsPersist;
    const plans = Array.isArray(state.plans) ? state.plans : [];
    try {
      await stashPlanImages(plans);
      if (state.cms) await stashCmsBlobs(state.cms);
    } catch {
      /* IndexedDB 不可用时仍写入瘦身后的 JSON，避免撑爆 localStorage */
    }
    state.plans = plans.map(slimPlanImages);
    if (state.cms) state.cms = slimCms(state.cms);
    if (Array.isArray(state.logs) && state.logs.length > 200) {
      state.logs = state.logs.slice(0, 200);
    }
    localStorage.setItem(name, JSON.stringify({ ...value, state }));
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
  },
};
