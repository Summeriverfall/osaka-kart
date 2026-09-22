export type PlanBadgeId = "intro" | "rec" | "landmark" | "night" | "full";

export const PLAN_BADGES: Record<string, PlanBadgeId> = {
  sunset: "intro",
  standard: "rec",
  "night-run": "landmark",
  "vip-night": "night",
  "grand-tour": "full",
};

export const HERO_SLIDES = [
  "/images/social/22.webp",
  "/images/hero/poster.webp",
  "/images/social/yejiankadingche.webp",
  "/images/social/tsutenkaku-kart.webp",
  "/images/social/33.webp",
  "/images/social/bianzhuang.webp",
] as const;

export const HIDE_FAQ_Q =
  /下雨天會取消|Is it cancelled in the rain|雨の日は中止|비 오는 날은 취소|最多幾個人一起走|How many can ride together|何人まで一緒に走れる|몇 명까지 함께 탈 수 있나요/;

export const HIDE_FAQ_IDS = new Set(["f7", "f10", "q7", "q10"]);

export const TRIPADVISOR_SEARCH =
  "https://www.tripadvisor.com/Search?q=Future%20Kart%20Osaka";

type LicenseSection = { title: string; items: string[] };

type PlanCopy = { title: string; desc: string; points: string[] };

export type HomeCopy = {
  tags: string[];
  needBefore: string;
  needLink: string;
  cta: string;
  book: string;
  routeLabel: string;
  close: string;
  safetyKicker: string;
  footerLead: string;
  floatDock: string;
  floatMagnet: string;
  floatBook: string;
  floatAsk: string;
  floatSocial: string;
  floatAskTitle: string;
  floatSocialTitle: string;
  floatCall: string;
  floatMail: string;
  floatLine: string;
  floatWhatsapp: string;
  floatOpen: string;
  floatClose: string;
  badges: Record<PlanBadgeId, string>;
  plans?: Record<string, PlanCopy>;
  license: {
    kicker: string;
    title: string;
    lead: string;
    sections: LicenseSection[];
  };
};

const I18N: Record<"zh-TW" | "en" | "ja" | "ko", HomeCopy> = {
  "zh-TW": {
    tags: ["從人潮裡開過去", "街上的人都會看你", "現場提供賽車服", "專業領隊"],
    needBefore: "須年滿 18 歲，持",
    needLink: "日本認可的有效駕駛許可",
    cta: "查看可預約時間及套餐",
    book: "選日期並預約",
    routeLabel: "路線圖",
    close: "關閉",
    safetyKicker: "須知",
    footerLead: "選路線、鎖時段，從難波出發。",
    floatDock: "快捷操作",
    floatMagnet: "Book",
    floatBook: "預約",
    floatAsk: "問問",
    floatSocial: "社媒",
    floatAskTitle: "問問客服",
    floatSocialTitle: "關注我們",
    floatCall: "打電話",
    floatMail: "發郵件",
    floatLine: "LINE",
    floatWhatsapp: "WhatsApp",
    floatOpen: "展開快捷按鈕",
    floatClose: "收起快捷按鈕",
    badges: { intro: "入門", rec: "最推薦", landmark: "地標", night: "夜景", full: "完整行程" },
    plans: {
      sunset: {
        title: "黃昏灣岸 45 分鐘",
        desc: "黃昏時分沿灣岸走一圈，路線短、好上手，適合想先試車的人。",
        points: ["灣岸黃昏", "短途好上手", "適合試車"],
      },
      standard: {
        title: "難波 60 分鐘",
        desc: "在大阪市中心的難波，體驗 60 分鐘的街景騎行。一邊看熱鬧景點，一邊感受速度。路線專為新手設計，第一次來也能放心玩。",
        points: ["難波 60 分鐘", "熱門街景", "適合新手"],
      },
      "night-run": {
        title: "通天閣 90 分鐘",
        desc: "以大阪地標通天閣為中心，體驗 90 分鐘行程。地道街巷和著名景點更多，路線更長，可以慢慢把城市看一遍。",
        points: ["通天閣 90 分鐘", "地道風情", "著名景點"],
      },
      "vip-night": {
        title: "夜間霓虹 90 分鐘",
        desc: "夜間霓虹路線，燈火和街景更密，適合想拍夜景的人。",
        points: ["夜間霓虹", "夜景更好拍", "90 分鐘"],
      },
      "grand-tour": {
        title: "大阪城 120 分鐘",
        desc: "以大阪城為背景的 120 分鐘行程。歷史街區和現代街景串在一條路上，適合想把代表性景點慢慢看完的人。",
        points: ["大阪城 120 分鐘", "歷史與現代", "悠閒遊覽"],
      },
    },
    license: {
      kicker: "駕照",
      title: "日本認可的有效駕駛許可",
      lead: "報到時須出示規定文件。沒有符合規定的駕照不能上路。塑膠國際駕照卡無效。",
      sections: [
        {
          title: "可直接使用",
          items: [
            "日本駕照",
            "比利時、法國、德國、摩納哥、斯洛維尼亞、瑞士、台灣：原始駕照 + 官方日文譯本",
          ],
        },
        {
          title: "須另持紙本國際駕照",
          items: [
            "1949 年日內瓦公約國際駕駛許可，須為小冊子，分類 A–E",
            "美國、加拿大、澳洲：本國駕照 + 紙本 IDP，或 SOFA",
            "中國、韓國及其他多數國家：本國駕照不能單獨上路，須同時攜帶原件和紙本 IDP",
          ],
        },
        {
          title: "報到還要帶",
          items: [
            "駕照正本、規定的紙本國際駕照或譯本、護照",
            "駕駛員年滿 18 歲，身高 150–190 公分",
            "不確定是否適用，出發前把駕照照片發給我們核對",
          ],
        },
      ],
    },
  },
  en: {
    tags: ["Public streets", "Guide-led convoy", "Gear provided on site", "Photos and video extra"],
    needBefore: "18+, with a ",
    needLink: "Japan-recognized license",
    cta: "See available times and packages",
    book: "Pick a date",
    routeLabel: "Route map",
    close: "Close",
    safetyKicker: "Notes",
    footerLead: "Pick a route, lock a time, roll out of Namba.",
    floatDock: "Quick actions",
    floatMagnet: "Book",
    floatBook: "Book",
    floatAsk: "Ask",
    floatSocial: "Social",
    floatAskTitle: "Ask the team",
    floatSocialTitle: "Follow us",
    floatCall: "Call",
    floatMail: "Email",
    floatLine: "LINE",
    floatWhatsapp: "WhatsApp",
    floatOpen: "Open shortcuts",
    floatClose: "Close shortcuts",
    badges: { intro: "Starter", rec: "Most popular", landmark: "Landmark", night: "Night view", full: "Full tour" },
    license: {
      kicker: "License",
      title: "Japan-recognized driving permit",
      lead: "Bring the required documents at check-in. No qualifying license, no drive. Plastic IDP cards are not accepted.",
      sections: [
        {
          title: "Ready to drive",
          items: [
            "A valid Japanese license",
            "Belgium, France, Germany, Monaco, Slovenia, Switzerland, Taiwan: original license + official Japanese translation",
          ],
        },
        {
          title: "Paper IDP also required",
          items: [
            "1949 Geneva Convention IDP — booklet only, categories A–E",
            "USA, Canada, Australia: national license + paper IDP, or SOFA",
            "China, Korea, and most other countries: a national license alone is not enough; bring the original and a paper IDP",
          ],
        },
        {
          title: "Also bring",
          items: [
            "Original license, the required paper IDP or translation, and your passport",
            "Drivers must be 18+ and 150–190 cm tall",
            "Unsure? Send us a photo of your license before you come",
          ],
        },
      ],
    },
  },
  ja: {
    tags: ["公道走行", "ガイド先導", "装備は現地で提供", "写真・動画は追加可"],
    needBefore: "18歳以上、",
    needLink: "日本で認められる免許",
    cta: "予約可能な時間とプランを見る",
    book: "日時を選ぶ",
    routeLabel: "ルート図",
    close: "閉じる",
    safetyKicker: "案内",
    footerLead: "コースと時間を決めて、難波から出発。",
    floatDock: "ショートカット",
    floatMagnet: "Book",
    floatBook: "予約",
    floatAsk: "相談",
    floatSocial: "SNS",
    floatAskTitle: "スタッフに相談",
    floatSocialTitle: "フォロー",
    floatCall: "電話",
    floatMail: "メール",
    floatLine: "LINE",
    floatWhatsapp: "WhatsApp",
    floatOpen: "ショートカットを開く",
    floatClose: "ショートカットを閉じる",
    badges: { intro: "入門", rec: "一番人気", landmark: "名所", night: "夜景", full: "じっくり" },
    license: {
      kicker: "免許",
      title: "日本で認められる免許",
      lead: "受付で指定の書類を提示してください。条件を満たさない免許では運転できません。プラスチックの国際免許証は無効です。",
      sections: [
        {
          title: "このまま運転できる",
          items: [
            "有効な日本の免許",
            "ベルギー、フランス、ドイツ、モナコ、スロベニア、スイス、台湾：原本＋公式日本語翻訳",
          ],
        },
        {
          title: "紙の国際免許も必要",
          items: [
            "1949年ジュネーブ条約の国際免許。冊子のみ、区分 A–E",
            "米国、カナダ、オーストラリア：本国免許＋紙のIDP、またはSOFA",
            "中国、韓国、その他多くの国：本国免許だけでは不可。原本と紙のIDPを持参",
          ],
        },
        {
          title: "受付で持参するもの",
          items: [
            "免許の原本、必要な紙の国際免許または翻訳、パスポート",
            "運転者は18歳以上、身長150–190cm",
            "判断がつかない場合は、出発前に免許の写真を送ってください",
          ],
        },
      ],
    },
  },
  ko: {
    tags: ["일반 도로 주행", "가이드 선도", "장비 현장 제공", "사진·영상 추가 가능"],
    needBefore: "18세 이상, ",
    needLink: "일본이 인정하는 면허",
    cta: "예약 가능 시간과 패키지 보기",
    book: "날짜 선택",
    routeLabel: "경로",
    close: "닫기",
    safetyKicker: "안내",
    footerLead: "코스와 시간을 정하고 난바에서 출발하세요.",
    floatDock: "바로가기",
    floatMagnet: "Book",
    floatBook: "예약",
    floatAsk: "문의",
    floatSocial: "소셜",
    floatAskTitle: "스태프에게 문의",
    floatSocialTitle: "팔로우",
    floatCall: "전화",
    floatMail: "이메일",
    floatLine: "LINE",
    floatWhatsapp: "WhatsApp",
    floatOpen: "바로가기 열기",
    floatClose: "바로가기 닫기",
    badges: { intro: "입문", rec: "가장 추천", landmark: "랜드마크", night: "야경", full: "풀코스" },
    license: {
      kicker: "면허",
      title: "일본이 인정하는 면허",
      lead: "체크인 때 지정 서류를 보여 주세요. 요건을 갖춘 면허가 없으면 운전할 수 없습니다. 플라스틱 국제면허 카드는 무효입니다.",
      sections: [
        {
          title: "바로 운전 가능",
          items: [
            "유효한 일본 면허",
            "벨기에, 프랑스, 독일, 모나코, 슬로베니아, 스위스, 대만: 원본 면허 + 공식 일본어 번역",
          ],
        },
        {
          title: "종이 국제면허 필요",
          items: [
            "1949 제네바 협약 국제면허. 소책자만 가능, 분류 A–E",
            "미국, 캐나다, 호주: 자국 면허 + 종이 IDP, 또는 SOFA",
            "중국, 한국 및 대부분의 다른 나라: 자국 면허만으로는 부족. 원본과 종이 IDP를 함께 지참",
          ],
        },
        {
          title: "체크인 때 지참",
          items: [
            "면허 원본, 필요한 종이 국제면허 또는 번역, 여권",
            "운전자는 18세 이상, 키 150–190cm",
            "확실하지 않으면 출발 전에 면허 사진을 보내 주세요",
          ],
        },
      ],
    },
  },
};

export function homeCopy(locale: string): HomeCopy {
  if (locale.startsWith("zh")) return I18N["zh-TW"];
  if (locale.startsWith("ja")) return I18N.ja;
  if (locale.startsWith("ko")) return I18N.ko;
  return I18N.en;
}

export function homePlanOverlay(locale: string, slug: string) {
  return homeCopy(locale).plans?.[slug] ?? null;
}
