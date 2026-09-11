"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { formatJpy } from "@/lib/format";
import { useLivePlans } from "@/lib/live-catalog";
import { coverOf } from "@/lib/media";
import { appPageHref, isFileProtocol, navigateToHref } from "@/lib/file-href";
import { withSlash } from "@/lib/paths";
import type { PlanWithTranslation } from "@/lib/plans/types";
import { cn } from "@/lib/utils";

type Mode = "row" | "pick" | "hero" | "acc" | "lineup";

const MODES: { id: Mode; zh: string; en: string; ja: string; hint: string }[] = [
  { id: "row", zh: "A 横卡", en: "A Rows", ja: "A 横並び", hint: "图在左，名称、说明、标签、价格一次看完" },
  { id: "pick", zh: "B 点选展开", en: "B Pick", ja: "B 選択展開", hint: "上面点套餐，下面出大图和完整信息" },
  { id: "hero", zh: "C 主图切换", en: "C Hero", ja: "C メイン", hint: "一张大图吃满，底下小图换套餐" },
  { id: "acc", zh: "D 手风琴", en: "D Accordion", ja: "D アコーディオン", hint: "一行一项，点开才展开详情" },
  { id: "lineup", zh: "E 横滑", en: "E Lineup", ja: "E 横スライド", hint: "一次看一张，左右滑切换，旁边露出下一张" },
];

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
};

export function PlanLayoutGallery({ plans: seedPlans, locale }: Props) {
  const t = useTranslations("PlansHome");
  const planT = useTranslations("Plan");
  const nav = useTranslations("Nav");
  const plans = useLivePlans(seedPlans, locale);
  const [mode, setMode] = useState<Mode>("lineup");
  const [picked, setPicked] = useState(plans[0]?.slug ?? "");
  const current = plans.find((item) => item.slug === picked) ?? plans[0];
  const lineupRef = useRef<HTMLDivElement>(null);
  const pickedRef = useRef(picked);
  pickedRef.current = picked;
  const lineupIndex = Math.max(0, plans.findIndex((item) => item.slug === picked));

  function scrollLineupTo(index: number) {
    const track = lineupRef.current;
    const card = track?.querySelector<HTMLElement>(`[data-lineup="${index}"]`);
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function slideLineup(next: number) {
    const index = Math.max(0, Math.min(plans.length - 1, next));
    const plan = plans[index];
    if (!plan) return;
    setPicked(plan.slug);
    scrollLineupTo(index);
  }

  useEffect(() => {
    if (mode !== "lineup") return;
    const track = lineupRef.current;
    if (!track) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-lineup]"));
        const x = track.scrollLeft;
        let best = 0;
        let dist = Number.POSITIVE_INFINITY;
        cards.forEach((el, index) => {
          const gap = Math.abs(el.offsetLeft - x);
          if (gap < dist) {
            dist = gap;
            best = index;
          }
        });
        const slug = plans[best]?.slug;
        if (slug && slug !== pickedRef.current) setPicked(slug);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [mode, plans]);

  const go = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isFileProtocol()) return;
    event.preventDefault();
    navigateToHref(path, locale);
  };

  const bookPath = (slug: string) => withSlash(`/booking?plan=${slug}`);
  const detailPath = (slug: string) => withSlash(`/plan/${slug}`);

  function meta(plan: PlanWithTranslation) {
    return `${planT("minutes", { n: plan.duration_minutes })}${
      plan.distance_km != null ? ` · ${planT("km", { n: plan.distance_km })}` : ""
    }`;
  }

  function actions(plan: PlanWithTranslation) {
    return (
      <div className="ok-pack-actions">
        <a className="ok-btn" href={appPageHref(bookPath(plan.slug), locale)} onClick={go(bookPath(plan.slug))}>
          {nav("booking")}
        </a>
        <a className="ok-btn-ghost" href={appPageHref(detailPath(plan.slug), locale)} onClick={go(detailPath(plan.slug))}>
          {t("details")}
        </a>
      </div>
    );
  }

  function tags(plan: PlanWithTranslation) {
    const points = plan.translation.highlights.slice(0, 3);
    if (!points.length) return null;
    return (
      <ul className="ok-pack-points">
        {points.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  function price(plan: PlanWithTranslation) {
    return (
      <p className="ok-pack-price">
        {formatJpy(plan.base_price_jpy, locale)}
        <span>{planT("perPerson")}</span>
      </p>
    );
  }

  function modeLabel(item: (typeof MODES)[number]) {
    if (locale.startsWith("ja")) return item.ja;
    if (locale.startsWith("en") || locale.startsWith("ko")) return item.en;
    return item.zh;
  }

  return (
    <div className="ok-idea">
      <div className="ok-idea-switch" role="tablist" aria-label="layout">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            className={cn("ok-idea-chip", mode === item.id && "is-on")}
            onClick={() => setMode(item.id)}
          >
            {modeLabel(item)}
          </button>
        ))}
      </div>
      <p className="ok-idea-hint">{MODES.find((item) => item.id === mode)?.hint}</p>

      {mode === "row" ? (
        <div className="ok-idea-rows">
          {plans.map((plan) => (
            <article key={plan.id} className="ok-idea-row">
              <div className="ok-pack-photo">
                <img src={coverOf(plan)} alt="" />
                <span className="ok-pack-chip">{planT("minutes", { n: plan.duration_minutes })}</span>
              </div>
              <div className="ok-pack-copy">
                <h3>{plan.translation.name}</h3>
                <p className="ok-pack-meta">{meta(plan)}</p>
                <p className="ok-pack-desc ok-idea-desc-full">{plan.translation.description}</p>
                {tags(plan)}
                {price(plan)}
                {actions(plan)}
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {mode === "pick" && current ? (
        <div className="ok-idea-pick">
          <div className="ok-idea-tiles">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={cn("ok-idea-tile", plan.slug === current.slug && "is-on")}
                onClick={() => setPicked(plan.slug)}
              >
                <img src={coverOf(plan)} alt="" />
                <span>{plan.translation.name}</span>
                <em>{planT("minutes", { n: plan.duration_minutes })}</em>
              </button>
            ))}
          </div>
          <article className="ok-idea-detail">
            <div className="ok-pack-photo">
              <img src={coverOf(current)} alt="" />
              <span className="ok-pack-chip">{planT("minutes", { n: current.duration_minutes })}</span>
            </div>
            <div className="ok-pack-copy">
              <h3>{current.translation.name}</h3>
              <p className="ok-pack-meta">{meta(current)}</p>
              <p className="ok-pack-desc ok-idea-desc-full">{current.translation.description}</p>
              {tags(current)}
              {price(current)}
              {actions(current)}
            </div>
          </article>
        </div>
      ) : null}

      {mode === "hero" && current ? (
        <div className="ok-idea-hero">
          <article className="ok-idea-hero-main">
            <img src={coverOf(current)} alt="" />
            <div className="ok-idea-hero-copy">
              <h3>{current.translation.name}</h3>
              <p className="ok-pack-meta">{meta(current)}</p>
              <p className="ok-pack-desc ok-idea-desc-full">{current.translation.description}</p>
              {tags(current)}
              {price(current)}
              {actions(current)}
            </div>
          </article>
          <div className="ok-idea-thumbs">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={cn("ok-idea-thumb", plan.slug === current.slug && "is-on")}
                onClick={() => setPicked(plan.slug)}
              >
                <img src={coverOf(plan)} alt="" />
                <span>{plan.translation.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {mode === "lineup" ? (
        <div className="ok-idea-lineup">
          <div className="ok-idea-lineup-track" ref={lineupRef}>
            {plans.map((plan, index) => (
              <article key={plan.id} className="ok-idea-lineup-card" data-lineup={index}>
                <div className="ok-idea-lineup-photo">
                  <img src={coverOf(plan)} alt="" />
                  <span className="ok-pack-chip">{planT("minutes", { n: plan.duration_minutes })}</span>
                </div>
                <div className="ok-idea-lineup-copy">
                  <h3>{plan.translation.name}</h3>
                  <p className="ok-pack-meta">{meta(plan)}</p>
                  <p className="ok-idea-lineup-desc">
                    {plan.translation.highlights[0] || plan.translation.description}
                  </p>
                  {price(plan)}
                  {actions(plan)}
                </div>
              </article>
            ))}
          </div>
          <div className="ok-idea-lineup-bar">
            <div className="ok-idea-lineup-dots" role="tablist" aria-label="plans">
              {plans.map((plan, index) => (
                <button
                  key={plan.id}
                  type="button"
                  aria-label={plan.translation.name}
                  aria-selected={index === lineupIndex}
                  className={cn(index === lineupIndex && "is-on")}
                  onClick={() => slideLineup(index)}
                />
              ))}
            </div>
            <div className="ok-idea-lineup-arrows">
              <button type="button" aria-label="prev" disabled={lineupIndex <= 0} onClick={() => slideLineup(lineupIndex - 1)}>
                ‹
              </button>
              <button
                type="button"
                aria-label="next"
                disabled={lineupIndex >= plans.length - 1}
                onClick={() => slideLineup(lineupIndex + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {mode === "acc" ? (
        <div className="ok-idea-acc">
          {plans.map((plan) => {
            const open = plan.slug === current?.slug;
            return (
              <article key={plan.id} className={cn("ok-idea-acc-item", open && "is-on")}>
                <button type="button" className="ok-idea-acc-head" onClick={() => setPicked(plan.slug)}>
                  <img src={coverOf(plan)} alt="" />
                  <span>
                    <b>{plan.translation.name}</b>
                    <em className="ok-pack-meta">{meta(plan)}</em>
                  </span>
                  <strong>{formatJpy(plan.base_price_jpy, locale)}</strong>
                </button>
                {open ? (
                  <div className="ok-idea-acc-body">
                    <div className="ok-pack-photo">
                      <img src={coverOf(plan)} alt="" />
                    </div>
                    <div className="ok-pack-copy">
                      <p className="ok-pack-desc ok-idea-desc-full">{plan.translation.description}</p>
                      {tags(plan)}
                      {price(plan)}
                      {actions(plan)}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
