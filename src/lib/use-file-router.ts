"use client";

import { useLocale } from "next-intl";
import { useRouter as useIntlRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { navigateToHref } from "@/lib/file-href";

type Href = string;
type Opts = { locale?: AppLocale };

export function useFileRouter() {
  const router = useIntlRouter();
  const locale = useLocale();

  return {
    ...router,
    prefetch() {
      return;
    },
    push(href: Href, opts?: Opts) {
      navigateToHref(href, opts?.locale ?? locale);
    },
    replace(href: Href, opts?: Opts) {
      navigateToHref(href, opts?.locale ?? locale);
    },
  };
}
