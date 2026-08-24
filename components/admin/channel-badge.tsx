"use client";

import { useLocale } from "next-intl";
import { adminChannel } from "@/lib/admin/copy";
import { cn } from "@/lib/utils";
import type { OrderChannel } from "@/lib/mock/orders";

const TONE: Record<OrderChannel, string> = {
  Klook: "border-sky-200 bg-sky-50 text-sky-800",
  Viator: "border-violet-200 bg-violet-50 text-violet-800",
  官网: "border-emerald-200 bg-emerald-50 text-emerald-800",
  微信: "border-amber-200 bg-amber-50 text-amber-800",
  WhatsApp: "border-slate-200 bg-slate-100 text-slate-600",
  线下: "border-blue-200 bg-blue-50 text-blue-800",
};

export function ChannelBadge({ channel }: { channel: OrderChannel }) {
  const locale = useLocale();
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", TONE[channel])}>
      {adminChannel(locale, channel)}
    </span>
  );
}
