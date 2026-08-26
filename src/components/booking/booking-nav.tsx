import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { LiveBrandMark } from "@/components/site/live-brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { landingHref } from "@/lib/booking/path";
import type { SiteTheme } from "@/lib/visual-theme";

type BookingNavProps = {
  theme: SiteTheme;
  back: string;
};

export function BookingNav({ theme, back }: BookingNavProps) {
  return (
    <header className={`landing-nav nav-${theme} is-scrolled`}>
      <div className="nav-brand">
        <LiveBrandMark className="nav-logo" look={theme} />
        <Link href={landingHref(theme)} className="looks-link">
          {back}
        </Link>
      </div>
      <div className="nav-end">
        <Suspense
          fallback={
            <span className="lang-switcher-trigger pointer-events-none opacity-70">
              EN
            </span>
          }
        >
          <LanguageSwitcher />
        </Suspense>
      </div>
    </header>
  );
}
