import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AddonItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
};

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

type BookingState = BookingDraft & {
  planId: string | null;
  planName: string;
  basePrice: number;
  addons: AddonItem[];
  totalPrice: number;
  setPlan: (id: string, slug: string, name: string, price: number) => void;
  setDate: (d: string) => void;
  setTimeSlot: (t: string) => void;
  addAddon: (addon: AddonItem) => void;
  removeAddon: (id: string) => void;
  updateAddonQty: (id: string, qty: number) => void;
  calcTotal: () => void;
  patch: (next: Partial<BookingDraft>) => void;
  reset: () => void;
};

function slugsFromAddons(addons: AddonItem[]) {
  return addons.filter((item) => item.qty > 0).map((item) => item.slug);
}

function sumAddons(addons: AddonItem[]) {
  return addons.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...emptyDraft,
      planId: null,
      planName: "",
      basePrice: 0,
      addons: [],
      totalPrice: 0,
      setPlan: (id, slug, name, price) => {
        const same = get().planId === id;
        if (same) {
          set({
            planSlug: slug,
            planName: name,
            basePrice: price,
            totalPrice: price * Math.max(get().riders, 1) + sumAddons(get().addons),
          });
          return;
        }
        set({
          planId: id,
          planSlug: slug,
          planName: name,
          basePrice: price,
          addons: [],
          addonSlugs: [],
          date: "",
          time: "",
          totalPrice: price * Math.max(get().riders, 1),
        });
      },
      setDate: (d) => set({ date: d }),
      setTimeSlot: (t) => set({ time: t }),
      addAddon: (addon) => {
        const qty = Math.max(addon.qty, 1);
        const next = [...get().addons.filter((item) => item.id !== addon.id), { ...addon, qty }];
        set({
          addons: next,
          addonSlugs: slugsFromAddons(next),
          totalPrice: get().basePrice * Math.max(get().riders, 1) + sumAddons(next),
        });
      },
      removeAddon: (id) => {
        const addons = get().addons.filter((item) => item.id !== id);
        set({
          addons,
          addonSlugs: slugsFromAddons(addons),
          totalPrice: get().basePrice * Math.max(get().riders, 1) + sumAddons(addons),
        });
      },
      updateAddonQty: (id, qty) => {
        const addons =
          qty <= 0
            ? get().addons.filter((item) => item.id !== id)
            : get().addons.map((item) => (item.id === id ? { ...item, qty } : item));
        set({
          addons,
          addonSlugs: slugsFromAddons(addons),
          totalPrice: get().basePrice * Math.max(get().riders, 1) + sumAddons(addons),
        });
      },
      calcTotal: () => {
        set({
          totalPrice:
            get().basePrice * Math.max(get().riders, 1) + sumAddons(get().addons),
        });
      },
      patch: (next) => {
        set(next);
        const riders = Math.max(next.riders ?? get().riders, 1);
        set({
          totalPrice: get().basePrice * riders + sumAddons(get().addons),
        });
      },
      reset: () =>
        set({
          ...emptyDraft,
          planId: null,
          planName: "",
          basePrice: 0,
          addons: [],
          totalPrice: 0,
        }),
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
