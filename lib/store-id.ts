export const DEFAULT_STORE_ID = "namba";
export const ALL_STORES_ID = "all";

export function storeIdOf(id?: string | null) {
  return id || DEFAULT_STORE_ID;
}

export function isAllStores(id?: string | null) {
  return id === ALL_STORES_ID;
}
