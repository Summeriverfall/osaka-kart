"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { localeText } from "@/lib/live-cms";
import type { CmsReview } from "@/lib/mock/cms";

const PREVIEW_LINES = 8;

type Props = {
  reviews: CmsReview[];
  kicker?: string;
  title: string;
};

export function HomeReviews({ reviews, kicker, title }: Props) {
  const locale = useLocale();

  return (
    <section id="reviews" className="ok-sec ok-sec-alt">
      <div className="ok-sec-wide">
        <header className="ok-sec-head">
          {kicker ? <p className="ok-kicker">{kicker}</p> : null}
          <h2>{title}</h2>
        </header>
        <div className="ok-reviews">
          {reviews.map((item) => (
            <ReviewCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ item, locale }: { item: CmsReview; locale: string }) {
  const t = useTranslations("ReviewsHome");
  const shop = useTranslations("Shop");
  const href = item.url?.trim();
  const text = localeText(item.quote, locale)
    .replace(/\s*🇯🇵\s*/g, "")
    .replace(/^[\s\u201c\u201d\u2018\u2019"「『]+/, "")
    .replace(/[\u201c\u201d\u2018\u2019"」』]+\s*$/, "");
  const [open, setOpen] = useState(false);
  const quoteEl = useRef<HTMLQuoteElement>(null);
  const [overflow, setOverflow] = useState(false);
  const clamp = !open;

  useEffect(() => {
    const el = quoteEl.current;
    if (!el) return;

    function measure() {
      const quote = quoteEl.current;
      if (!quote) return;
      const style = getComputedStyle(quote);
      const fontSize = Number.parseFloat(style.fontSize) || 14;
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.7;
      const probe = document.createElement("blockquote");
      probe.className = quote.className.replace("is-clamp", "").trim();
      probe.textContent = quote.textContent ?? "";
      probe.style.cssText = [
        "position:absolute",
        "left:-9999px",
        "top:0",
        "visibility:hidden",
        "display:block",
        "height:auto",
        "max-height:none",
        `-webkit-line-clamp:unset`,
        `width:${quote.clientWidth}px`,
        `font:${style.font}`,
        `letter-spacing:${style.letterSpacing}`,
        "white-space:pre-wrap",
        `line-height:${style.lineHeight}`,
      ].join(";");
      quote.parentElement?.appendChild(probe);
      const full = probe.scrollHeight;
      probe.remove();
      setOverflow(full > lineHeight * PREVIEW_LINES + 2);
    }

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [text, locale]);

  const quoteStyle = clamp
    ? ({ "--quote-lines": String(PREVIEW_LINES) } as CSSProperties)
    : undefined;

  return (
    <article className="ok-review">
      <p className="ok-stars" aria-hidden>
        {Array.from({ length: 5 }).map((_, star) => (
          <Star key={star} className="inline size-4 fill-current" />
        ))}
      </p>
      <blockquote ref={quoteEl} className={clamp ? "is-clamp" : undefined} style={quoteStyle}>
        {text}
      </blockquote>
      <div className="ok-review-more">
        {overflow || open ? (
          <button type="button" onClick={() => setOpen((value) => !value)}>
            {open ? t("collapse") : t("expand")}
          </button>
        ) : null}
      </div>
      <footer>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            <strong>{item.name}</strong>
          </a>
        ) : (
          <strong>{item.name}</strong>
        )}
        {item.country ? <span> · {item.country}</span> : null}
        {item.platform ? <small>{shop("fromReview", { platform: item.platform })}</small> : null}
      </footer>
    </article>
  );
}
