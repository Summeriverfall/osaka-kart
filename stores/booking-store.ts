import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingDraft = {
  planSlug: string;
  riders: number;
  date: string;
  time: string;
  addonSlugs: string[];
  name: string;
  email: string;
  phone: string;
  licenseOk: boolean;
};

const emptyDraft: BookingDraft = {
  planSlug: "",
  riders: 1,
  date: "",
  time: "",
  addonSlugs: [],
  name: "",
  email: "",
  phone: "",
  licenseOk: false,
};

type BookingStore = BookingDraft & {
  patch: (next: Partial<BookingDraft>) => void;
  reset: () => void;
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      ...emptyDraft,
      patch: (next) => set(next),
      reset: () => set(emptyDraft),
    }),
    { name: "osaka-kart-booking" },
  ),
);

export const BOOKING_RESULT_KEY = "osaka-kart-last-booking";

export type BookingResult = BookingDraft & {
  ref: string;
  planName: string;
  totalJpy: number;
  paid?: boolean;
};
