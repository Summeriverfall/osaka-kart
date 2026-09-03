"use client";

import { useLocale } from "next-intl";
import { adminStoreName } from "@/lib/admin/copy";
import { b2Copy } from "@/lib/admin/b2-copy";
import { useAdminShopFocus } from "@/lib/admin-shop-focus";
import { cn } from "@/lib/utils";

type Props = {
  onChange?: () => void;
  className?: string;
};

export function AdminShopPills({ onChange, className }: Props) {
  const locale = useLocale();
  const b2 = b2Copy(locale);
  const { showPills, stores, focusStore, setFocusStore } = useAdminShopFocus();
  if (!showPills) return null;

  return (
    <div className={cn("fleet-storebar", className)}>
      <div className="fleet-stores">
        {stores.map((store) => (
          <button
            key={store.id}
            type="button"
            className={cn("ib-btn", focusStore === store.id && "is-on")}
            aria-pressed={focusStore === store.id}
            onClick={() => {
              setFocusStore(store.id);
              onChange?.();
            }}
          >
            {adminStoreName(locale, store.id, store.name)}
          </button>
        ))}
      </div>
      <p className="fleet-pick">{b2.pickStore}</p>
    </div>
  );
}
