import { HomeVideos } from "@/components/home/home-videos";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatBook, SiteNav } from "@/components/site/site-nav";
import type { AppLocale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: AppLocale }> };

export default async function VideosPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-dvh bg-[#0A0A0F] pt-16">
      <SiteNav />
      <HomeVideos />
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
