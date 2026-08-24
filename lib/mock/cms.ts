import { SITE_BRAND, SITE_BRAND_SHORT } from "@/lib/brand";
import { SITE_CONTACT } from "@/lib/contact";
import { emptyLocaleText, type LocaleText } from "@/lib/cms-text";

export type CmsVideoSlot = "hero" | "gallery" | "experience" | "page";
export type CmsVideoSource = "youtube" | "file";

export type CmsVideo = {
  id: string;
  slot: CmsVideoSlot;
  source: CmsVideoSource;
  youtubeId: string;
  file?: string;
  poster?: string;
  title: LocaleText;
  startAt?: number;
  active: boolean;
  sort: number;
};

export type CmsReview = {
  id: string;
  name: string;
  country: string;
  quote: LocaleText;
  photo?: string;
  active: boolean;
  sort: number;
};

export type CmsFaq = {
  id: string;
  q: LocaleText;
  a: LocaleText;
  home: boolean;
  active: boolean;
  sort: number;
};

export type CmsPress = {
  id: string;
  source: LocaleText;
  title: LocaleText;
  image: string;
  href?: string;
  active: boolean;
  sort: number;
};

export type CmsMeetup = {
  title: LocaleText;
  address: LocaleText;
  station: LocaleText;
  walk: LocaleText;
  lead: LocaleText;
  mapsUrl: string;
};

export type CmsHowToBook = {
  title: LocaleText;
  onlineLabel: LocaleText;
  showOnline: boolean;
  whatsappHint: LocaleText;
  showWhatsapp: boolean;
  whatsapp: string;
  showPhone: boolean;
  phone: string;
  showEmail: boolean;
  email: string;
  showLine: boolean;
  line: string;
};

export type CmsSocial = {
  instagram: string;
  youtube: string;
  x: string;
  facebook: string;
  tiktok: string;
  line: string;
};

export type CmsSite = {
  brandName: string;
  brandShort: string;
  brandSuffix: string;
  logo: string;
  phone: string;
  email: string;
  hours: string;
  whatsapp: string;
  social: CmsSocial;
  footerCompany: LocaleText;
};

export type CmsLabels = {
  videosTitle: LocaleText;
  videosLead: LocaleText;
  experienceTitle: LocaleText;
  experienceLead: LocaleText;
  reviewsTitle: LocaleText;
  reviewsLead: LocaleText;
  faqTitle: LocaleText;
  faqLead: LocaleText;
  pressTitle: LocaleText;
};

export type CmsState = {
  videos: CmsVideo[];
  reviews: CmsReview[];
  faqs: CmsFaq[];
  press: CmsPress[];
  meetup: CmsMeetup;
  howToBook: CmsHowToBook;
  site: CmsSite;
  labels: CmsLabels;
};

function L(zh: string, en: string, ja: string, ko: string): LocaleText {
  return { zh, en, ja, ko };
}

function video(
  id: string,
  slot: CmsVideoSlot,
  title: LocaleText,
  youtubeId: string,
  sort: number,
  extra?: Partial<CmsVideo>,
): CmsVideo {
  return {
    id,
    slot,
    source: extra?.source ?? (extra?.file ? "file" : "youtube"),
    youtubeId,
    file: extra?.file,
    poster: extra?.poster,
    title,
    startAt: extra?.startAt ?? 0,
    active: extra?.active ?? true,
    sort,
  };
}

export const MOCK_CMS: CmsState = {
  labels: {
    videosTitle: L("現場畫面", "On the street", "現場映像", "현장 영상"),
    videosLead: L("真實街道，不是封閉賽道。", "Real streets, not a closed circuit.", "本物の公道。閉鎖コースではありません。", "실제 도로입니다. 폐쇄 코스가 아닙니다."),
    experienceTitle: L("體驗影片", "Experience videos", "体験動画", "체험 영상"),
    experienceLead: L("上路之後是什麼感覺，先看一段。", "See the streets before you ride.", "走る前に、公道の雰囲気を見てください。", "타기 전에 거리를 먼저 보세요."),
    reviewsTitle: L("用戶評價", "Guest reviews", "お客さまの声", "이용 후기"),
    reviewsLead: L("客人帶走的感受。", "What guests take away.", "乗った人の感想。", "이용하신 분들의 이야기."),
    faqTitle: L("常見問題", "Frequently Asked Questions", "よくある質問", "자주 묻는 질문"),
    faqLead: L("上路前最常被問到的事。駕照規定因國家而異。", "The questions people ask before they ride. License rules differ by country.", "走る前にいちばん聞かれること。免許の扱いは国によって違います。", "타기 전에 가장 많이 묻는 질문. 면허 규정은 나라마다 다릅니다."),
    pressTitle: L("新聞報道", "In the news", "ニュース報道", "뉴스 보도"),
  },
  videos: [
    video("hero-main", "hero", L("首頁主視覺", "Hero loop", "ヒーロー映像", "히어로 영상"), "", 0, {
      source: "file",
      file: "/videos/hero-bg.mp4",
      poster: "/images/hero/poster.jpg",
    }),
    video("gallery-main", "gallery", L("夜間道頓堀", "Dotonbori night", "ナイト道頓堀", "나이트 도톤보리"), "", 1, {
      source: "file",
      file: "/videos/street-run.mp4",
      poster: "/images/hero/poster.jpg",
    }),
    video("xp-1", "experience", L("難波出發", "Namba start", "難波スタート", "난바 출발"), "", 10, {
      source: "file",
      file: "/videos/street-run.mp4",
      poster: "/images/hero/poster.jpg",
      startAt: 2,
    }),
    video("xp-2", "experience", L("夜間道頓堀", "Dotonbori night", "ナイト道頓堀", "나이트 도톤보리"), "", 11, {
      source: "file",
      file: "/videos/hero-bg.mp4",
      poster: "/images/hero/poster.jpg",
      startAt: 18,
    }),
    video("xp-3", "experience", L("車隊燈光", "Convoy lights", "隊列のライト", "대열의 빛"), "", 12, {
      source: "file",
      file: "/videos/street-run.mp4",
      poster: "/images/hero/poster.jpg",
      startAt: 7,
    }),
    video("xp-4", "experience", L("心齋橋環線", "Shinsaibashi loop", "心斎橋ループ", "신사이바시 루프"), "", 13, {
      source: "file",
      file: "/videos/hero-bg.mp4",
      poster: "/images/hero/poster.jpg",
      startAt: 48,
    }),
    video("xp-5", "experience", L("通天閣夜跑", "Tsutenkaku night", "通天閣ナイト", "츠텐카쿠 나이트"), "", 14, {
      source: "file",
      file: "/videos/street-run.mp4",
      poster: "/images/hero/poster.jpg",
      startAt: 13,
    }),
    video("xp-6", "experience", L("大阪城路段", "Castle run", "大阪城区間", "오사카성 구간"), "", 15, {
      source: "file",
      file: "/videos/hero-bg.mp4",
      poster: "/images/hero/poster.jpg",
      startAt: 108,
    }),
    video("page-1", "page", L("夜間道頓堀", "Dotonbori night", "ナイト道頓堀", "나이트 도톤보리"), "aqz-KE-bpKQ", 20),
    video("page-2", "page", L("難波出發", "Namba start", "難波スタート", "난바 출발"), "aqz-KE-bpKQ", 21),
    video("page-3", "page", L("車隊燈光", "Convoy lights", "隊列のライト", "대열의 빛"), "aqz-KE-bpKQ", 22),
    video("page-4", "page", L("心齋橋環線", "Shinsaibashi loop", "心斎橋ループ", "신사이바시 루프"), "aqz-KE-bpKQ", 23),
    video("page-5", "page", L("通天閣夜跑", "Tsutenkaku night", "通天閣ナイト", "츠텐카쿠 나이트"), "aqz-KE-bpKQ", 24),
    video("page-6", "page", L("大阪城路段", "Castle run", "大阪城区間", "오사카성 구간"), "aqz-KE-bpKQ", 25),
    video("page-7", "page", L("頭盔視角", "Helmet cam", "ヘルメット視点", "헬멧 캠"), "aqz-KE-bpKQ", 26),
    video("page-8", "page", L("車隊合影", "Team photo", "チーム写真", "팀 사진"), "aqz-KE-bpKQ", 27),
  ],
  reviews: [
    {
      id: "r1",
      name: "Alex M.",
      country: "USA",
      quote: L(
        "從卡丁車上看出去，這座城完全不一樣。大阪最棒的一晚。",
        "The streets look completely different from a kart. Best night in Osaka.",
        "カートから見る街は別物。大阪で一番の夜だった。",
        "카트에서 보는 도시는 완전히 달랐다. 오사카에서 가장 좋은 밤.",
      ),
      photo: "/images/reviews/r1.webp",
      active: true,
      sort: 1,
    },
    {
      id: "r2",
      name: "Mei L.",
      country: "Singapore",
      quote: L(
        "說明清楚，嚮導友善，照片值得留。",
        "Clear briefing, friendly guide, and photos we actually want to keep.",
        "説明が明確で、ガイドも親切。残したい写真が撮れた。",
        "설명이 분명하고 가이드가 친절했다. 남기고 싶은 사진이 나왔다.",
      ),
      photo: "/images/reviews/r2.webp",
      active: true,
      sort: 2,
    },
    {
      id: "r3",
      name: "Jonas K.",
      country: "Germany",
      quote: L(
        "街上的速度也很穩。霓虹這一趟就是整趟旅行。",
        "Felt safe at street speed. The neon run is the whole trip.",
        "公道でも安心できた。ネオンの走行が旅の全部。",
        "도로 속도에서도 안정적이었다. 네온 주행이 여행의 전부였다.",
      ),
      photo: "/images/reviews/r3.webp",
      active: true,
      sort: 3,
    },
  ],
  faqs: [
    {
      id: "f1",
      home: true,
      active: true,
      sort: 1,
      q: L("需要駕照嗎？", "Do I need a license?", "免許は必要？", "면허가 필요한가요?"),
      a: L(
        "需要。請攜帶有效駕照，或 1949 年日內瓦公約國際駕駛許可。沒有駕照不能上路。",
        "Yes. Bring a valid license or a 1949 Geneva International Driving Permit. No license, no ride.",
        "必要です。有効な免許、または1949年ジュネーブ条約の国際免許を持参。免許なしは走行不可。",
        "필요합니다. 유효 면허 또는 1949년 제네바 협약 국제운전면허를 지참하세요. 면허 없이는 주행할 수 없습니다.",
      ),
    },
    {
      id: "f2",
      home: true,
      active: true,
      sort: 2,
      q: L("服裝包含嗎？", "Are costumes included?", "衣装は含まれる？", "의상이 포함되나요?"),
      a: L(
        "含賽車服和頭盔。高級角色服裝可在預約時加購。",
        "A racing suit and helmet are included. Premium character costumes can be added at booking.",
        "レーシングスーツとヘルメット込み。プレミアムキャラ衣装は予約時に追加できます。",
        "레이싱 슈트와 헬멧이 포함됩니다. 프리미엄 캐릭터 의상은 예약 시 추가할 수 있습니다.",
      ),
    },
    {
      id: "f3",
      home: true,
      active: true,
      sort: 3,
      q: L("在哪裡集合？", "Where do we meet?", "集合場所は？", "어디서 모이나요?"),
      a: L(
        "大阪難波一帶。確切地點會在預訂後發送。",
        "Around Namba, Osaka. The exact pin is sent after you book.",
        "大阪・難波周辺。正確なピンは予約後に送ります。",
        "오사카 난바 일대. 정확한 위치는 예약 후 보내 드립니다.",
      ),
    },
    {
      id: "f4",
      home: true,
      active: true,
      sort: 4,
      q: L("下雨怎麼辦？", "What if it rains?", "雨の場合は？", "비가 오면요?"),
      a: L(
        "小雨提供雨衣、通常照常出發。暴雨或颱風：免費改期或全額退款。",
        "Light rain: ponchos, we usually go. Storms or typhoons: free reschedule or full refund.",
        "小雨はレインコートを用意し、通常実施。大雨・台風は無料振替または全額返金。",
        "가랑비는 우의를 제공하고 보통 진행합니다. 폭우/태풍은 무료 일정 변경 또는 전액 환불.",
      ),
    },
    {
      id: "f5",
      home: true,
      active: true,
      sort: 5,
      q: L("年齡要求？", "Age requirement?", "年齢制限は？", "나이 제한이 있나요?"),
      a: L(
        "駕駛員須年滿 18 歲並持有有效駕照。兒童可作為乘客搭乘，請先確認空位。",
        "Drivers must be 18+ with a valid license. Children may ride as passengers if a seat is available.",
        "運転者は18歳以上で有効な免許が必要。お子さまは同乗できる場合があります。",
        "운전자는 만 18세 이상이며 유효 면허가 있어야 합니다. 어린이는 동승할 수 있습니다.",
      ),
    },
    {
      id: "f6",
      home: false,
      active: true,
      sort: 6,
      q: L("需要國際駕照嗎？", "Do I need an international permit?", "国際免許は必要？", "국제운전면허가 필요한가요?"),
      a: L(
        "取決於你的駕照簽發國。美國、日本通常本國駕照即可；中國、韓國駕照不能在日本公路駕駛，必須同時攜帶 1949 年日內瓦公約國際駕駛許可。",
        "It depends on the issuing country. US and Japanese licenses are often fine. Chinese and Korean licenses are not valid on Japanese public roads — bring a 1949 Geneva IDP.",
        "発行国によります。米国・日本の免許は多くの場合そのままで可。中国・韓国の免許は日本の公道では使えず、1949年ジュネーブ条約の国際免許が必要です。",
        "발급 국가에 따라 다릅니다. 미국·일본 면허는 대개 그대로 가능합니다. 중국·한국 면허는 일본 일반 도로에서 쓸 수 없어 1949년 제네바 협약 국제운전면허가 필요합니다.",
      ),
    },
    {
      id: "f7",
      home: false,
      active: true,
      sort: 7,
      q: L("下雨天會取消嗎？", "Is it cancelled in the rain?", "雨の日は中止？", "비 오는 날은 취소되나요?"),
      a: L(
        "小雨通常照常出發，會提供雨衣。暴雨、颱風或官方警報會免費改期或全額退款。出發前會再確認一次天氣。",
        "Light rain usually goes ahead with ponchos. Heavy rain, typhoons, or official warnings: free reschedule or full refund. We reconfirm before departure.",
        "小雨はレインコートを用意して実施することが多いです。大雨・台風・公式警報は無料振替または全額返金。出発前に再確認します。",
        "가랑비는 우의를 제공하고 보통 진행합니다. 폭우·태풍·공식 경보는 무료 일정 변경 또는 전액 환불. 출발 전 날씨를 다시 확인합니다.",
      ),
    },
    {
      id: "f8",
      home: false,
      active: true,
      sort: 8,
      q: L("身高體重有限制嗎？", "Height or weight limits?", "身長・体重の制限は？", "키·몸무게 제한이 있나요?"),
      a: L(
        "駕駛建議身高 145cm 以上。體重上限以現場車輛為準，報到時工作人員會幫你確認座艙是否合適。",
        "Drivers should be about 145cm or taller. Weight depends on the kart that day — staff check the seat at check-in.",
        "運転は145cm以上が目安。体重は当日の車両によります。受付でシートが合うか確認します。",
        "운전자는 145cm 이상을 권장합니다. 체중 제한은 당일 차량에 따릅니다. 체크인 때 좌석을 확인합니다.",
      ),
    },
    {
      id: "f9",
      home: false,
      active: true,
      sort: 9,
      q: L("可以自己跟拍或用手機錄影嗎？", "Can I film on my phone while riding?", "走行中にスマホ撮影はできる？", "주행 중 휴대폰 촬영이 가능한가요?"),
      a: L(
        "行駛中請雙手握方向盤，不要自己拿手機拍攝。想留影像請加 GoPro 或專業跟拍。停車後可以自拍。",
        "Both hands on the wheel — no filming while moving. Add a GoPro or pro shoot if you want footage. Selfies after you stop are fine.",
        "両手はハンドル。走行中の撮影は不可です。映像が欲しい場合はGoProまたはプロ撮影を追加。停車後の自撮りはOK。",
        "핸들은 두 손으로. 주행 중 촬영은 불가합니다. 영상이 필요하면 GoPro 또는 프로 사진을 추가하세요. 정차 후 셀카는 가능합니다.",
      ),
    },
    {
      id: "f10",
      home: false,
      active: true,
      sort: 10,
      q: L("最多幾個人一起走？", "How many can ride together?", "何人まで一緒に走れる？", "몇 명까지 함께 탈 수 있나요?"),
      a: L(
        "同一時段通常最多 4 台車。超過 4 人可拆成連續時段，或先留言讓我們安排。",
        "A slot is usually up to 4 karts. Bigger groups can split into back-to-back slots — message us and we will arrange it.",
        "1枠は通常最大4台。それ以上は連続枠に分けます。メッセージで調整できます。",
        "한 타임은 보통 최대 4대입니다. 그 이상은 연속 타임으로 나눌 수 있습니다. 메시지로 맞춰 드립니다.",
      ),
    },
  ],
  press: [
    {
      id: "p1",
      image: "/images/news/n1.webp",
      active: true,
      sort: 1,
      source: L("大阪街頭日記", "Osaka Street Diary", "Osaka Street Diary", "Osaka Street Diary"),
      title: L(
        "合法上路的卡丁車，切過道頓堀的夜色。",
        "Street-legal karts cutting through Dotonbori after dark.",
        "合法な公道カートが、夜の道頓堀を走る。",
        "합법 도로 카트가 밤의 도톤보리를 가로지른다.",
      ),
    },
    {
      id: "p2",
      image: "/images/news/n2.webp",
      active: true,
      sort: 2,
      source: L("夜跑雜誌", "Night Run Mag", "Night Run Mag", "Night Run Mag"),
      title: L(
        "為什麼只有大阪能這樣開上街頭。",
        "Why Osaka is the only city that lets you drive this.",
        "なぜ大阪だけが、この走り方を許すのか。",
        "왜 오사카에서만 이렇게 달릴 수 있는가.",
      ),
    },
    {
      id: "p3",
      image: "/images/news/n3.webp",
      active: true,
      sort: 3,
      source: L("城市卡丁週刊", "City Kart Weekly", "City Kart Weekly", "City Kart Weekly"),
      title: L(
        "服裝、車隊、鏡頭——遊客最先拍下來的一趟。",
        "Costume, convoy, camera — the ride tourists film first.",
        "コスチューム、隊列、カメラ。旅人が最初に撮る走行。",
        "의상, 대열, 카메라. 여행객이 가장 먼저 찍는 주행.",
      ),
    },
    {
      id: "p4",
      image: "/images/news/n4.webp",
      active: true,
      sort: 4,
      source: L("Travel Frame", "Travel Frame", "Travel Frame", "Travel Frame"),
      title: L(
        "從難波出發的夜環，像電影裡的追逐。",
        "A night loop from Namba that feels like a movie chase.",
        "難波発のナイトループは、映画のチェイスみたいだ。",
        "난바에서 출발하는 나이트 루프는 영화 추격전 같다.",
      ),
    },
    {
      id: "p5",
      image: "/images/hero/poster.jpg",
      active: true,
      sort: 5,
      source: L("霓虹快訊", "Neon Dispatch", "Neon Dispatch", "Neon Dispatch"),
      title: L("嚮導定節奏，照片你帶走。", "A guide sets the pace. You keep the photos.", "ガイドがペースを決める。写真はあなたのもの。", "가이드가 속도를 정한다. 사진은 당신이 가져간다."),
    },
    {
      id: "p6",
      image: "/images/social/tsutenkaku-kart.webp",
      active: true,
      sort: 6,
      source: L("海灣環線", "Bay Loop", "Bay Loop", "Bay Loop"),
      title: L("通天閣燈光、合法車牌、一條車隊。", "Tsutenkaku lights, street plates, one convoy.", "通天閣の光、合法プレート、ひとつの隊列。", "쓰텐카쿠의 빛, 합법 번호판, 하나의 대열."),
    },
  ],
  meetup: {
    title: L("集合地點", "Meeting Point", "集合場所", "집합 장소"),
    address: L("大阪市中央區難波", "Namba, Chuo-ku, Osaka", "大阪市中央区難波", "오사카시 주오구 난바"),
    station: L("難波站", "Namba Station", "難波駅", "난바역"),
    walk: L("從難波站步行約 5 分鐘。", "About 5 min walk from Namba Station.", "難波駅から徒歩約5分。", "난바역에서 도보 약 5분."),
    lead: L("集合在難波。確切門牌預訂後發送。", "We meet in Namba. The exact pin is sent after you book.", "集合は難波。正確なピンは予約後にお送りします。", "집합은 난바. 정확한 주소는 예약 후 보내 드립니다."),
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Namba+Osaka",
  },
  howToBook: {
    title: L("怎麼預約", "How to book", "予約方法", "예약 방법"),
    onlineLabel: L("線上填寫預約", "Book online", "オンラインで予約", "온라인 예약"),
    showOnline: true,
    whatsappHint: L("訊息回覆通常更快", "Usually the fastest reply", "返信が早いことが多いです", "보통 답장이 더 빠릅니다"),
    showWhatsapp: true,
    whatsapp: SITE_CONTACT.whatsapp,
    showPhone: true,
    phone: SITE_CONTACT.phone,
    showEmail: true,
    email: SITE_CONTACT.email,
    showLine: false,
    line: SITE_CONTACT.line,
  },
  site: {
    brandName: SITE_BRAND,
    brandShort: SITE_BRAND_SHORT,
    brandSuffix: "Osaka",
    logo: "",
    phone: SITE_CONTACT.phone,
    email: SITE_CONTACT.email,
    hours: SITE_CONTACT.hours,
    whatsapp: SITE_CONTACT.whatsapp,
    social: {
      instagram: SITE_CONTACT.instagram,
      youtube: SITE_CONTACT.youtube,
      x: SITE_CONTACT.x,
      facebook: SITE_CONTACT.facebook,
      tiktok: SITE_CONTACT.tiktok,
      line: SITE_CONTACT.line,
    },
    footerCompany: L("Furture Kart Osaka · 大阪", "Furture Kart Osaka · Osaka, Japan", "Furture Kart Osaka · 大阪", "Furture Kart Osaka · 오사카"),
  },
};

export function blankVideo(): CmsVideo {
  return {
    id: `v-${Date.now().toString(36)}`,
    slot: "page",
    source: "youtube",
    youtubeId: "",
    file: "",
    poster: "",
    title: emptyLocaleText(),
    startAt: 0,
    active: true,
    sort: 50,
  };
}

export function blankReview(): CmsReview {
  return {
    id: `r-${Date.now().toString(36)}`,
    name: "",
    country: "",
    quote: emptyLocaleText(),
    photo: "",
    active: true,
    sort: 50,
  };
}

export function blankFaq(): CmsFaq {
  return {
    id: `f-${Date.now().toString(36)}`,
    q: emptyLocaleText(),
    a: emptyLocaleText(),
    home: false,
    active: true,
    sort: 50,
  };
}

export function blankPress(): CmsPress {
  return {
    id: `p-${Date.now().toString(36)}`,
    source: emptyLocaleText(),
    title: emptyLocaleText(),
    image: "",
    href: "",
    active: true,
    sort: 50,
  };
}

function isDemoExperience(item: CmsVideo) {
  if (item.slot !== "experience") return false;
  if (item.source === "file" && item.file && (item.startAt ?? 0) > 0) return false;
  return item.source === "youtube" && (!item.file || item.youtubeId === "aqz-KE-bpKQ");
}

function mergeVideos(seed: CmsVideo[], extra?: CmsVideo[]) {
  if (!Array.isArray(extra) || extra.length === 0) return seed;
  const rest = extra.filter((item) => item.slot !== "experience");
  const xpExtra = extra.filter((item) => item.slot === "experience");
  const xpSeed = seed.filter((item) => item.slot === "experience");
  const useSeedXp = xpExtra.length < 6 || xpExtra.every(isDemoExperience);
  return [...(rest.length ? rest : seed.filter((item) => item.slot !== "experience")), ...(useSeedXp ? xpSeed : xpExtra)];
}

export function mergeCms(seed: CmsState, extra?: Partial<CmsState> | null): CmsState {
  if (!extra) return seed;
  return {
    videos: mergeVideos(seed.videos, extra.videos),
    reviews: Array.isArray(extra.reviews) ? extra.reviews : seed.reviews,
    faqs: Array.isArray(extra.faqs) ? extra.faqs : seed.faqs,
    press: Array.isArray(extra.press) ? extra.press : seed.press,
    meetup: extra.meetup ? { ...seed.meetup, ...extra.meetup } : seed.meetup,
    howToBook: extra.howToBook ? { ...seed.howToBook, ...extra.howToBook } : seed.howToBook,
    site: extra.site
      ? { ...seed.site, ...extra.site, social: { ...seed.site.social, ...extra.site.social } }
      : seed.site,
    labels: extra.labels ? { ...seed.labels, ...extra.labels } : seed.labels,
  };
}

export function cmsBySlot(videos: CmsVideo[], slot: CmsVideoSlot) {
  return videos
    .filter((item) => item.active && item.slot === slot)
    .slice()
    .sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id));
}
