"use client";

import { useTranslations } from "next-intl";
import { BrandMark } from "@/components/site/brand-mark";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { asset } from "@/lib/asset";
import { formatJpy } from "@/lib/format";
import { appPageHref, isFileProtocol, navigateToHref } from "@/lib/file-href";
import { siteHome } from "@/lib/paths";
import { SITE_THEMES, type SiteTheme } from "@/lib/visual-theme";

const PREVIEWS: Record<SiteTheme, string> = {
  neon: asset("/images/plans/standard.webp"),
  acid: asset("/images/reviews/r1.webp"),
  oni: asset("/images/reviews/r2.webp"),
};

type GatewayViewProps = {
  fromPrice: number;
  locale: string;
};

export function GatewayView({ fromPrice, locale }: GatewayViewProps) {
  const t = useTranslations("Gateway");

  return (
    <div className="gateway-root" data-theme="portal">
      <header className="gateway-top">
        <BrandMark />
        <LocaleSwitcher />
      </header>

      <main className="gateway-main">
        <p className="gateway-kicker">{t("kicker")}</p>
        <h1>{t("title")}</h1>
        <p className="gateway-lead">{t("lead")}</p>
        <p className="gateway-what">{t("what")}</p>
        <p className="gateway-facts">
          <span>{t("from", { price: formatJpy(fromPrice, locale) })}</span>
          <span>{t("need")}</span>
        </p>

        <div className="gateway-bento">
          {SITE_THEMES.map((look) => {
            const path = siteHome(look);
            return (
              <a
                key={look}
                href={appPageHref(path, locale)}
                className={`gw-card gw-${look}`}
                suppressHydrationWarning
                onClick={(event) => {
                  if (!isFileProtocol()) return;
                  event.preventDefault();
                  event.stopPropagation();
                  navigateToHref(path, locale);
                }}
              >
                <div className="gw-shot">
                  <img
                    src={PREVIEWS[look]}
                    alt=""
                    width={800}
                    height={600}
                    decoding="async"
                    fetchPriority={look === "neon" ? "high" : "low"}
                  />
                </div>
                <div className="gw-copy">
                  <em>{t("enter")} →</em>
                </div>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
}
