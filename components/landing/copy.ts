import { getTranslations } from "next-intl/server";

export async function getLandingCopy() {
  const [plan, nav, faq, footer, hero, safety, videos, reviews, meet, gateway] =
    await Promise.all([
      getTranslations("Plan"),
      getTranslations("Nav"),
      getTranslations("Faq"),
      getTranslations("Footer"),
      getTranslations("Hero"),
      getTranslations("Safety"),
      getTranslations("VideosHome"),
      getTranslations("ReviewsHome"),
      getTranslations("Meet"),
      getTranslations("Gateway"),
    ]);

  return {
    home: {
      eyebrow: "",
      title: hero("title"),
      subtitle: hero("subtitle"),
      cta: hero("cta"),
    },
    hero: {
      title: hero("title"),
      titleRest: hero("titleRest"),
      subtitle: hero("subtitle"),
      cta: hero("cta"),
      rating: hero("rating"),
    },
    nav: {
      plans: nav("plans"),
      videos: nav("videos"),
      faq: nav("faq"),
      booking: nav("booking"),
      calendar: nav("calendar"),
    },
    changeLook: gateway("changeLook"),
    look: {
      neon: gateway("neonLead"),
      acid: gateway("acidLead"),
      oni: gateway("oniLead"),
      glitch: gateway("glitchLead"),
    },
    featuresTitle: safety("title"),
    features: [
      { id: "01", title: safety("s1Title"), body: safety("s1Body") },
      { id: "02", title: safety("s2Title"), body: safety("s2Body") },
      { id: "03", title: safety("s3Title"), body: safety("s3Body") },
    ],
    videosTitle: videos("title"),
    videosLead: videos("lead"),
    videos: [
      { id: "1", title: videos("v1") },
      { id: "2", title: videos("v2") },
      { id: "3", title: videos("v3") },
    ],
    faqTitle: faq("title"),
    faqs: [
      { q: faq("q1"), a: faq("a1") },
      { q: faq("q2"), a: faq("a2") },
      { q: faq("q3"), a: faq("a3") },
      { q: faq("q4"), a: faq("a4") },
      { q: faq("q5"), a: faq("a5") },
    ],
    access: {
      title: meet("title"),
      walk: meet("walk"),
      address: meet("address"),
    },
    reviewsTitle: reviews("title"),
    reviews: [
      { quote: reviews("r1Quote"), name: reviews("r1Name"), meta: reviews("r1Country") },
      { quote: reviews("r2Quote"), name: reviews("r2Name"), meta: reviews("r2Country") },
      { quote: reviews("r3Quote"), name: reviews("r3Name"), meta: reviews("r3Country") },
    ],
    plan: {
      title: plan("title"),
      lead: plan("lead"),
      flowTitle: plan("flow"),
      flow: [
        { n: "01", title: plan("flow1Title"), body: plan("flow1Body") },
        { n: "02", title: plan("flow2Title"), body: plan("flow2Body") },
        { n: "03", title: plan("flow3Title"), body: plan("flow3Body") },
        { n: "04", title: plan("flow4Title"), body: plan("flow4Body") },
      ],
    },
    labels: {
      select: plan("select"),
      duration: plan("duration"),
      distance: plan("distance"),
      perPerson: plan("perPerson"),
      includes: plan("includes"),
      route: plan("route"),
      notes: plan("notes"),
      continue: plan("continue"),
      selected: plan("selected"),
      booking: nav("booking"),
      comingSoon: plan("lead"),
    },
    footer: footer("copyright"),
  };
}

export type LandingCopy = Awaited<ReturnType<typeof getLandingCopy>>;
