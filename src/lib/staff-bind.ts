import { MOCK_STAFF } from "@/lib/mock/staff";
import { useOpsStore } from "@/stores/ops-store";
import { storeIdOf } from "@/lib/store-id";

export function staffRecordForEmail(email: string) {
  const needle = email.trim().toLowerCase();
  const live = typeof window !== "undefined" ? useOpsStore.getState().staff : [];
  return (live.length ? live : MOCK_STAFF).find((item) => item.email.toLowerCase() === needle);
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
