import { japanAppointmentPassed } from "@/lib/japan-time";
import { sendNewBookingMail } from "@/lib/ops-notify";
import { readStoredPromoCode } from "@/lib/promo";
import { BOOKING_RESULT_KEY, useBookingStore, type BookingResult } from "@/stores/booking-store";
import { useOpsStore } from "@/stores/ops-store";

export function finalizePaidBooking(result: BookingResult) {
  if (japanAppointmentPassed(result.date, result.time)) {
    return { ok: false as const, reason: "time-passed" as const };
  }
  const committed = useOpsStore.getState().commitWebsiteBooking({
    ref: result.ref,
    planSlug: result.planSlug,
    planName: result.planName,
    riders: result.riders,
    date: result.date,
    time: result.time,
    addonSlugs: result.addonSlugs,
    name: result.name,
    email: result.email,
    phone: result.phone,
    passport: result.passport,
    nationality: result.nationality,
    licenceCountry: result.licenceCountry,
    note: result.note,
    totalJpy: result.totalJpy,
    storeId: result.storeId,
    affiliateCode: result.affiliateCode || useBookingStore.getState().affiliateCode || readStoredPromoCode(),
  });
  if (!committed.ok) {
    return { ok: false as const, reason: "time-passed" as const };
  }
  const next = { ...result, paid: true, synced: committed.ok };
  sessionStorage.setItem(BOOKING_RESULT_KEY, JSON.stringify(next));
  if (committed.ok && !committed.already && committed.order) {
    void sendNewBookingMail(committed.order, useOpsStore.getState().settings);
  }
  return { ok: true as const, already: committed.already, result: next };
}
