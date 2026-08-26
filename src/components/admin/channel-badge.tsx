"use client";

import { useLocale } from "next-intl";
import { labelChannel } from "@/lib/channel-options";
import { useOpsStore } from "@/stores/ops-store";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  Klook: "border-sky-200 bg-sky-50 text-sky-800",
  Instagram: "border-pink-200 bg-pink-50 text-pink-800",
  TikTok: "border-cyan-200 bg-cyan-50 text-cyan-800",
  携程: "border-blue-200 bg-blue-50 text-blue-800",
  官网: "border-emerald-200 bg-emerald-50 text-emerald-800",
  微信: "border-amber-200 bg-amber-50 text-amber-800",
  WhatsApp: "border-slate-200 bg-slate-100 text-slate-600",
  线下: "border-rose-200 bg-rose-50 text-rose-800",
};

const FALLBACK = "border-indigo-200 bg-indigo-50 text-indigo-800";

export function ChannelBadge({ channel }: { channel: string }) {
  const locale = useLocale();
  const channels = useOpsStore((state) => state.settings.channels);
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", TONE[channel] ?? FALLBACK)}>
      {labelChannel(locale, channel, channels)}
    </span>
  );
}
