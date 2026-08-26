"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Store } from "lucide-react";
import { useLocale } from "next-intl";
import { adminCopy, adminStoreName, adminStoreStatus } from "@/lib/admin/copy";
import { ALL_STORES_ID } from "@/lib/store-id";
import { useStoreScope } from "@/lib/store-scope";
import { cn } from "@/lib/utils";

export function StoreSwitcher() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const { store, stores, canSwitch, setStoreId, storeId } = useStoreScope();
  const name = store ? adminStoreName(locale, store.id, store.name) : copy.nambaStore;
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

  const options = [
    { id: ALL_STORES_ID, name: copy.store.all, status: "营业中" as const },
    ...stores,
  ];

  return (
    <div ref={rootRef} className={cn("store-switch", !canSwitch && "is-locked", open && "is-open")}>
      {canSwitch ? (
        <button
          type="button"
          className="store-switch-trigger"
          aria-label={copy.store.switchAria}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
        >
          <Store className="store-switch-mark" aria-hidden />
          <span className="store-switch-name">{isAll(storeId) ? copy.store.all : name}</span>
          <ChevronDown className="store-switch-caret" aria-hidden />
        </button>
      ) : (
        <span className="store-switch-trigger" title={copy.store.locked}>
          <Store className="store-switch-mark" aria-hidden />
          <span className="store-switch-name">{name}</span>
        </span>
      )}

      {canSwitch && open ? (
        <ul id={listId} className="store-switch-menu" role="listbox" aria-label={copy.store.shops}>
          {options.map((item) => {
            const active = item.id === storeId;
            const reserved = item.status === "预留";
            const label = item.id === ALL_STORES_ID ? copy.store.all : adminStoreName(locale, item.id, item.name);
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
                    <span className="store-switch-option-name">{label}</span>
                    <span className="store-switch-option-meta">
                      {item.id === ALL_STORES_ID ? copy.store.allSum : adminStoreStatus(locale, reserved ? "预留" : "营业中")}
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

function isAll(id: string) {
  return id === ALL_STORES_ID;
}
