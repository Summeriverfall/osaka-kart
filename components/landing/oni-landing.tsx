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
import { asset } from "@/lib/asset";

type Props = {
  plans: PlanWithTranslation[];
  locale: string;
  copy: LandingCopy;
};

export function OniLanding({ plans, locale, copy }: Props) {
  return (
    <div className="oni-shell" data-theme="oni" id="top">
      <HtmlTheme theme="oni" />
      <aside className="oni-spine" aria-hidden>
        <span>鬼</span>
        <span>OSAKA KART</span>
        <span>{copy.look.oni}</span>
      </aside>

      <div className="oni-main">
        <SiteNav
          theme="oni"
          changeLook={copy.changeLook}
          plans={copy.nav.plans}
          videos={copy.nav.videos}
          faq={copy.nav.faq}
          booking={copy.nav.booking}
          calendar={copy.nav.calendar}
        />

        <section className="oni-hero">
          <div className="oni-hero-copy">
            <p className="oni-stamp">{copy.look.oni}</p>
            <h1>
              {copy.hero.title}
              <em>{copy.hero.titleRest}</em>
            </h1>
            <p>{copy.hero.subtitle}</p>
            <Link href={bookingHref("oni")} className="cta-btn">
              {copy.hero.cta}
            </Link>
          </div>
          <div className="oni-hero-screen">
            <HeroMedia theme="oni" />
            <p className="oni-hero-mark">鬼</p>
          </div>
        </section>

        <section className="oni-ofuda-row">
          {copy.features.map((item) => (
            <article key={item.id} className="oni-ofuda">
              <b>{item.id}</b>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </section>

        <section id="plans" className="oni-lanterns">
          <h2>{copy.plan.title}</h2>
          <div className="oni-lantern-track">
            {plans.map((plan) => (
              <article key={plan.id}>
                <img src={planImage(plan.slug)} alt="" />
                <div>
                  <h3>{plan.translation.name}</h3>
                  <p>{formatJpy(plan.base_price_jpy, locale)}</p>
                  <Link href={bookingHref("oni", plan.slug)}>{copy.labels.select}</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ol className="oni-steps">
          {copy.plan.flow.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <section id="videos" className="oni-frames">
          <h2>{copy.videosTitle}</h2>
          <div>
            {copy.videos.map((clip, index) => (
              <figure key={clip.id}>
                <img
                  src={
                  asset(
                    ["/images/reviews/r1.webp", "/images/hero/poster.webp", "/images/social/33.webp"][
                      index
                    ],
                  )
                  }
                  alt=""
                />
                <figcaption>{clip.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="oni-ema-wall">
          <h2>{copy.reviewsTitle}</h2>
          <div>
            {copy.reviews.map((item) => (
              <blockquote key={item.meta}>
                <p>{item.quote}</p>
                <footer>{item.meta}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="faq" className="oni-faq">
          <h2>{copy.faqTitle}</h2>
          {copy.faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>

        <section id="access" className="oni-gate">
          <div>
            <h2>{copy.access.title}</h2>
            <p>{copy.access.walk}</p>
            <p>{copy.access.address}</p>
            <Link href={bookingHref("oni")} className="cta-btn">
              {copy.nav.booking}
            </Link>
          </div>
        </section>

        <LandingMore plans={plans} locale={locale} theme="oni" />
        <footer className="oni-foot">{copy.footer}</footer>
      </div>
      <FloatBook theme="oni" label={copy.nav.booking} />
    </div>
  );
}
