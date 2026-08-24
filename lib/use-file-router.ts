"use client";

import { useLocale } from "next-intl";
import { useRouter as useIntlRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { isFileProtocol, navigateToHref } from "@/lib/file-href";

type Href = string;
type Opts = { locale?: AppLocale };

export function useFileRouter() {
  const router = useIntlRouter();
  const locale = useLocale();

  return {
    ...router,
    prefetch(href?: Href) {
      if (isFileProtocol()) return;
      return router.prefetch?.(href as never);
    },
    push(href: Href, opts?: Opts) {
      if (isFileProtocol()) {
        navigateToHref(href, opts?.locale ?? locale);
        return;
      }
      return router.push(href, opts);
    },
    replace(href: Href, opts?: Opts) {
      if (isFileProtocol()) {
        navigateToHref(href, opts?.locale ?? locale);
        return;
      }
      return router.replace(href, opts);
    },
  };
}
