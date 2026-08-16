"use client";

import { useEffect, useState } from "react";
import type { SiteTheme } from "@/lib/visual-theme";

type FloatBookProps = {
  theme: SiteTheme;
  label: string;
};

export function FloatBook({ theme, label }: FloatBookProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 520);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <a href="#book" className={`cta-btn cta-btn-solid float-book float-book-${theme}`}>
      {label}
    </a>
  );
}
