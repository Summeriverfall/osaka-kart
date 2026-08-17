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
