"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { withSlash } from "@/lib/paths";
import { appPageHref } from "@/lib/file-href";
import { finalizePaidBooking } from "@/lib/booking/finalize-pay";
import { readStripeSession } from "@/lib/stripe/browser";
import {
  BOOKING_RESULT_KEY,
  type BookingResult,
} from "@/stores/booking-store";
import { GuestDetails } from "@/components/booking/guest-details";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { scheduleOpsRehydrate } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";

type SuccessViewProps = {
  locale: string;
};

export function SuccessView({ locale }: SuccessViewProps) {
  const t = useTranslations("Success");
  const pay = useTranslations("Pay");
  const notify = useToastStore((state) => state.notify);
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    scheduleOpsRehydrate(true);
    let stored: BookingResult | null = null;
    try {
      const raw = sessionStorage.getItem(BOOKING_RESULT_KEY);
      stored = raw ? (JSON.parse(raw) as BookingResult) : null;
    } catch {
      stored = null;
    }
    if (stored) setResult(stored);

    const sessionId = new URLSearchParams(window.location.search).get("session_id") || "";
    if (!sessionId || !stored || stored.paid) return;

    let cancelled = false;
    void readStripeSession(sessionId)
      .then((session) => {
        if (cancelled) return;
        if (!session.paid) return;
        if (session.ref && session.ref !== stored.ref) return;
        const done = finalizePaidBooking(stored);
        if (!done.ok) {
          notify(pay("timePassed"));
          return;
        }
        setResult(done.result);
      })
      .catch(() => {
        if (!cancelled) notify(pay("stripeOffline"));
      });
    return () => {
      cancelled = true;
    };
  }, [notify, pay]);

  return (
    <div className="ok-page ok-page-pad">
      <SiteNav />
      <main className="ok-shell ok-success">
        <p className="text-xs tracking-[0.2em] text-neon-pink uppercase">
          {result?.paid ? t("paidKicker") : t("kicker")}
        </p>
        <h1 className="mt-3 text-4xl font-black">{result?.paid ? t("paidTitle") : t("title")}</h1>
        <p className="mt-4 text-gray-300">{result?.paid ? t("paidBody") : t("body")}</p>
        {result && (
          <dl className="book-receipt mt-8">
            <div>
              <dt>{t("ref")}</dt>
              <dd>{result.ref}</dd>
            </div>
            <div>
              <dt>{t("plan")}</dt>
              <dd>{result.planName}</dd>
            </div>
            <div>
              <dt>{t("when")}</dt>
              <dd>
                {result.date} · {result.time}
              </dd>
            </div>
            <div>
              <dt>{t("guests")}</dt>
              <dd>{result.riders}</dd>
            </div>
            <div>
              <dt>{t("total")}</dt>
              <dd>{formatJpy(result.totalJpy, locale)}</dd>
            </div>
          </dl>
        )}
        {result ? <GuestDetails locale={locale} result={result} /> : null}
        <div className="mt-8 flex flex-col gap-3">
          {result && !result.paid ? (
            <Link href={withSlash("/pay")} className="ok-btn">
              {t("pay")}
            </Link>
          ) : null}
          <a
            href={appPageHref(withSlash("/"), locale)}
            className={result && !result.paid ? "ok-btn-ghost" : "ok-btn"}
            suppressHydrationWarning
          >
            {t("back")}
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
