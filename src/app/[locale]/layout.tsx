import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { FileProtocolNav } from "@/components/file-protocol-nav";
import { PromoCapture } from "@/components/promo/promo-capture";
import { LocaleGate } from "@/components/site/locale-switcher";
import { routing } from "@/i18n/routing";
import { acidPaletteBootScript } from "@/lib/acid-palette";

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
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&family=Noto+Sans+TC:wght@900&family=Bungee&display=swap"
        />
      </head>
      <body className="min-h-dvh bg-black text-[#F5F5F7] antialiased">
        <script dangerouslySetInnerHTML={{ __html: acidPaletteBootScript() }} />
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="Asia/Tokyo"
        >
          <FileProtocolNav />
          <PromoCapture />
          <LocaleGate />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
