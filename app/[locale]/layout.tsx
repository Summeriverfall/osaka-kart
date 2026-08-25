import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import {
  Anton,
  Geist,
  Geist_Mono,
  Noto_Serif_JP,
  Orbitron,
  Share_Tech_Mono,
} from "next/font/google";
import { notFound } from "next/navigation";
import { FileProtocolNav } from "@/components/file-protocol-nav";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  preload: false,
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
});

const shareTech = Share_Tech_Mono({
  variable: "--font-share-tech",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`dark ${geistSans.variable} ${geistMono.variable} ${anton.variable} ${orbitron.variable} ${notoSerifJp.variable} ${shareTech.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-[#0A0A0F] text-[#F1F1F5] antialiased">
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="Asia/Tokyo"
        >
          <FileProtocolNav />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
