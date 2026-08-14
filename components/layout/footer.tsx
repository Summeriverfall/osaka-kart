import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="site-footer px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="neon-text text-sm font-semibold tracking-[0.18em]">
          OSAKA KART
        </p>
        <p className="text-xs text-[#9CA3AF]">{t("copyright")}</p>
      </div>
    </footer>
  );
}
