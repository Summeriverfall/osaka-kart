import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/plan", key: "plans" as const },
  { href: "/faq", key: "faq" as const },
  { href: "/videos", key: "videos" as const },
];

export async function Navbar() {
  const t = await getTranslations("Nav");

  return (
    <header className="nav-bar sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="neon-text shrink-0 text-lg font-bold tracking-[0.18em]"
        >
          OSAKA KART
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#F1F1F5] transition-colors hover:text-neon-pink"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Suspense
            fallback={
              <span className="lang-switcher-trigger pointer-events-none opacity-70">
                EN
              </span>
            }
          >
            <LanguageSwitcher />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
