"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatYenShort } from "@/lib/format";

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  color: "#111827",
  maxWidth: 220,
  fontSize: 12,
};

export type ChannelAnalysisRow = {
  id: string;
  name: string;
  fill: string;
  cut: number;
  orders: number;
  revenue: number;
};

type ChannelAnalysisCopy = {
  title: string;
  exportCsv: string;
  channel: string;
  orders: string;
  revenueCol: string;
  cut: string;
  net: string;
  cutHint: string;
  unitOrders: string;
};

function CutInput({
  value,
  label,
  onChange,
}: {
  value: number;
  label: string;
  onChange: (pct: number) => void;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <input
        className="report-cut-input"
        type="number"
        min={0}
        max={100}
        step={0.1}
        aria-label={label}
        value={Number((value * 100).toFixed(1))}
        onChange={(event) => onChange(Math.min(100, Math.max(0, Number(event.target.value) || 0)))}
      />
      <span className="text-slate-500">%</span>
    </span>
  );
}

export function ChannelAnalysisCard({
  copy,
  rows,
  pieRadius,
  onCut,
  onExport,
}: {
  copy: ChannelAnalysisCopy;
  rows: ChannelAnalysisRow[];
  pieRadius: number;
  onCut: (id: string, pct: number) => void;
  onExport: () => void;
}) {
  const pieData = rows.filter((item) => item.orders > 0);
  const chartRows = pieData.length ? pieData : rows;

  return (
    <section className="report-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="min-w-0 font-black">{copy.title}</h2>
        <button
          type="button"
          className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs hover:border-blue-400"
          onClick={onExport}
        >
          {copy.exportCsv}
        </button>
      </div>
      <div className="report-chart mx-auto h-56 w-full max-w-xl sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartRows} dataKey="orders" nameKey="name" innerRadius={Math.round(pieRadius * 0.62)} outerRadius={pieRadius}>
              {chartRows.map((item) => (
                <Cell key={item.id} fill={item.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: "#374151", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{copy.channel}</th>
              <th>{copy.orders}</th>
              <th>{copy.revenueCol}</th>
              <th>{copy.cut}</th>
              <th>{copy.net}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.orders}</td>
                <td>{formatYenShort(item.revenue)}</td>
                <td>
                  <CutInput
                    value={item.cut}
                    label={`${item.name} ${copy.cut}`}
                    onChange={(pct) => onCut(item.id, pct)}
                  />
                </td>
                <td>{formatYenShort(Math.round(item.revenue * (1 - item.cut)))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-slate-400">{copy.cutHint}</p>
      </div>
      <ul className="mt-4 grid gap-2 md:hidden">
        {rows.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{item.name}</span>
              <span className="text-sm tabular-nums">{formatYenShort(item.revenue)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {item.orders}
                {copy.unitOrders} · {copy.net} {formatYenShort(Math.round(item.revenue * (1 - item.cut)))}
              </p>
              <CutInput
                value={item.cut}
                label={`${item.name} ${copy.cut}`}
                onChange={(pct) => onCut(item.id, pct)}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-400 md:hidden">{copy.cutHint}</p>
    </section>
  );
}
