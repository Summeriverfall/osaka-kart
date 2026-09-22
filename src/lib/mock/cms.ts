import { SITE_BRAND, SITE_BRAND_SHORT } from "@/lib/brand";
import { SITE_CONTACT } from "@/lib/contact";
import { emptyLocaleText, type LocaleText } from "@/lib/cms-text";

export type CmsVideoSlot = "hero" | "gallery" | "experience" | "page";
export type CmsVideoSource = "youtube" | "file" | "facebook" | "instagram";

export type CmsVideo = {
  id: string;
  slot: CmsVideoSlot;
  source: CmsVideoSource;
  youtubeId: string;
  file?: string;
  poster?: string;
  pageUrl?: string;
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
  platform?: string;
  url?: string;
  rating?: number;
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
  tripadvisor: string;
};

export const SOCIAL_DOCK_KEYS = ["instagram", "tiktok", "facebook", "tripadvisor", "twitter"] as const;
export type SocialDockKey = (typeof SOCIAL_DOCK_KEYS)[number];
export type CmsSocialDock = Record<SocialDockKey, boolean>;

export const DEFAULT_SOCIAL_DOCK: CmsSocialDock = {
  instagram: true,
  tiktok: true,
  facebook: true,
  tripadvisor: true,
  twitter: true,
};

export function socialDockOf(site?: { socialDock?: Partial<CmsSocialDock> | null }): CmsSocialDock {
  return { ...DEFAULT_SOCIAL_DOCK, ...site?.socialDock };
}

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
  socialDock: CmsSocialDock;
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
    source: extra?.source ?? "youtube",
    youtubeId,
    file: extra?.file,
    poster: extra?.poster,
    pageUrl: extra?.pageUrl,
    title,
    startAt: extra?.startAt ?? 0,
    active: extra?.active ?? true,
    sort,
  };
}

export const MOCK_CMS: CmsState = {
  labels: {
    videosTitle: L("現場畫面", "On the street", "実際の走行風景", "현장 영상"),
    videosLead: L("真實街道，不是封閉賽道。", "Public roads, not a closed track.", "クローズドコースではなく、実際の公道を走行します。", "폐쇄 코스가 아닌 실제 도로입니다."),
    experienceTitle: L("體驗影片", "Experience videos", "体験動画", "체험 영상"),
    experienceLead: L("上路之後是什麼感覺，先看一段。", "See the streets before you ride.", "走る前に、公道の雰囲気を見てください。", "타기 전에 거리를 먼저 보세요."),
    reviewsTitle: L("用戶評價", "Guest reviews", "お客さまの声", "이용 후기"),
    reviewsLead: L("來自 Google、Klook、Trip.com 等平台的真實評價。", "Real guest reviews from Google, Klook, Trip.com, and more.", "Google、Klook、Trip.com などに投稿されたお客さまの声。", "Google, Klook, Trip.com 등 실제 후기."),
    faqTitle: L("常見問題", "Frequently Asked Questions", "よくある質問", "자주 묻는 질문"),
    faqLead: L("上路前最常被問到的事。駕照規定因國家而異。", "The questions people ask before they ride. License rules differ by country.", "走行前によくある質問。免許の条件は国によって異なります。", "타기 전에 가장 많이 묻는 질문. 면허 규정은 나라마다 다릅니다."),
    pressTitle: L("新聞報道", "In the news", "メディア掲載", "뉴스 보도"),
  },
  videos: [
    video("hero-main", "hero", L("首頁循環背景", "Hero loop", "ヒーロー映像", "히어로 영상"), "", 0, {
      file: "/videos/hero-bg.mp4",
      poster: "/images/hero/poster.webp",
    }),
    video("gallery-main", "gallery", L("夜間道頓堀", "Night Dotonbori", "ナイト道頓堀", "나이트 도톤보리"), "", 1, {
      file: "/videos/street-run.mp4",
      poster: "/images/social/yejiankadingche.webp",
    }),
    video("xp-1", "experience", L("難波出發", "Namba start", "難波スタート", "난바 출발"), "", 10, {
      file: "/videos/street-run.mp4",
      poster: "/images/social/nanbo.webp",
      startAt: 2,
    }),
    video("xp-2", "experience", L("夜間道頓堀", "Night Dotonbori", "ナイト道頓堀", "나이트 도톤보리"), "", 11, {
      file: "/videos/hero-bg.mp4",
      poster: "/images/social/yejiankadingche.webp",
      startAt: 18,
    }),
    video("xp-3", "experience", L("車隊燈光", "Convoy lights", "隊列の光", "대열의 빛"), "", 12, {
      file: "/videos/street-run.mp4",
      poster: "/images/social/33.webp",
      startAt: 7,
    }),
    video("xp-4", "experience", L("心齋橋環線", "Shinsaibashi loop", "心斎橋ループ", "신사이바시 루프"), "", 13, {
      file: "/videos/hero-bg.mp4",
      poster: "/images/social/22.webp",
      startAt: 48,
    }),
    video("xp-5", "experience", L("通天閣夜跑", "Tsutenkaku night", "通天閣ナイト", "츠텐카쿠 나이트"), "", 14, {
      file: "/videos/street-run.mp4",
      poster: "/images/social/tsutenkaku-kart.webp",
      startAt: 13,
    }),
    video("xp-6", "experience", L("大阪城路段", "Osaka Castle stretch", "大阪城区間", "오사카성 구간"), "", 15, {
      file: "/videos/hero-bg.mp4",
      poster: "/images/social/yejingtiyan.webp",
      startAt: 108,
    }),
    video("page-1", "page", L("夜間道頓堀", "Night Dotonbori", "ナイト道頓堀", "나이트 도톤보리"), "NSiMSPHGqT4", 20),
    video("page-2", "page", L("難波出發", "Namba start", "難波スタート", "난바 출발"), "A8u8hIKTNGI", 21),
    video("page-3", "page", L("車隊燈光", "Convoy lights", "隊列の光", "대열의 빛"), "8-xfX6V-Jb0", 22),
    video("page-4", "page", L("心齋橋環線", "Shinsaibashi loop", "心斎橋ループ", "신사이바시 루프"), "1JL050BtOlY", 23),
  ],
  reviews: [
    {
      id: "r1",
      name: "Paroshadrack",
      country: "",
      quote: L(
        "我和朋友們在大阪 Future Kart 體驗了一次很棒的卡丁車之旅！最讓我印象深刻的是他們卓越的客戶服務。由於我們這邊的疏忽，錯過了原定的預約時間，我們很擔心錯過這次體驗。但工作人員竭盡全力地幫助我們，最終讓我們順利上路。\n\n整個體驗令人難忘。駕駛卡丁車穿梭在大阪的街道上，真是太刺激了！從一個全新的視角欣賞這座城市的標誌性景點，留下了美好的回憶和照片。卡丁車保養很好，路線設計也很棒，工作人員確保每個人在整個旅程中都感到安全和舒適。\n\n最令人印象深刻的是團隊的友好、耐心和專業。他們把原本可能令人焦慮的情況變成了我們日本之旅的一大亮點。\n\n如果你來大阪，這絕對是必體驗的項目。感謝 Future Kart 團隊讓我們擁有如此難忘的一天。我們一定會再次體驗！\n\n強烈推薦！",
        "My friends and I had an amazing go-kart experience at Future Kart in Osaka! What impressed me most was their outstanding customer service. Due to an oversight on our side, we missed our original reservation time and were worried we would miss the experience. But the staff did everything they could to help us, and we eventually made it out on the road.\n\nThe whole experience was unforgettable. Driving a go-kart through the streets of Osaka was so exciting! Seeing the city's iconic sights from a completely new perspective left us with wonderful memories and photos. The karts were well maintained, the route was great, and the staff made sure everyone felt safe and comfortable throughout the journey.\n\nWhat impressed me most was how friendly, patient, and professional the team was. They turned a situation that could have been stressful into one of the highlights of our trip to Japan.\n\nIf you come to Osaka, this is an absolute must-do. Thank you to the Future Kart team for giving us such an unforgettable day. We will definitely do it again!\n\nHighly recommended!",
        "友人と大阪の Future Kart で素晴らしいゴーカート体験をしました。いちばん印象に残ったのは、卓越したカスタマーサービスです。こちらの不注意で予約時間に間に合わず、体験を逃すのではと心配しましたが、スタッフが全力で対応してくれ、無事に走り出すことができました。\n\n体験全体が忘れられません。大阪の街をカートで走るのは本当に刺激的で、いつもの名所をまったく新しい視点で見られ、素敵な思い出と写真が残りました。カートの整備もよく、ルートも素晴らしく、スタッフが行程を通して安全と快適さを守ってくれました。\n\nチームの親切さ、忍耐、プロ意識が何より印象的でした。不安になり得た状況を、日本旅行のハイライトに変えてくれました。\n\n大阪に来るなら絶対に体験すべきです。忘れられない一日をありがとうございました。また必ず体験します！\n\n強くおすすめします！",
        "친구들과 오사카 Future Kart에서 멋진 고카트 체험을 했습니다. 가장 인상 깊었던 것은 탁월한 고객 서비스입니다. 저희 실수로 원래 예약 시간을 놓쳐 체험을 못 할까 걱정했는데, 직원이 최선을 다해 도와준 덕분에 결국 출발할 수 있었습니다.\n\n전체 경험이 잊히지 않습니다. 오사카 거리를 카트로 달리는 것은 정말 짜릿했고, 도시의 상징적인 명소를 완전히 새로운 시선으로 보며 좋은 추억과 사진을 남겼습니다. 카트 정비도 좋았고 코스도 훌륭했으며, 직원이 전 과정에서 안전하고 편안하게 해주었습니다.\n\n팀의 친절함, 인내, 전문성이 가장 인상적이었습니다. 불안할 수 있었던 상황을 일본 여행의 하이라이트로 바꿔 주었습니다.\n\n오사카에 온다면 꼭 해볼 체험입니다. 잊을 수 없는 하루를 만들어 준 Future Kart 팀에 감사합니다. 꼭 다시 하겠습니다!\n\n강력 추천합니다!",
      ),
      photo: "/images/reviews/r1.webp",
      platform: "Google",
      url: "https://maps.app.goo.gl/zjRVCLAokNTRG8d97",
      rating: 5,
      active: true,
      sort: 1,
    },
    {
      id: "r2",
      name: "Alex T.",
      country: "",
      quote: L(
        "如果你還在猶豫要不要參加卡丁車行程，就去吧！這些車是電動的，比較安靜也不排廢氣，不用吸到前車的廢氣。導遊很友善，拍了很多照片，一路上也會指給你看有趣的景點。這是我找到唯一既走一般景點、又會帶到大阪城的行程（我們選了2小時）。卡丁車是兩踏板（右油門、左煞車），需要一點時間習慣，方向燈也不會自動熄，每次轉彎後要自己關掉。你會在真實道路上跟一般車輛一起開，如果不習慣市區開車可能要再想想。服裝讓整趟更有趣，很多人對我們揮手、拍照。你不會後悔的！",
        "If you're still hesitating about whether to join a go-kart tour, just go for it! Since these karts are electric, they're quieter and don't emit exhaust, so you don't have to inhale the exhaust from the kart in front of you. The guide was very friendly, took lots of photos, and was great at pointing out interesting sights along the way. This was also the only tour I could find that both covers the usual sights AND takes us to Osaka Castle (we chose the 2-hour itinerary). Since the karts are a two-pedal system (right accelerator, left brake), it takes a bit of getting used to, and the turn signals don't turn off automatically, so you have to manually switch them off after each turn. You will be driving on real roads with regular vehicles, so if you're not used to city driving, you might want to think it over. The costumes add to the fun, and lots of people waved and took photos of us. You won't regret it!",
        "ゴーカートツアーにまだ迷っているなら、思い切って参加してください。電動なので静かで排気もなく、前のカートの排気を吸わずに済みます。ガイドはとても親切で、写真もたくさん撮ってくれ、途中の見どころもよく教えてくれました。通常の観光スポットに加えて大阪城まで行けるツアーはここだけでした（2時間コースを選びました）。ペダルは2つ（右がアクセル、左がブレーキ）で少し慣れが必要で、ウインカーは自動で消えないので曲がったあとに自分で消します。一般車両と同じ公道を走るので、街中の運転に慣れていない方はよく考えてからがよいです。コスチュームも楽しく、たくさんの人が手を振ったり写真を撮ったりしてくれました。後悔はしません！",
        "고카트 투어를 망설이고 있다면 그냥 가세요! 전기 카트라 조용하고 배기가스가 없어서 앞차 매연을 마실 일이 없습니다. 가이드가 매우 친절했고 사진도 많이 찍어 주었으며, 길의 볼거리도 잘 알려 주었습니다. 일반 명소와 오사카성을 함께 가는 투어는 여기가 유일했습니다(저희는 2시간 코스). 페달은 두 개(오른쪽 액셀, 왼쪽 브레이크)라 익숙해질 시간이 필요하고, 방향지시등은 자동으로 꺼지지 않아 코너마다 직접 꺼야 합니다. 일반 차량과 함께 실제 도로를 달리니, 시내 운전에 익숙하지 않다면 한 번 더 생각해 보세요. 의상 덕분에 더 재미있었고 많은 사람이 손을 흔들고 사진을 찍었습니다. 후회하지 않을 거예요!",
      ),
      photo: "/images/reviews/r2.webp",
      platform: "Klook",
      url: "https://www.klook.com/activity/152539-osaka-electric-go-kart-by-future-kart/",
      rating: 5,
      active: true,
      sort: 2,
    },
    {
      id: "r3",
      name: "Huang",
      country: "Taiwan",
      quote: L(
        "因為評論不多，所以在其他公司之間猶豫了很久，但因為電動車的優點而選擇了這家，結果真的是很棒的選擇。首先，沒有尾氣這點很好，而且導遊非常親切，等紅燈的時候會確認我們是否還好！還幫我們拍了很多照片，真的非常感謝。如果有人正在猶豫要不要選這家，請不要猶豫，直接預約。我們下次還會再來！",
        "There weren't many reviews, so I hesitated a long time between shops. I picked this one for the electric karts and it was a great choice. No exhaust fumes, and the guide was so kind — at every red light they checked we were okay. They also took lots of photos for us. If you're still deciding, just book. We'll come again.",
        "口コミが少なくて他社と迷いましたが、電動カートの利点でここに決め、本当に正解でした。排気ガスがないのが良く、ガイドもとても親切で、赤信号のたびに大丈夫か確認してくれます。写真もたくさん撮ってくれました。迷っているなら予約して大丈夫。また来ます！",
        "후기가 많지 않아 다른 업체와 오래 고민했는데, 전기 카트 때문에 여기를 골랐고 정말 잘한 선택이었습니다. 배기가스가 없고, 가이드가 친절해서 빨간불마다 괜찮은지 확인해 줍니다. 사진도 많이 찍어 주었습니다. 고민 중이면 그냥 예약하세요. 다음에 또 올게요!",
      ),
      photo: "/images/reviews/r3.webp",
      platform: "Trip.com",
      url: "https://www.trip.com/",
      rating: 5,
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
      q: L("需要駕照嗎？", "Do I need a license?", "免許は必要ですか？", "면허가 필요한가요?"),
      a: L(
        "需要。請攜帶有效駕照，或 1949 年日內瓦公約國際駕駛許可。沒有駕照不能上路。",
        "Yes. Bring a valid license or a 1949 Geneva International Driving Permit. No license, no ride.",
        "有効な運転免許証、または1949年ジュネーブ条約に基づく国際運転免許証をご持参ください。免許証をお持ちでない方は走行できません。",
        "필요합니다. 유효 면허 또는 1949년 제네바 협약 국제운전면허를 지참하세요. 면허 없이는 주행할 수 없습니다.",
      ),
    },
    {
      id: "f2",
      home: true,
      active: true,
      sort: 2,
      q: L("服裝包含嗎？", "Are costumes included?", "衣装は含まれていますか？", "의상이 포함되나요?"),
      a: L(
        "含賽車服和頭盔。高級角色服裝可在預約時加購。",
        "A racing suit and helmet are included. Premium character costumes can be added at booking.",
        "レーシングスーツとヘルメットが含まれています。プレミアムキャラクター衣装は、ご予約時に追加できます。",
        "레이싱 슈트와 헬멧이 포함됩니다. 프리미엄 캐릭터 의상은 예약 시 추가할 수 있습니다.",
      ),
    },
    {
      id: "f3",
      home: true,
      active: true,
      sort: 3,
      q: L("在哪裡集合？", "Where do we meet?", "集合場所はどこですか？", "어디서 모이나요?"),
      a: L(
        "集合在難波・道頓堀，おおきに道頓堀ビル。從難波站步行約 5 分鐘。",
        "We meet at おおきに道頓堀ビル in Kozu, near Namba / Dotonbori. About 5 min walk from Namba Station.",
        "大阪・難波周辺です。正確な集合場所は、ご予約後にお送りします。",
        "집합은 난바·도톤보리의 おおきに道頓堀ビル. 난바역에서 도보 약 5분.",
      ),
    },
    {
      id: "f4",
      home: true,
      active: true,
      sort: 4,
      q: L("下雨怎麼辦？", "What if it rains?", "雨の場合はどうなりますか？", "비가 오면요?"),
      a: L(
        "小雨提供雨衣、通常照常出發。暴雨或颱風：免費改期或全額退款。",
        "Light rain: ponchos, we usually go. Storms or typhoons: free reschedule or full refund.",
        "小雨の場合はレインコートをご用意し、通常どおり実施します。大雨や台風の場合は、無料での日程変更または全額返金に対応します。",
        "가랑비는 우의를 제공하고 보통 진행합니다. 폭우/태풍은 무료 일정 변경 또는 전액 환불.",
      ),
    },
    {
      id: "f5",
      home: true,
      active: true,
      sort: 5,
      q: L("年齡要求？", "Age requirement?", "年齢制限はありますか？", "나이 제한이 있나요?"),
      a: L(
        "駕駛員須年滿 18 歲並持有有效駕照。兒童可作為乘客搭乘，請先確認空位。",
        "Drivers must be 18+ with a valid license. Children may ride as passengers if a seat is available.",
        "運転者は18歳以上で、有効な運転免許証が必要です。お子さまが同乗できる場合もありますので、事前に空き状況をご確認ください。",
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
        "取決於駕照簽發地。美國、加拿大、澳洲須出示紙本國際駕照（小冊子，分類 A–E）或 SOFA。比利時、法國、德國、摩納哥、斯洛維尼亞、瑞士、台灣可出示原始駕照加官方日文譯本。其他國家須持 1949 年日內瓦公約國際駕照。塑膠卡無效。",
        "It depends on where the licence was issued. US, Canada and Australia need a paper IDP booklet (categories A–E) or SOFA ID. Belgium, France, Germany, Monaco, Slovenia, Switzerland and Taiwan may use the original licence plus an official Japanese translation. Others need a 1949 Geneva IDP. Plastic IDP cards are not accepted.",
        "発行地によります。米国・カナダ・オーストラリアは冊子の国際免許（区分A〜E）またはSOFAが必要です。ベルギー、フランス、ドイツ、モナコ、スロベニア、スイス、台湾は原本の免許と公式日本語翻訳で参加できます。その他は1949年ジュネーブ条約の国際免許が必要です。プラスチックカードは無効です。",
        "발급지에 따라 다릅니다. 미국·캐나다·호주는 종이 IDP 소책자(분류 A–E) 또는 SOFA가 필요합니다. 벨기에, 프랑스, 독일, 모나코, 슬로베니아, 스위스, 대만은 원본 면허와 공식 일본어 번역본으로 가능합니다. 그 외는 1949년 제네바 협약 국제면허가 필요합니다. 플라스틱 카드는 무효입니다.",
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
        "駕駛員身高必須介於 150–190 公分。體重上限以現場車輛為準，報到時工作人員會幫你確認座艙是否合適。",
        "Drivers must be between 150 and 190 cm. Weight depends on the kart that day — staff check the seat at check-in.",
        "運転者の身長は150〜190cm。体重は当日の車両によります。受付でシートが合うか確認します。",
        "운전자 신장은 150–190cm여야 합니다. 체중 제한은 당일 차량에 따릅니다. 체크인 때 좌석을 확인합니다.",
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
        "コスチューム、隊列、カメラ。旅の思い出を彩るストリート体験。",
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
      image: "/images/hero/poster.webp",
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
    address: L(
      "〒542-0072 大阪市中央區高津2丁目4-21 おおきに道頓堀ビル",
      "〒542-0072 Osaka, Chuo Ward, Kozu, 2 Chome−4−21 おおきに道頓堀ビル",
      "大阪・難波周辺",
      "〒542-0072 오사카시 주오구 고즈 2초메 4-21 おおきに道頓堀ビル",
    ),
    station: L("難波站", "Namba Station", "難波駅", "난바역"),
    walk: L("從難波站步行約 5 分鐘。", "About 5 min walk from Namba Station.", "難波駅から徒歩約5分。", "난바역에서 도보 약 5분."),
    lead: L(
      "集合在難波・道頓堀。大樓門口見。",
      "Meet in Namba / Dotonbori, at the building entrance.",
      "集合場所は難波周辺です。正確な集合場所はご予約後にお送りします。",
      "집합은 난바·도톤보리. 건물 입구에서 만납니다.",
    ),
    mapsUrl: "https://maps.app.goo.gl/wLwUcA8YABaQCB6p8",
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
      tripadvisor: SITE_CONTACT.tripadvisor,
    },
    socialDock: { ...DEFAULT_SOCIAL_DOCK },
    footerCompany: L("Future Kart Osaka · 大阪", "Future Kart Osaka · Osaka, Japan", "Future Kart Osaka · 大阪", "Future Kart Osaka · 오사카"),
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
    pageUrl: "",
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
    platform: "",
    url: "",
    rating: 5,
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

export function isCustomCmsVideo(item: CmsVideo) {
  const file = item.file?.trim() ?? "";
  if (file.startsWith("data:") || file.startsWith("blob:")) return true;
  if (file.startsWith("http://") || file.startsWith("https://")) return true;
  if (item.source === "facebook" || item.source === "instagram") {
    return Boolean(item.pageUrl?.trim());
  }
  if (item.source === "youtube") {
    const id = item.youtubeId?.trim() ?? "";
    return Boolean(id) && id !== "aqz-KE-bpKQ";
  }
  return false;
}

export function refreshBundledReviews(seed: CmsReview[], extra?: CmsReview[]) {
  if (!Array.isArray(extra) || extra.length === 0) return seed;
  const extraById = new Map(extra.map((item) => [item.id, item]));
  const seedIds = new Set(seed.map((item) => item.id));
  const merged = seed.map((seedItem) => {
    const prev = extraById.get(seedItem.id);
    if (!prev) return seedItem;
    return {
      ...seedItem,
      ...prev,
      platform: prev.platform?.trim() || seedItem.platform,
      url: prev.url?.trim() || seedItem.url,
      rating: prev.rating ?? seedItem.rating,
    };
  });
  return [...merged, ...extra.filter((item) => !seedIds.has(item.id))];
}

function mergeVideos(seed: CmsVideo[], extra?: CmsVideo[]) {
  if (!Array.isArray(extra) || extra.length === 0) return seed;
  const rest = extra.filter((item) => item.slot !== "experience");
  const xpExtra = extra.filter((item) => item.slot === "experience");
  const seedRest = seed.filter((item) => item.slot !== "experience");
  return [...(rest.length ? rest : seedRest), ...xpExtra];
}

export function refreshBundledVideos(seed: CmsVideo[], extra?: CmsVideo[]) {
  if (!Array.isArray(extra) || extra.length === 0) return seed;
  const extraById = new Map(extra.map((item) => [item.id, item]));
  const seedIds = new Set(seed.map((item) => item.id));
  const extraXpIds = new Set(extra.filter((item) => item.slot === "experience").map((item) => item.id));
  const merged = seed
    .filter((seedItem) => seedItem.slot !== "experience" || extraXpIds.has(seedItem.id))
    .map((seedItem) => {
      const extraItem = extraById.get(seedItem.id);
      if (extraItem && isCustomCmsVideo(extraItem)) return { ...seedItem, ...extraItem };
      return extraItem ?? seedItem;
    });
  const customExtra = extra.filter(
    (item) => !seedIds.has(item.id) && (item.slot === "experience" || isCustomCmsVideo(item)),
  );
  return [...merged, ...customExtra];
}

export function rewriteBundledMediaPath(value?: string) {
  if (!value) return value;
  return value.replace(/\/images\/hero\/poster\.jpg$/i, "/images/hero/poster.webp");
}

function isBrokenCmsImage(value?: string) {
  const image = value?.trim() ?? "";
  if (!image) return true;
  return image.startsWith("data:") || image.startsWith("blob:");
}

export function refreshBundledPress(seed: CmsPress[], extra?: CmsPress[]) {
  const rewrite = (item: CmsPress, fallback?: string) => ({
    ...item,
    image: isBrokenCmsImage(item.image)
      ? (fallback || item.image)
      : (rewriteBundledMediaPath(item.image) ?? item.image),
  });
  if (!Array.isArray(extra) || extra.length === 0) {
    return seed.map((item) => rewrite(item));
  }
  const extraById = new Map(extra.map((item) => [item.id, item]));
  const seedIds = new Set(seed.map((item) => item.id));
  const merged = seed.map((seedItem) => {
    const prev = extraById.get(seedItem.id);
    if (!prev) return rewrite(seedItem);
    return rewrite({ ...seedItem, ...prev }, seedItem.image);
  });
  const custom = extra.filter((item) => !seedIds.has(item.id)).map((item) => rewrite(item));
  return [...merged, ...custom];
}

export function mergeCms(seed: CmsState, extra?: Partial<CmsState> | null): CmsState {
  if (!extra) return seed;
  return {
    videos: mergeVideos(seed.videos, extra.videos).map((item) => ({
      ...item,
      poster: rewriteBundledMediaPath(item.poster) ?? item.poster,
    })),
    reviews: refreshBundledReviews(seed.reviews, extra.reviews),
    faqs: extra.faqs?.length
      ? (() => {
          const extraById = new Map(extra.faqs.map((item) => [item.id, item]));
          const seedIds = new Set(seed.faqs.map((item) => item.id));
          return [
            ...seed.faqs.map((item) => {
              const prev = extraById.get(item.id);
              return prev ? { ...prev, ...item, active: prev.active, sort: prev.sort } : item;
            }),
            ...extra.faqs.filter((item) => !seedIds.has(item.id)),
          ];
        })()
      : seed.faqs,
    press: refreshBundledPress(seed.press, extra.press),
    meetup: extra.meetup ? { ...seed.meetup, ...extra.meetup } : seed.meetup,
    howToBook: extra.howToBook ? { ...seed.howToBook, ...extra.howToBook } : seed.howToBook,
    site: extra.site
      ? {
          ...seed.site,
          ...extra.site,
          social: { ...seed.site.social, ...extra.site.social },
          socialDock: socialDockOf({ socialDock: { ...seed.site.socialDock, ...extra.site.socialDock } }),
        }
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
