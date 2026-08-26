"use client";

import { useTranslations } from "next-intl";

export function HeroTrust() {
  const shop = useTranslations("Shop");
  const hero = useTranslations("Hero");

  return (
    <ul className="hero-trust">
      <li>{shop("legal")}</li>
      <li>{shop("tax")}</li>
      <li>{shop("license")}</li>
      <li>{hero("rating")}</li>
    </ul>
  );
}
