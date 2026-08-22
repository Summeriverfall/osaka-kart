"use client";

import { ChevronDown } from "lucide-react";
import { ALL_STORES_ID } from "@/lib/store-id";
import { useStoreScope } from "@/lib/store-scope";
import { cn } from "@/lib/utils";

export function StoreSwitcher() {
  const { store, stores, canSwitch, setStoreId, storeId } = useStoreScope();
  const name = store?.name ?? "难波本店";

  return (
    <div className={cn("store-switch", !canSwitch && "is-locked")}>
      <strong className="store-switch-name">{name}</strong>
      {canSwitch ? (
        <>
          <ChevronDown className="store-switch-caret size-3.5" aria-hidden />
          <select
            className="store-switch-select"
            value={storeId}
            aria-label="切换店铺"
            onChange={(event) => setStoreId(event.target.value)}
          >
            <option value={ALL_STORES_ID}>全部店铺</option>
            {stores.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </>
      ) : null}
    </div>
  );
}
