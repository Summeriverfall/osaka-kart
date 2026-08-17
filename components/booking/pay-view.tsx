"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CreditCard, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { formatJpy } from "@/lib/format";
import { siteHome, useSiteLook } from "@/lib/site-look";
import {
  BOOKING_RESULT_KEY,
  type BookingResult,
} from "@/stores/booking-store";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { cn } from "@/lib/utils";

type PayViewProps = {
  locale: string;
};

type PayMethod = "card" | "paypay" | "apple";

export function PayView({ locale }: PayViewProps) {
  const t = useTranslations("Pay");
  const success = useTranslations("Success");
  const look = useSiteLook();
  const router = useRouter();
  const [result, setResult] = useState<BookingResult | null>(null);
  const [method, setMethod] = useState<PayMethod>("card");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_RESULT_KEY);
      if (raw) setResult(JSON.parse(raw) as BookingResult);
    } catch {
      setResult(null);
    }
  }, []);

  function finishPay() {
    if (!result) return;
    const next = { ...result, paid: true };
    sessionStorage.setItem(BOOKING_RESULT_KEY, JSON.stringify(next));
    router.push("/success");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result || busy) return;
    if (method === "card") {
      const digits = number.replace(/\s/g, "");
      if (digits.length < 15 || expiry.length < 4 || cvc.length < 3 || !holder.trim()) {
        return;
      }
    }
    setBusy(true);
    window.setTimeout(finishPay, 650);
  }

  return (
    <div className="pay-page">
      <SiteNav />
      <main className="pay-main">
        <p className="pay-kicker">{t("kicker")}</p>
        <h1>{t("title")}</h1>
        <p className="pay-lead">{t("lead")}</p>

        {!result ? (
          <div className="pay-empty">
            <p>{t("empty")}</p>
            <Link href="/booking" className="cta-btn cta-btn-solid">
              {t("book")}
            </Link>
          </div>
        ) : (
          <div className="pay-grid">
            <form className="pay-panel" onSubmit={onSubmit}>
              <p className="pay-secure">
                <Lock className="size-4" />
                {t("secure")}
              </p>
              <p className="pay-label">{t("methods")}</p>
              <div className="pay-methods" role="tablist">
                {(
                  [
                    ["card", t("card")],
                    ["paypay", t("paypay")],
                    ["apple", t("apple")],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={method === id}
                    className={cn("pay-method", method === id && "is-on")}
                    onClick={() => setMethod(id)}
                  >
                    {id === "card" ? <CreditCard className="size-4" /> : null}
                    {label}
                  </button>
                ))}
              </div>

              {method === "card" ? (
                <div className="pay-card-fields">
                  <label>
                    <span>{t("number")}</span>
                    <input
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="ACCT-000015"
                      value={number}
                      onChange={(event) =>
                        setNumber(
                          event.target.value
                            .replace(/[^\d]/g, "")
                            .slice(0, 16)
                            .replace(/(\d{4})(?=\d)/g, "$1 ")
                            .trim(),
                        )
                      }
                      required
                    />
                  </label>
                  <div className="pay-card-row">
                    <label>
                      <span>{t("expiry")}</span>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(event) => {
                          const digits = event.target.value.replace(/[^\d]/g, "").slice(0, 4);
                          setExpiry(digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits);
                        }}
                        required
                      />
                    </label>
                    <label>
                      <span>{t("cvc")}</span>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        value={cvc}
                        onChange={(event) => setCvc(event.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    <span>{t("holder")}</span>
                    <input
                      autoComplete="cc-name"
                      value={holder}
                      onChange={(event) => setHolder(event.target.value)}
                      required
                    />
                  </label>
                </div>
              ) : (
                <p className="pay-wallet-note">{t("walletNote")}</p>
              )}

              <button type="submit" className={cn("cta-btn pay-submit", method === "apple" && "pay-apple")} disabled={busy}>
                {t("payNow", { price: formatJpy(result.totalJpy, locale) })}
              </button>
            </form>

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
              <Link href={siteHome(look)} className="shop-text-link">
                {success("back")}
              </Link>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
