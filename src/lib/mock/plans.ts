import { MOCK_ADDONS } from "./addons";

export type MockPlan = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  nameJa: string;
  nameKo?: string;
  durationMinutes: number;
  distanceKm: number;
  priceJpy: number;
  active: boolean;
  maxRiders: number;
  includes: string[];
  allowedAddonIds: string[];
  storeIds?: string[];
  coverImage?: string;
  detailImage?: string;
  description?: string;
  descriptionEn?: string;
  descriptionJa?: string;
  descriptionKo?: string;
  highlights?: string[];
  highlightsEn?: string[];
  highlightsJa?: string[];
  highlightsKo?: string[];
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
    nameJa: "黄昏ベイ45分",
    durationMinutes: 45,
    distanceKm: 6,
    priceJpy: 5000,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "基础赛车服", "保险", "向导"],
    allowedAddonIds: CORE_ONLY,
    storeIds: ["namba"],
    description: "黄昏时分沿湾岸走一圈，路线短、好上手，适合想先试车的人。",
    highlights: ["湾岸黄昏", "短途好上手", "适合试车"],
  },
  {
    id: "plan-standard",
    slug: "standard",
    name: "难波 60 分钟",
    nameEn: "Namba 60 min",
    nameJa: "難波60分",
    nameKo: "난바 60분 코스",
    durationMinutes: 60,
    distanceKm: 8,
    priceJpy: 12800,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "赛车服", "保险", "向导"],
    allowedAddonIds: ALL_ADDONS,
    description:
      "在大阪市中心的难波，体验 60 分钟的街景骑行。一边看热闹景点，一边感受速度。路线专为新手设计，第一次来也能放心玩。",
    descriptionEn:
      "A 60-minute run through Namba in central Osaka. See the busy streets and famous sights while you drive. Built for first-timers.",
    descriptionJa:
      "大阪都心の難波を走る60分。人気スポットと賑わいを見ながらスピードを楽しめます。初めての方でも安心して乗れる短いコースです。",
    descriptionKo:
      "오사카 도심 난바에서 60분. 인기 명소와 붐비는 거리를 보며 달립니다. 처음 타는 분도 짧은 코스로 오사카의 활기를 느낄 수 있습니다.",
    highlights: ["难波 60 分钟", "热门街景", "适合新手"],
    highlightsEn: ["60 minutes in Namba", "Famous streets and sights", "Easy for first-timers"],
    highlightsJa: ["難波60分", "人気の街並み", "初めてでも安心"],
    highlightsKo: ["난바 60분", "인기 거리", "초심자용"],
  },
  {
    id: "plan-night",
    slug: "night-run",
    name: "通天阁 90 分钟",
    nameEn: "Tsutenkaku 90 min",
    nameJa: "通天閣90分",
    nameKo: "츠텐카쿠 90분 코스",
    durationMinutes: 90,
    distanceKm: 10,
    priceJpy: 15800,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "赛车服", "保险", "向导"],
    allowedAddonIds: ALL_ADDONS,
    description:
      "以大阪地标通天阁为中心，体验 90 分钟行程。地道街巷和著名景点更多，路线更长，可以慢慢把城市看一遍。",
    descriptionEn:
      "A 90-minute ride centered on Tsutenkaku. More local streets, more landmarks, and a longer loop at an easier pace.",
    descriptionJa:
      "大阪のランドマーク通天閣を中心に走る90分。ローカルな街並みと名所をまわり、長めのコースでゆっくり楽しめます。",
    descriptionKo:
      "오사카의 상징 츠텐카쿠를 중심으로 90분. 로컬 거리와 명소를 돌며, 여유 있게 모험을 즐길 수 있는 긴 코스입니다.",
    highlights: ["通天阁 90 分钟", "地道风情", "著名景点"],
    highlightsEn: ["90 minutes", "Tsutenkaku", "Local Osaka sights"],
    highlightsJa: ["通天閣90分", "ローカルな街", "名所めぐり"],
    highlightsKo: ["츠텐카쿠 90분", "로컬 분위기", "명소"],
  },
  {
    id: "plan-grand",
    slug: "grand-tour",
    name: "大阪城 120 分钟",
    nameEn: "Osaka Castle 120 min",
    nameJa: "大阪城120分",
    nameKo: "오사카성 120분 코스",
    durationMinutes: 120,
    distanceKm: 15,
    priceJpy: 18800,
    active: true,
    maxRiders: 4,
    includes: ["头盔", "赛车服", "保险", "向导", "路线讲解"],
    allowedAddonIds: ALL_ADDONS,
    description:
      "以大阪城为背景的 120 分钟行程。历史街区和现代街景串在一条路上，适合想把代表性景点慢慢看完的人。",
    descriptionEn:
      "A 120-minute kart run with Osaka Castle as the backdrop. History and the modern city on one loop.",
    descriptionJa:
      "歴史ある大阪城を背景に走る120分。歴史と今が交わるスポットをまわり、代表的な名所をゆっくり楽しめます。",
    descriptionKo:
      "유서 깊은 오사카성을 배경으로 120분. 역사와 현대가 어우러진 명소를 돌며, 여유 있게 오사카를 둘러보고 싶은 분께 맞습니다.",
    highlights: ["大阪城 120 分钟", "历史与现代", "悠闲游览"],
    highlightsEn: ["120 minutes", "Osaka Castle", "History and the city"],
    highlightsJa: ["大阪城120分", "歴史と今", "ゆったり名所"],
    highlightsKo: ["오사카성 120분", "역사와 현대", "여유 있는 관광"],
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
    description: "夜间霓虹路线，灯火和街景更密，适合想拍夜景的人。",
    highlights: ["夜间霓虹", "夜景更好拍", "90 分钟"],
  },
];
