"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { adminCopy, adminLogRole, adminLogType } from "@/lib/admin/copy";
import { type LogType } from "@/lib/mock/logs";
import { useStoreData } from "@/lib/use-store-data";

const LOG_TYPES: LogType[] = ["登录", "登出", "订单修改", "库存调整", "套餐上下架", "员工变更"];

type LogsTableProps = {
  limit?: number;
};

export function LogsTable({ limit }: LogsTableProps) {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const [actor, setActor] = useState("all");
  const [type, setType] = useState<LogType | "all">("all");
  const { logs: source } = useStoreData();

  const filtered = useMemo(() => {
    return [...source]
      .sort((a, b) => b.time.localeCompare(a.time))
      .filter((item) => {
        if (actor !== "all" && item.actor !== actor) return false;
        if (type !== "all" && item.type !== type) return false;
        return true;
      });
  }, [actor, type, source]);

  const rows = typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  return (
    <>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-md">
        <select className="admin-input mt-0" value={actor} onChange={(e) => setActor(e.target.value)}>
          <option value="all">{copy.logsPage.allActors}</option>
          {[...new Set(source.map((item) => item.actor))].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <select className="admin-input mt-0" value={type} onChange={(e) => setType(e.target.value as LogType | "all")}>
          <option value="all">{copy.logsPage.allTypes}</option>
          {LOG_TYPES.map((item) => (
            <option key={item} value={item}>{adminLogType(locale, item)}</option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        {typeof limit === "number"
          ? copy.logsPage.recent(rows.length, filtered.length > rows.length ? filtered.length : undefined)
          : copy.logsPage.total(rows.length)}
      </p>
      <div className="mt-3 hidden overflow-x-auto md:block">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{copy.logsPage.time}</th>
              <th>{copy.logsPage.actor}</th>
              <th>{copy.logsPage.role}</th>
              <th>{copy.logsPage.type}</th>
              <th>{copy.logsPage.detail}</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td>{item.time}</td>
                <td>{item.actor}</td>
                <td>{adminLogRole(locale, item.role)}</td>
                <td>{adminLogType(locale, item.type)}</td>
                <td>{item.detail}</td>
                <td className="font-mono text-xs">{item.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid gap-3 md:hidden">
        {rows.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500">{item.time}</p>
              <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-600">{adminLogType(locale, item.type)}</span>
            </div>
            <p className="mt-1 text-sm font-semibold">
              {item.actor}
              <span className="ml-1 font-normal text-slate-500">· {adminLogRole(locale, item.role)}</span>
            </p>
            <p className="mt-1 break-words text-sm leading-5 text-slate-600">{item.detail}</p>
            <p className="mt-1 font-mono text-[11px] text-slate-400">{item.ip}</p>
          </article>
        ))}
      </div>
      {rows.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-400">{copy.logsPage.empty}</p> : null}
    </>
  );
}
