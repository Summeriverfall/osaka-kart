export type StaffRole = "admin" | "manager" | "staff";

export type MockStaff = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  store: string;
  active: boolean;
  lastLogin: string;
};

export const STAFF_ROLE_LABEL: Record<StaffRole, string> = {
  admin: "超管",
  manager: "店长",
  staff: "员工",
};

export const MOCK_STAFF: MockStaff[] = [
  { id: "s1", name: "Aya Chen", email: "admin@test.com", role: "admin", store: "难波本店", active: true, lastLogin: "2026-08-20 16:02" },
  { id: "s2", name: "佐藤 翼", email: "manager@test.com", role: "manager", store: "难波本店", active: true, lastLogin: "2026-08-20 15:41" },
  { id: "s3", name: "Mina Park", email: "mina@osakakart.jp", role: "staff", store: "难波本店", active: true, lastLogin: "2026-08-20 12:18" },
  { id: "s4", name: "Leo Huang", email: "leo@osakakart.jp", role: "staff", store: "难波本店", active: true, lastLogin: "2026-08-19 19:04" },
  { id: "s5", name: "Yuki Mori", email: "yuki@osakakart.jp", role: "staff", store: "难波本店", active: false, lastLogin: "2026-07-02 10:11" },
  { id: "s6", name: "Chris Ng", email: "chris@osakakart.jp", role: "manager", store: "预留·心斋桥", active: true, lastLogin: "2026-08-18 09:22" },
];
