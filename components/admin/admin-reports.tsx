"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminCopy } from "@/lib/admin/copy";
import { addDaysIso } from "@/lib/calendar";
import { todayIsoDate } from "@/lib/booking/slots";
import { reportsFromOrders, resolveReportRange, type RangeKind } from "@/lib/mock/reports";
import { formatYenShort } from "@/lib/format";
import { CountUp } from "@/components/admin/count-up";
import { useStoreData } from "@/lib/use-store-data";
import { useToastStore } from "@/stores/toast-store";

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

function ChartBox({
  title,
  mobileTitle,
  exportLabel,
  children,
  onExport,
}: {
  title: string;
  mobileTitle?: string;
  exportLabel: string;
  children: React.ReactNode;
  onExport: () => void;
}) {
  return (
    <section className="report-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="min-w-0 font-black">
          <span className="md:hidden">{mobileTitle ?? title}</span>
          <span className="hidden md:inline">{title}</span>
        </h2>
        <button
          type="button"
          className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs hover:border-blue-400"
          onClick={onExport}
        >
          {exportLabel}
        </button>
      </div>
      {children}
    </section>
  );
}

export function AdminReportsView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const notify = useToastStore((state) => state.notify);
  const today = todayIsoDate();
  const [kind, setKind] = useState<RangeKind>("month");
  const [custom, setCustom] = useState(() => ({ from: addDaysIso(today, -13), to: today }));
  const { orders } = useStoreData();
  const range = useMemo(() => resolveReportRange(kind, today, custom), [kind, today, custom]);
  const report = useMemo(() => reportsFromOrders(orders, range, locale), [orders, range, locale]);
  const exportOk = () => notify(copy.reports.exportOk);
  const totalRev = report.plans.reduce((sum, item) => sum + item.revenue, 0) || 1;
  const narrow = useNarrow();
  const axisTick = { fill: "#6B7280", fontSize: narrow ? 10 : 11 };
  const dayCount = Math.max(report.trend.length, 1);

  const presets = [
    ["today", copy.reports.today],
    ["week", copy.reports.week],
    ["month", copy.reports.month],
    ["custom", copy.reports.custom],
  ] as const;

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
      <div className="flex flex-wrap items-center gap-2">
        {presets.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`rounded-full border px-3 py-1.5 text-sm ${kind === id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-500"}`}
            onClick={() => {
              setKind(id);
              notify(copy.reports.switched(label));
            }}
          >
            {label}
          </button>
        ))}
        <span className="text-xs text-slate-400">
          {copy.reports.rangeCaption} {range.from} – {range.to}
        </span>
      </div>

      {kind === "custom" ? (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <label className="grid gap-1 text-xs text-slate-500">
            {copy.reports.from}
            <input
              className="admin-input mt-0 w-auto"
              type="date"
              value={custom.from}
              max={custom.to}
              onChange={(event) => setCustom((prev) => ({ ...prev, from: event.target.value }))}
            />
          </label>
          <span className="pb-2 text-slate-400">–</span>
          <label className="grid gap-1 text-xs text-slate-500">
            {copy.reports.to}
            <input
              className="admin-input mt-0 w-auto"
              type="date"
              value={custom.to}
              min={custom.from}
              onChange={(event) => setCustom((prev) => ({ ...prev, to: event.target.value }))}
            />
          </label>
          <p className="pb-2 text-xs text-slate-400">{copy.reports.customHint}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: copy.reports.revenue, value: report.summary.revenue, yen: true },
          { label: copy.reports.orderCount, value: report.summary.orders },
          { label: copy.reports.aov, value: report.summary.avg, yen: true },
          { label: copy.reports.refunds, value: report.summary.refunds, yen: true },
        ].map((card) => (
          <article key={card.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 sm:p-6">
            <p className="text-xs text-slate-500 sm:text-sm">{card.label}</p>
            <p className="mt-2 break-all text-lg font-black tabular-nums sm:mt-3 sm:text-3xl">
              <CountUp value={card.value} yen={card.yen} />
            </p>
          </article>
        ))}
      </div>

      <ChartBox
        title={copy.reports.trend(dayCount)}
        mobileTitle={copy.reports.trendMobile}
        exportLabel={copy.reports.exportCsv}
        onExport={exportOk}
      >
        <div className="report-chart h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(15,23,42,0.08)" />
              <XAxis
                dataKey="day"
                stroke="#6B7280"
                interval={narrow ? Math.max(Math.ceil(dayCount / 6) - 1, 0) : Math.max(Math.ceil(dayCount / 12) - 1, 0)}
                tick={axisTick}
                minTickGap={8}
              />
              <YAxis
                stroke="#6B7280"
                width={narrow ? 36 : 52}
                tick={{ ...axisTick }}
                tickFormatter={compactYen}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => formatYenShort(Number(value ?? 0))}
              />
              <Legend wrapperStyle={{ color: "#374151", fontSize: 12 }} />
              <Line type="monotone" dataKey="current" name={copy.reports.current} stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="previous" name={copy.reports.previous} stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartBox>

      <ChartBox title={copy.reports.plans} exportLabel={copy.reports.exportCsv} onExport={exportOk}>
          <div className="report-chart h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={report.plans}
                margin={{ top: 8, right: 8, left: 0, bottom: narrow ? 28 : 8 }}
              >
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  interval={0}
                  angle={narrow ? -28 : 0}
                  textAnchor={narrow ? "end" : "middle"}
                  height={narrow ? 56 : 30}
                  tick={axisTick}
                />
                <YAxis stroke="#6B7280" width={narrow ? 28 : 40} tick={axisTick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sold" name={copy.reports.sold} fill="#A855F7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{copy.reports.plan}</th>
                  <th>{copy.reports.sold}</th>
                  <th>{copy.reports.share}</th>
                </tr>
              </thead>
              <tbody>
                {report.plans.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.sold}</td>
                    <td>{Math.round((item.revenue / totalRev) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 grid gap-2 md:hidden">
            {report.plans.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="min-w-0 truncate font-semibold">{item.name}</span>
                <span className="shrink-0 text-sm text-slate-500">
                  {copy.reports.planCard(item.sold, Math.round((item.revenue / totalRev) * 100))}
                </span>
              </li>
            ))}
          </ul>
        </ChartBox>
    </div>
  );
}
