import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { FileProtocolNav } from "@/components/file-protocol-nav";
import { routing } from "@/i18n/routing";
import "@/styles/admin/admin.css";
import "@/styles/admin/inventory.css";

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

type AdminLocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AdminLocaleLayout({
  children,
  params,
}: AdminLocaleLayoutProps) {
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
      <body className="min-h-dvh bg-[#f5f6f8] text-slate-900 antialiased">
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
