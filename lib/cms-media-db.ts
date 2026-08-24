import type { CmsState } from "@/lib/mock/cms";
import { CMS_BLOB_STORE, isInlineImage, openMediaDb } from "@/lib/plan-media-db";

export function isInlineBlob(value?: string) {
  return Boolean(value?.startsWith("data:"));
}

function nextBlobField(value: string | undefined, stored?: string) {
  if (isInlineBlob(value)) return value;
  if (value === "") return "";
  return stored || "";
}

function pickBlobField(value: string | undefined, stored?: string): string {
  if (value && isInlineBlob(value)) return value;
  if (value) return value;
  return stored || "";
}

export async function putCmsBlob(key: string, value: string) {
  const db = await openMediaDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(CMS_BLOB_STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(CMS_BLOB_STORE).put(value, key);
  });
}

export async function getAllCmsBlobs() {
  const db = await openMediaDb();
  return new Promise<Record<string, string>>((resolve, reject) => {
    if (!db.objectStoreNames.contains(CMS_BLOB_STORE)) {
      resolve({});
      return;
    }
    const tx = db.transaction(CMS_BLOB_STORE, "readonly");
    const req = tx.objectStore(CMS_BLOB_STORE).openCursor();
    const out: Record<string, string> = {};
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) {
        resolve(out);
        return;
      }
      out[String(cursor.key)] = String(cursor.value ?? "");
      cursor.continue();
    };
    req.onerror = () => reject(req.error);
  });
}

export function slimCms(cms: CmsState): CmsState {
  return {
    ...cms,
    videos: cms.videos.map((item) => ({
      ...item,
      file: isInlineBlob(item.file) ? undefined : item.file,
      poster: isInlineBlob(item.poster) || isInlineImage(item.poster) ? undefined : item.poster,
    })),
    reviews: cms.reviews.map((item) => ({
      ...item,
      photo: isInlineBlob(item.photo) ? undefined : item.photo,
    })),
    press: cms.press.map((item) => ({
      ...item,
      image: isInlineBlob(item.image) ? "" : item.image,
    })),
    site: {
      ...cms.site,
      logo: isInlineBlob(cms.site.logo) ? "" : cms.site.logo,
    },
  };
}

export function cmsHasInline(cms?: CmsState | null) {
  if (!cms) return false;
  return Boolean(
    cms.videos.some((item) => isInlineBlob(item.file) || isInlineBlob(item.poster)) ||
      cms.reviews.some((item) => isInlineBlob(item.photo)) ||
      cms.press.some((item) => isInlineBlob(item.image)) ||
      isInlineBlob(cms.site.logo),
  );
}

export async function stashCmsBlobs(cms: CmsState) {
  const existing = await getAllCmsBlobs().catch(() => ({} as Record<string, string>));
  const writes: Promise<void>[] = [];

  for (const item of cms.videos) {
    const file = nextBlobField(item.file, existing[`video:${item.id}:file`]);
    const poster = nextBlobField(item.poster, existing[`video:${item.id}:poster`]);
    if (file !== (existing[`video:${item.id}:file`] || "")) writes.push(putCmsBlob(`video:${item.id}:file`, file ?? ""));
    if (poster !== (existing[`video:${item.id}:poster`] || "")) writes.push(putCmsBlob(`video:${item.id}:poster`, poster ?? ""));
  }
  for (const item of cms.reviews) {
    const photo = nextBlobField(item.photo, existing[`review:${item.id}:photo`]);
    if (photo !== (existing[`review:${item.id}:photo`] || "")) writes.push(putCmsBlob(`review:${item.id}:photo`, photo ?? ""));
  }
  for (const item of cms.press) {
    const image = nextBlobField(item.image, existing[`press:${item.id}:image`]);
    if (image !== (existing[`press:${item.id}:image`] || "")) writes.push(putCmsBlob(`press:${item.id}:image`, image ?? ""));
  }
  const logo = nextBlobField(cms.site.logo, existing["site:logo"]);
  if (logo !== (existing["site:logo"] || "")) writes.push(putCmsBlob("site:logo", logo ?? ""));

  await Promise.all(writes);
}

export function applyCmsBlobs(cms: CmsState, blobs: Record<string, string>): CmsState {
  return {
    ...cms,
    videos: cms.videos.map((item) => ({
      ...item,
      file: pickBlobField(item.file, blobs[`video:${item.id}:file`]),
      poster: pickBlobField(item.poster, blobs[`video:${item.id}:poster`]),
    })),
    reviews: cms.reviews.map((item) => ({
      ...item,
      photo: pickBlobField(item.photo, blobs[`review:${item.id}:photo`]),
    })),
    press: cms.press.map((item) => ({
      ...item,
      image: pickBlobField(item.image, blobs[`press:${item.id}:image`]),
    })),
    site: {
      ...cms.site,
      logo: pickBlobField(cms.site.logo, blobs["site:logo"]),
    },
  };
}
