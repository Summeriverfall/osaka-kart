export function formatJpy(amount: number, locale = "en") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatYenShort(amount: number) {
  return `¥${amount.toLocaleString("en-US")}`;
}

export function formatYenCell(amount: number) {
  return `¥${amount}`;
}

export function formatBookDate(iso: string, locale = "en") {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  const loc = locale === "zh-TW" ? "zh-Hant" : locale;
  return new Intl.DateTimeFormat(loc, { month: "long", day: "numeric" }).format(new Date(year, month - 1, day));
}

export function formatBookDateLong(iso: string, locale = "en") {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  const loc = locale === "zh-TW" ? "zh-Hant" : locale;
  return new Intl.DateTimeFormat(loc, { year: "numeric", month: "long", day: "numeric" }).format(new Date(year, month - 1, day));
}
