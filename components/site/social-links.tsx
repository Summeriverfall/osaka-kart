"use client";

import { useLiveCms } from "@/lib/live-cms";

type SocialLinksProps = {
  className?: string;
};

const LINKS = [
  { key: "instagram" as const, label: "Instagram", icon: InstagramIcon },
  { key: "x" as const, label: "X", icon: XIcon },
  { key: "youtube" as const, label: "YouTube", icon: YoutubeIcon },
  { key: "tiktok" as const, label: "TikTok", icon: TikTokIcon },
  { key: "facebook" as const, label: "Facebook", icon: FacebookIcon },
  { key: "line" as const, label: "LINE", icon: LineIcon },
];

export function SocialLinks({ className }: SocialLinksProps) {
  const cms = useLiveCms();
  const items = LINKS.map((item) => ({ ...item, href: cms.site.social[item.key]?.trim() })).filter((item) => item.href);

  if (!items.length) return null;

  return (
    <nav className={className ?? "social-links"} aria-label="Social">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
        >
          <item.icon />
        </a>
      ))}
    </nav>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.7 10.3 22 2h-2.2l-6.2 6.9L8.7 2H2l7.7 10.9L2 22h2.2l6.8-7.6L15.3 22H22l-7.3-11.7Zm-2.4 2.7-.8-1.1L5 3.5h2.6l5.2 7.2.8 1.1L19.2 20.5h-2.6l-4.3-7.5Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.5 7.2a3.2 3.2 0 0 0-2.25-2.27C18.4 4.5 12 4.5 12 4.5s-6.4 0-8.25.43A3.2 3.2 0 0 0 1.5 7.2 33 33 0 0 0 1.07 12a33 33 0 0 0 .43 4.8 3.2 3.2 0 0 0 2.25 2.27C5.6 19.5 12 19.5 12 19.5s6.4 0 8.25-.43a3.2 3.2 0 0 0 2.25-2.27A33 33 0 0 0 22.93 12a33 33 0 0 0-.43-4.8ZM10 15.2V8.8l5.5 3.2L10 15.2Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.2 3c.4 2.6 1.9 4.3 4.4 4.6v2.7c-1.5 0-2.9-.5-4.1-1.4v6.5c0 3.4-2.6 6-6.2 6.1A6.2 6.2 0 0 1 8.2 9.6v2.8c.5-.2 1-.3 1.6-.3 1.4 0 2.6 1.1 2.6 2.6V3h1.8Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.2 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.5 1.6-1.5h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H8.2v3.2h2.6V22h3.4Z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3.5c-5.1 0-9.2 3.3-9.2 7.4 0 3.7 3.3 6.8 7.7 7.3.3 0 .7.2.8.5l.5 1.7c.1.4.5.5.8.3l2.2-1.2c.2-.1.3-.1.5-.1 4.8-.3 8.4-3.5 8.4-7.5 0-4.1-4.1-7.4-9.2-7.4Zm-4.4 9.3H6.2V8.8h1.4v4Zm2.4 0H9.6c-.4 0-.7-.3-.7-.7V8.8h1.4v3.2h1.1v1.4Zm3.2 0h-1.4l1.6-4.4h-1.3l-1 2.8-1-2.8H8.7l1.6 4.4H9v.1h4.2v-1.5Zm4.2 0h-2.6c-.4 0-.7-.3-.7-.7V8.8h1.4v3.2h1.9v1.4Z" />
    </svg>
  );
}
