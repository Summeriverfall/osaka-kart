"use client";

import { useLocale } from "next-intl";
import { homeCopy } from "@/lib/home-storefront";

export function HeroTrust() {
  const locale = useLocale();
  const tags = homeCopy(locale).tags;

  return (
    <ul className="hero-trust">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
