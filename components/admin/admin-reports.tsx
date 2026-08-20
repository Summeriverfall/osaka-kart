"use client";

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
import {
  REPORT_AGES,
  REPORT_CHANNELS,
  REPORT_DAYPART,
  REPORT_GENDER,
  REPORT_NATIONS,
  REPORT_PLANS,
  REPORT_SUMMARY,
  REPORT_TREND_30D,
} from "@/lib/mock/reports";
import { formatYenShort } from "@/lib/format";
import { CountUp } from "@/components/admin/count-up";
import { useToastStore } from "@/stores/toast-store";
import { useState } from "react";

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  color: "#111827",
};

function ChartBox({ title, children, onExport }: { title: string; children: React.ReactNode; onExport: () => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-black">{title}</h2>
        <button type="button" className="rounded-full border border-slate-200 px-3 py-1 text-xs hover:border-blue-400" onClick={onExport}>
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
  const exportOk = () => notify("导出成功");
  const totalRev = REPORT_CHANNELS.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        {[["today", "今日"], ["week", "本周"], ["month", "本月"], ["custom", "自定义"]].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`rounded-full border px-3 py-1.5 text-sm ${range === id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-500"}`}
            onClick={() => { setRange(id); notify(`已切换${label}`); }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "总营收", value: REPORT_SUMMARY.revenue, yen: true },
          { label: "总订单数", value: REPORT_SUMMARY.orders },
          { label: "客单价", value: REPORT_SUMMARY.avg, yen: true },
          { label: "退款总额", value: REPORT_SUMMARY.refunds, yen: true },
        ].map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-black"><CountUp value={card.value} yen={card.yen} /></p>
          </article>
        ))}
      </div>

      <ChartBox title="30 天营收趋势（本期 vs 上期）" onExport={exportOk}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={REPORT_TREND_30D}>
              <CartesianGrid stroke="rgba(15,23,42,0.08)" />
              <XAxis dataKey="day" stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: "#374151" }} />
              <Line type="monotone" dataKey="current" name="本期" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="previous" name="上期" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartBox>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartBox title="渠道分析" onExport={exportOk}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REPORT_CHANNELS} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {REPORT_CHANNELS.map((item) => <Cell key={item.name} fill={item.fill} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#374151" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="admin-table">
              <thead><tr><th>渠道</th><th>订单</th><th>营收</th><th>抽成</th><th>到账</th></tr></thead>
              <tbody>
                {REPORT_CHANNELS.map((item) => (
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
        </ChartBox>
        <ChartBox title="套餐销量" onExport={exportOk}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPORT_PLANS}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 11 }} />
                <YAxis stroke="#6B7280" tick={{ fill: "#6B7280", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sold" name="销量" fill="#A855F7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="admin-table">
              <thead><tr><th>套餐</th><th>销量</th><th>营收占比</th></tr></thead>
              <tbody>
                {REPORT_PLANS.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.sold}</td>
                    <td>{Math.round((item.revenue / totalRev) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartBox>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartBox title="国籍分布" onExport={exportOk}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REPORT_NATIONS} dataKey="value" nameKey="name" outerRadius={80}>
                  {REPORT_NATIONS.map((item) => <Cell key={item.name} fill={item.fill} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#374151" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
        <ChartBox title="性别比例" onExport={exportOk}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REPORT_GENDER} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80}>
                  {REPORT_GENDER.map((item) => <Cell key={item.name} fill={item.fill} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#374151" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
        <ChartBox title="年龄段" onExport={exportOk}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPORT_AGES}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="band" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="people" name="人数" fill="#22D3EE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
        <ChartBox title="预订时间段" onExport={exportOk}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPORT_DAYPART}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="band" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="people" name="人数" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartBox>
      </div>
    </div>
  );
}
