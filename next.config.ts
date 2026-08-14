import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const repo = "osaka-kart";
const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: pages ? `/${repo}` : "",
  assetPrefix: pages ? `/${repo}/` : undefined,
};

export default withNextIntl(nextConfig);
