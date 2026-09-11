"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatJpy } from "@/lib/format";
import { useLivePlans } from "@/lib/live-catalog";
import { coverOf } from "@/lib/media";
import { appPageHref, isFileProtocol, navigateToHref } from "@/lib/file-href";
import { withSlash } from "@/lib/paths";
import type { PlanWithTranslation } from "@/lib/plans/types";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
  sectionId?: string;
  kicker?: string;
  heading?: boolean;
};

export function HomePlans({ plans: seedPlans, locale, sectionId = "plans", kicker, heading = true }: Props) {
  const t = useTranslations("PlansHome");
  const planT = useTranslations("Plan");
  const nav = useTranslations("Nav");
  const plans = useLivePlans(seedPlans, locale);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pager, setPager] = useState({ prev: false, next: false });

  function updatePager() {
    const el = trackRef.current;
    if (!el) {
      setPager({ prev: false, next: false });
      return;
    }
    const max = el.scrollWidth - el.clientWidth;
    setPager({
      prev: el.scrollLeft > 20,
      next: max - el.scrollLeft > 20,
    });
  }

  function slide(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".ok-pack-card");
    const styles = getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 16;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updatePager();
    const onScroll = () => updatePager();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => updatePager());
    ro.observe(el);
    window.addEventListener("resize", updatePager);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", updatePager);
    };
  }, [plans.length]);

  const go = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isFileProtocol()) return;
    event.preventDefault();
    navigateToHref(path, locale);
  };

  const showArrows = pager.prev || pager.next;

  const deck = (
    <div className={showArrows ? "ok-pack-deck has-arrows" : "ok-pack-deck"}>
      {showArrows ? (
        <>
          <button
            type="button"
            className="ok-pack-arrow is-prev"
            aria-label={t("prev")}
            disabled={!pager.prev}
            onClick={() => slide(-1)}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            className="ok-pack-arrow is-next"
            aria-label={t("next")}
            disabled={!pager.next}
            onClick={() => slide(1)}
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      ) : null}
      <div className="ok-pack-grid" ref={trackRef}>
        {plans.map((plan) => {
          const points = plan.translation.highlights.slice(0, 3);
          const bookPath = withSlash(`/booking?plan=${plan.slug}`);
          const detailPath = withSlash(`/plan/${plan.slug}`);
          return (
            <article key={plan.id} className="ok-pack-card">
              <div className="ok-pack-photo">
                <img src={coverOf(plan)} alt="" />
                <span className="ok-pack-chip">{planT("minutes", { n: plan.duration_minutes })}</span>
              </div>
              <div className="ok-pack-copy">
                <h3>{plan.translation.name}</h3>
                <p className="ok-pack-meta">
                  {planT("minutes", { n: plan.duration_minutes })}
                  {plan.distance_km != null ? ` · ${planT("km", { n: plan.distance_km })}` : ""}
                </p>
                <p className="ok-pack-desc">{plan.translation.description}</p>
                {points.length ? (
                  <ul className="ok-pack-points">
                    {points.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="ok-pack-price">
                  {formatJpy(plan.base_price_jpy, locale)}
                  <span>{planT("perPerson")}</span>
                </p>
                <div className="ok-pack-actions">
                  <a className="ok-btn" href={appPageHref(bookPath, locale)} onClick={go(bookPath)}>
                    {nav("booking")}
                  </a>
                  <a className="ok-btn-ghost" href={appPageHref(detailPath, locale)} onClick={go(detailPath)}>
                    {t("details")}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );

  if (!heading) return deck;

  return (
    <section id={sectionId} className="ok-sec">
      <div className="ok-sec-wide">
        <header className="ok-sec-head">
          {kicker ? <p className="ok-kicker">{kicker}</p> : null}
          <h2>{t("title")}</h2>
        </header>
        {deck}
      </div>
    </section>
  );
}
