"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { homeCopy } from "@/lib/home-storefront";

export function LicenseModal({
  locale,
  open,
  onClose,
}: {
  locale: string;
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const copy = homeCopy(locale);
  const info = copy.license;

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
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="ok-plan-modal ok-license-modal" role="presentation" onClick={onClose}>
      <div
        className="ok-plan-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ok-license-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="ok-plan-close" aria-label={copy.close} onClick={onClose}>
          ×
        </button>
        <p className="ok-plan-kicker">{info.kicker}</p>
        <h3 id="ok-license-title">{info.title}</h3>
        <p className="ok-plan-meta">{info.lead}</p>
        <div className="ok-license-body">
          {info.sections.map((section) => (
            <section key={section.title}>
              <h4>{section.title}</h4>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
