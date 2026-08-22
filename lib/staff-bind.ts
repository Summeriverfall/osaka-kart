import { MOCK_STAFF } from "@/lib/mock/staff";
import { storeIdOf } from "@/lib/store-id";

export function staffRecordForEmail(email: string) {
  return MOCK_STAFF.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
}

export function boundStoreIdFromEmail(email: string) {
  return storeIdOf(staffRecordForEmail(email)?.storeId);
}

export function isSuperAdminEmail(email: string) {
  const staff = staffRecordForEmail(email);
  if (staff?.role === "admin") return true;
  if (staff?.role === "manager" || staff?.role === "staff") return false;
  return email.toLowerCase().includes("admin");
}
