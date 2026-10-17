import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const repo = "osaka-kart";
const pages = process.env.GITHUB_PAGES === "true";
const siteBase = (process.env.SITE_BASE || (pages ? `/${repo}` : "")).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: siteBase,
  assetPrefix: siteBase ? `${siteBase}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: siteBase,
  },
};

export default withNextIntl(nextConfig);
