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
  payments: MockPayChannel[];
};

export const MOCK_PAYMENTS: MockPayChannel[] = [
  { id: "stripe", name: "VISA / Stripe", enabled: true, reserved: false, testMode: true, fieldLabel: "API Key", fieldValue: "sk_test_osaka_kart" },
  { id: "apple", name: "Apple Pay", enabled: true, reserved: false, fieldLabel: "Merchant ID", fieldValue: "merchant.jp.osakakart" },
  { id: "google", name: "Google Pay", enabled: false, reserved: false, fieldLabel: "Merchant ID", fieldValue: "" },
  { id: "alipay", name: "支付宝跨境", enabled: false, reserved: true },
  { id: "wechat", name: "微信支付跨境", enabled: false, reserved: true },
];

const TYPES = ["预订确认", "出发提醒", "退款通知", "回访评价"] as const;
const LOCALES = ["zh-TW", "en", "ja"] as const;

export const MOCK_EMAIL_TEMPLATES: MockEmailTemplate[] = TYPES.flatMap((type) =>
  LOCALES.map((locale) => ({
    id: `${type}-${locale}`,
    type,
    locale,
    updated: "2026-08-18 11:20",
    body: `{{customer_name}} / {{booking_id}} / {{date}} {{time}}\n\n[${locale}] ${type} — Furture Kart Osaka`,
  })),
);

export const MOCK_STORES: MockStore[] = [
  {
    id: "namba",
    name: "难波本店",
    address: "大阪市中央区难波",
    phone: "+81-6-0000-0000",
    hours: "10:00 – 21:00",
    maps: "https://maps.google.com/?q=Namba+Station+Osaka",
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
    "Hi {{customer_name}},\n\nYour Furture Kart Osaka booking {{booking_id}} is confirmed for {{date}} {{time}}. Meet us in Namba 15 minutes early.\n\nSee you on the street.",
  payments: MOCK_PAYMENTS,
};
