import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

type PlaceholderPageProps = {
  params: Promise<{ locale: AppLocale }>;
  titleKey: "booking" | "videos" | "faq" | "success";
};

export async function PlaceholderPage({
  params,
  titleKey,
}: PlaceholderPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Nav");

  return (
    <main className="hero-shell mx-auto max-w-6xl px-4 py-24">
      <h1 className="text-3xl font-black tracking-tight text-[#F1F1F5] md:text-4xl">
        {t(titleKey === "success" ? "booking" : titleKey)}
      </h1>
    </main>
  );
}
