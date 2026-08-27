"use client";

import { useTranslations } from "next-intl";

export function HeroTrust() {
  const shop = useTranslations("Shop");

  return (
    <ul className="hero-trust">
      <li>{shop("legal")}</li>
      <li>{shop("tax")}</li>
      <li>{shop("license")}</li>
      <li>{shop("media")}</li>
    </ul>
  );
}
