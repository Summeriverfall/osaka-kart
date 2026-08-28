import { SITE_BRAND } from "@/lib/brand";
import { qrImageSrc } from "@/lib/promo";

export type PosterTemplate = {
  id: string;
  name: string;
  nameEn: string;
  nameJa: string;
  hint: string;
  width: number;
  height: number;
};

export const POSTER_TEMPLATES: PosterTemplate[] = [
  { id: "night", name: "夜景大海报", nameEn: "Night poster", nameJa: "ナイトポスター", hint: "1080 × 1920，适合打印和朋友圈长图", width: 1080, height: 1920 },
  { id: "tent", name: "桌面立牌", nameEn: "Table tent", nameJa: "卓上カード", hint: "1050 × 1480，适合酒店/柜台立牌", width: 1050, height: 1480 },
  { id: "square", name: "方图卡片", nameEn: "Square card", nameJa: "スクエアカード", hint: "1080 × 1080，适合 Instagram", width: 1080, height: 1080 },
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("qr"));
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export async function downloadAffiliatePoster(opts: {
  template: PosterTemplate;
  name: string;
  code: string;
  link: string;
  cut: number;
}) {
  const { template, name, code, link, cut } = opts;
  const canvas = document.createElement("canvas");
  canvas.width = template.width;
  canvas.height = template.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = template.width;
  const h = template.height;
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#050508");
  bg.addColorStop(0.45, "#161625");
  bg.addColorStop(1, "#2a0d28");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ff2e97";
  ctx.font = `700 ${Math.round(w * 0.046)}px "Microsoft YaHei", sans-serif`;
  ctx.fillText(SITE_BRAND.toUpperCase(), w * 0.08, h * 0.1);

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 ${Math.round(w * 0.09)}px "Microsoft YaHei", sans-serif`;
  const title = template.id === "tent" ? "扫码预约夜跑" : "大阪街头卡丁车";
  ctx.fillText(title, w * 0.08, h * 0.2);

  ctx.fillStyle = "#d4d4dc";
  ctx.font = `400 ${Math.round(w * 0.038)}px "Microsoft YaHei", sans-serif`;
  ctx.fillText(`${name} 专属邀请  ·  ${cut}%`, w * 0.08, h * 0.255);

  ctx.fillStyle = "#ff2e97";
  ctx.font = `800 ${Math.round(w * 0.07)}px "Microsoft YaHei", sans-serif`;
  ctx.fillText(code, w * 0.08, h * 0.34);

  const qrSize = Math.round(Math.min(w, h) * (template.id === "square" ? 0.42 : 0.38));
  const qrX = (w - qrSize) / 2;
  const qrY = h * (template.id === "night" ? 0.42 : 0.4);
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qrX - 24, qrY - 24, qrSize + 48, qrSize + 48, 28);
  ctx.fill();

  try {
    const qr = await loadImage(qrImageSrc(link, 400));
    ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);
  } catch {
    ctx.fillStyle = "#111";
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    ctx.fillStyle = "#ff2e97";
    ctx.font = `700 ${Math.round(qrSize * 0.08)}px "Microsoft YaHei", sans-serif`;
    ctx.fillText(code, qrX + 24, qrY + qrSize / 2);
  }

  ctx.fillStyle = "#a0a0a0";
  ctx.font = `400 ${Math.round(w * 0.028)}px "Microsoft YaHei", sans-serif`;
  const urlY = qrY + qrSize + 80;
  wrapText(ctx, link, w * 0.08, urlY, w * 0.84, Math.round(w * 0.038));

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = `${code}-${template.id}.png`;
  a.click();
  URL.revokeObjectURL(href);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  let line = "";
  let cy = y;
  for (const ch of text) {
    const next = line + ch;
    if (ctx.measureText(next).width > maxW) {
      ctx.fillText(line, x, cy);
      line = ch;
      cy += lineH;
    } else {
      line = next;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

export async function downloadQrPng(code: string, link: string) {
  try {
    const res = await fetch(qrImageSrc(link, 600));
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${code}-qr.png`;
    a.click();
    URL.revokeObjectURL(href);
  } catch {
    const a = document.createElement("a");
    a.href = qrImageSrc(link, 600);
    a.target = "_blank";
    a.download = `${code}-qr.png`;
    a.click();
  }
}
