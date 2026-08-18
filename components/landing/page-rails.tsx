import type { SiteTheme } from "@/lib/visual-theme";

const RAIL = "FURTURE KART OSAKA  ·  STREET KART  ·  ";

export function PageRails({ theme }: { theme: SiteTheme }) {
  return (
    <div className={`page-rails page-rails-${theme}`} aria-hidden>
      <b>{RAIL.repeat(3)}</b>
      <b>{RAIL.repeat(3)}</b>
    </div>
  );
}
