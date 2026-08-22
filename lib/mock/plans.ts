import { MOCK_ADDONS } from "./addons";

export type MockPlan = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  nameJa: string;
  durationMinutes: number;
  distanceKm: number;
  priceJpy: number;
  active: boolean;
  maxRiders: number;
  includes: string[];
  allowedAddonIds: string[];
  storeIds?: string[];
};

const ALL_ADDONS = MOCK_ADDONS.map((item) => item.id);
const NO_PHOTOS = MOCK_ADDONS.filter((item) => item.slug !== "photos").map((item) => item.id);
const CORE_ONLY = MOCK_ADDONS.filter((item) => item.slug === "gopro" || item.slug === "insurance").map((item) => item.id);

export const MOCK_PLANS: MockPlan[] = [
  {
    id: "plan-sunset",
    slug: "sunset",
    name: "黄昏湾岸 45 分钟",
    nameEn: "Sunset bay 45 min",
    nameJa: "黄昏ベイ 45分",
    durationMinutes: 45,
    distanceKm: 6,
    priceJpy: 5000,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "基础赛车服", "保险", "向导"],
    allowedAddonIds: CORE_ONLY,
    storeIds: ["namba"],
  },
  {
    id: "plan-standard",
    slug: "standard",
    name: "难波 60 分钟",
    nameEn: "Namba 60 min",
    nameJa: "難波60分",
    durationMinutes: 60,
    distanceKm: 8,
    priceJpy: 12800,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "赛车服", "保险", "向导"],
    allowedAddonIds: ALL_ADDONS,
  },
  {
    id: "plan-night",
    slug: "night-run",
    name: "通天阁 90 分钟",
    nameEn: "Tsutenkaku 90 min",
    nameJa: "通天閣90分",
    durationMinutes: 90,
    distanceKm: 10,
    priceJpy: 15800,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "赛车服", "保险", "向导"],
    allowedAddonIds: ALL_ADDONS,
  },
  {
    id: "plan-grand",
    slug: "grand-tour",
    name: "大阪城 120 分钟",
    nameEn: "Osaka Castle 120 min",
    nameJa: "大阪城120分",
    durationMinutes: 120,
    distanceKm: 15,
    priceJpy: 18800,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "赛车服", "保险", "向导", "路线讲解"],
    allowedAddonIds: ALL_ADDONS,
  },
  {
    id: "plan-vip",
    slug: "vip-night",
    name: "夜间霓虹 90 分钟",
    nameEn: "Neon night 90 min",
    nameJa: "ネオンナイト90分",
    durationMinutes: 90,
    distanceKm: 11,
    priceJpy: 15000,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "赛车服", "保险", "向导", "夜拍点"],
    allowedAddonIds: NO_PHOTOS,
    storeIds: ["namba"],
  },
];
