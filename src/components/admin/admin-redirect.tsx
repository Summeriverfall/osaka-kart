"use client";

import { useEffect } from "react";
import { appPageHref, goToAppPath } from "@/lib/file-href";

export function AdminRedirect({ locale, to }: { locale: string; to: string }) {
  useEffect(() => {
    goToAppPath(to, locale);
  }, [locale, to]);

  return (
    <p className="p-6 text-sm text-slate-500">
      <a href={appPageHref(to, locale)}>Continue</a>
    </p>
  );
}
