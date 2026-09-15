export type ParticipantDraft = {
  name: string;
  licenceCountry: string;
};

export function participantsKey(ref: string) {
  return `osaka-kart-guests-${ref}`;
}

export function extraGuestCount(riders: number) {
  return Math.max(0, Math.floor(riders) - 1);
}

export function emptyParticipants(riders: number): ParticipantDraft[] {
  return Array.from({ length: extraGuestCount(riders) }, () => ({ name: "", licenceCountry: "" }));
}

export function readParticipants(ref: string, riders: number): ParticipantDraft[] {
  const fallback = emptyParticipants(riders);
  if (!ref || typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(participantsKey(ref));
    if (!raw) return fallback;
    const rows = JSON.parse(raw) as ParticipantDraft[];
    if (!Array.isArray(rows)) return fallback;
    return fallback.map((item, index) => ({
      name: rows[index]?.name ?? item.name,
      licenceCountry: rows[index]?.licenceCountry ?? item.licenceCountry,
    }));
  } catch {
    return fallback;
  }
}

export function saveParticipants(ref: string, rows: ParticipantDraft[]) {
  if (!ref || typeof window === "undefined") return;
  localStorage.setItem(participantsKey(ref), JSON.stringify(rows));
}

export function formatParticipantsNote(rows: ParticipantDraft[]) {
  const filled = rows.filter((item) => item.name.trim() || item.licenceCountry);
  if (!filled.length) return "";
  return filled
    .map((item, index) => `同行者${index + 2}: ${item.name.trim() || "—"} / 驾照签发地 ${item.licenceCountry || "—"}`)
    .join("；");
}
