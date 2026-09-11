"use client";

import { type CSSProperties, type Ref, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { localeText } from "@/lib/live-cms";
import type { CmsReview } from "@/lib/mock/cms";

type Props = {
  reviews: CmsReview[];
  kicker?: string;
  title: string;
};

export function HomeReviews({ reviews, kicker, title }: Props) {
  const locale = useLocale();
  const firstQuoteRef = useRef<HTMLQuoteElement>(null);
  const [lines, setLines] = useState<number | null>(null);
  const [capPx, setCapPx] = useState<number | null>(null);

  useEffect(() => {
    const el = firstQuoteRef.current;
    if (!el) return;

    function measure() {
      const quote = firstQuoteRef.current;
      if (!quote) return;
      const style = getComputedStyle(quote);
      const fontSize = Number.parseFloat(style.fontSize) || 14;
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.7;
      const height = quote.scrollHeight;
      setCapPx(height);
      setLines(Math.max(4, Math.round(height / lineHeight)));
    }

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reviews, locale]);

  return (
    <section id="reviews" className="ok-sec ok-sec-alt">
      <div className="ok-sec-wide">
        <header className="ok-sec-head">
          {kicker ? <p className="ok-kicker">{kicker}</p> : null}
          <h2>{title}</h2>
        </header>
        <div className="ok-reviews">
          {reviews.map((item, index) => (
            <ReviewCard
              key={item.id}
              item={item}
              locale={locale}
              quoteRef={index === 0 ? firstQuoteRef : undefined}
              lines={index === 0 ? null : lines}
              capPx={index === 0 ? null : capPx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  item,
  locale,
  quoteRef,
  lines,
  capPx,
}: {
  item: CmsReview;
  locale: string;
  quoteRef?: Ref<HTMLQuoteElement>;
  lines: number | null;
  capPx: number | null;
}) {
  const t = useTranslations("ReviewsHome");
  const shop = useTranslations("Shop");
  const href = item.url?.trim();
  const text = localeText(item.quote, locale);
  const [open, setOpen] = useState(false);
  const quoteEl = useRef<HTMLQuoteElement>(null);
  const [overflow, setOverflow] = useState(false);
  const clamp = Boolean(lines) && !open;

  useEffect(() => {
    const el = quoteEl.current;
    if (!el || !lines || open) {
      setOverflow(false);
      return;
    }
    const id = requestAnimationFrame(() => {
      setOverflow(el.scrollHeight > el.clientHeight + 1);
    });
    return () => cancelAnimationFrame(id);
  }, [text, lines, open]);

  function setQuoteRef(node: HTMLQuoteElement | null) {
    quoteEl.current = node;
    if (!quoteRef) return;
    if (typeof quoteRef === "function") quoteRef(node);
    else quoteRef.current = node;
  }

  const quoteStyle = {
    ...(capPx && !open ? { minHeight: capPx } : null),
    ...(clamp && lines ? ({ "--quote-lines": String(lines) } as CSSProperties) : null),
  };

  return (
    <article className="ok-review">
      <p className="ok-stars" aria-hidden>
        {Array.from({ length: 5 }).map((_, star) => (
          <Star key={star} className="inline size-4 fill-current" />
        ))}
      </p>
      <blockquote ref={setQuoteRef} className={clamp ? "is-clamp" : undefined} style={quoteStyle}>
        “{text}”
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
