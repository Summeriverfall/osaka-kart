import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SITE_BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: {
    default: SITE_BRAND,
    template: `%s | ${SITE_BRAND}`,
  },
  description: "Street kart experience in Osaka",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
