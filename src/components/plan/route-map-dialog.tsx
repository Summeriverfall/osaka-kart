"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { routeOf } from "@/lib/media";
import type { PlanWithTranslation } from "@/lib/plans/types";

export function RouteMapLightbox({
  plan,
  onClose,
}: {
  plan: PlanWithTranslation | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const src = plan ? routeOf(plan) : "";
  const open = Boolean(plan && src);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

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
    <div className="ok-route-layer" role="dialog" aria-modal="true" aria-labelledby="ok-route-title">
      <button type="button" className="ok-route-scrim" aria-label="Close" onClick={() => closeRef.current()} />
      <div className="ok-route-sheet">
        <header className="ok-route-head">
          <h2 id="ok-route-title">{plan.translation.name}</h2>
          <button type="button" className="ok-route-x" onClick={() => closeRef.current()} aria-label="Close">
            <X className="size-4" />
          </button>
        </header>
        <img src={src} alt="" />
        {plan.translation.route_summary ? <p>{plan.translation.route_summary}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
