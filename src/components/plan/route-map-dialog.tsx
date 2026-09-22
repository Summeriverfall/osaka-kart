"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { routeOf } from "@/lib/media";
import { isFileProtocol, navigateToHref } from "@/lib/file-href";
import type { PlanWithTranslation } from "@/lib/plans/types";

export function RouteMapLightbox({
  plan,
  title,
  kicker,
  bookHref,
  bookLabel,
  closeLabel = "Close",
  onClose,
}: {
  plan: PlanWithTranslation | null;
  title?: string;
  kicker?: string;
  bookHref?: string;
  bookLabel?: string;
  closeLabel?: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const src = plan ? routeOf(plan) : "";
  const open = Boolean(plan && src);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const heading = title || plan?.translation.name || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeRef.current();
    }

    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  if (!mounted || !open || !plan) return null;

  return createPortal(
    <div className="ok-plan-modal" role="presentation" onClick={() => closeRef.current()}>
      <div
        className="ok-plan-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ok-route-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="ok-plan-close" aria-label={closeLabel} onClick={() => closeRef.current()}>
          ×
        </button>
        {kicker ? <p className="ok-plan-kicker">{kicker}</p> : null}
        <h3 id="ok-route-title">{heading}</h3>
        {plan.translation.route_summary ? <p className="ok-plan-meta">{plan.translation.route_summary}</p> : null}
        <div className="ok-plan-panel">
          <img src={src} alt={heading} />
        </div>
        {bookHref && bookLabel ? (
          <a
            className="ok-btn ok-plan-book"
            href={bookHref}
            onClick={(event) => {
              if (!isFileProtocol()) return;
              event.preventDefault();
              navigateToHref(bookHref);
              closeRef.current();
            }}
          >
            {bookLabel}
          </a>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
