"use client";

import { HomeFaq } from "@/components/home/home-faq";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatBook, SiteNav } from "@/components/site/site-nav";
import { Shield, IdCard, Footprints, CloudRain } from "lucide-react";
import { useTranslations } from "next-intl";

const COUNTRIES = [
  { code: "US", name: "美国", body: "州驾照通常可用。建议同时携带 1949 年日内瓦公约国际驾驶许可，现场核对更快。" },
  { code: "CN", name: "中国", body: "中国驾照不能在日本公路驾驶。必须出示原件 + 1949 年日内瓦公约国际驾驶许可。" },
  { code: "JP", name: "日本", body: "出示有效日本驾照即可。" },
  { code: "UK", name: "英国", body: "带照片的驾照。是否需要国际许可视签发时间而定，建议一并携带。" },
  { code: "EU", name: "欧盟", body: "本国驾照可使用。国际许可方便工作人员核对。" },
  { code: "OT", name: "其他", body: "以 1949 年日内瓦公约国际驾驶许可为准。报名前把驾照照片发给我们核对。" },
];

const SAFETY = [
  { icon: Shield, title: "戴盔上路", body: "车辆移动时必须戴头盔。出发前工作人员帮你调松紧。" },
  { icon: Footprints, title: "跟头车", body: "不要超车、不要竞速。头车定节奏，手势即停。" },
  { icon: IdCard, title: "包头鞋", body: "必须穿包头鞋。拖鞋、高跟鞋不能开。" },
  { icon: CloudRain, title: "雨天预案", body: "小雨发雨衣照常走。暴雨或台风免费改期或退款。" },
];

export function HelpContent() {
  const t = useTranslations("Help");

  return (
    <div className="help-page bg-[#0A0A0F]">
      <SiteNav />
      <main className="help-main">
        <p className="shop-kicker">Help</p>
        <h1>{t("title")}</h1>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black">{t("licenseTitle")}</h2>
          <p className="mb-6 text-[#9CA3AF]">{t("licenseLead")}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {COUNTRIES.map((item) => (
              <article key={item.code} className="rounded-2xl border border-white/10 bg-[#12121A] p-5">
                <p className="text-xs tracking-[0.16em] text-neon-pink uppercase">{item.code}</p>
                <h3 className="mt-2 font-black">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-black">{t("safetyTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SAFETY.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-[#12121A] p-5">
                <item.icon className="size-5 text-neon-pink" />
                <h3 className="mt-3 font-black">{item.title}</h3>
                <p className="mt-2 text-sm text-[#9CA3AF]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <HomeFaq />
      <SiteFooter />
      <FloatBook />
    </div>
  );
}
