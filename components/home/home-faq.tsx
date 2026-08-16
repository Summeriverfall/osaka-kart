"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function HomeFaq() {
  const t = useTranslations("Faq");
  const items = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
  ];

  return (
    <section id="faq" className="bg-[#0A0A0F] py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-8 text-center text-3xl font-black md:text-4xl">
          {t("title")}
        </h2>
        <Accordion
          defaultValue={["q0"]}
          className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#12121A] px-5"
        >
          {items.map((item, index) => (
            <AccordionItem key={item.q} value={`q${index}`}>
              <AccordionTrigger className="text-lg text-[#F1F1F5] hover:no-underline hover:text-[var(--neon-pink)]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-7 text-gray-200">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
