"use client";

import { useTranslations } from "next-intl";
import { SITE_CONTACT } from "@/lib/contact";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.5 7.2a3.2 3.2 0 0 0-2.25-2.27C18.4 4.5 12 4.5 12 4.5s-6.4 0-8.25.43A3.2 3.2 0 0 0 1.5 7.2 33 33 0 0 0 1.07 12a33 33 0 0 0 .43 4.8 3.2 3.2 0 0 0 2.25 2.27C5.6 19.5 12 19.5 12 19.5s6.4 0 8.25-.43a3.2 3.2 0 0 0 2.25-2.27A33 33 0 0 0 22.93 12a33 33 0 0 0-.43-4.8ZM10 15.2V8.8l5.5 3.2L10 15.2Z" />
    </svg>
  );
}

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer id="footer" className="border-t border-white/10 bg-[#0A0A0F] px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="neon-text text-sm font-black tracking-[0.2em]">OSAKA KART</p>
        <p className="text-sm text-gray-400">{t("company")}</p>
        <div className="flex items-center gap-4 text-gray-400">
          <span className="text-xs uppercase tracking-widest">{t("social")}</span>
          <a href={SITE_CONTACT.instagram} aria-label="Instagram" className="hover:text-neon-pink">
            <InstagramIcon className="size-5" />
          </a>
          <a href={SITE_CONTACT.youtube} aria-label="YouTube" className="hover:text-neon-pink">
            <YoutubeIcon className="size-5" />
          </a>
        </div>
        <p className="text-xs text-gray-500">{t("copyright")}</p>
      </div>
    </footer>
  );
}
