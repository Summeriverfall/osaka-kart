export const PLAN_IMAGE_LIMIT = {
  maxBytes: 2 * 1024 * 1024,
  minEdge: 600,
  maxEdge: 4000,
  compressEdge: 1400,
} as const;

export function planImageLimitHint() {
  return `宽和高均不少于 ${PLAN_IMAGE_LIMIT.minEdge}px，最长边不超过 ${PLAN_IMAGE_LIMIT.maxEdge}px，文件不超过 ${PLAN_IMAGE_LIMIT.maxBytes / 1024 / 1024}MB。上传后转 WebP，图存在本机 IndexedDB，不进页面主缓存。`;
}

function canvasToDataUrl(canvas: HTMLCanvasElement, quality = 0.82) {
  const jpeg = canvas.toDataURL("image/jpeg", quality);
  try {
    const webp = canvas.toDataURL("image/webp", quality);
    if (webp.startsWith("data:image/webp") && webp.length > 32 && webp.length <= jpeg.length) {
      return webp;
    }
  } catch {
    /* Safari 等不支持 WebP 导出时用 JPEG */
  }
  return jpeg;
}

export function readLocalImageErrorMessage(code: string) {
  if (code === "size") return `图片文件不能超过 ${PLAN_IMAGE_LIMIT.maxBytes / 1024 / 1024}MB`;
  if (code === "small") return `图片太小，宽和高都要至少 ${PLAN_IMAGE_LIMIT.minEdge}px`;
  if (code === "large") return `图片太大，最长边不能超过 ${PLAN_IMAGE_LIMIT.maxEdge}px`;
  if (code === "type") return "请上传 jpg、png 或 webp 图片";
  return "图片读取失败，请换一张再试";
}

export function readLocalImage(file: File, maxEdge = PLAN_IMAGE_LIMIT.compressEdge): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
      reject(new Error("type"));
      return;
    }
    if (file.size > PLAN_IMAGE_LIMIT.maxBytes) {
      reject(new Error("size"));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      const min = Math.min(image.width, image.height);
      const max = Math.max(image.width, image.height);
      if (min < PLAN_IMAGE_LIMIT.minEdge) {
        reject(new Error("small"));
        return;
      }
      if (max > PLAN_IMAGE_LIMIT.maxEdge) {
        reject(new Error("large"));
        return;
      }
      const scale = Math.min(1, maxEdge / max);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(image, 0, 0, width, height);
      resolve(canvasToDataUrl(canvas));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    image.src = url;
  });
}
