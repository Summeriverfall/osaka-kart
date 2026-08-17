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

const LOCALES = ["en", "zh-CN", "zh-TW", "ja", "ko"] as const;

export const PLAN_SLUGS = ["standard", "night-run", "grand-tour"] as const;

const plans: PlanRecord[] = [
  {
    id: STANDARD_ID,
    slug: "standard",
    duration_minutes: 60,
    distance_km: 8,
    base_price_jpy: 8000,
    max_participants: 4,
    is_active: true,
  },
  {
    id: NIGHT_ID,
    slug: "night-run",
    duration_minutes: 60,
    distance_km: 10,
    base_price_jpy: 9800,
    max_participants: 4,
    is_active: true,
  },
  {
    id: GRAND_ID,
    slug: "grand-tour",
    duration_minutes: 90,
    distance_km: 15,
    base_price_jpy: 12800,
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
      name: "Standard Street Run",
      description:
        "The first-timer favorite. Drive a street-legal kart through Osaka neon streets with a professional guide.",
      highlights: ["60 minutes on the street", "Dotonbori night lights", "Suit and helmet included"],
      route_summary: "Namba check-in → Dotonbori loop → Shinsaibashi return.",
      includes: [...includes.en],
      requirements: [...requirements.en],
    },
    {
      locale: "zh-CN",
      name: "标准街头体验",
      description:
        "初次体验首选。在专业向导带领下，驾驶合法上路的卡丁车穿行大阪霓虹街道。",
      highlights: ["街头驾驶 60 分钟", "道顿堀夜景", "含赛车服与头盔"],
      route_summary: "难波集合 → 道顿堀环线 → 心斋桥返回。",
      includes: [...includes["zh-CN"]],
      requirements: [...requirements["zh-CN"]],
    },
    {
      locale: "zh-TW",
      name: "標準街頭體驗",
      description:
        "初次體驗首選。在專業嚮導帶領下，駕駛合法上路的卡丁車穿行大阪霓虹街道。",
      highlights: ["街頭駕駛 60 分鐘", "道頓堀夜景", "含賽車服與頭盔"],
      route_summary: "難波集合 → 道頓堀環線 → 心齋橋返回。",
      includes: [...includes["zh-TW"]],
      requirements: [...requirements["zh-TW"]],
    },
    {
      locale: "ja",
      name: "スタンダード街乗り",
      description:
        "初めての方に人気。プロのガイドとともに、大阪のネオン街を公道カートで走ります。",
      highlights: ["ストリート走行60分", "道頓堀の夜景", "スーツとヘルメット込み"],
      route_summary: "難波集合 → 道頓堀ループ → 心斎橋へ戻る。",
      includes: [...includes.ja],
      requirements: [...requirements.ja],
    },
    {
      locale: "ko",
      name: "스탠다드 스트리트 런",
      description:
        "처음 방문하는 분께 추천. 전문 가이드와 함께 오사카 네온 거리를 스트리트 카트로 달립니다.",
      highlights: ["스트리트 주행 60분", "도톤보리 야경", "슈트와 헬멧 포함"],
      route_summary: "난바 체크인 → 도톤보리 루프 → 신사이바시 복귀.",
      includes: [...includes.ko],
      requirements: [...requirements.ko],
    },
  ],
  [NIGHT_ID]: [
    {
      locale: "en",
      name: "Night Dotonbori Run",
      description:
        "After-dark streets, denser neon, and a route timed for the brightest Osaka night.",
      highlights: ["Best after sunset", "Photo-ready neon", "Guide-led convoy"],
      route_summary:
        "Evening departure from Namba through Dotonbori and the inner-city lights.",
      includes: [...includes.en],
      requirements: [...requirements.en],
    },
    {
      locale: "zh-CN",
      name: "夜间道顿堀骑行",
      description: "日落后出发，霓虹更密，路线对准大阪最亮的夜景时段。",
      highlights: ["日落后来最好", "适合拍照的霓虹", "向导车队带领"],
      route_summary: "傍晚从难波出发，穿行道顿堀与市中心灯光带。",
      includes: [...includes["zh-CN"]],
      requirements: [...requirements["zh-CN"]],
    },
    {
      locale: "zh-TW",
      name: "夜間道頓堀騎行",
      description: "日落後出發，霓虹更密，路線對準大阪最亮的夜景時段。",
      highlights: ["日落後來最好", "適合拍照的霓虹", "嚮導車隊帶領"],
      route_summary: "傍晚從難波出發，穿行道頓堀與市中心燈光帶。",
      includes: [...includes["zh-TW"]],
      requirements: [...requirements["zh-TW"]],
    },
    {
      locale: "ja",
      name: "ナイト道頓堀ラン",
      description:
        "日没後の街並み。ネオンがより強く、大阪の夜が一番明るい時間に合わせたルートです。",
      highlights: ["日没後がおすすめ", "写真映えするネオン", "ガイド隊列"],
      route_summary: "夕方に難波を出発し、道頓堀と都心の明かりを走ります。",
      includes: [...includes.ja],
      requirements: [...requirements.ja],
    },
    {
      locale: "ko",
      name: "나이트 도톤보리 런",
      description:
        "해가 진 뒤 출발합니다. 네온이 더 진하고, 오사카 밤이 가장 밝은 시간대에 맞춘 코스입니다.",
      highlights: ["일몰 이후 추천", "사진용 네온", "가이드 대열"],
      route_summary: "저녁에 난바를 출발해 도톤보리와 도심 조명 구간을 달립니다.",
      includes: [...includes.ko],
      requirements: [...requirements.ko],
    },
  ],
  [GRAND_ID]: [
    {
      locale: "en",
      name: "Grand City Tour",
      description:
        "A longer street kart run covering more of central Osaka. Built for riders who want extra time on the road.",
      highlights: ["90 minutes", "Extended city loop", "More photo stops"],
      route_summary: "Namba → Dotonbori → wider inner-city loop → return to base.",
      includes: [...includes.en],
      requirements: [...requirements.en],
    },
    {
      locale: "zh-CN",
      name: "城市长线体验",
      description:
        "更长的街头卡丁车路线，覆盖大阪市中心更多路段，适合想多开一会儿的车手。",
      highlights: ["90 分钟", "加长市区环线", "更多拍照停留"],
      route_summary: "难波 → 道顿堀 → 更宽的市区环线 → 返回集合点。",
      includes: [...includes["zh-CN"]],
      requirements: [...requirements["zh-CN"]],
    },
    {
      locale: "zh-TW",
      name: "城市長線體驗",
      description:
        "更長的街頭卡丁車路線，覆蓋大阪市中心更多路段，適合想多開一會兒的車手。",
      highlights: ["90 分鐘", "加長市區環線", "更多拍照停留"],
      route_summary: "難波 → 道頓堀 → 更寬的市區環線 → 返回集合點。",
      includes: [...includes["zh-TW"]],
      requirements: [...requirements["zh-TW"]],
    },
    {
      locale: "ja",
      name: "グランドシティツアー",
      description:
        "大阪都心をより広く走る長めのストリートカート。もっと走りたい方向けです。",
      highlights: ["90分", "拡張シティループ", "撮影スポット多め"],
      route_summary: "難波 → 道頓堀 → より広い都心ループ → 基地へ戻る。",
      includes: [...includes.ja],
      requirements: [...requirements.ja],
    },
    {
      locale: "ko",
      name: "그랜드 시티 투어",
      description:
        "오사카 도심을 더 넓게 도는 긴 스트리트 카트 코스. 조금 더 달리고 싶은 분께 맞습니다.",
      highlights: ["90분", "확장 도심 루프", "포토 스톱 추가"],
      route_summary: "난바 → 도톤보리 → 더 넓은 도심 루프 → 베이스 복귀.",
      includes: [...includes.ko],
      requirements: [...requirements.ko],
    },
  ],
};

const addonTranslations = {
  [GOPRO_ID]: {
    en: { name: "GoPro recording", description: "Front-mounted camera so you can keep the ride." },
    "zh-CN": { name: "GoPro 录像", description: "车头固定摄像头，把整段骑行留下来。" },
    "zh-TW": { name: "GoPro 錄影", description: "車頭固定攝影機，把整段騎行留下來。" },
    ja: { name: "GoPro撮影", description: "前方カメラで走行を記録できます。" },
    ko: { name: "GoPro 촬영", description: "전방 카메라로 주행을 남길 수 있습니다." },
  },
  [COSTUME_ID]: {
    en: { name: "Costume upgrade", description: "Pick a themed racing suit for photos on the street." },
    "zh-CN": { name: "服装升级", description: "可选主题赛车服，方便在街头拍照。" },
    "zh-TW": { name: "服裝升級", description: "可選主題賽車服，方便在街頭拍照。" },
    ja: { name: "コスチュームアップグレード", description: "ストリート撮影向けのテーマスーツを選べます。" },
    ko: { name: "의상 업그레이드", description: "거리에서 사진 찍기 좋은 테마 슈트를 고를 수 있습니다." },
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
      price_jpy: 2000,
      max_qty: 1,
      is_active: true,
      source: "seed",
      translation: { locale: key, ...addonTranslations[GOPRO_ID][key] },
    },
    {
      id: COSTUME_ID,
      slug: "costume",
      price_jpy: 1500,
      max_qty: 1,
      is_active: true,
      source: "seed",
      translation: { locale: key, ...addonTranslations[COSTUME_ID][key] },
    },
  ];
}
