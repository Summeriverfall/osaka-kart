"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { asset } from "@/lib/asset";
import { SITE_THEMES, type SiteTheme } from "@/lib/visual-theme";

const PREVIEWS: Record<SiteTheme, string> = {
  neon: asset("/images/plans/standard.png"),
  hud: asset("/images/hero/poster.jpg"),
  acid: asset("/images/reviews/r1.png"),
  oni: asset("/images/reviews/r2.png"),
  glitch: asset("/images/reviews/r3.png"),
};

const LEAD: Record<
  SiteTheme,
  "neonLead" | "hudLead" | "acidLead" | "oniLead" | "glitchLead"
> = {
  neon: "neonLead",
  hud: "hudLead",
  acid: "acidLead",
  oni: "oniLead",
  glitch: "glitchLead",
};

export function GatewayView() {
  const t = useTranslations("Gateway");

  return (
    <div className="gateway-root" data-theme="portal">
      <header className="gateway-top">
        <p>OSAKA KART</p>
        <LocaleSwitcher />
      </header>

      <main className="gateway-main">
        <p className="gateway-kicker">{t("kicker")}</p>
        <h1>{t("title")}</h1>
        <p className="gateway-lead">{t("lead")}</p>

        <div className="gateway-bento">
          {SITE_THEMES.map((look) => (
            <Link key={look} href={`/${look}`} className={`gw-card gw-${look}`}>
              <div className="gw-shot">
                <img src={PREVIEWS[look]} alt="" />
              </div>
              <div className="gw-copy">
                <span>{t(look)}</span>
                <strong>{t(LEAD[look])}</strong>
                <em>{t("enter")} →</em>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
