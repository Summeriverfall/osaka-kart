export type AffiliateStatus = "active" | "paused";

export type MockAffiliate = {
  id: string;
  name: string;
  code: string;
  note: string;
  channel: string;
  commissionPct: number;
  status: AffiliateStatus;
};

export const MOCK_AFFILIATES: MockAffiliate[] = [
  {
    id: "af-yuki",
    name: "Yuki Tanaka",
    code: "YUKI10",
    note: "Instagram 夜跑达人，大阪本地内容。",
    channel: "Instagram",
    commissionPct: 10,
    status: "active",
  },
  {
    id: "af-mei",
    name: "Mei Wong",
    code: "MEI08",
    note: "Klook / 小红书向导合作。",
    channel: "Klook",
    commissionPct: 8,
    status: "active",
  },
  {
    id: "af-chen",
    name: "陈浩宇",
    code: "HAOYU12",
    note: "微信社群与旅行团。",
    channel: "微信",
    commissionPct: 12,
    status: "active",
  },
  {
    id: "af-park",
    name: "박서연",
    code: "PARK05",
    note: "韩国游客 TikTok 引流。",
    channel: "TikTok",
    commissionPct: 5,
    status: "paused",
  },
];

export const MOCK_AFFILIATE_IDS = MOCK_AFFILIATES.map((item) => item.id);

export function blankAffiliate(): MockAffiliate {
  return {
    id: `af-${Date.now().toString(36)}`,
    name: "",
    code: "",
    note: "",
    channel: "官网",
    commissionPct: 10,
    status: "active",
  };
}
