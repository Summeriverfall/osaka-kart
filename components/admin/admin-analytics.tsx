"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useLocale } from "next-intl";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CountUp } from "@/components/admin/count-up";
import { ChannelAnalysisCard } from "@/components/admin/channel-analysis-card";
import { adminCopy } from "@/lib/admin/copy";
import { collectChannelIds, labelChannel } from "@/lib/channel-options";
import { downloadCsv } from "@/lib/csv";
import { todayIsoDate } from "@/lib/booking/slots";
import { formatYenShort } from "@/lib/format";
import {
  analyticsFromOrders,
  clampRange,
  defaultAnalyticsRange,
  shiftRange,
  type CompareMode,
} from "@/lib/mock/analytics";
import { useStoreData } from "@/lib/use-store-data";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  color: "#111827",
  maxWidth: 220,
  fontSize: 12,
};

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return narrow;
}

function Delta({ label, tone }: { label: string; tone: "up" | "down" | "flat" }) {
  return (
    <p
      className={cn(
        "mt-1 text-xs font-semibold",
        tone === "up" && "text-emerald-600",
        tone === "down" && "text-rose-600",
        tone === "flat" && "text-slate-400",
      )}
    >
      {label}
    </p>
  );
}

export function AdminAnalyticsView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const notify = useToastStore((state) => state.notify);
  const today = todayIsoDate();
  const { orders, storeId } = useStoreData();
  const channels = useOpsStore((state) => state.settings.channels);
  const patchSettings = useOpsStore((state) => state.patchSettings);
  const [mode, setMode] = useState<CompareMode>("week");
  const [draft, setDraft] = useState(() => defaultAnalyticsRange("week", today));
  const [applied, setApplied] = useState(() => defaultAnalyticsRange("week", today));
  const narrow = useNarrow();

  const cuts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of channels ?? []) map[row.id] = row.cut;
    return map;
  }, [channels]);

  const currentRange = useMemo(() => clampRange(applied, today), [applied, today]);
  const previousRange = useMemo(() => shiftRange(currentRange, mode), [currentRange, mode]);
  const report = useMemo(
    () => analyticsFromOrders(orders, currentRange, previousRange, locale, cuts, storeId, copy.analytics.deltaNew),
    [orders, currentRange, previousRange, locale, cuts, storeId, copy.analytics.deltaNew],
  );

  const channelRows = useMemo(() => {
    const byId = new Map(report.channels.map((item) => [item.id, item]));
    const ids = collectChannelIds(channels, report.channels.map((item) => item.id));
    return ids.map((id, index) => {
      const found = byId.get(id);
      const setting = (channels ?? []).find((row) => row.id === id);
      return {
        id,
        name: labelChannel(locale, id, channels),
        fill: found?.fill ?? CHANNEL_TONES[id] ?? EXTRA_TONES[index % EXTRA_TONES.length],
        cut: setting?.cut ?? 0,
        orders: found?.orders ?? 0,
        revenue: found?.revenue ?? 0,
      };
    });
  }, [report.channels, channels, locale]);

  function setCut(id: string, pct: number) {
    const cut = Math.min(100, Math.max(0, pct)) / 100;
    const list = [...(channels ?? [])];
    const index = list.findIndex((row) => row.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], cut };
    } else {
      list.push({ id, enabled: true, cut });
    }
    patchSettings({ channels: list });
  }

  const modes: { id: CompareMode; label: string }[] = [
    { id: "week", label: copy.analytics.compareWeek },
    { id: "month", label: copy.analytics.compareMonth },
    { id: "year", label: copy.analytics.compareYear },
  ];

  function apply(nextMode = mode, nextRange = draft) {
    const range = clampRange(nextRange, today);
    setMode(nextMode);
    setDraft(range);
    setApplied(range);
    notify(copy.analytics.applyOk);
  }

  function onMode(next: CompareMode) {
    const range = defaultAnalyticsRange(next, today);
    apply(next, range);
  }

  function exportCsv() {
    const a = copy.analytics;
    downloadCsv(`analytics-${currentRange.from}-${currentRange.to}.csv`, [
      [a.mode, modes.find((item) => item.id === mode)?.label ?? mode],
      [a.current, `${currentRange.from} – ${currentRange.to}`],
      [a.previous, `${previousRange.from} – ${previousRange.to}`],
      [],
      [a.metric, a.current, a.previous],
      [a.bookings, report.current.bookings, report.previous.bookings],
      [a.completed, report.current.completed, report.previous.completed],
      [a.cancelled, report.current.cancelled, report.previous.cancelled],
      [a.revenue, report.current.revenue, report.previous.revenue],
      [a.profit, report.current.profit, report.previous.profit],
      [a.aov, report.current.aov, report.previous.aov],
      [],
      [a.day, a.bookings, `${a.bookings} (${a.previous})`, a.revenue, `${a.revenue} (${a.previous})`],
      ...report.trend.map((row) => [row.iso || row.day, row.bookings, row.bookingsPrev, row.revenue, row.revenuePrev]),
      [],
      [a.planShare, a.sold, a.revenue],
      ...report.plans.map((row) => [row.name, row.sold, row.revenue]),
      [],
      [a.channelShare, a.orders, a.revenue, copy.reports.cut, copy.reports.net],
      ...channelRows.map((row) => [
        row.name,
        row.orders,
        row.revenue,
        `${Number((row.cut * 100).toFixed(1))}%`,
        Math.round(row.revenue * (1 - row.cut)),
      ]),
      [],
      [a.nations, a.people],
      ...report.nations.map((row) => [row.name, row.value]),
      [],
      [a.gender, a.people],
      ...report.gender.map((row) => [row.name, row.value]),
      [],
      [a.ages, a.people],
      ...report.ages.map((row) => [row.band, row.people]),
      [],
      [a.daypart, a.people],
      ...report.daypart.map((row) => [row.band, row.people]),
    ]);
    notify(copy.reports.exportOk);
  }

  const cards = [
    { key: "bookings", label: copy.analytics.bookings, value: report.current.bookings, yen: false, warn: false },
    { key: "completed", label: copy.analytics.completed, value: report.current.completed, yen: false, warn: false },
    { key: "cancelled", label: copy.analytics.cancelled, value: report.current.cancelled, yen: false, warn: true },
    { key: "revenue", label: copy.analytics.revenue, value: report.current.revenue, yen: true, warn: false },
    { key: "profit", label: copy.analytics.profit, value: report.current.profit, yen: true, warn: false },
    { key: "aov", label: copy.analytics.aov, value: report.current.aov, yen: true, warn: false },
  ] as const;

  const dayCount = report.trend.length;
  const axisTick = { fill: "#6B7280", fontSize: narrow ? 10 : 11 };
  const pieRadius = narrow ? 58 : 80;

  function compactYen(value: number) {
    if (locale.startsWith("en")) {
      if (Math.abs(value) >= 1000) return `${Math.round(value / 1000)}k`;
      return String(value);
    }
    if (Math.abs(value) >= 10000) return `${Math.round(value / 10000)}${copy.common.wan}`;
    return String(value);
  }

  return (
    <div className="grid min-w-0 gap-5 md:gap-6">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <label className="grid gap-1 text-xs text-slate-500">
          {copy.reports.from}
          <input
            className="admin-input mt-0 w-auto"
            type="date"
            value={draft.from}
            max={draft.to}
            onChange={(event) => setDraft((prev) => ({ ...prev, from: event.target.value }))}
          />
        </label>
        <span className="pb-2 text-slate-400">–</span>
        <label className="grid gap-1 text-xs text-slate-500">
          {copy.reports.to}
          <input
            className="admin-input mt-0 w-auto"
            type="date"
            value={draft.to}
            min={draft.from}
            onChange={(event) => setDraft((prev) => ({ ...prev, to: event.target.value }))}
          />
        </label>
        <label className="grid min-w-[12rem] flex-1 gap-1 text-xs text-slate-500">
          {copy.analytics.compare}
          <select
            className="admin-input mt-0"
            value={mode}
            onChange={(event) => onMode(event.target.value as CompareMode)}
          >
            {modes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="cta-btn px-4 py-2 text-sm" onClick={() => apply()}>
          {copy.analytics.apply}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:border-blue-400"
          onClick={exportCsv}
        >
          <Download className="size-3.5" />
          {copy.reports.exportCsv}
        </button>
        <p className="basis-full text-xs text-slate-400">
          {copy.analytics.rangeCaption} {currentRange.from} – {currentRange.to}
          <span className="mx-2 text-slate-300">·</span>
          {copy.analytics.previous} {previousRange.from} – {previousRange.to}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">
        {cards.map((card) => (
          <article key={card.key} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">{card.label}</p>
            <p
              className={cn(
                "mt-2 break-all text-lg font-black tabular-nums sm:mt-3 sm:text-2xl",
                card.warn && "text-rose-600",
              )}
            >
              <CountUp value={card.value} yen={card.yen} />
            </p>
            <Delta label={report.deltas[card.key].label} tone={report.deltas[card.key].tone} />
          </article>
        ))}
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2 md:gap-6">
        <section className="report-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="mb-4 font-black">{copy.analytics.bookingTrend(dayCount)}</h2>
          <div className="report-chart h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis
                  dataKey="day"
                  stroke="#6B7280"
                  interval={narrow ? Math.max(Math.ceil(dayCount / 6) - 1, 0) : Math.max(Math.ceil(dayCount / 12) - 1, 0)}
                  tick={axisTick}
                  minTickGap={8}
                />
                <YAxis stroke="#6B7280" width={narrow ? 28 : 36} allowDecimals={false} tick={axisTick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#374151", fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  name={copy.analytics.current}
                  stroke="#2563eb"
                  fill="#93c5fd"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="bookingsPrev"
                  name={copy.analytics.previous}
                  stroke="#94a3b8"
                  fill="transparent"
                  strokeDasharray="6 6"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="report-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="mb-4 font-black">{copy.analytics.revenueTrend(dayCount)}</h2>
          <div className="report-chart h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis
                  dataKey="day"
                  stroke="#6B7280"
                  interval={narrow ? Math.max(Math.ceil(dayCount / 6) - 1, 0) : Math.max(Math.ceil(dayCount / 12) - 1, 0)}
                  tick={axisTick}
                  minTickGap={8}
                />
                <YAxis stroke="#6B7280" width={narrow ? 36 : 52} tick={{ ...axisTick }} tickFormatter={compactYen} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatYenShort(Number(value ?? 0))} />
                <Legend wrapperStyle={{ color: "#374151", fontSize: 12 }} />
                <Bar dataKey="revenue" name={copy.analytics.current} fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenuePrev" name={copy.analytics.previous} fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <ChannelAnalysisCard
        copy={{
          title: copy.reports.channels,
          exportCsv: copy.reports.exportCsv,
          channel: copy.reports.channel,
          orders: copy.reports.orders,
          revenueCol: copy.reports.revenueCol,
          cut: copy.reports.cut,
          net: copy.reports.net,
          cutHint: copy.reports.cutHint,
          unitOrders: copy.reports.unitOrders,
        }}
        rows={channelRows}
        pieRadius={pieRadius}
        onCut={setCut}
        onExport={() => {
          downloadCsv(`channels-${currentRange.from}-${currentRange.to}.csv`, [
            [copy.reports.channel, copy.reports.orders, copy.reports.revenueCol, copy.reports.cut, copy.reports.net],
            ...channelRows.map((row) => [
              row.name,
              row.orders,
              row.revenue,
              `${Number((row.cut * 100).toFixed(1))}%`,
              Math.round(row.revenue * (1 - row.cut)),
            ]),
          ]);
          notify(copy.reports.exportOk);
        }}
      />

      <div className="grid min-w-0 gap-5 lg:grid-cols-2 md:gap-6">
        <MixPie
          title={copy.analytics.planShare}
          empty={copy.analytics.empty}
          data={report.plans}
          dataKey="sold"
          pieRadius={pieRadius}
          inner
          fills={PLAN_FILLS}
        />
        <MixPie
          title={copy.analytics.nations}
          empty={copy.analytics.empty}
          data={report.nations}
          dataKey="value"
          pieRadius={pieRadius}
        />
        <MixPie
          title={copy.analytics.gender}
          empty={copy.analytics.empty}
          data={report.gender}
          dataKey="value"
          pieRadius={pieRadius}
          inner
        />
        <section className="report-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="mb-4 font-black">{copy.analytics.ages}</h2>
          <div className="report-chart h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.ages} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="band" stroke="#6B7280" interval={0} tick={axisTick} />
                <YAxis stroke="#6B7280" width={narrow ? 28 : 40} allowDecimals={false} tick={axisTick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="people" name={copy.analytics.people} fill="#22D3EE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="report-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="mb-4 font-black">{copy.analytics.daypart}</h2>
          <div className="report-chart h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.daypart} margin={{ top: 8, right: 4, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis
                  dataKey="band"
                  stroke="#6B7280"
                  interval={0}
                  height={40}
                  tick={(props) => {
                    const part = report.daypart.find((item) => item.band === String(props.payload?.value ?? ""));
                    const x = Number(props.x ?? 0);
                    const y = Number(props.y ?? 0);
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text textAnchor="middle" dy={12} fill="#334155" fontSize={11} fontWeight={600}>
                          {props.payload?.value}
                        </text>
                        <text textAnchor="middle" dy={26} fill="#94a3b8" fontSize={9}>
                          {part?.range}
                        </text>
                      </g>
                    );
                  }}
                />
                <YAxis stroke="#6B7280" width={narrow ? 28 : 40} allowDecimals={false} tick={axisTick} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(label) => {
                    const part = report.daypart.find((item) => item.band === label);
                    return part ? `${part.band} ${part.range}` : String(label);
                  }}
                />
                <Bar dataKey="people" name={copy.analytics.people} fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

const PLAN_FILLS = ["#A855F7", "#2563eb", "#34d399", "#F59E0B", "#FF2E93", "#22D3EE"];
const EXTRA_TONES = ["#6366f1", "#14b8a6", "#e11d48", "#84cc16", "#0ea5e9"];
const CHANNEL_TONES: Record<string, string> = {
  Klook: "#38BDF8",
  官网: "#34D399",
  Instagram: "#E1306C",
  TikTok: "#69C9D0",
  携程: "#287DFA",
  微信: "#F59E0B",
  WhatsApp: "#9CA3AF",
  线下: "#FF2E93",
};

function MixPie({
  title,
  empty,
  data,
  dataKey,
  pieRadius,
  inner,
  fills,
}: {
  title: string;
  empty: string;
  data: Array<{ name: string; fill?: string } & Record<string, string | number>>;
  dataKey: string;
  pieRadius: number;
  inner?: boolean;
  fills?: string[];
}) {
  return (
    <section className="report-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <h2 className="mb-4 font-black">{title}</h2>
      {data.length ? (
        <div className="report-chart h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey="name"
                innerRadius={inner ? Math.round(pieRadius * 0.62) : 0}
                outerRadius={pieRadius}
              >
                {data.map((item, index) => (
                  <Cell key={`${item.name}-${index}`} fill={item.fill || fills?.[index % (fills.length || 1)] || "#9CA3AF"} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: "#374151", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-slate-400">{empty}</p>
      )}
    </section>
  );
}
