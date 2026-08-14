import { Calendar } from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { PlanShowcase } from "@/components/landing/plan-showcase";
import { HeroMedia } from "@/components/landing/hero-media";
import { FloatBook } from "@/components/landing/float-book";
import { LandingMore } from "@/components/landing/landing-more";
import { HtmlTheme } from "@/components/layout/html-theme";
import type { LandingCopy } from "@/components/landing/copy";
import type { PlanWithTranslation } from "@/lib/plans/types";
import { Link } from "@/i18n/navigation";
import { bookingHref } from "@/lib/booking/path";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

export function HudLanding({ plans, locale, copy }: Props) {
  return (
    <div className="landing-root hud-root" data-theme="hud" id="top">
      <HtmlTheme theme="hud" />
      <div className="hud-scan" aria-hidden />
      <div className="hud-shell">
        <SiteNav
          theme="hud"
          changeLook={copy.changeLook}
          plans={copy.nav.plans}
          videos={copy.nav.videos}
          faq={copy.nav.faq}
          booking={copy.nav.booking}
          calendar={copy.nav.calendar}
        />

        <div className="hud-stage">
          <section className="hud-hero">
            <div className="hud-cam">
              <HeroMedia theme="hud" />
              <p className="hud-cam-tag">CAM_01 // LIVE</p>
            </div>
            <div className="hud-hero-copy">
              <p className="hud-chip">SYS // OSAKA-01</p>
              <h1>
                {copy.hero.title}
                {copy.hero.titleRest ? (
                  <>
                    <br />
                    {copy.hero.titleRest}
                  </>
                ) : null}
              </h1>
              <p>{copy.hero.subtitle}</p>
              <Link
                href={bookingHref("hud")}
                className="hero-cta-hud mt-8 inline-flex items-center gap-2 px-6 py-3"
              >
                <Calendar className="size-4" />
                {copy.hero.cta}
              </Link>
            </div>
            <aside className="hud-telemetry">
              <p>LAT 34.6686</p>
              <p>LNG 135.5019</p>
              <p className="mt-4">SLOT_OK ........ TRUE</p>
              <p>LICENSE ........ REQUIRED</p>
              <p>GUIDE .......... ON</p>
              <p>WEATHER ....... NIGHT</p>
              <p className="hud-go">GO &gt;</p>
            </aside>
          </section>

          <section className="hud-section">
            <p className="hud-kicker">{copy.plan.flowTitle}</p>
            <ol className="hud-protocol">
              {copy.plan.flow.map((step) => (
                <li key={step.n}>
                  <code>STEP_{step.n}</code>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="plans" className="hud-section">
            <p className="hud-kicker">{copy.plan.title}</p>
            <p className="hud-lead">{copy.plan.lead}</p>
            <PlanShowcase
              plans={plans}
              locale={locale}
              theme="hud"
              labels={copy.labels}
            />
          </section>

          <section className="hud-section">
            <p className="hud-kicker">{copy.featuresTitle}</p>
            <div className="hud-rail">
              {copy.features.map((item) => (
                <article key={item.id}>
                  <span>{item.id}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="videos" className="hud-section">
            <p className="hud-kicker">{copy.videosTitle}</p>
            <div className="hud-videos">
              {copy.videos.map((clip, index) => (
                <article key={clip.id}>
                  <img
                    src={
                      [
                        "/images/videos/cover-1.jpg",
                        "/images/social/kadingche.webp",
                        "/images/social/s4.webp",
                      ][index]
                    }
                    alt=""
                  />
                  <p>{clip.title}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="hud-section">
            <p className="hud-kicker">{copy.reviewsTitle}</p>
            <div className="hud-logs">
              {copy.reviews.map((item, index) => (
                <blockquote key={item.meta}>
                  <p>&gt; LOG_{String(index + 1).padStart(2, "0")}</p>
                  <p>{item.quote}</p>
                  <footer>{item.meta}</footer>
                </blockquote>
              ))}
            </div>
          </section>

          <section id="faq" className="hud-section hud-faq">
            <p className="hud-kicker">{copy.faqTitle}</p>
            {copy.faqs.map((item) => (
              <details key={item.q}>
                <summary>[Q] {item.q}</summary>
                <p>[A] {item.a}</p>
              </details>
            ))}
          </section>

          <section id="access" className="hud-section">
            <p className="hud-kicker">{copy.access.title}</p>
            <p>{copy.access.walk}</p>
            <p className="opacity-50">{copy.access.address}</p>
          </section>

          <LandingMore plans={plans} locale={locale} theme="hud" />
          <footer className="hud-foot">{copy.footer}</footer>
        </div>
      </div>
      <FloatBook theme="hud" label={copy.nav.booking} />
    </div>
  );
}
