export type AffiliateStatus = "active" | "paused";

export type MockAffiliate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  code: string;
  note: string;
  channel: string;
  commissionPct: number;
  status: AffiliateStatus;
};

export const AFFILIATE_DEMO_PASSWORD = "agent123";

export const MOCK_AFFILIATES: MockAffiliate[] = [
  {
    id: "af-yuki",
    name: "Yuki Tanaka",
    email: "yuki@agent.test",
    phone: "+81-90-1000-0101",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "YUKI10",
    note: "Instagram 夜跑达人，大阪本地内容。",
    channel: "Instagram",
    commissionPct: 10,
    status: "active",
  },
  {
    id: "af-mei",
    name: "Mei Wong",
    email: "mei@agent.test",
    phone: "+852-6123-8800",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "MEI08",
    note: "Klook / 小红书向导合作。",
    channel: "Klook",
    commissionPct: 8,
    status: "active",
  },
  {
    id: "af-chen",
    name: "陈浩宇",
    email: "chen@agent.test",
    phone: "+86-138-0000-2211",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "HAOYU12",
    note: "微信社群与旅行团。",
    channel: "微信",
    commissionPct: 12,
    status: "active",
  },
  {
    id: "af-park",
    name: "박서연",
    email: "park@agent.test",
    phone: "+82-10-2222-0192",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "PARK05",
    note: "韩国游客 TikTok 引流。",
    channel: "TikTok",
    commissionPct: 5,
    status: "paused",
  },
  {
    id: "af-lisa",
    name: "Lisa Chen",
    email: "lisa@agent.test",
    phone: "+1-415-555-0144",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "LISA09",
    note: "旧金山旅行博主，主推夜跑。",
    channel: "Instagram",
    commissionPct: 9,
    status: "active",
  },
  {
    id: "af-rits",
    name: "Kenji Mori",
    email: "kenji@agent.test",
    phone: "+81-90-2000-3344",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "RITZ08",
    note: "丽思卡尔顿礼宾合作。",
    channel: "丽思卡尔顿酒店",
    commissionPct: 8,
    status: "active",
  },
  {
    id: "af-via",
    name: "Sophie Laurent",
    email: "sophie@agent.test",
    phone: "+33-6-12-00-88-21",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "VIA07",
    note: "Viator 向导与法语团。",
    channel: "Viator",
    commissionPct: 7,
    status: "active",
  },
  {
    id: "af-gyg",
    name: "Tom Becker",
    email: "tom@agent.test",
    phone: "+49-170-555-0199",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "GYG06",
    note: "GetYourGuide 德语市场。",
    channel: "GetYourGuide",
    commissionPct: 6,
    status: "active",
  },
  {
    id: "af-wa",
    name: "Aisha Rahman",
    email: "aisha@agent.test",
    phone: "+971-50-555-0190",
    password: AFFILIATE_DEMO_PASSWORD,
    code: "WA11",
    note: "WhatsApp 中东旅行群。",
    channel: "WhatsApp",
    commissionPct: 11,
    status: "active",
  },
];

export const MOCK_AFFILIATE_IDS = MOCK_AFFILIATES.map((item) => item.id);

export function generateAffiliateCode(name: string) {
  const stem = name
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .slice(0, 6)
    .toUpperCase() || "AGENT";
  const tail = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${stem}${tail}`.slice(0, 10);
}

export function hydrateAffiliate(row: Partial<MockAffiliate> & { id: string; name?: string; code?: string }): MockAffiliate {
  const seed = MOCK_AFFILIATES.find((item) => item.id === row.id);
  return {
    id: row.id,
    name: row.name || seed?.name || "Agent",
    email: row.email || seed?.email || `${row.id}@agent.test`,
    phone: row.phone || seed?.phone || "",
    password: row.password || seed?.password || AFFILIATE_DEMO_PASSWORD,
    code: (row.code || seed?.code || row.id.slice(-6)).toUpperCase(),
    note: row.note ?? seed?.note ?? "",
    channel: row.channel || seed?.channel || "官网",
    commissionPct: Number.isFinite(row.commissionPct) ? Number(row.commissionPct) : seed?.commissionPct ?? 10,
    status: row.status === "paused" ? "paused" : "active",
  };
}

export function blankAffiliate(): MockAffiliate {
  const id = `af-${Date.now().toString(36)}`;
  return {
    id,
    name: "",
    email: "",
    phone: "",
    password: AFFILIATE_DEMO_PASSWORD,
    code: generateAffiliateCode(id),
    note: "",
    channel: "官网",
    commissionPct: 10,
    status: "active",
  };
}

export function findAffiliateByCode(list: MockAffiliate[], code: string) {
  const key = code.trim().toUpperCase();
  if (!key) return undefined;
  return list.find((item) => item.code.toUpperCase() === key && item.status === "active");
}

export function findAffiliateByLogin(list: MockAffiliate[], email: string, password: string) {
  const mail = email.trim().toLowerCase();
  return list.find((item) => item.email.trim().toLowerCase() === mail && item.password === password && item.status === "active");
}

export function refreshBundledAffiliates(extra?: MockAffiliate[]) {
  const extraById = new Map((extra ?? []).map((item) => [item.id, item]));
  const seedIds = new Set(MOCK_AFFILIATES.map((item) => item.id));
  const merged = MOCK_AFFILIATES.map((seed) => {
    const prev = extraById.get(seed.id);
    return hydrateAffiliate(prev ? { ...seed, ...prev, id: seed.id } : seed);
  });
  const custom = (extra ?? []).filter((item) => !seedIds.has(item.id)).map(hydrateAffiliate);
  return [...merged, ...custom];
}
