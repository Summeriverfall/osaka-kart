export type VehicleStatus = "available" | "repair" | "retired";

export type MockVehicle = {
  id: string;
  code: string;
  model: string;
  status: VehicleStatus;
  lastService: string;
  note: string;
  logs: string[];
  logPhotos?: string[];
  storeId?: string;
};

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  available: "可用",
  repair: "维修中",
  retired: "停用",
};

export const MOCK_VEHICLES: MockVehicle[] = [
  { id: "v1", code: "OK-01", model: "Street Kart S", status: "available", lastService: "2026-08-12", note: "", logs: ["2026-08-12 常规保养"], logPhotos: [] },
  { id: "v2", code: "OK-02", model: "Street Kart S", status: "available", lastService: "2026-08-12", note: "", logs: ["2026-08-12 常规保养"] },
  { id: "v3", code: "OK-03", model: "Street Kart S", status: "repair", lastService: "2026-08-18", note: "刹车片更换", logs: ["2026-08-18 进厂", "2026-08-19 等待零件"] },
  { id: "v4", code: "OK-04", model: "Street Kart S", status: "available", lastService: "2026-08-10", note: "", logs: ["2026-08-10 换胎"] },
  { id: "v5", code: "OK-05", model: "Street Kart Pro", status: "available", lastService: "2026-08-08", note: "夜跑主力", logs: ["2026-08-08 灯组检查"] },
  { id: "v6", code: "OK-06", model: "Street Kart Pro", status: "available", lastService: "2026-08-08", note: "", logs: ["2026-08-08 灯组检查"] },
  { id: "v7", code: "OK-07", model: "Street Kart S", status: "available", lastService: "2026-07-30", note: "", logs: ["2026-07-30 常规保养"] },
  { id: "v8", code: "OK-08", model: "Street Kart S", status: "repair", lastService: "2026-08-19", note: "转向异响", logs: ["2026-08-19 进厂"] },
  { id: "v9", code: "OK-09", model: "Street Kart Lite", status: "available", lastService: "2026-08-01", note: "矮个子客人优先", logs: ["2026-08-01 座舱调整"] },
  { id: "v14", code: "OK-11", model: "Street Kart S", status: "available", lastService: "2026-08-20", note: "", logs: ["2026-08-20 入库"] },
  { id: "v15", code: "OK-12", model: "Street Kart S", status: "available", lastService: "2026-08-20", note: "", logs: ["2026-08-20 入库"] },
  { id: "v16", code: "OK-13", model: "Street Kart Pro", status: "available", lastService: "2026-08-20", note: "", logs: ["2026-08-20 入库"] },
  { id: "v10", code: "OK-10", model: "Street Kart Lite", status: "retired", lastService: "2026-06-20", note: "车架裂纹，停用待报废", logs: ["2026-06-20 停用"] },
  { id: "v11", code: "SK-01", model: "Street Kart S", status: "available", lastService: "2026-08-15", note: "心斋桥预留车", logs: ["2026-08-15 调拨"], storeId: "shinsaibashi" },
  { id: "v12", code: "SK-02", model: "Street Kart Pro", status: "available", lastService: "2026-08-15", note: "心斋桥预留车", logs: ["2026-08-15 调拨"], storeId: "shinsaibashi" },
  { id: "v13", code: "UM-01", model: "Street Kart S", status: "available", lastService: "2026-08-01", note: "梅田预留车", logs: ["2026-08-01 入库"], storeId: "umeda" },
];
