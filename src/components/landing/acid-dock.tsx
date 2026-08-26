"use client";

import { useEffect, useState } from "react";

type AcidDockProps = {
  label: string;
};

export function AcidDock({ label }: AcidDockProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      const book = document.getElementById("book");
      const top = book?.getBoundingClientRect().top ?? 9999;
      setShow(window.scrollY > 280 && top > 120);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <a href="#book" className="acid-dock">
      {label}
    </a>
  );
}
