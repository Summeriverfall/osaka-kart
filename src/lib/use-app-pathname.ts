"use client";

import { usePathname } from "@/i18n/navigation";
import { fileAppPathname, isFileProtocol } from "@/lib/file-href";

export function useAppPathname() {
  const intl = usePathname();
  if (isFileProtocol()) {
    return fileAppPathname() ?? intl;
  }
  return intl;
}
