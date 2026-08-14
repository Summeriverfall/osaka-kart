import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { bookingHref, landingHref } from "@/lib/booking/path";
import type { SiteTheme } from "@/lib/visual-theme";

type BookingNavProps = {
  theme: SiteTheme;
  brand: string;
  back: string;
  changeLook: string;
  booking: string;
};

export function BookingNav({
  theme,
  brand,
  back,
  changeLook,
  booking,
}: BookingNavProps) {
  return (
    <header className={`landing-nav nav-${theme} is-scrolled`}>
      <div className="nav-brand">
        <Link href={landingHref(theme)} className="nav-logo">
          {brand}
        </Link>
        <Link href={landingHref(theme)} className="looks-link">
          {back}
        </Link>
        <Link href="/" className="looks-link">
          {changeLook}
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
        <Link href={bookingHref(theme)} className="cta-btn nav-cta">
          {booking}
        </Link>
      </div>
    </header>
  );
}
