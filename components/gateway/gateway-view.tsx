"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/site/brand-mark";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { asset } from "@/lib/asset";
import { formatJpy } from "@/lib/format";
import { siteHome } from "@/lib/paths";
import { SITE_THEMES, type SiteTheme } from "@/lib/visual-theme";

const PREVIEWS: Record<SiteTheme, string> = {
  neon: asset("/images/plans/standard.png"),
  acid: asset("/images/reviews/r1.png"),
  oni: asset("/images/reviews/r2.png"),
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
          {SITE_THEMES.map((look) => (
            <Link key={look} href={siteHome(look)} className={`gw-card gw-${look}`}>
              <div className="gw-shot">
                <img src={PREVIEWS[look]} alt="" />
              </div>
              <div className="gw-copy">
                <em>{t("enter")} →</em>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
