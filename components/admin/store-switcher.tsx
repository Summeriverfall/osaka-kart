"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Store } from "lucide-react";
import { ALL_STORES_ID } from "@/lib/store-id";
import { useStoreScope } from "@/lib/store-scope";
import { cn } from "@/lib/utils";

export function StoreSwitcher() {
  const { store, stores, canSwitch, setStoreId, storeId } = useStoreScope();
  const name = store?.name ?? "难波本店";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const options = [{ id: ALL_STORES_ID, name: "全部店铺", status: "营业中" as const }, ...stores];

  return (
    <div ref={rootRef} className={cn("store-switch", !canSwitch && "is-locked", open && "is-open")}>
      {canSwitch ? (
        <button
          type="button"
          className="store-switch-trigger"
          aria-label="切换店铺"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
        >
          <Store className="store-switch-mark" aria-hidden />
          <span className="store-switch-name">{name}</span>
          <ChevronDown className="store-switch-caret" aria-hidden />
        </button>
      ) : (
        <span className="store-switch-trigger" title="店长仅能查看绑定门店">
          <Store className="store-switch-mark" aria-hidden />
          <span className="store-switch-name">{name}</span>
        </span>
      )}

      {canSwitch && open ? (
        <ul id={listId} className="store-switch-menu" role="listbox" aria-label="店铺">
          {options.map((item) => {
            const active = item.id === storeId;
            const reserved = item.status === "预留";
            return (
              <li key={item.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={cn("store-switch-option", active && "is-active")}
                  onClick={() => {
                    setStoreId(item.id);
                    setOpen(false);
                  }}
                >
                  <span className="store-switch-option-text">
                    <span className="store-switch-option-name">{item.name}</span>
                    <span className="store-switch-option-meta">
                      {item.id === ALL_STORES_ID ? "全店合计" : reserved ? "预留" : "营业中"}
                    </span>
                  </span>
                  {active ? <Check className="store-switch-check" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
