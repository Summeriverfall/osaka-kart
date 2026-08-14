import { Calendar } from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { PlanShowcase } from "@/components/landing/plan-showcase";
import { HeroMedia } from "@/components/landing/hero-media";
import { HeroScroll } from "@/components/landing/hero-scroll";
import { FloatBook } from "@/components/landing/float-book";
import { LandingMore } from "@/components/landing/landing-more";
import { HtmlTheme } from "@/components/layout/html-theme";
import type { LandingCopy } from "@/components/landing/copy";
import type { PlanWithTranslation } from "@/lib/plans/types";
import { asset } from "@/lib/asset";
import { Link } from "@/i18n/navigation";
import { bookingHref } from "@/lib/booking/path";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

export function NeonLanding({ plans, locale, copy }: Props) {
  return (
    <div className="landing-root neon-root" data-theme="neon" id="top">
      <HtmlTheme theme="neon" />
      <div className="neon-grain" aria-hidden />
      <SiteNav
        theme="neon"
        changeLook={copy.changeLook}
        plans={copy.nav.plans}
        videos={copy.nav.videos}
        faq={copy.nav.faq}
        booking={copy.nav.booking}
        calendar={copy.nav.calendar}
      />

      <section className="neon-hero">
        <HeroMedia theme="neon" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <h1 className="neon-text text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl">
            {copy.hero.title}
            {copy.hero.titleRest ? (
              <>
                <br className="hidden md:block" /> {copy.hero.titleRest}
              </>
            ) : null}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light tracking-wide text-gray-300 md:text-2xl">
            {copy.hero.subtitle}
          </p>
          <Link
            href={bookingHref("neon")}
            className="hero-cta-neon mt-8 inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold"
          >
            <Calendar className="size-5" />
            {copy.hero.cta}
          </Link>
        </div>
        <HeroScroll theme="neon" label={copy.nav.plans} />
      </section>

      <section className="neon-section">
        <div className="neon-wrap">
          <h2 className="neon-h2">{copy.featuresTitle}</h2>
          <div className="neon-features">
            {copy.features.map((item) => (
              <article key={item.id} className="neon-glass">
                <p className="neon-index">{item.id}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="neon-section neon-flow-band">
        <div className="neon-wrap">
          <h2 className="neon-h2">{copy.plan.flowTitle}</h2>
          <ol className="neon-flow">
            {copy.plan.flow.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="plans" className="neon-section">
        <div className="neon-wrap">
          <h2 className="neon-h2">{copy.plan.title}</h2>
          <p className="neon-lead">{copy.plan.lead}</p>
          <PlanShowcase
            plans={plans}
            locale={locale}
            theme="neon"
            labels={copy.labels}
          />
        </div>
      </section>

      <section id="videos" className="neon-section">
        <div className="neon-wrap">
          <h2 className="neon-h2">{copy.videosTitle}</h2>
          <div className="neon-videos">
            {copy.videos.map((clip, index) => (
              <article key={clip.id} className="neon-glass overflow-hidden">
                <img
                  src={
                    asset(
                      [
                        "/images/videos/cover-1.jpg",
                        "/images/videos/cover-2.png",
                        "/images/social/yejiankadingche.webp",
                      ][index],
                    )
                  }
                  alt=""
                  className="neon-video-frame"
                />
                <p>{clip.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="neon-section">
        <div className="neon-wrap">
          <h2 className="neon-h2">{copy.reviewsTitle}</h2>
          <div className="neon-reviews">
            {copy.reviews.map((item) => (
              <blockquote key={item.meta} className="neon-glass neon-quote">
                <p>“{item.quote}”</p>
                <footer>{item.meta}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="neon-section">
        <div className="neon-wrap neon-faq-wrap">
          <h2 className="neon-h2">{copy.faqTitle}</h2>
          <div className="neon-faq">
            {copy.faqs.map((item) => (
              <details key={item.q} className="neon-glass">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="access" className="neon-section neon-access">
        <h2 className="neon-h2">{copy.access.title}</h2>
        <p>{copy.access.walk}</p>
        <p className="opacity-60">{copy.access.address}</p>
      </section>

      <LandingMore plans={plans} locale={locale} theme="neon" />
      <footer className="neon-foot">{copy.footer}</footer>
      <FloatBook theme="neon" label={copy.nav.booking} />
    </div>
  );
}
