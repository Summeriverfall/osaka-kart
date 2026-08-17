import type { Metadata } from "next";
import "./globals.css";

import { SITE_BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: {
    default: SITE_BRAND,
    template: `%s | ${SITE_BRAND}`,
  },
  description: "Street kart experience in Osaka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
