"use client";

import { useEffect } from "react";
import { readPromoQuery, rememberPromoCode, readStoredPromoCode } from "@/lib/promo";
import { useBookingStore } from "@/stores/booking-store";

export function PromoCapture() {
  const patch = useBookingStore((state) => state.patch);

  useEffect(() => {
    const fromQuery = readPromoQuery(window.location.search);
    if (fromQuery) rememberPromoCode(fromQuery);
    const code = fromQuery || readStoredPromoCode();
    if (code) patch({ affiliateCode: code });
  }, [patch]);

  return null;
}
