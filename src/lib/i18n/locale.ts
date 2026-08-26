import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";

export async function getLocaleFromCookies(): Promise<AppLocale> {
  const store = await cookies();
  const raw = store.get("NEXT_LOCALE")?.value;

  if (hasLocale(routing.locales, raw)) {
    return raw;
  }

  return routing.defaultLocale;
}
