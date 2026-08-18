"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { withSlash } from "@/lib/paths";
import { routing, type AppLocale } from "@/i18n/routing";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";
import zhTW from "@/messages/zh-TW.json";

const ALL_MESSAGES = {
  en,
  ja,
  "zh-TW": zhTW,
  ko,
} as const;

type Messages = (typeof ALL_MESSAGES)[AppLocale];

type LocaleContextValue = {
  locale: AppLocale;
  switchLocale: (next: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocaleSwitch() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleSwitch must be used inside I18nProvider");
  }
  return ctx;
}

type I18nProviderProps = {
  locale: AppLocale;
  messages: typeof en;
  children: ReactNode;
};

export function I18nProvider({
  locale,
  messages,
  children,
}: I18nProviderProps) {
  const [current, setCurrent] = useState<AppLocale>(locale);
  const [msgs, setMsgs] = useState<Messages>(messages as Messages);

  useEffect(() => {
    setCurrent(locale);
    setMsgs(ALL_MESSAGES[locale]);
  }, [locale]);

  return (
    <NextIntlClientProvider locale={current} messages={msgs} timeZone="Asia/Tokyo">
      <LocaleSwitchBridge
        current={current}
        setCurrent={setCurrent}
        setMsgs={setMsgs}
      >
        {children}
      </LocaleSwitchBridge>
    </NextIntlClientProvider>
  );
}

function LocaleSwitchBridge({
  current,
  setCurrent,
  setMsgs,
  children,
}: {
  current: AppLocale;
  setCurrent: Dispatch<SetStateAction<AppLocale>>;
  setMsgs: Dispatch<SetStateAction<Messages>>;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = useCallback(
    (next: AppLocale) => {
      if (next === current) return;
      setCurrent(next);
      setMsgs(ALL_MESSAGES[next]);
      document.documentElement.lang = next;
      router.replace(withSlash(pathname), { locale: next });
    },
    [current, pathname, router, setCurrent, setMsgs],
  );

  const value = useMemo(
    () => ({ locale: current, switchLocale }),
    [current, switchLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "EN",
  ja: "日",
  "zh-TW": "繁",
  ko: "한",
};

export { routing };
