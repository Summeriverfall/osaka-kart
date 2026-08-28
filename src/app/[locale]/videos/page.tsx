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
    <div className="ok-page ok-page-pad">
      <SiteNav />
      <HomeVideos />
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
