import palettes from "./acid-palettes.json";

export const ACID_PALETTE_META = palettes;
export const ACID_PALETTE_IDS = palettes.map((item) => item.id);
export type AcidPalette = (typeof palettes)[number]["id"];

/** 酸街最终配色：节奏。不再跟 ?palette= 或本地旧记录走。 */
export const ACID_PALETTE: AcidPalette = "pace";

export const ACID_PALETTE_KEY = "fk-acid-palette-v2";

export function isAcidPalette(value: string | null | undefined): value is AcidPalette {
  return value === ACID_PALETTE;
}

export function resolveAcidPalette(): AcidPalette {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ACID_PALETTE_KEY, ACID_PALETTE);
    } catch {
      /* ignore */
    }
  }
  return ACID_PALETTE;
}

export function acidPaletteBootScript(): string {
  const k = JSON.stringify(ACID_PALETTE_KEY);
  const d = JSON.stringify(ACID_PALETTE);
  const lookKey = JSON.stringify("furture-kart-look");
  return `(function(){var k=${k};var d=${d};var look=${lookKey};try{localStorage.setItem(k,d)}catch(e){}var path=location.pathname.replace(/\\\\/g,"/");var onAcid=/\\/acid(\\/|$)/.test(path)||/\\/acid\\/index\\.html$/i.test(path);if(!onAcid){try{onAcid=localStorage.getItem(look)===\"acid\"}catch(e){}}if(!onAcid)return;document.documentElement.setAttribute("data-acid-palette",d)})();`;
}
