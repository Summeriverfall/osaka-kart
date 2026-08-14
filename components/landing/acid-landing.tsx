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
import { Link } from "@/i18n/navigation";
import { bookingHref } from "@/lib/booking/path";
import { asset } from "@/lib/asset";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

export function AcidLanding({ plans, locale, copy }: Props) {
  return (
    <div className="landing-root acid-root" data-theme="acid" id="top">
      <HtmlTheme theme="acid" />
      <SiteNav
        theme="acid"
        changeLook={copy.changeLook}
        plans={copy.nav.plans}
        videos={copy.nav.videos}
        faq={copy.nav.faq}
        booking={copy.nav.booking}
        calendar={copy.nav.calendar}
      />

      <section className="acid-hero">
        <HeroMedia theme="acid" />
        <div className="acid-hero-copy">
          <p className="acid-eyebrow">{copy.look.acid}</p>
          <h1 className="acid-mega">
            {copy.hero.title}
            {copy.hero.titleRest ? (
              <>
                <br />
                {copy.hero.titleRest}
              </>
            ) : null}
          </h1>
          <p className="acid-sub">{copy.hero.subtitle}</p>
          <Link href={bookingHref("acid")} className="cta-btn acid-hero-cta inline-flex items-center gap-2">
            <Calendar className="size-5" />
            {copy.hero.cta}
          </Link>
        </div>
        <HeroScroll theme="acid" label={copy.nav.plans} />
      </section>

      <section className="acid-section">
        <h2 className="acid-h2">{copy.featuresTitle}</h2>
        <div className="acid-posters">
          {copy.features.map((item, index) => (
            <article
              key={item.id}
              className={index === 1 ? "acid-poster alt" : "acid-poster"}
            >
              <span>{item.id}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="acid-section acid-steps-band">
        <h2 className="acid-h2">{copy.plan.flowTitle}</h2>
        <ol className="acid-steps">
          {copy.plan.flow.map((step) => (
            <li key={step.n}>
              <b>{step.n}</b>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="plans" className="acid-section">
        <h2 className="acid-h2">{copy.plan.title}</h2>
        <p className="acid-lead">{copy.plan.lead}</p>
        <PlanShowcase
          plans={plans}
          locale={locale}
          theme="acid"
          labels={copy.labels}
        />
      </section>

      <section id="videos" className="acid-section">
        <h2 className="acid-h2">{copy.videosTitle}</h2>
        <div className="acid-videos">
          {copy.videos.map((clip, index) => (
            <article key={clip.id} className={index === 1 ? "flip" : undefined}>
              <img
                src={
                  asset(
                    [
                      "/images/social/22.webp",
                      "/images/social/bianzhuang.webp",
                      "/images/plans/standard.webp",
                    ][index],
                  )
                }
                alt=""
              />
              <p>{clip.title}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="acid-section">
        <h2 className="acid-h2">{copy.reviewsTitle}</h2>
        <div className="acid-stickers">
          {copy.reviews.map((item, index) => (
            <blockquote key={item.meta} className={`rot-${index}`}>
              <p>{item.quote}</p>
              <footer>{item.meta}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section id="faq" className="acid-section acid-faq">
        <h2 className="acid-h2">{copy.faqTitle}</h2>
        {copy.faqs.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section id="access" className="acid-access">
        <h2>{copy.access.title}</h2>
        <p>{copy.access.walk}</p>
        <p>{copy.access.address}</p>
      </section>

      <LandingMore plans={plans} locale={locale} theme="acid" />
      <footer className="acid-foot">{copy.footer}</footer>
      <FloatBook theme="acid" label={copy.nav.booking} />
    </div>
  );
}
