import { addDaysIso } from "@/lib/calendar";
import { todayIsoDate } from "@/lib/booking/slots";

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type OrderChannel = "官网" | "Klook" | "Viator" | "微信" | "WhatsApp" | "线下";

export type OrderLog = {
  time: string;
  actor: string;
  action: string;
  note: string;
};

export type MockOrder = {
  id: string;
  customer: string;
  nationality: string;
  email: string;
  phone: string;
  passport: string;
  planName: string;
  planSlug: string;
  date: string;
  time: string;
  riders: number;
  male: number;
  female: number;
  addons: string[];
  totalJpy: number;
  channel: OrderChannel;
  status: OrderStatus;
  paid: boolean;
  note: string;
  logs: OrderLog[];
  storeId?: string;
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "待确认",
  confirmed: "已确认",
  cancelled: "已取消",
  completed: "已完成",
};

export const CHANNELS: OrderChannel[] = ["Klook", "官网", "Viator", "微信", "WhatsApp", "线下"];

const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"] as const;

type GuestSeed = {
  customer: string;
  nationality: string;
  email: string;
  phone: string;
  passport: string;
  planName: string;
  planSlug: string;
  riders: number;
  male: number;
  female: number;
  addons: string[];
  totalJpy: number;
  channel: OrderChannel;
  note: string;
};

const GUESTS: GuestSeed[] = [
  { customer: "Alex Morgan", nationality: "USA", email: "alex.m@example.com", phone: "+1-415-555-0198", passport: "US5591021", planName: "难波 60 分钟", planSlug: "standard", riders: 2, male: 1, female: 1, addons: ["GoPro 租赁"], totalJpy: 28100, channel: "官网", note: "首次体验，需要英文向导。" },
  { customer: "林佳颖", nationality: "TW", email: "chia.lin@example.com", phone: "+886-912-555-017", passport: "TW3128891", planName: "通天阁 90 分钟", planSlug: "night-run", riders: 3, male: 1, female: 2, addons: ["赛车服升级", "专业跟拍照片"], totalJpy: 53400, channel: "Klook", note: "三人同行，希望同色赛车服。" },
  { customer: "김민준", nationality: "KR", email: "minjun.k@example.com", phone: "+82-10-5555-0192", passport: "KR8802143", planName: "大阪城 120 分钟", planSlug: "grand-tour", riders: 1, male: 1, female: 0, addons: ["额外保险"], totalJpy: 19300, channel: "Viator", note: "" },
  { customer: "Nora Patel", nationality: "UK", email: "nora.p@example.com", phone: "+44-7700-555-019", passport: "UK1029384", planName: "难波 60 分钟", planSlug: "standard", riders: 2, male: 0, female: 2, addons: ["GoPro 租赁", "额外保险"], totalJpy: 28600, channel: "WhatsApp", note: "到店付尾款。" },
  { customer: "陈浩宇", nationality: "CN", email: "haoyu.c@example.com", phone: "+86-138-5550-1120", passport: "CN E12345678", planName: "通天阁 90 分钟", planSlug: "night-run", riders: 2, male: 2, female: 0, addons: ["专业跟拍照片"], totalJpy: 34600, channel: "微信", note: "" },
  { customer: "Hannah Lee", nationality: "USA", email: "hannah.l@example.com", phone: "+1-310-555-0144", passport: "US4412098", planName: "大阪城 120 分钟", planSlug: "grand-tour", riders: 3, male: 1, female: 2, addons: ["赛车服升级"], totalJpy: 59400, channel: "Klook", note: "" },
  { customer: "Jonas Keller", nationality: "DE", email: "jonas.k@example.com", phone: "+49-170-555-0181", passport: "DE9981120", planName: "难波 60 分钟", planSlug: "standard", riders: 1, male: 1, female: 0, addons: [], totalJpy: 12800, channel: "Viator", note: "" },
  { customer: "Sophie Dubois", nationality: "FR", email: "sophie.d@example.com", phone: "+33-6-12-55-01-88", passport: "FR2201987", planName: "难波 60 分钟", planSlug: "standard", riders: 2, male: 0, female: 2, addons: ["专业跟拍照片"], totalJpy: 28600, channel: "官网", note: "要下午出片。" },
  { customer: "田中 翔", nationality: "JP", email: "sho.tanaka@example.com", phone: "+81-90-5555-0144", passport: "JP TK88021", planName: "通天阁 90 分钟", planSlug: "night-run", riders: 4, male: 3, female: 1, addons: ["GoPro 租赁", "赛车服升级"], totalJpy: 70200, channel: "线下", note: "公司团建。" },
  { customer: "Ryan Cole", nationality: "USA", email: "ryan.c@example.com", phone: "+1-646-555-0177", passport: "US7781203", planName: "黄昏湾岸 45 分钟", planSlug: "sunset", riders: 2, male: 2, female: 0, addons: ["GoPro 租赁"], totalJpy: 17500, channel: "Klook", note: "" },
  { customer: "Mei Wong", nationality: "SG", email: "mei.wong@example.com", phone: "+65-8555-0190", passport: "SG K192833", planName: "大阪城 120 分钟", planSlug: "grand-tour", riders: 2, male: 0, female: 2, addons: ["GoPro 租赁"], totalJpy: 40100, channel: "Klook", note: "" },
  { customer: "王磊", nationality: "CN", email: "lei.wang@example.com", phone: "+86-139-5550-2201", passport: "CN E87654321", planName: "夜间霓虹 90 分钟", planSlug: "vip-night", riders: 2, male: 1, female: 1, addons: ["专业跟拍照片", "额外保险"], totalJpy: 36500, channel: "微信", note: "想走道顿堀多停一次。" },
  { customer: "Emily Chen", nationality: "AU", email: "emily.chen@example.com", phone: "+61-412-555-016", passport: "AU 8891203", planName: "难波 60 分钟", planSlug: "standard", riders: 3, male: 1, female: 2, addons: ["赛车服升级"], totalJpy: 41400, channel: "Klook", note: "其中一位身高 158cm。" },
  { customer: "Luca Rossi", nationality: "IT", email: "luca.r@example.com", phone: "+39-347-555-0194", passport: "IT YA10293", planName: "大阪城 120 分钟", planSlug: "grand-tour", riders: 2, male: 1, female: 1, addons: ["GoPro 租赁", "专业跟拍照片"], totalJpy: 43100, channel: "官网", note: "希望尽量拍城堡背景。" },
];

function log(time: string, actor: string, action: string, note = ""): OrderLog {
  return { time, actor, action, note };
}

function storeOf(dayOffset: number, index: number) {
  if (index === 3 && dayOffset % 3 === 0) return "shinsaibashi";
  if (index === 2 && dayOffset % 2 === 0) return "umeda";
  return "namba";
}

function prefixOf(storeId: string) {
  if (storeId === "shinsaibashi") return "SK";
  if (storeId === "umeda") return "UM";
  return "FK";
}

function statusOf(dayOffset: number, index: number): OrderStatus {
  if (index === 1) return "pending";
  if (dayOffset <= -4 && index === 3) return "completed";
  if (dayOffset === -5 && index === 0) return "cancelled";
  return "confirmed";
}

export function isWebsiteLiveOrder(order: MockOrder) {
  return order.logs.some((item) => item.note === "官网支付" || item.action === "官网支付") || order.note.includes("官网支付完成");
}

export function buildWeekDemoOrders(today = todayIsoDate()): MockOrder[] {
  const rows: MockOrder[] = [];
  for (let offset = -6; offset <= 0; offset += 1) {
    const date = addDaysIso(today, offset);
    const compact = date.replace(/-/g, "").slice(2);
    for (let index = 0; index < 4; index += 1) {
      const guest = GUESTS[((offset + 6) * 4 + index) % GUESTS.length];
      const storeId = storeOf(offset, index);
      const status = statusOf(offset, index);
      const time = SLOTS[(index + Math.abs(offset)) % SLOTS.length];
      rows.push({
        ...guest,
        id: `${prefixOf(storeId)}-${compact}-${String(index + 1).padStart(3, "0")}`,
        date,
        time,
        status,
        paid: status !== "pending" || index % 2 === 0,
        storeId,
        logs: [
          log(`${addDaysIso(date, -1)} 18:20`, guest.channel, "创建订单"),
          ...(status === "confirmed" || status === "completed"
            ? [log(`${date} 09:10`, "店长 佐藤", "确认订单")]
            : []),
          ...(status === "completed" ? [log(`${date} 18:40`, "店长 佐藤", "标记完成")] : []),
          ...(status === "cancelled" ? [log(`${date} 08:02`, "店长 佐藤", "取消订单", "行程变更")] : []),
        ],
      });
    }
  }
  return rows;
}

export const MOCK_ORDERS: MockOrder[] = buildWeekDemoOrders();
export const MOCK_ORDER_IDS = MOCK_ORDERS.map((item) => item.id);
