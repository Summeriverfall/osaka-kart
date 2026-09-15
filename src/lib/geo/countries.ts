export type GeoCountry = {
  code: string;
  dial: string;
};

export const COUNTRIES: GeoCountry[] = [
  { code: "US", dial: "1" },
  { code: "CA", dial: "1" },
  { code: "GB", dial: "44" },
  { code: "AU", dial: "61" },
  { code: "NZ", dial: "64" },
  { code: "JP", dial: "81" },
  { code: "CN", dial: "86" },
  { code: "TW", dial: "886" },
  { code: "HK", dial: "852" },
  { code: "MO", dial: "853" },
  { code: "KR", dial: "82" },
  { code: "SG", dial: "65" },
  { code: "MY", dial: "60" },
  { code: "TH", dial: "66" },
  { code: "VN", dial: "84" },
  { code: "ID", dial: "62" },
  { code: "PH", dial: "63" },
  { code: "IN", dial: "91" },
  { code: "AE", dial: "971" },
  { code: "SA", dial: "966" },
  { code: "QA", dial: "974" },
  { code: "FR", dial: "33" },
  { code: "DE", dial: "49" },
  { code: "IT", dial: "39" },
  { code: "ES", dial: "34" },
  { code: "PT", dial: "351" },
  { code: "NL", dial: "31" },
  { code: "BE", dial: "32" },
  { code: "CH", dial: "41" },
  { code: "AT", dial: "43" },
  { code: "SE", dial: "46" },
  { code: "NO", dial: "47" },
  { code: "DK", dial: "45" },
  { code: "FI", dial: "358" },
  { code: "IE", dial: "353" },
  { code: "PL", dial: "48" },
  { code: "CZ", dial: "420" },
  { code: "HU", dial: "36" },
  { code: "GR", dial: "30" },
  { code: "TR", dial: "90" },
  { code: "BR", dial: "55" },
  { code: "MX", dial: "52" },
  { code: "AR", dial: "54" },
  { code: "CL", dial: "56" },
  { code: "ZA", dial: "27" },
  { code: "IL", dial: "972" },
  { code: "RU", dial: "7" },
  { code: "UA", dial: "380" },
  { code: "RO", dial: "40" },
  { code: "HR", dial: "385" },
  { code: "BG", dial: "359" },
  { code: "RS", dial: "381" },
  { code: "SK", dial: "421" },
  { code: "SI", dial: "386" },
  { code: "LT", dial: "370" },
  { code: "LV", dial: "371" },
  { code: "EE", dial: "372" },
  { code: "IS", dial: "354" },
  { code: "LU", dial: "352" },
  { code: "MT", dial: "356" },
  { code: "CY", dial: "357" },
  { code: "EG", dial: "20" },
  { code: "MA", dial: "212" },
  { code: "NG", dial: "234" },
  { code: "KE", dial: "254" },
  { code: "PK", dial: "92" },
  { code: "BD", dial: "880" },
  { code: "LK", dial: "94" },
  { code: "NP", dial: "977" },
  { code: "KH", dial: "855" },
  { code: "LA", dial: "856" },
  { code: "MM", dial: "95" },
  { code: "BN", dial: "673" },
  { code: "PE", dial: "51" },
  { code: "CO", dial: "57" },
  { code: "UY", dial: "598" },
  { code: "CR", dial: "506" },
  { code: "PA", dial: "507" },
  { code: "PR", dial: "1" },
];

const PINNED = ["US", "GB", "AU", "JP", "CN", "TW", "KR", "HK", "SG", "CA", "DE", "FR", "IT", "ES", "TH", "VN", "ID", "MY", "PH", "NZ", "IN", "AE"];

function localeTag(locale: string) {
  if (locale === "zh-TW") return "zh-Hant";
  return locale || "en";
}

export function regionName(code: string, locale: string) {
  try {
    return new Intl.DisplayNames([localeTag(locale), "en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

export function countryByCode(code: string) {
  return COUNTRIES.find((item) => item.code === code);
}

export function defaultDial(locale: string) {
  if (locale === "ja") return "81";
  if (locale === "zh-TW") return "886";
  if (locale === "ko") return "82";
  return "1";
}

export type DialOption = {
  dial: string;
  codes: string[];
};

export function dialOptions(): DialOption[] {
  const map = new Map<string, string[]>();
  for (const item of COUNTRIES) {
    const codes = map.get(item.dial) ?? [];
    if (!codes.includes(item.code)) codes.push(item.code);
    map.set(item.dial, codes);
  }
  const pinnedDials = ["1", "44", "61", "81", "86", "886", "82", "852", "65", "33", "49"];
  const rest = [...map.entries()]
    .map(([dial, codes]) => ({ dial, codes }))
    .sort((a, b) => Number(a.dial) - Number(b.dial));
  const pinned = pinnedDials
    .map((dial) => rest.find((item) => item.dial === dial))
    .filter((item): item is DialOption => Boolean(item));
  const extra = rest.filter((item) => !pinnedDials.includes(item.dial));
  return [...pinned, ...extra];
}

export function dialLabel(option: DialOption, locale: string) {
  const names = option.codes.slice(0, 2).map((code) => regionName(code, locale));
  return `${names.join(" / ")} +${option.dial}`;
}

export function filterCountries(query: string, locale: string) {
  const q = query.trim().toLowerCase();
  const ranked = [...COUNTRIES].sort((a, b) => {
    const ap = PINNED.indexOf(a.code);
    const bp = PINNED.indexOf(b.code);
    if (ap >= 0 && bp >= 0) return ap - bp;
    if (ap >= 0) return -1;
    if (bp >= 0) return 1;
    return regionName(a.code, locale).localeCompare(regionName(b.code, locale), localeTag(locale));
  });
  if (!q) return ranked;
  return ranked.filter((item) => {
    const name = regionName(item.code, locale).toLowerCase();
    return (
      name.includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.dial.includes(q.replace(/^\+/, "")) ||
      `+${item.dial}`.includes(q)
    );
  });
}

export function parsePhone(raw: string, fallbackDial: string) {
  const text = raw.trim();
  const match = text.match(/^\+(\d{1,4})\s*(.*)$/);
  if (match) {
    return { dial: match[1], number: match[2].replace(/[^\d]/g, "") };
  }
  return { dial: fallbackDial, number: text.replace(/[^\d]/g, "") };
}

export function joinPhone(dial: string, number: string) {
  const digits = number.replace(/[^\d]/g, "");
  if (!digits) return "";
  return `+${dial} ${digits}`;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
