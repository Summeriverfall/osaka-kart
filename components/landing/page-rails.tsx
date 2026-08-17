import type { SiteTheme } from "@/lib/visual-theme";

const RAIL: Record<SiteTheme, string> = {
  neon: "NEON NIGHT  ·  FURTURE KART OSAKA  ·  ",
  acid: "ACID STREET  ·  OSAKA NIGHT RUN  ·  ",
  oni: "鬼巷  ·  ONI ALLEY  ·  OSAKA  ·  ",
  glitch: "SIGNAL LOST  ·  CH-04  ·  OSAKA  ·  ",
};

export function PageRails({ theme }: { theme: SiteTheme }) {
  const label = RAIL[theme];
  return (
    <div className={`page-rails page-rails-${theme}`} aria-hidden>
      <b>{label.repeat(3)}</b>
      <b>{label.repeat(3)}</b>
    </div>
  );
}
