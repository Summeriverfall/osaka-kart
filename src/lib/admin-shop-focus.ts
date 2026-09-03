"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { DEFAULT_STORE_ID, isAllStores, storeIdOf } from "@/lib/store-id";
import { useStoreData } from "@/lib/use-store-data";

const KEY = "ok-admin-shop-focus";

type ShopFocusState = {
  focusStore: string;
  setFocusStore: (id: string) => void;
};

export const useShopFocusStore = create<ShopFocusState>((set) => ({
  focusStore: DEFAULT_STORE_ID,
  setFocusStore: (focusStore) => {
    set({ focusStore });
    try {
      localStorage.setItem(KEY, focusStore);
    } catch {
      /* ignore */
    }
  },
}));

function hydrateShopFocus() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) useShopFocusStore.setState({ focusStore: saved });
  } catch {
    /* ignore */
  }
}

export function useAdminShopFocus() {
  const { storeId, stores, canSwitch } = useStoreData();
  const focusStore = useShopFocusStore((state) => state.focusStore);
  const setFocusStore = useShopFocusStore((state) => state.setFocusStore);

  useEffect(() => {
    hydrateShopFocus();
  }, []);

  const shopId = isAllStores(storeId) ? storeIdOf(focusStore) : storeIdOf(storeId);
  return {
    shopId,
    focusStore,
    setFocusStore,
    showPills: Boolean(canSwitch && isAllStores(storeId)),
    stores,
    storeId,
  };
}
