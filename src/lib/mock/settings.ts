export type MockPayChannel = {
  id: string;
  name: string;
  enabled: boolean;
  reserved: boolean;
  testMode?: boolean;
  fieldLabel?: string;
  fieldValue?: string;
};

export type MockEmailTemplate = {
  id: string;
  type: string;
  locale: "zh-TW" | "en" | "ja";
  updated: string;
  body: string;
};

export type MockStore = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  maps: string;
  status: "营业中" | "预留";
  created: string;
};

export type MockBookChannel = {
  id: string;
  name?: string;
  enabled: boolean;
  locked?: boolean;
  cut: number;
  fieldLabel?: string;
  fieldValue?: string;
};

export type MockSettings = {
  paypay: boolean;
  stripe: boolean;
  onsite: boolean;
  klook: boolean;
  viator: boolean;
  applePay: boolean;
  googlePay: boolean;
  stripeKey: string;
  appleMerchant: string;
  googleMerchant: string;
  emailTemplate: string;
  mailFrom: string;
  mailTo: string;
  mailPublicKey: string;
  mailServiceId: string;
  mailTemplateId: string;
  payments: MockPayChannel[];
  channels: MockBookChannel[];
  removedChannelIds?: string[];
  refundPolicy?: string;
};

export const MOCK_PAYMENTS: MockPayChannel[] = [
  { id: "stripe", name: "VISA / Stripe", enabled: true, reserved: false, testMode: true, fieldLabel: "API Key", fieldValue: "sk_test_osaka_kart" },
  { id: "apple", name: "Apple Pay", enabled: true, reserved: false, fieldLabel: "Merchant ID", fieldValue: "merchant.jp.osakakart" },
  { id: "google", name: "Google Pay", enabled: false, reserved: false, fieldLabel: "Merchant ID", fieldValue: "" },
  { id: "alipay", name: "支付宝跨境", enabled: false, reserved: true },
  { id: "wechat", name: "微信支付跨境", enabled: false, reserved: true },
];

export const MOCK_BOOK_CHANNELS: MockBookChannel[] = [
  { id: "Klook", enabled: true, cut: 0.18, fieldLabel: "API Key", fieldValue: "" },
  { id: "官网", enabled: true, locked: true, cut: 0 },
  { id: "Instagram", enabled: true, cut: 0 },
  { id: "TikTok", enabled: true, cut: 0 },
  { id: "携程", enabled: true, cut: 0.15 },
  { id: "微信", enabled: true, cut: 0.05 },
  { id: "WhatsApp", enabled: true, cut: 0 },
  { id: "线下", enabled: true, cut: 0 },
];

const REMOVED_BOOK_CHANNELS = new Set(["Viator"]);

export function refreshBundledChannels(
  seed: MockBookChannel[],
  extra?: MockBookChannel[],
  removedIds: string[] = [],
) {
  const extraById = new Map((extra ?? []).map((item) => [item.id, item]));
  const seedIds = new Set(seed.map((item) => item.id));
  const removed = new Set([...removedIds, ...REMOVED_BOOK_CHANNELS]);
  const merged = seed
    .filter((seedItem) => {
      if (seedItem.locked) return true;
      if (REMOVED_BOOK_CHANNELS.has(seedItem.id)) return false;
      if (removed.has(seedItem.id) && !extraById.has(seedItem.id)) return false;
      return true;
    })
    .map((seedItem) => {
      const prev = extraById.get(seedItem.id);
      if (!prev) return seedItem;
      return {
        ...seedItem,
        ...prev,
        id: seedItem.id,
        locked: seedItem.locked,
      };
    });
  const custom = (extra ?? []).filter(
    (item) => !seedIds.has(item.id) && !REMOVED_BOOK_CHANNELS.has(item.id),
  );
  return [...merged, ...custom];
}

const TYPES = ["预订确认", "出发提醒", "退款通知", "回访评价"] as const;
const LOCALES = ["zh-TW", "en", "ja"] as const;

const EMAIL_BODIES: Record<(typeof TYPES)[number], Record<(typeof LOCALES)[number], string>> = {
  预订确认: {
    "zh-TW": `主旨：Future Kart Osaka 預訂確認 — {{booking_id}}

{{customer_name}} 您好，

您的大阪街頭卡丁車預約已確認。

預約編號：{{booking_id}}
出發日期：{{date}}
出發時間：{{time}}
套餐：{{plan_name}}
人數：{{riders}} 人
金額：{{total}}（含稅）

【集合】
請於出發時間前 15 分鐘抵達難波集合點，辦理報到與試穿裝備。確切門牌與地圖會在出發提醒信中再次發送。

【當日請攜帶】
・有效駕照：日本駕照，或 1949 年日內瓦公約國際駕照（IDP）+ 原駕照
・中國／韓國駕照無法在日本公路上單獨使用，須同時持有 1949 Geneva IDP
・本確認信或預約截圖

【行程說明】
目前套餐為難波 60 分鐘、通天閣 90 分鐘、大阪城 120 分鐘。服裝、安全帽與保險已含在費用內。未滿 18 歲無法駕駛。

如需改期或取消，請直接回覆本信，或致電 +81 6-7771-0100。

Future Kart Osaka
book@osakakart.jp`,
    en: `Subject: Future Kart Osaka booking confirmed — {{booking_id}}

Hi {{customer_name}},

Your street-kart booking is confirmed.

Booking ID: {{booking_id}}
Date: {{date}}
Start time: {{time}}
Course: {{plan_name}}
Riders: {{riders}}
Total: {{total}} (tax included)

Meet us in Namba 15 minutes before start. The exact pin is sent again in the departure reminder.

Bring a valid Japanese license, or a 1949 Geneva International Driving Permit plus your original license. Chinese and Korean licenses cannot be used on Japanese public roads without that IDP. Plastic IDP cards are not accepted. You must be 18 or older.

Courses are Namba 60, Tsutenkaku 90, and Osaka Castle 120. Suit, helmet, and insurance are included.

To change or cancel, reply to this email or call +81 6-7771-0100.

Future Kart Osaka
book@osakakart.jp`,
    ja: `件名：Future Kart Osaka 予約確定 — {{booking_id}}

{{customer_name}} 様

大阪ストリートカートのご予約が確定しました。

予約番号：{{booking_id}}
日付：{{date}}
出発時刻：{{time}}
コース：{{plan_name}}
人数：{{riders}} 名
金額：{{total}}（税込）

【集合】
出発の15分前に難波の集合場所へお越しください。正確なピンは出発リマインドメールでも再度お送りします。

【当日お持ちいただくもの】
・有効な日本の免許、または1949年ジュネーブ条約の国際免許証（IDP）+ 本国免許
・中国／韓国の免許のみでは日本の公道を走行できません
・本確認メールまたは予約画面のスクリーンショット

コースは難波60分、通天閣90分、大阪城120分です。ウェア・ヘルメット・保険は料金に含まれます。18歳未満は運転できません。

変更・キャンセルは本メールへの返信、または +81 6-7771-0100 までご連絡ください。

Future Kart Osaka
book@osakakart.jp`,
  },
  出发提醒: {
    "zh-TW": `主旨：出發提醒 — {{date}} {{time}}（{{booking_id}}）

{{customer_name}} 您好，

提醒您即將出發。

預約編號：{{booking_id}}
日期：{{date}}
時間：{{time}}
套餐：{{plan_name}}
人數：{{riders}} 人

請提前 15 分鐘抵達難波集合點報到、試穿裝備。遲到可能無法補時。

當日請務必攜帶駕照或 1949 Geneva IDP。小雨照常出發並提供雨衣；暴雨或颱風將協助免費改期。

集合點地圖與門牌請見本郵件／簡訊。如找不到集合點，請致電 +81 6-7771-0100。

Future Kart Osaka
book@osakakart.jp`,
    en: `Subject: Departure reminder — {{date}} {{time}} ({{booking_id}})

Hi {{customer_name}},

This is a reminder for your ride.

Booking ID: {{booking_id}}
Date: {{date}}
Time: {{time}}
Course: {{plan_name}}
Riders: {{riders}}

Please arrive at the Namba meeting point 15 minutes early for check-in and fitting. Late arrival may shorten the run.

Bring your license or 1949 Geneva IDP. Light rain still goes; we provide rainwear. Typhoon or heavy rain: we help you reschedule at no extra course fee.

If you cannot find the pin, call +81 6-7771-0100.

Future Kart Osaka
book@osakakart.jp`,
    ja: `件名：出発リマインド — {{date}} {{time}}（{{booking_id}}）

{{customer_name}} 様

まもなくご出発です。

予約番号：{{booking_id}}
日付：{{date}}
時刻：{{time}}
コース：{{plan_name}}
人数：{{riders}} 名

難波の集合場所へ15分前にお越しください。遅刻した場合、走行時間を延長できないことがあります。

当日は免許または1949年ジュネーブ条約IDPをお持ちください。小雨はレインウェアを用意して通常運行、台風・豪雨は無料で日程変更をご案内します。

集合場所が分からない場合は +81 6-7771-0100 までお電話ください。

Future Kart Osaka
book@osakakart.jp`,
  },
  退款通知: {
    "zh-TW": `主旨：退款通知 — {{booking_id}}

{{customer_name}} 您好，

您的預約已取消，退款已受理。

預約編號：{{booking_id}}
原定日期：{{date}} {{time}}
套餐：{{plan_name}}
退款金額：{{total}}

款項將退回原支付方式。到帳時間視發卡行或平台而定，通常約 5–14 個工作日。

如非您本人申請取消，請立即回覆本信。

Future Kart Osaka
book@osakakart.jp`,
    en: `Subject: Refund notice — {{booking_id}}

Hi {{customer_name}},

Your booking has been cancelled and a refund has been started.

Booking ID: {{booking_id}}
Original slot: {{date}} {{time}}
Course: {{plan_name}}
Refund amount: {{total}}

The refund goes back to the original payment method. Banks and platforms usually take 5–14 business days.

If you did not request this cancellation, reply to this email immediately.

Future Kart Osaka
book@osakakart.jp`,
    ja: `件名：返金のご案内 — {{booking_id}}

{{customer_name}} 様

ご予約はキャンセルされ、返金手続きを開始しました。

予約番号：{{booking_id}}
元の日時：{{date}} {{time}}
コース：{{plan_name}}
返金額：{{total}}

返金は元の支払い方法へ戻ります。反映まで通常5〜14営業日ほどかかります。

ご本人以外のキャンセルと思われる場合は、すぐに本メールへご返信ください。

Future Kart Osaka
book@osakakart.jp`,
  },
  回访评价: {
    "zh-TW": `主旨：謝謝您來大阪飆車 — 歡迎留下評價

{{customer_name}} 您好，

感謝您在 {{date}} {{time}} 參加 Future Kart Osaka（{{plan_name}}，預約號 {{booking_id}}）。

如果行程順利，歡迎在 Google 或 TripAdvisor 留下短評，幫助下一位旅客。
若有任何不愉快，也請直接回覆本信，我們會優先處理。

期待下次在難波街頭再見。

Future Kart Osaka
book@osakakart.jp`,
    en: `Subject: Thanks for riding in Osaka — a short review helps

Hi {{customer_name}},

Thank you for joining Future Kart Osaka on {{date}} {{time}} ({{plan_name}}, {{booking_id}}).

If the run went well, a short Google or TripAdvisor review helps the next rider. If anything was off, reply to this email and we will follow up first.

See you on the street.

Future Kart Osaka
book@osakakart.jp`,
    ja: `件名：大阪走行ありがとうございました — レビューのお願い

{{customer_name}} 様

{{date}} {{time}} の Future Kart Osaka（{{plan_name}}／{{booking_id}}）にご参加いただきありがとうございました。

ご満足いただけましたら Google または TripAdvisor に短い感想を残していただけると助かります。ご不満な点があれば本メールへご返信ください。優先して対応します。

また難波の街でお会いできることを楽しみにしています。

Future Kart Osaka
book@osakakart.jp`,
  },
};

export const MOCK_EMAIL_TEMPLATES: MockEmailTemplate[] = TYPES.flatMap((type) =>
  LOCALES.map((locale) => ({
    id: `${type}-${locale}`,
    type,
    locale,
    updated: "2026-08-18 11:20",
    body: EMAIL_BODIES[type][locale],
  })),
);

export const MOCK_STORES: MockStore[] = [
  {
    id: "namba",
    name: "难波本店",
    address: "〒542-0072 大阪府大阪市中央区高津2丁目4-21 おおきに道頓堀ビル",
    phone: "+81-6-0000-0000",
    hours: "10:00 – 21:00",
    maps: "https://www.google.com/maps/search/?api=1&query=%E3%81%8A%E3%81%8A%E3%81%8D%E3%81%AB%E9%81%93%E9%A0%93%E5%A0%80%E3%83%93%E3%83%AB",
    status: "营业中",
    created: "2025-11-01",
  },
  {
    id: "shinsaibashi",
    name: "心斋桥（预留）",
    address: "大阪市中央区心斋桥",
    phone: "待开通",
    hours: "待定",
    maps: "https://maps.google.com/?q=Shinsaibashi+Osaka",
    status: "预留",
    created: "2026-06-01",
  },
  {
    id: "umeda",
    name: "梅田（预留）",
    address: "大阪市北区梅田",
    phone: "待开通",
    hours: "待定",
    maps: "https://maps.google.com/?q=Umeda+Osaka",
    status: "预留",
    created: "2026-07-15",
  },
];

export const MOCK_SETTINGS: MockSettings = {
  paypay: true,
  stripe: true,
  onsite: true,
  klook: true,
  viator: false,
  applePay: true,
  googlePay: false,
  stripeKey: "sk_test_osaka_kart",
  appleMerchant: "merchant.jp.osakakart",
  googleMerchant: "",
  emailTemplate:
    "主旨：Future Kart Osaka 預訂確認 — {{booking_id}}\n\n{{customer_name}} 您好，您的預約已確認。{{date}} {{time}}，難波集合請提前 15 分鐘。",
  mailFrom: "",
  mailTo: "",
  mailPublicKey: "",
  mailServiceId: "",
  mailTemplateId: "",
  payments: MOCK_PAYMENTS,
  channels: MOCK_BOOK_CHANNELS,
  removedChannelIds: ["Viator"],
  refundPolicy: "出发前 24 小时取消退 50%。出发前不足 24 小时或 No-show 不退款。",
};
