import { useMemo } from "react";
import { MOCK_STORES } from "@/lib/mock/settings";
import { boundStoreIdFromEmail } from "@/lib/staff-bind";
import { ALL_STORES_ID, DEFAULT_STORE_ID } from "@/lib/store-id";
import { useAdminStore } from "@/stores/admin-store";
import { useOpsStore } from "@/stores/ops-store";

export { DEFAULT_STORE_ID, storeIdOf } from "@/lib/store-id";

export function useStoreScope() {
  const role = useAdminStore((state) => state.role);
  const email = useAdminStore((state) => state.email);
  const persistedId = useAdminStore((state) => state.storeId);
  const setStoreId = useAdminStore((state) => state.setStoreId);
  const stores = useOpsStore((state) => state.stores);
  const list = stores.length ? stores : MOCK_STORES;
  const storeId = role === "manager" ? boundStoreIdFromEmail(email) : persistedId || ALL_STORES_ID;
  const allStore = useMemo(
    () => ({
      id: ALL_STORES_ID,
      name: "全部店铺",
      address: "",
      phone: "",
      hours: "",
      maps: "",
      status: "营业中" as const,
      created: "",
    }),
    [],
  );
  const current = useMemo(() => {
    if (storeId === ALL_STORES_ID) return allStore;
    return list.find((item) => item.id === storeId) ?? list[0] ?? MOCK_STORES[0];
  }, [list, storeId, allStore]);

  return {
    storeId: current?.id ?? DEFAULT_STORE_ID,
    store: current,
    stores: list,
    canSwitch: role === "admin",
    setStoreId,
  };
}
