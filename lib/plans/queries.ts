import type { AppLocale } from "@/i18n/routing";
import { getSupabaseServer } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { getSeedAddons, getSeedPlanBySlug, getSeedPlans } from "./seed";
import type {
  AddonWithTranslation,
  PlanTranslation,
  PlanWithTranslation,
} from "./types";

type TranslationRow = {
  locale: string;
  name: string;
  description: string | null;
  highlights: string[] | null;
  route_summary: string | null;
  includes: string[] | null;
  requirements: string[] | null;
};

type PlanRow = {
  id: string;
  slug: string;
  duration_minutes: number;
  distance_km: number | string | null;
  base_price_jpy: number;
  max_participants: number | null;
  is_active: boolean | null;
  plan_translations: TranslationRow[] | TranslationRow | null;
};

function asArray<T>(value: T[] | T | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toTranslation(row: TranslationRow): PlanTranslation {
  return {
    locale: row.locale,
    name: row.name,
    description: row.description ?? "",
    highlights: row.highlights ?? [],
    route_summary: row.route_summary ?? "",
    includes: row.includes ?? [],
    requirements: row.requirements ?? [],
  };
}

function pickTranslation(rows: TranslationRow[], locale: string) {
  const match =
    rows.find((row) => row.locale === locale) ??
    rows.find((row) => row.locale === "en") ??
    rows[0];

  if (!match) return null;
  return toTranslation(match);
}

function toPlan(
  row: PlanRow,
  locale: string,
  source: PlanWithTranslation["source"],
): PlanWithTranslation | null {
  const translation = pickTranslation(asArray(row.plan_translations), locale);
  if (!translation) return null;

  return {
    id: row.id,
    slug: row.slug,
    duration_minutes: row.duration_minutes,
    distance_km:
      row.distance_km == null ? null : Number(row.distance_km),
    base_price_jpy: row.base_price_jpy,
    max_participants: row.max_participants ?? 1,
    is_active: row.is_active ?? true,
    translation,
    source,
  };
}

const planSelect = `
  id,
  slug,
  duration_minutes,
  distance_km,
  base_price_jpy,
  max_participants,
  is_active,
  plan_translations (
    locale,
    name,
    description,
    highlights,
    route_summary,
    includes,
    requirements
  )
`;

async function fetchPlansFromSupabase(locale: string) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("plans")
    .select(planSelect)
    .eq("is_active", true)
    .order("base_price_jpy", { ascending: true });

  if (error) throw error;

  return (data as PlanRow[])
    .map((row) => toPlan(row, locale, "supabase"))
    .filter((plan): plan is PlanWithTranslation => plan !== null);
}

async function fetchPlanBySlugFromSupabase(slug: string, locale: string) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("plans")
    .select(planSelect)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return toPlan(data as PlanRow, locale, "supabase");
}

export async function getPlans(
  locale: AppLocale | string,
): Promise<PlanWithTranslation[]> {
  if (!hasSupabaseConfig()) {
    return getSeedPlans(locale);
  }

  try {
    return await fetchPlansFromSupabase(locale);
  } catch (error) {
    console.error("[plans] Supabase list failed, using seed", error);
    return getSeedPlans(locale);
  }
}

export async function getPlanBySlug(
  slug: string,
  locale: AppLocale | string,
): Promise<PlanWithTranslation | null> {
  if (!hasSupabaseConfig()) {
    return getSeedPlanBySlug(slug, locale);
  }

  try {
    return await fetchPlanBySlugFromSupabase(slug, locale);
  } catch (error) {
    console.error("[plans] Supabase detail failed, using seed", error);
    return getSeedPlanBySlug(slug, locale);
  }
}

export async function getAddons(
  locale: AppLocale | string,
): Promise<AddonWithTranslation[]> {
  if (!hasSupabaseConfig()) {
    return getSeedAddons(locale);
  }

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("addons")
      .select(
        `
        id,
        slug,
        price_jpy,
        max_qty,
        is_active,
        addon_translations ( locale, name, description )
      `,
      )
      .eq("is_active", true)
      .order("price_jpy", { ascending: true });

    if (error) throw error;

    return (data ?? []).flatMap((row) => {
      const rows = asArray(
        row.addon_translations as
          | { locale: string; name: string; description: string | null }[]
          | { locale: string; name: string; description: string | null }
          | null,
      );
      const match =
        rows.find((item) => item.locale === locale) ??
        rows.find((item) => item.locale === "en") ??
        rows[0];
      if (!match) return [];
      return [
        {
          id: row.id as string,
          slug: row.slug as string,
          price_jpy: row.price_jpy as number,
          max_qty: (row.max_qty as number | null) ?? 1,
          is_active: (row.is_active as boolean | null) ?? true,
          source: "supabase" as const,
          translation: {
            locale: match.locale,
            name: match.name,
            description: match.description ?? "",
          },
        },
      ];
    });
  } catch (error) {
    console.error("[addons] Supabase list failed, using seed", error);
    return getSeedAddons(locale);
  }
}
