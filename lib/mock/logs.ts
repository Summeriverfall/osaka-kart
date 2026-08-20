export type LogType = "登录" | "登出" | "订单修改" | "库存调整" | "套餐上下架" | "员工变更";

export type MockLog = {
  id: string;
  time: string;
  actor: string;
  role: string;
  type: LogType;
  detail: string;
  ip: string;
};

export const MOCK_LOGS: MockLog[] = [
  { id: "l1", time: "2026-08-20 16:12", actor: "Aya Chen", role: "超管", type: "登录", detail: "后台登录", ip: "203.180.12.4" },
  { id: "l2", time: "2026-08-20 16:14", actor: "Aya Chen", role: "超管", type: "套餐上下架", detail: "夜间霓虹 90 分钟 上架", ip: "203.180.12.4" },
  { id: "l3", time: "2026-08-20 15:41", actor: "佐藤 翼", role: "店长", type: "登录", detail: "手机后台登录", ip: "126.20.88.19" },
  { id: "l4", time: "2026-08-20 15:44", actor: "佐藤 翼", role: "店长", type: "订单修改", detail: "确认 FK-260820-001", ip: "126.20.88.19" },
  { id: "l5", time: "2026-08-20 14:08", actor: "佐藤 翼", role: "店长", type: "库存调整", detail: "08-20 10:00 余位改为 2", ip: "126.20.88.19" },
  { id: "l6", time: "2026-08-20 12:18", actor: "Mina Park", role: "员工", type: "订单修改", detail: "WhatsApp 录单 FK-260820-011", ip: "126.20.88.21" },
  { id: "l7", time: "2026-08-20 11:02", actor: "Aya Chen", role: "超管", type: "员工变更", detail: "停用 Yuki Mori", ip: "203.180.12.4" },
  { id: "l8", time: "2026-08-20 10:01", actor: "佐藤 翼", role: "店长", type: "订单修改", detail: "确认 FK-260820-003", ip: "126.20.88.19" },
  { id: "l9", time: "2026-08-19 19:22", actor: "Aya Chen", role: "超管", type: "套餐上下架", detail: "更新通天阁英文文案", ip: "203.180.12.4" },
  { id: "l10", time: "2026-08-19 18:40", actor: "佐藤 翼", role: "店长", type: "订单修改", detail: "完成 FK-260819-012", ip: "126.20.88.19" },
  { id: "l11", time: "2026-08-19 09:05", actor: "佐藤 翼", role: "店长", type: "订单修改", detail: "取消 FK-260819-008", ip: "126.20.88.19" },
  { id: "l12", time: "2026-08-19 08:50", actor: "Mina Park", role: "员工", type: "登录", detail: "前台登录", ip: "126.20.88.21" },
  { id: "l13", time: "2026-08-18 21:10", actor: "Leo Huang", role: "员工", type: "登出", detail: "夜班结束", ip: "126.20.88.22" },
  { id: "l14", time: "2026-08-18 19:05", actor: "系统", role: "系统", type: "订单修改", detail: "完成 FK-260818-007", ip: "127.0.0.1" },
  { id: "l15", time: "2026-08-18 14:33", actor: "Aya Chen", role: "超管", type: "库存调整", detail: "08-25 标记台风休业", ip: "203.180.12.4" },
  { id: "l16", time: "2026-08-18 09:22", actor: "Chris Ng", role: "店长", type: "登录", detail: "预留店查看", ip: "126.40.11.8" },
  { id: "l17", time: "2026-08-17 20:18", actor: "佐藤 翼", role: "店长", type: "库存调整", detail: "08-22 夜跑加场", ip: "126.20.88.19" },
  { id: "l18", time: "2026-08-17 11:04", actor: "Aya Chen", role: "超管", type: "员工变更", detail: "新增 Leo Huang", ip: "203.180.12.4" },
  { id: "l19", time: "2026-08-16 16:40", actor: "Aya Chen", role: "超管", type: "套餐上下架", detail: "黄昏湾岸 45 分钟 上架", ip: "203.180.12.4" },
  { id: "l20", time: "2026-08-16 09:01", actor: "佐藤 翼", role: "店长", type: "登录", detail: "早班登录", ip: "126.20.88.19" },
];
