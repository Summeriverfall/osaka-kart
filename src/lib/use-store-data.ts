import { useMemo } from "react";
import { DEFAULT_STORE_ID, isAllStores, storeIdOf } from "@/lib/store-id";
import { useStoreScope } from "@/lib/store-scope";
import { type MockPlan } from "@/lib/mock/plans";
import { useOpsStore } from "@/stores/ops-store";

function planAtStore(plan: MockPlan, storeId: string) {
  if (!plan.storeIds || plan.storeIds.length === 0) return true;
  return plan.storeIds.includes(storeId);
}

export function useStoreData() {
  const scope = useStoreScope();
  const { storeId } = scope;
  const logsAll = useOpsStore((state) => state.logs);
  const ordersAll = useOpsStore((state) => state.orders);
  const vehiclesAll = useOpsStore((state) => state.vehicles);
  const staffAll = useOpsStore((state) => state.staff);
  const plansAll = useOpsStore((state) => state.plans);
  const slotsAll = useOpsStore((state) => state.vehicleSlots);
  const specialAll = useOpsStore((state) => state.specialDates);

  const vehicles = useMemo(
    () => (isAllStores(storeId) ? vehiclesAll : vehiclesAll.filter((item) => storeIdOf(item.storeId) === storeId)),
    [vehiclesAll, storeId],
  );
  const vehicleIds = useMemo(() => new Set(vehicles.map((item) => item.id)), [vehicles]);
  const orders = useMemo(() => {
    return isAllStores(storeId)
      ? ordersAll
      : ordersAll.filter((item) => storeIdOf(item.storeId) === storeId);
  }, [ordersAll, storeId]);
  const staff = useMemo(
    () => (isAllStores(storeId) ? staffAll : staffAll.filter((item) => storeIdOf(item.storeId) === storeId)),
    [staffAll, storeId],
  );
  const plans = useMemo(
    () => (isAllStores(storeId) ? plansAll : plansAll.filter((item) => planAtStore(item, storeId))),
    [plansAll, storeId],
  );
  const vehicleSlots = useMemo(
    () => (isAllStores(storeId) ? slotsAll : slotsAll.filter((item) => vehicleIds.has(item.vehicleId))),
    [slotsAll, vehicleIds, storeId],
  );
  const specialDates = useMemo(
    () =>
      isAllStores(storeId)
        ? specialAll
        : specialAll.filter((item) => !item.storeId || storeIdOf(item.storeId) === storeId),
    [specialAll, storeId],
  );
  const logs = useMemo(
    () => (isAllStores(storeId) ? logsAll : logsAll.filter((item) => storeIdOf(item.storeId) === storeId)),
    [logsAll, storeId],
  );

  return {
    ...scope,
    defaultStoreId: DEFAULT_STORE_ID,
    orders,
    vehicles,
    staff,
    plans,
    vehicleSlots,
    specialDates,
    logs,
  };
}
