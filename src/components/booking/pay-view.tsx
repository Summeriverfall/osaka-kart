"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFileRouter as useRouter } from "@/lib/use-file-router";
import { formatJpy } from "@/lib/format";
import { withSlash } from "@/lib/paths";
import { appPageHref, isFileProtocol } from "@/lib/file-href";
import { createStripeCheckout, isStripeTestMode } from "@/lib/stripe/browser";
import {
  BOOKING_RESULT_KEY,
  type BookingResult,
} from "@/stores/booking-store";
import { RideNotes } from "@/components/notes/ride-notes";
import { SiteNav } from "@/components/site/site-nav";
import { japanAppointmentPassed } from "@/lib/japan-time";
import { useBookingStore } from "@/stores/booking-store";
import { scheduleOpsRehydrate } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

type PayViewProps = {
  locale: string;
};

export function PayView({ locale }: PayViewProps) {
  const t = useTranslations("Pay");
  const success = useTranslations("Success");
  const router = useRouter();
  const notify = useToastStore((state) => state.notify);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    scheduleOpsRehydrate(true);
    try {
      const raw = sessionStorage.getItem(BOOKING_RESULT_KEY);
      if (raw) setResult(JSON.parse(raw) as BookingResult);
    } catch {
      setResult(null);
    }
  }, []);

  async function payWithStripe() {
    if (!result || busy) return;
    if (japanAppointmentPassed(result.date, result.time)) {
      notify(t("timePassed"));
      return;
    }
    if (isFileProtocol()) {
      notify(t("stripeFile"));
      return;
    }
    setBusy(true);
    try {
      const origin = window.location.origin;
      const successUrl = `${origin}${appPageHref(withSlash("/success"), locale)}?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}${appPageHref(withSlash("/pay"), locale)}`;
      const addons = useBookingStore.getState().addons
        .filter((item) => item.qty > 0)
        .map((item) => ({ slug: item.slug, qty: item.qty, name: item.name }));
      const url = await createStripeCheckout({
        origin,
        locale,
        successUrl,
        cancelUrl,
        ref: result.ref,
        planSlug: result.planSlug,
        planName: result.planName,
        riders: result.riders,
        date: result.date,
        time: result.time,
        email: result.email,
        addonSlugs: result.addonSlugs,
        addons,
      });
      window.location.assign(url);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      notify(code === "offline" || code === "missing-secret" ? t("stripeOffline") : t("stripeFail"));
      setBusy(false);
    }
  }

  return (
    <div className="ok-page pay-page">
      <SiteNav />
      <main className="ok-shell pay-main">
        {result ? (
          <a
            href={appPageHref(withSlash("/booking?from=pay"), locale)}
            className="pay-back"
            suppressHydrationWarning
            onClick={(event) => {
              if (!isFileProtocol()) return;
              event.preventDefault();
              router.push(withSlash("/booking?from=pay"));
            }}
          >
            <ArrowLeft className="size-4" />
            {t("backEdit")}
          </a>
        ) : null}
        <p className="pay-kicker">{t("kicker")}</p>
        <h1>{t("title")}</h1>
        <p className="pay-lead">{t("lead")}</p>

        {!result ? (
          <div className="pay-empty">
            <p>{t("empty")}</p>
            <Link href={withSlash("/booking")} className="ok-btn">
              {t("book")}
            </Link>
          </div>
        ) : (
          <div className="pay-grid">
            <div className="pay-panel">
              <p className="pay-secure">
                <Lock className="size-4" />
                {t("secure")}
              </p>
              <p className="pay-card-note">{t("stripeLead")}</p>
              {isStripeTestMode() ? <p className="pay-wallet-note">{t("testHint")}</p> : null}
              <button
                type="button"
                className="cta-btn pay-submit pay-stripe"
                disabled={busy}
                onClick={() => void payWithStripe()}
              >
                {t("payNow", { price: formatJpy(result.totalJpy, locale) })}
              </button>
            </div>

            <div className="pay-side">
              <aside className="pay-summary">
                <h2>{t("order")}</h2>
                <dl className="book-receipt">
                  <div>
                    <dt>{success("ref")}</dt>
                    <dd>{result.ref}</dd>
                  </div>
                  <div>
                    <dt>{success("plan")}</dt>
                    <dd>{result.planName}</dd>
                  </div>
                  <div>
                    <dt>{success("when")}</dt>
                    <dd>
                      {result.date} · {result.time}
                    </dd>
                  </div>
                  <div>
                    <dt>{success("total")}</dt>
                    <dd>{formatJpy(result.totalJpy, locale)}</dd>
                  </div>
                </dl>
                <a
                  href={appPageHref(withSlash("/booking?from=pay"), locale)}
                  className="shop-text-link"
                  suppressHydrationWarning
                  onClick={(event) => {
                    if (!isFileProtocol()) return;
                    event.preventDefault();
                    router.push(withSlash("/booking?from=pay"));
                  }}
                >
                  {t("backEdit")}
                </a>
              </aside>
              <aside className="pay-license">
                <RideNotes compact />
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
