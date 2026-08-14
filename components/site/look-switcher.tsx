"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE_THEMES, type SiteTheme } from "@/lib/visual-theme";
import { cn } from "@/lib/utils";

type LookSwitcherProps = {
  current?: SiteTheme | null;
};

export function LookSwitcher({ current }: LookSwitcherProps) {
  const t = useTranslations("Gateway");

  return (
    <div className="flex max-w-[16rem] flex-wrap items-center justify-end gap-1 rounded-full border border-white/10 bg-black/40 p-1 text-[0.62rem] font-semibold tracking-wide sm:max-w-none">
      {SITE_THEMES.map((look) => (
        <Link
          key={look}
          href={`/${look}`}
          className={cn(
            "rounded-full px-2 py-1 uppercase",
            current === look
              ? "bg-neon-pink text-white"
              : "text-gray-300 hover:text-white",
          )}
        >
          {t(look)}
        </Link>
      ))}
    </div>
  );
}
