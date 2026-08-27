"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { siteHome, withSlash } from "@/lib/paths";
import { appPageHref } from "@/lib/file-href";
import { useSiteLook } from "@/lib/site-look";
import {
  BOOKING_RESULT_KEY,
  type BookingResult,
} from "@/stores/booking-store";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

type SuccessViewProps = {
  locale: string;
};

export function SuccessView({ locale }: SuccessViewProps) {
  const t = useTranslations("Success");
  const look = useSiteLook();
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_RESULT_KEY);
      if (raw) setResult(JSON.parse(raw) as BookingResult);
    } catch {
      setResult(null);
    }
  }, []);

  return (
    <div className="min-h-dvh bg-[#0A0A0F] pt-16">
      <SiteNav />
      <main className="mx-auto max-w-xl px-4 py-20">
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
              <dt>{t("total")}</dt>
              <dd>{formatJpy(result.totalJpy, locale)}</dd>
            </div>
          </dl>
        )}
        <div className="mt-8 flex flex-col gap-3">
          {result && !result.paid ? (
            <Link href={withSlash("/pay")} className="cta-btn inline-flex px-6 py-3">
              {t("pay")}
            </Link>
          ) : null}
          <a
            href={appPageHref(siteHome(look), locale)}
            className={result && !result.paid ? "cta-btn cta-btn-ghost inline-flex px-6 py-3" : "cta-btn mt-8 inline-flex px-6 py-3"}
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
