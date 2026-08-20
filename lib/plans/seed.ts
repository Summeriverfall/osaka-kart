import type {
  AddonWithTranslation,
  PlanRecord,
  PlanTranslation,
  PlanWithTranslation,
} from "./types";

const STANDARD_ID = "a1111111-1111-4111-8111-111111111111";
const NIGHT_ID = "a2222222-2222-4222-8222-222222222222";
const GRAND_ID = "a3333333-3333-4333-8333-333333333333";
const GOPRO_ID = "b1111111-1111-4111-8111-111111111111";
const COSTUME_ID = "b2222222-2222-4222-8222-222222222222";
const PHOTO_ID = "b3333333-3333-4333-8333-333333333333";
const INSURANCE_ID = "b4444444-4444-4444-8444-444444444444";

const LOCALES = ["en", "zh-CN", "zh-TW", "ja", "ko"] as const;

export const PLAN_SLUGS = ["standard", "night-run", "grand-tour"] as const;

const plans: PlanRecord[] = [
  {
    id: STANDARD_ID,
    slug: "standard",
    duration_minutes: 60,
    distance_km: 8,
    base_price_jpy: 12800,
    max_participants: 4,
    is_active: true,
  },
  {
    id: NIGHT_ID,
    slug: "night-run",
    duration_minutes: 90,
    distance_km: 10,
    base_price_jpy: 15800,
    max_participants: 4,
    is_active: true,
  },
  {
    id: GRAND_ID,
    slug: "grand-tour",
    duration_minutes: 120,
    distance_km: 15,
    base_price_jpy: 18800,
    max_participants: 4,
    is_active: true,
  },
];

const includes = {
  en: ["Kart rental", "Helmet and racing suit", "Insurance", "Guide", "Safety briefing"],
  "zh-CN": ["卡丁车租赁", "头盔与赛车服", "保险", "向导", "安全说明"],
  "zh-TW": ["卡丁車租賃", "頭盔與賽車服", "保險", "嚮導", "安全說明"],
  ja: ["カートレンタル", "ヘルメットとレーシングスーツ", "保険", "ガイド", "安全説明"],
  ko: ["카트 대여", "헬멧과 레이싱 슈트", "보험", "가이드", "안전 교육"],
} as const;

const requirements = {
  en: [
    "Valid driving license or International Driving Permit",
    "Minimum age 18",
    "Closed-toe shoes",
  ],
  "zh-CN": ["有效驾照或国际驾驶许可", "年满 18 岁", "穿包头鞋"],
  "zh-TW": ["有效駕照或國際駕駛許可", "年滿 18 歲", "穿包頭鞋"],
  ja: ["有効な運転免許証または国際運転免許証", "18歳以上", "つま先の閉じた靴"],
  ko: ["유효한 운전면허 또는 국제운전면허", "만 18세 이상", "앞이 막힌 신발"],
} as const;

const planTranslations: Record<string, PlanTranslation[]> = {
  [STANDARD_ID]: [
    {
      locale: "en",
      name: "Namba 60-minute course",
      description:
        "A 60-minute run through Namba in central Osaka. See the busy streets and famous sights while you drive. Built for first-timers, so you can feel the city on a short loop.",
      highlights: ["60 minutes in Namba", "Famous streets and sights", "Easy for first-timers"],
      route_summary: "Namba check-in → Dotonbori loop → Shinsaibashi return.",
      includes: [...includes.en],
      requirements: [...requirements.en],
    },
    {
      locale: "zh-CN",
      name: "难波60分钟套餐",
      description:
        "在大阪市中心的难波，体验60分钟的冒险。您可以一边欣赏热门景点和热闹街景，一边感受速度的激情。路线专为新手设计，即使是第一次体验的人也能放心参与，在短时间内充分感受大阪的活力氛围。",
      highlights: ["难波 60 分钟", "热门街景", "适合新手"],
      route_summary: "难波集合 → 道顿堀环线 → 心斋桥返回。",
      includes: [...includes["zh-CN"]],
      requirements: [...requirements["zh-CN"]],
    },
    {
      locale: "zh-TW",
      name: "難波60分鐘套餐",
      description:
        "在大阪市中心的難波，體驗60分鐘的冒險。您可以一邊欣賞熱門景點和熱鬧街景，一邊感受速度的激情。路線專為新手設計，即使是第一次體驗的人也能放心參與，在短時間內充分感受大阪的活力氛圍。",
      highlights: ["難波 60 分鐘", "熱門街景", "適合新手"],
      route_summary: "難波集合 → 道頓堀環線 → 心齋橋返回。",
      includes: [...includes["zh-TW"]],
      requirements: [...requirements["zh-TW"]],
    },
    {
      locale: "ja",
      name: "難波60分コース",
      description:
        "大阪都心の難波を走る60分。人気スポットと賑わいを見ながらスピードを楽しめます。初めての方でも安心して乗れる短いコースです。",
      highlights: ["難波60分", "人気の街並み", "初めてでも安心"],
      route_summary: "難波集合 → 道頓堀ループ → 心斎橋へ戻る。",
      includes: [...includes.ja],
      requirements: [...requirements.ja],
    },
    {
      locale: "ko",
      name: "난바 60분 코스",
      description:
        "오사카 도심 난바에서 60분. 인기 명소와 붐비는 거리를 보며 달립니다. 처음 타는 분도 짧은 코스로 오사카의 활기를 느낄 수 있습니다.",
      highlights: ["난바 60분", "인기 거리", "초심자용"],
      route_summary: "난바 체크인 → 도톤보리 루프 → 신사이바시 복귀.",
      includes: [...includes.ko],
      requirements: [...requirements.ko],
    },
  ],
  [NIGHT_ID]: [
    {
      locale: "en",
      name: "Tsutenkaku 90-minute course",
      description:
        "A 90-minute ride centered on Tsutenkaku. More local streets, more landmarks, and a longer loop so you can take the city in at an easier pace.",
      highlights: ["90 minutes", "Tsutenkaku", "Local Osaka sights"],
      route_summary: "Namba → Nipponbashi → Shinsekai / Tsutenkaku → return.",
      includes: [...includes.en],
      requirements: [...requirements.en],
    },
    {
      locale: "zh-CN",
      name: "通天阁90分钟套餐",
      description:
        "以大阪地标通天阁为中心，体验90分钟的行程。感受地道风情，游览多处著名景点，深入体验大阪的独特魅力。路线较长，亮点丰富，让您可以悠闲地享受并充分体验冒险的乐趣。",
      highlights: ["通天阁 90 分钟", "地道风情", "著名景点"],
      route_summary: "难波 → 日本桥 → 新世界／通天阁 → 返回。",
      includes: [...includes["zh-CN"]],
      requirements: [...requirements["zh-CN"]],
    },
    {
      locale: "zh-TW",
      name: "通天閣90分鐘套餐",
      description:
        "以大阪地標通天閣為中心，體驗90分鐘的行程。感受地道風情，遊覽多處著名景點，深入體驗大阪的獨特魅力。路線較長，亮點豐富，讓您可以悠閒地享受並充分體驗冒險的樂趣。",
      highlights: ["通天閣 90 分鐘", "地道風情", "著名景點"],
      route_summary: "難波 → 日本橋 → 新世界／通天閣 → 返回。",
      includes: [...includes["zh-TW"]],
      requirements: [...requirements["zh-TW"]],
    },
    {
      locale: "ja",
      name: "通天閣90分コース",
      description:
        "大阪のランドマーク通天閣を中心に走る90分。ローカルな街並みと名所をまわり、長めのコースで冒険をゆっくり楽しめます。",
      highlights: ["通天閣90分", "ローカルな街", "名所めぐり"],
      route_summary: "難波 → 日本橋 → 新世界／通天閣 → 戻る。",
      includes: [...includes.ja],
      requirements: [...requirements.ja],
    },
    {
      locale: "ko",
      name: "츠텐카쿠 90분 코스",
      description:
        "오사카의 상징 츠텐카쿠를 중심으로 90분. 로컬 거리와 명소를 돌며, 여유 있게 모험을 즐길 수 있는 긴 코스입니다.",
      highlights: ["츠텐카쿠 90분", "로컬 분위기", "명소"],
      route_summary: "난바 → 닛폰바시 → 신세카이/츠텐카쿠 → 복귀.",
      includes: [...includes.ko],
      requirements: [...requirements.ko],
    },
  ],
  [GRAND_ID]: [
    {
      locale: "en",
      name: "Osaka Castle 120-minute course",
      description:
        "A 120-minute kart run with Osaka Castle as the backdrop. History and the modern city on one loop — for visitors who want the landmarks at an easier pace.",
      highlights: ["120 minutes", "Osaka Castle", "History and the city"],
      route_summary: "Namba → castle loop → return to base.",
      includes: [...includes.en],
      requirements: [...requirements.en],
    },
    {
      locale: "zh-CN",
      name: "大阪城120分钟套餐",
      description:
        "以历史悠久的大阪城为背景，体验120分钟的特别卡丁车之旅。游览大阪历史与现代交融的景点，充分享受卡丁车的乐趣。非常适合喜欢悠闲游览大阪代表性景点的游客。",
      highlights: ["大阪城 120 分钟", "历史与现代", "悠闲游览"],
      route_summary: "难波 → 大阪城环线 → 返回集合点。",
      includes: [...includes["zh-CN"]],
      requirements: [...requirements["zh-CN"]],
    },
    {
      locale: "zh-TW",
      name: "大阪城120分鐘套餐",
      description:
        "以歷史悠久的大阪城為背景，體驗120分鐘的特別卡丁車之旅。遊覽大阪歷史與現代交融的景點，充分享受卡丁車的樂趣。非常適合喜歡悠閒遊覽大阪代表性景點的遊客。",
      highlights: ["大阪城 120 分鐘", "歷史與現代", "悠閒遊覽"],
      route_summary: "難波 → 大阪城環線 → 返回集合點。",
      includes: [...includes["zh-TW"]],
      requirements: [...requirements["zh-TW"]],
    },
    {
      locale: "ja",
      name: "大阪城120分コース",
      description:
        "歴史ある大阪城を背景に走る120分。歴史と今が交わるスポットをまわり、代表的な名所をゆっくり楽しめます。",
      highlights: ["大阪城120分", "歴史と今", "ゆったり名所"],
      route_summary: "難波 → 大阪城ループ → 基地へ戻る。",
      includes: [...includes.ja],
      requirements: [...requirements.ja],
    },
    {
      locale: "ko",
      name: "오사카성 120분 코스",
      description:
        "유서 깊은 오사카성을 배경으로 120분. 역사와 현대가 어우러진 명소를 돌며, 여유 있게 오사카를 둘러보고 싶은 분께 맞습니다.",
      highlights: ["오사카성 120분", "역사와 현대", "여유 있는 관광"],
      route_summary: "난바 → 오사카성 루프 → 베이스 복귀.",
      includes: [...includes.ko],
      requirements: [...requirements.ko],
    },
  ],
};

const addonTranslations = {
  [GOPRO_ID]: {
    en: {
      name: "GoPro rental",
      description: "HD action camera rental with waterproof housing.",
    },
    "zh-CN": {
      name: "GoPro 租赁",
      description: "高清运动相机租赁，含防水壳。",
    },
    "zh-TW": {
      name: "GoPro 租賃",
      description: "高清運動相機租賃，含防水殼。",
    },
    ja: {
      name: "GoProレンタル",
      description: "防水ハウジング付きの高画質アクションカメラ。",
    },
    ko: {
      name: "GoPro 대여",
      description: "방수 하우징 포함 고화질 액션캠 대여.",
    },
  },
  [COSTUME_ID]: {
    en: {
      name: "Racing suit upgrade",
      description: "Pro fire-retardant racing suits, several colors.",
    },
    "zh-CN": {
      name: "赛车服升级",
      description: "专业防火赛车服，多色可选。",
    },
    "zh-TW": {
      name: "賽車服升級",
      description: "專業防火賽車服，多色可選。",
    },
    ja: {
      name: "レーシングスーツアップグレード",
      description: "防火レーシングスーツ。カラー複数。",
    },
    ko: {
      name: "레이싱 슈트 업그레이드",
      description: "전문 방화 레이싱 슈트, 여러 색상.",
    },
  },
  [PHOTO_ID]: {
    en: {
      name: "Pro photo follow",
      description: "Trackside photographer. Five retouched originals included.",
    },
    "zh-CN": {
      name: "专业跟拍照片",
      description: "赛道摄影师跟拍，含5张精修原片。",
    },
    "zh-TW": {
      name: "專業跟拍照片",
      description: "賽道攝影師跟拍，含5張精修原片。",
    },
    ja: {
      name: "プロフォト同行",
      description: "カメラマンが走行を撮影。レタッチ原版5枚付き。",
    },
    ko: {
      name: "프로 사진 동행",
      description: "트랙 포토그래퍼 촬영, 보정 원본 5장 포함.",
    },
  },
  [INSURANCE_ID]: {
    en: {
      name: "Extra insurance",
      description: "Additional personal accident cover on top of the included policy.",
    },
    "zh-CN": {
      name: "额外保险",
      description: "在基础保险之外加保人身意外。",
    },
    "zh-TW": {
      name: "額外保險",
      description: "在基礎保險之外加保人身意外。",
    },
    ja: {
      name: "追加保険",
      description: "基本保険に加えて傷害保険を上乗せ。",
    },
    ko: {
      name: "추가 보험",
      description: "기본 보험 외에 상해 담보를 추가합니다.",
    },
  },
} as const;

function localeFallbacks(locale: string): string[] {
  if (locale === "zh-TW" || locale === "zh-CN" || locale === "zh-Hant") {
    return ["zh-TW", "zh-CN", "en"];
  }
  return [locale, "en"];
}

function pickTranslation(
  rows: PlanTranslation[] | undefined,
  locale: string,
): PlanTranslation {
  if (!rows?.length) {
    throw new Error("Missing plan translation");
  }

  for (const code of localeFallbacks(locale)) {
    const match = rows.find((row) => row.locale === code);
    if (match) return match;
  }

  return rows[0];
}

export function getSeedPlans(locale: string): PlanWithTranslation[] {
  return plans.map((plan) => ({
    ...plan,
    translation: pickTranslation(planTranslations[plan.id], locale),
    source: "seed" as const,
  }));
}

export function getSeedPlanBySlug(
  slug: string,
  locale: string,
): PlanWithTranslation | null {
  const plan = plans.find((item) => item.slug === slug);
  if (!plan) return null;

  return {
    ...plan,
    translation: pickTranslation(planTranslations[plan.id], locale),
    source: "seed",
  };
}

export function getSeedAddons(locale: string): AddonWithTranslation[] {
  const key = LOCALES.includes(locale as (typeof LOCALES)[number])
    ? (locale as (typeof LOCALES)[number])
    : "en";

  return [
    {
      id: GOPRO_ID,
      slug: "gopro",
      price_jpy: 2500,
      max_qty: 2,
      is_active: true,
      source: "seed",
      translation: { locale: key, ...addonTranslations[GOPRO_ID][key] },
    },
    {
      id: COSTUME_ID,
      slug: "costume",
      price_jpy: 1000,
      max_qty: 8,
      is_active: true,
      source: "seed",
      translation: { locale: key, ...addonTranslations[COSTUME_ID][key] },
    },
    {
      id: PHOTO_ID,
      slug: "photos",
      price_jpy: 3000,
      max_qty: 1,
      is_active: true,
      source: "seed",
      translation: { locale: key, ...addonTranslations[PHOTO_ID][key] },
    },
    {
      id: INSURANCE_ID,
      slug: "insurance",
      price_jpy: 500,
      max_qty: 8,
      is_active: true,
      source: "seed",
      translation: { locale: key, ...addonTranslations[INSURANCE_ID][key] },
    },
  ];
}
