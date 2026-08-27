export type AddonUnit = "kart" | "person" | "set";
export type AddonSlug = "gopro" | "costume" | "photos" | "insurance";

export type MockAddon = {
  id: string;
  slug: AddonSlug;
  name: string;
  nameEn: string;
  nameJa: string;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionKo?: string;
  priceJpy: number;
  unit: AddonUnit;
  unitLabel: string;
  maxQty: number;
  active: boolean;
  stock: number;
};

export const MOCK_ADDONS: MockAddon[] = [
  {
    id: "addon-gopro",
    slug: "gopro",
    name: "GoPro 租赁",
    nameEn: "GoPro rental",
    nameJa: "GoProレンタル",
    description: "高清运动相机租赁，含防水壳",
    descriptionEn: "HD action camera rental with a waterproof case.",
    descriptionJa: "高画質アクションカメラのレンタル。防水ケース付き。",
    priceJpy: 2500,
    unit: "kart",
    unitLabel: "/ 车",
    maxQty: 2,
    active: true,
    stock: 12,
  },
  {
    id: "addon-costume",
    slug: "costume",
    name: "赛车服升级",
    nameEn: "Racing suit upgrade",
    nameJa: "レーシングスーツへのアップグレード",
    description: "专业防火赛车服，多色可选",
    descriptionEn: "A proper racing suit. Several colors available.",
    descriptionJa: "本格的なレーシングスーツ。複数カラーから選択できます。",
    priceJpy: 1000,
    unit: "person",
    unitLabel: "/ 人",
    maxQty: 8,
    active: true,
    stock: 24,
  },
  {
    id: "addon-photos",
    slug: "photos",
    name: "专业跟拍照片",
    nameEn: "Pro photo follow",
    nameJa: "プロによる撮影写真",
    description: "赛道摄影师跟拍，含5张精修原片",
    descriptionEn: "A pro photographer rides with you. Five high-quality photos included.",
    descriptionJa: "プロカメラマンによる走行中の撮影。高画質写真5枚付き。",
    priceJpy: 3000,
    unit: "set",
    unitLabel: "/ 组",
    maxQty: 1,
    active: true,
    stock: 6,
  },
  {
    id: "addon-insurance",
    slug: "insurance",
    name: "额外保险",
    nameEn: "Extra insurance",
    nameJa: "追加保険",
    description: "在基础保险之外加保人身意外",
    descriptionEn: "Extra injury cover on top of the basic insurance, while you ride.",
    descriptionJa: "基本保険に加えて、搭乗中の傷害補償を追加できます。",
    priceJpy: 500,
    unit: "person",
    unitLabel: "/ 人",
    maxQty: 8,
    active: true,
    stock: 99,
  },
];

export function addonUnitLabel(unit: AddonUnit, locale: string) {
  if (locale.startsWith("ja")) {
    return unit === "kart" ? "/ 台" : unit === "person" ? "/ 人" : "/ 組";
  }
  if (locale.startsWith("ko")) {
    return unit === "kart" ? "/ 대" : unit === "person" ? "/ 명" : "/ 세트";
  }
  if (locale.startsWith("zh")) {
    return unit === "kart" ? "/ 车" : unit === "person" ? "/ 人" : "/ 组";
  }
  return unit === "kart" ? "/ kart" : unit === "person" ? "/ person" : "/ set";
}
