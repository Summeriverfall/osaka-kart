import { BookingNoticeDoc } from "@/components/notes/ride-notes";
import { HomeFaq } from "@/components/home/home-faq";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export function HelpContent() {
  const t = useTranslations("Help");
  const nav = useTranslations("Nav");

  return (
    <div className="ok-page">
      <SiteNav />
      <header className="ok-page-head ok-page-head-pad">
        <div className="ok-sec-wide">
          <p className="ok-kicker">{nav("help")}</p>
          <h1>{t("title")}</h1>
        </div>
      </header>

      <HomeFaq kicker={nav("faq")} />

      <section id="license" className="ok-sec ok-sec-alt">
        <div className="ok-sec-wide">
          <header className="ok-sec-head">
            <p className="ok-kicker">License</p>
            <h2>{t("licenseTitle")}</h2>
            <p className="ok-sec-lead">{t("licenseLead")}</p>
          </header>
          <BookingNoticeDoc />
        </div>
      </section>

      <section id="safety" className="ok-sec">
        <div className="ok-sec-wide">
          <header className="ok-sec-head">
            <p className="ok-kicker">Safety</p>
            <h2>{t("safetyTitle")}</h2>
          </header>
          <article className="ok-panel ok-panel-wide">
            <Shield className="size-5 text-[var(--ok-pink)]" />
            <p className="mt-3">{t("safetyBody")}</p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
