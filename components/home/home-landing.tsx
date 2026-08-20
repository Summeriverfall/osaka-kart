import { HomeCta } from "@/components/home/home-cta";
import { HomeFaq } from "@/components/home/home-faq";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMeeting } from "@/components/home/home-meeting";
import { HomePlans } from "@/components/home/home-plans";
import { HomeReviews } from "@/components/home/home-reviews";
import { HomeSafety } from "@/components/home/home-safety";
import { HomeVideos } from "@/components/home/home-videos";
import { HtmlTheme } from "@/components/layout/html-theme";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatBook, SiteNav } from "@/components/site/site-nav";
import type { SiteTheme } from "@/lib/visual-theme";
import type { PlanWithTranslation } from "@/lib/plans/types";

type HomeLandingProps = {
  look: SiteTheme;
  plans: PlanWithTranslation[];
  locale: string;
};

export function HomeLanding({ look, plans, locale }: HomeLandingProps) {
  return (
    <div
      id="top"
      className="landing-root bg-[#0A0A0F] text-[#F1F1F5]"
      data-theme={look}
    >
      <HtmlTheme theme={look} />
      <SiteNav look={look} />
      <HomeHero look={look} />
      <HomePlans plans={plans} locale={locale} />
      <HomeVideos limit={4} />
      <HomeReviews />
      <HomeSafety />
      <HomeFaq />
      <HomeMeeting />
      <HomeCta />
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
