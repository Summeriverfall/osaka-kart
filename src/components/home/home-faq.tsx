"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { localeText, localizedList, useLiveCms } from "@/lib/live-cms";

export function HomeFaq({ kicker }: { kicker?: string }) {
  const t = useTranslations("Faq");
  const locale = useLocale();
  const cms = useLiveCms();
  const items = localizedList(cms.faqs).map((item) => ({
    id: item.id,
    q: localeText(item.q, locale),
    a: localeText(item.a, locale),
  }));
  const fallback = [
    { id: "q1", q: t("q1"), a: t("a1") },
    { id: "q2", q: t("q2"), a: t("a2") },
    { id: "q3", q: t("q3"), a: t("a3") },
    { id: "q4", q: t("q4"), a: t("a4") },
    { id: "q5", q: t("q5"), a: t("a5") },
    { id: "q6", q: t("q6"), a: t("a6") },
    { id: "q7", q: t("q7"), a: t("a7") },
    { id: "q8", q: t("q8"), a: t("a8") },
    { id: "q9", q: t("q9"), a: t("a9") },
    { id: "q10", q: t("q10"), a: t("a10") },
  ];
  const list = items.length ? items : fallback;
  const title = localeText(cms.labels.faqTitle, locale, t("title"));

  return (
    <section id="faq" className="ok-sec">
      <div className="ok-sec-wide">
        <header className="ok-sec-head">
          {kicker ? <p className="ok-kicker">{kicker}</p> : null}
          <h2>{title}</h2>
        </header>
        <Accordion multiple className="ok-faq">
          {list.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="ok-faq-item border-0">
              <AccordionTrigger className="text-[1.05rem] text-white hover:no-underline hover:text-[var(--ok-pink)]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[0.95rem] leading-7 text-[var(--ok-g300)]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
