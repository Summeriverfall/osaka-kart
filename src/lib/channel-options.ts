import { CHANNELS } from "@/lib/mock/orders";
import type { MockBookChannel } from "@/lib/mock/settings";
import { adminChannel } from "@/lib/admin/copy";

export function isOfficialChannel(id: string) {
  return id === "官网";
}

export function isBuiltinChannel(id: string) {
  return (CHANNELS as readonly string[]).includes(id);
}

export function labelChannel(locale: string, id: string, channels?: MockBookChannel[]) {
  const named = channels?.find((row) => row.id === id)?.name?.trim();
  return named || adminChannel(locale, id);
}

export function collectChannelIds(channels?: MockBookChannel[], extraIds: string[] = []) {
  const ids: string[] = [];
  const seen = new Set<string>();
  const push = (id: string) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    ids.push(id);
  };
  if (channels?.length) channels.forEach((row) => push(row.id));
  else CHANNELS.forEach((id) => push(id));
  extraIds.forEach((id) => push(id));
  return ids;
}

export function liveChannelIds(channels?: MockBookChannel[], keep?: string) {
  const source = channels?.length ? channels : CHANNELS.map((id) => ({ id, enabled: true }));
  const ids = source.filter((row) => row.enabled || row.id === keep).map((row) => row.id);
  if (keep && !ids.includes(keep)) ids.push(keep);
  return ids.length ? ids : [...CHANNELS];
}
