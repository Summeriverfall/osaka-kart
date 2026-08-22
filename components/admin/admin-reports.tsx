"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BOOKING_DAYPARTS } from "@/lib/booking/slots";
import { reportsFromOrders } from "@/lib/mock/reports";
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

function compactYen(value: number) {
  if (Math.abs(value) >= 10000) return `${Math.round(value / 10000)}万`;
  return String(value);
}

function DaypartTick({ x = 0, y = 0, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const part = BOOKING_DAYPARTS.find((item) => item.label === payload?.value);
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" dy={12} fill="#334155" fontSize={11} fontWeight={600}>
        {payload?.value}
      </text>
      <text textAnchor="middle" dy={26} fill="#94a3b8" fontSize={9}>
        {part?.range}
      </text>
    </g>
  );
}

function ChartBox({
  title,
  mobileTitle,
  children,
  onExport,
}: {
  title: string;
  mobileTitle?: string;
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
          导出 CSV
        </button>
      </div>
      {children}
    </section>
  );
}

export function AdminReportsView() {
  const notify = useToastStore((state) => state.notify);
  const [range, setRange] = useState("month");
  const { orders } = useStoreData();
  const report = useMemo(() => reportsFromOrders(orders), [orders]);
  const exportOk = () => notify("导出成功");
  const totalRev = report.channels.reduce((sum, item) => sum + item.revenue, 0) || 1;
  const narrow = useNarrow();
  const pieRadius = narrow ? 58 : 80;
  const axisTick = { fill: "#6B7280", fontSize: narrow ? 10 : 11 };

  return (
    <div className="grid min-w-0 gap-5 md:gap-6">
      <div className="flex flex-wrap gap-2">
        {([["today", "今日"], ["week", "本周"], ["month", "本月"], ["custom", "自定义"]] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`rounded-full border px-3 py-1.5 text-sm ${range === id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-500"}`}
            onClick={() => {
              setRange(id);
              notify(`已切换${label}`);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "总营收", value: report.summary.revenue, yen: true },
          { label: "总订单数", value: report.summary.orders },
          { label: "客单价", value: report.summary.avg, yen: true },
          { label: "退款总额", value: report.summary.refunds, yen: true },
        ].map((card) => (
          <article key={card.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 sm:p-6">
            <p className="text-xs text-slate-500 sm:text-sm">{card.label}</p>
            <p className="mt-2 break-all text-lg font-black tabular-nums sm:mt-3 sm:text-3xl">
              <CountUp value={card.value} yen={card.yen} />
            </p>
          </article>
        ))}
      </div>

      <ChartBox title="30 天营收趋势（本期 vs 上期）" mobileTitle="营收趋势" onExport={exportOk}>
        <div className="report-chart h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(15,23,42,0.08)" />
              <XAxis
                dataKey="day"
                stroke="#6B7280"
                interval={narrow ? 4 : 2}
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
              <Line type="monotone" dataKey="current" name="本期" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="previous" name="上期" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartBox>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2 md:gap-6">
        <ChartBox title="渠道分析" onExport={exportOk}>
          <div className="report-chart h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={report.channels} dataKey="value" nameKey="name" innerRadius={narrow ? 36 : 50} outerRadius={pieRadius}>
                  {report.channels.map((item) => (
                    <Cell key={item.name} fill={item.fill} />
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
                  <th>渠道</th>
                  <th>订单</th>
                  <th>营收</th>
                  <th>抽成</th>
                  <th>到账</th>
                </tr>
              </thead>
              <tbody>
                {report.channels.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.orders}</td>
                    <td>{formatYenShort(item.revenue)}</td>
                    <td>{Math.round(item.cut * 100)}%</td>
                    <td>{formatYenShort(Math.round(item.revenue * (1 - item.cut)))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 grid gap-2 md:hidden">
            {report.channels.map((item) => (
              <li key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-sm tabular-nums">{formatYenShort(item.revenue)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {item.orders} 单 · 抽成 {Math.round(item.cut * 100)}% · 到账 {formatYenShort(Math.round(item.revenue * (1 - item.cut)))}
                </p>
              </li>
            ))}
          </ul>
        </ChartBox>

        <ChartBox title="套餐销量" onExport={exportOk}>
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
                <Bar dataKey="sold" name="销量" fill="#A855F7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>套餐</th>
                  <th>销量</th>
                  <th>营收占比</th>
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
                  {item.sold} 单 · {Math.round((item.revenue / totalRev) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </ChartBox>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2 md:gap-6">
        <ChartBox title="国籍分布" onExport={exportOk}>
          <div className="report-chart h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={report.nations} dataKey="value" nameKey="name" outerRadius={pieRadius}>
                  {report.nations.map((item) => (
                    <Cell key={item.name} fill={item.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#374151", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
        <ChartBox title="性别比例" onExport={exportOk}>
          <div className="report-chart h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={report.gender} dataKey="value" nameKey="name" innerRadius={narrow ? 34 : 48} outerRadius={pieRadius}>
                  {report.gender.map((item) => (
                    <Cell key={item.name} fill={item.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#374151", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
        <ChartBox title="年龄段" onExport={exportOk}>
          <div className="report-chart h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.ages} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="band" stroke="#6B7280" interval={0} tick={axisTick} />
                <YAxis stroke="#6B7280" width={narrow ? 28 : 40} tick={axisTick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="people" name="人数" fill="#22D3EE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
        <ChartBox title="预订时间段" onExport={exportOk}>
          <div className="report-chart h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.daypart} margin={{ top: 8, right: 4, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="band" stroke="#6B7280" interval={0} height={40} tick={<DaypartTick />} />
                <YAxis stroke="#6B7280" width={narrow ? 28 : 40} tick={axisTick} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(label) => {
                    const part = BOOKING_DAYPARTS.find((item) => item.label === label);
                    return part ? `${part.label}（${part.range}）` : String(label);
                  }}
                />
                <Bar dataKey="people" name="人数" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
      </div>
    </div>
  );
}
