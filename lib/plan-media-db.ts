import type { MockPlan } from "@/lib/mock/plans";

const DB_NAME = "osaka-kart-media";
const DB_VERSION = 2;
const STORE = "plan-images";
export const CMS_BLOB_STORE = "cms-blobs";

export type PlanMedia = {
  cover?: string;
  detail?: string;
};

export function isInlineImage(value?: string) {
  return Boolean(value?.startsWith("data:image"));
}

export function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
      if (!req.result.objectStoreNames.contains(CMS_BLOB_STORE)) {
        req.result.createObjectStore(CMS_BLOB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function openDb() {
  return openMediaDb();
}

export async function putPlanMedia(planId: string, media: PlanMedia) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(media, planId);
  });
}

export async function getAllPlanMedia() {
  const db = await openDb();
  return new Promise<Record<string, PlanMedia>>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).openCursor();
    const out: Record<string, PlanMedia> = {};
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) {
        resolve(out);
        return;
      }
      out[String(cursor.key)] = (cursor.value ?? {}) as PlanMedia;
      cursor.continue();
    };
    req.onerror = () => reject(req.error);
  });
}

export function slimPlanImages(plan: MockPlan): MockPlan {
  return {
    ...plan,
    coverImage: isInlineImage(plan.coverImage) ? undefined : plan.coverImage,
    detailImage: isInlineImage(plan.detailImage) ? undefined : plan.detailImage,
  };
}

export function plansHaveInlineImages(plans: MockPlan[] | undefined) {
  return Boolean(plans?.some((plan) => isInlineImage(plan.coverImage) || isInlineImage(plan.detailImage)));
}

function nextMediaField(value: string | undefined, stored?: string) {
  if (isInlineImage(value)) return value;
  if (value === "") return "";
  return stored || "";
}

export async function stashPlanImages(plans: MockPlan[]) {
  if (!plans.length) return;
  const existing = await getAllPlanMedia();
  await Promise.all(
    plans.map((plan) => {
      const prev = existing[plan.id];
      const cover = nextMediaField(plan.coverImage, prev?.cover);
      const detail = nextMediaField(plan.detailImage, prev?.detail);
      if (!cover && !detail && !prev) return Promise.resolve();
      if (cover === (prev?.cover || "") && detail === (prev?.detail || "")) return Promise.resolve();
      return putPlanMedia(plan.id, { cover, detail });
    }),
  );
}

export function applyPlanMedia(plans: MockPlan[], media: Record<string, PlanMedia>): MockPlan[] {
  return plans.map((plan) => {
    const row = media[plan.id];
    if (!row) {
      return {
        ...plan,
        coverImage: plan.coverImage || undefined,
        detailImage: plan.detailImage || undefined,
      };
    }
    return {
      ...plan,
      coverImage: plan.coverImage || row.cover || undefined,
      detailImage: plan.detailImage || row.detail || undefined,
    };
  });
}
