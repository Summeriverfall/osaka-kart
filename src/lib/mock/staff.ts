import type { PermFlags, PermModule } from "./permissions";

export type StaffRole = "admin" | "manager" | "staff";

export type MockStaff = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  store: string;
  storeId?: string;
  active: boolean;
  lastLogin: string;
  roleId?: string;
  permOverrides?: Partial<Record<PermModule, PermFlags>>;
};

export const STAFF_ROLE_LABEL: Record<StaffRole, string> = {
  admin: "超管",
  manager: "店长",
  staff: "员工",
};

export const MOCK_STAFF: MockStaff[] = [
  { id: "s1", name: "Aya Chen", email: "admin@test.com", role: "admin", store: "难波本店", storeId: "namba", active: true, lastLogin: "2026-08-20 16:02", roleId: "role-admin" },
  { id: "s2", name: "佐藤 翼", email: "manager@test.com", role: "manager", store: "难波本店", storeId: "namba", active: true, lastLogin: "2026-08-20 15:41", roleId: "role-manager" },
  { id: "s3", name: "Mina Park", email: "mina@osakakart.jp", role: "staff", store: "难波本店", storeId: "namba", active: true, lastLogin: "2026-08-20 12:18", roleId: "role-staff" },
  { id: "s4", name: "Leo Huang", email: "leo@osakakart.jp", role: "staff", store: "难波本店", storeId: "namba", active: true, lastLogin: "2026-08-19 19:04", roleId: "role-staff" },
  { id: "s5", name: "Yuki Mori", email: "yuki@osakakart.jp", role: "staff", store: "难波本店", storeId: "namba", active: false, lastLogin: "2026-07-02 10:11", roleId: "role-staff" },
  { id: "s6", name: "Chris Ng", email: "chris@osakakart.jp", role: "manager", store: "心斋桥（预留）", storeId: "shinsaibashi", active: true, lastLogin: "2026-08-18 09:22", roleId: "role-manager" },
  { id: "s7", name: "田中 美咲", email: "misaki@osakakart.jp", role: "manager", store: "梅田（预留）", storeId: "umeda", active: true, lastLogin: "2026-08-10 11:05", roleId: "role-manager" },
];
