import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/landing/site-nav";
import { HeroMedia } from "@/components/landing/hero-media";
import { FloatBook } from "@/components/landing/float-book";
import { LandingMore } from "@/components/landing/landing-more";
import { HtmlTheme } from "@/components/layout/html-theme";
import type { LandingCopy } from "@/components/landing/copy";
import type { PlanWithTranslation } from "@/lib/plans/types";
import { formatJpy } from "@/lib/format";
import { planImage } from "@/lib/media";
import { bookingHref } from "@/lib/booking/path";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

const MARQUEE = " SIGNAL_LOST // STREET_LEGAL // OSAKA_KART // 0x7F ";

export function GlitchLanding({ plans, locale, copy }: Props) {
  return (
    <div className="glitch-shell" data-theme="glitch" id="top">
      <HtmlTheme theme="glitch" />
      <p className="glitch-marquee" aria-hidden>
        <span>
          {Array.from({ length: 10 })
            .map(() => MARQUEE)
            .join("")}
        </span>
      </p>

      <SiteNav
        theme="glitch"
        changeLook={copy.changeLook}
        plans={copy.nav.plans}
        videos={copy.nav.videos}
        faq={copy.nav.faq}
        booking={copy.nav.booking}
        calendar={copy.nav.calendar}
      />

      <section className="glitch-hero">
        <HeroMedia theme="glitch" />
        <div className="glitch-hero-type">
          <p>ERR_OK / CAM_OVERFLOW</p>
          <h1>
            {copy.hero.title}
            <span>{copy.hero.titleRest}</span>
          </h1>
          <p>{copy.hero.subtitle}</p>
          <Link href={bookingHref("glitch")} className="cta-btn">
            {copy.hero.cta}
          </Link>
        </div>
      </section>

      <section id="videos" className="glitch-mosaic">
        <h2>{copy.videosTitle}</h2>
        <div>
          {copy.videos.map((clip, index) => (
            <figure key={clip.id} className={index === 0 ? "big" : undefined}>
              <img
                src={
                  ["/images/hero/poster.webp", "/images/social/22.webp", "/images/social/s4.webp"][
                    index
                  ]
                }
                alt=""
              />
              <figcaption>{clip.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="plans" className="glitch-stack">
        <h2>{copy.plan.title}</h2>
        {plans.map((plan, index) => (
          <article key={plan.id} className={`layer-${index}`}>
            <img src={planImage(plan.slug)} alt="" />
            <div>
              <h3>{plan.translation.name}</h3>
              <p>{formatJpy(plan.base_price_jpy, locale)}</p>
              <p>{plan.translation.description}</p>
              <Link href={bookingHref("glitch", plan.slug)}>{copy.labels.select}</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="glitch-split">
        {copy.features.map((item, index) => (
          <article key={item.id} className={`shift-${index}`}>
            <span>{item.id}</span>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="glitch-comments">
        <h2>{copy.reviewsTitle}</h2>
        {copy.reviews.map((item, index) => (
          <blockquote key={item.meta}>
            <code>#{index + 1} user_ok</code>
            <p>{item.quote}</p>
            <footer>{item.meta}</footer>
          </blockquote>
        ))}
      </section>

      <section id="faq" className="glitch-faq">
        <h2>{copy.faqTitle}</h2>
        {copy.faqs.map((item, index) => (
          <details key={item.q} className={`faq-shift-${index % 2}`}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section id="access" className="glitch-band">
        <div>
          <h2>{copy.access.title}</h2>
          <p>{copy.access.walk}</p>
          <p>{copy.access.address}</p>
        </div>
        <Link href={bookingHref("glitch")} className="cta-btn">
          {copy.nav.booking}
        </Link>
      </section>

      <LandingMore plans={plans} locale={locale} theme="glitch" />
      <footer className="glitch-foot">{copy.footer}</footer>
      <FloatBook theme="glitch" label={copy.nav.booking} />
    </div>
  );
}
