"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { b2Copy } from "@/lib/admin/b2-copy";
import { adminCopy } from "@/lib/admin/copy";
import { BOOKING_SLOTS, todayIsoDate } from "@/lib/booking/slots";
import { addDaysIso, eachIso, weekEndSunday, weekStartMonday, weekdayLabel } from "@/lib/calendar";
import { occupancyRate, summarizeFleetSlot, type FleetCell } from "@/lib/fleet-inventory";
import { timelineTicks } from "@/lib/mock/vehicle-timeline";
import { cn } from "@/lib/utils";
import { useOpsStore } from "@/stores/ops-store";
import { useStoreData } from "@/lib/use-store-data";

const TICKS = timelineTicks();

function toneClass(cell: FleetCell) {
  if (cell.closed) return "is-idle";
  if (cell.tone === "full") return "is-low";
  if (cell.tone === "tight") return "is-tight";
  return "is-free";
}

export function FleetInventoryGrid() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const today = todayIsoDate();
  const [anchor, setAnchor] = useState(weekStartMonday(today));
  const { vehicles, vehicleSlots, orders, specialDates, storeId } = useStoreData();
  const ensureInventory = useOpsStore((state) => state.ensureInventory);

  const days = useMemo(() => eachIso(anchor, weekEndSunday(anchor)), [anchor]);

  const grid = useMemo(() => {
    ensureInventory();
    return TICKS.map((time) =>
      days.map((date) =>
        summarizeFleetSlot(date, time, vehicles, vehicleSlots, orders, specialDates, storeId),
      ),
    );
  }, [days, vehicles, vehicleSlots, orders, specialDates, storeId, ensureInventory]);

  const oversell = grid.some((row) => row.some((cell) => cell.oversold));
  const rate = occupancyRate(days[0], days[days.length - 1], days, vehicles, vehicleSlots, orders, specialDates, storeId);

  return (
    <section className="fleet-board">
      <div className="fleet-toolbar">
        <button type="button" className="ib-btn" onClick={() => setAnchor(addDaysIso(anchor, -7))}>
          <ChevronLeft className="size-4" /> {b2.prevWeek}
        </button>
        <button type="button" className={cn("ib-btn", anchor === weekStartMonday(today) && "is-on")} onClick={() => setAnchor(weekStartMonday(today))}>
          {b2.thisWeek}
        </button>
        <button type="button" className="ib-btn" onClick={() => setAnchor(addDaysIso(anchor, 7))}>
          {b2.nextWeek} <ChevronRight className="size-4" />
        </button>
        <p className="fleet-rate">
          {b2.utilization} {Math.round(rate * 100)}%
        </p>
      </div>
      <p className="fleet-hint">{b2.fleetHint}</p>
      {oversell ? <p className="fleet-oversell">{b2.oversell}</p> : null}

      <div className="fleet-scroll">
        <table className="fleet-table">
          <thead>
            <tr>
              <th className="fleet-sticky">{copy.calendar.time}</th>
              {days.map((date) => (
                <th key={date}>
                  <span className="fleet-date">{date.slice(5)}</span>
                  <small>{weekdayLabel(locale, date)}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TICKS.map((time, rowIndex) => (
              <tr key={time}>
                <th className="fleet-sticky">{time}</th>
                {grid[rowIndex]?.map((cell) => (
                  <td key={`${cell.date}-${cell.time}`}>
                    <div
                      className={cn("fleet-cell", toneClass(cell), cell.oversold && "is-oversell")}
                      title={
                        cell.closed
                          ? b2.closed
                          : `${cell.left}/${cell.total} ${b2.units}`
                      }
                    >
                      {cell.closed ? b2.closed : `${cell.left}/${cell.total} ${b2.units}`}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="fleet-legend">
        <li><i className="is-free" /> {copy.inventory.free}</li>
        <li><i className="is-tight" /> {copy.inventory.tight}</li>
        <li><i className="is-low" /> {copy.inventory.full}</li>
        <li><i className="is-idle" /> {b2.closed}</li>
      </ul>
    </section>
  );
}

export const BOOKING_SLOT_SET = BOOKING_SLOTS;
