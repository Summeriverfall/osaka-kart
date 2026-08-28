import type { AppLocale } from "@/i18n/routing";

export type PlanTranslation = {
  locale: AppLocale | string;
  name: string;
  description: string;
  highlights: string[];
  route_summary: string;
  includes: string[];
  requirements: string[];
};

export type PlanRecord = {
  id: string;
  slug: string;
  duration_minutes: number;
  distance_km: number | null;
  base_price_jpy: number;
  max_participants: number;
  is_active: boolean;
};

export type PlanWithTranslation = PlanRecord & {
  translation: PlanTranslation;
  source: "supabase" | "seed";
  cover_image?: string;
  detail_image?: string;
  includedAddonIds?: string[];
};

export type AddonTranslation = {
  locale: AppLocale | string;
  name: string;
  description: string;
};

export type AddonRecord = {
  id: string;
  slug: string;
  price_jpy: number;
  max_qty: number;
  is_active: boolean;
};

export type AddonWithTranslation = AddonRecord & {
  translation: AddonTranslation;
  source: "supabase" | "seed";
};
