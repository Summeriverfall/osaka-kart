import { Link } from "@/i18n/navigation";
import { bookingHref } from "@/lib/booking/path";
import type { SiteTheme } from "@/lib/visual-theme";

type FloatBookProps = {
  theme: SiteTheme;
  label: string;
};

export function FloatBook({ theme, label }: FloatBookProps) {
  return (
    <Link href={bookingHref(theme)} className={`float-book float-book-${theme}`}>
      {label}
    </Link>
  );
}
