"use client";

import { adminCopy, adminNation, adminPlanName } from "@/lib/admin/copy";
import { labelChannel } from "@/lib/channel-options";
import { type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import { type MockPlan } from "@/lib/mock/plans";
import { useOpsStore } from "@/stores/ops-store";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export function OrderEditFields({
  order,
  plans,
  channelOptions,
  locale,
  onChange,
}: {
  order: MockOrder;
  plans: MockPlan[];
  channelOptions: string[];
  locale: string;
  onChange: (next: MockOrder) => void;
}) {
  const copy = adminCopy(locale);
  const channels = useOpsStore((state) => state.settings.channels);
  const nationKeys = Object.keys(copy.nation);
  const nations = nationKeys.includes(order.nationality) ? nationKeys : [order.nationality, ...nationKeys];

  function set(patch: Partial<MockOrder>) {
    onChange({ ...order, ...patch });
  }

  function setPeople(male: number, female: number) {
    const nextMale = Math.max(0, male);
    const nextFemale = Math.max(0, female);
    const riders = nextMale + nextFemale;
    const plan = plans.find((item) => item.slug === order.planSlug);
    set({
      male: nextMale,
      female: nextFemale,
      riders,
      totalJpy: plan ? plan.priceJpy * riders : order.totalJpy,
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="admin-field">
        {copy.orders.date}
        <input className="admin-input" type="date" value={order.date} onChange={(event) => set({ date: event.target.value })} />
      </label>
      <label className="admin-field">
        {copy.orders.time}
        <input
          className="admin-input"
          type="time"
          value={order.time.slice(0, 5)}
          onChange={(event) => set({ time: event.target.value.slice(0, 5) })}
        />
      </label>
      <label className="admin-field">
        {copy.orders.plan}
        <select
          className="admin-input"
          value={order.planSlug}
          onChange={(event) => {
            const plan = plans.find((item) => item.slug === event.target.value) ?? plans[0];
            set({
              planSlug: plan.slug,
              planName: plan.name,
              totalJpy: plan.priceJpy * order.riders,
            });
          }}
        >
          {plans.map((plan) => (
            <option key={plan.id} value={plan.slug}>
              {adminPlanName(locale, plan, plan.name)}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        {copy.gender.male}
        <input
          className="admin-input"
          type="number"
          min={0}
          value={order.male}
          onChange={(event) => setPeople(Number(event.target.value) || 0, order.female)}
        />
      </label>
      <label className="admin-field">
        {copy.gender.female}
        <input
          className="admin-input"
          type="number"
          min={0}
          value={order.female}
          onChange={(event) => setPeople(order.male, Number(event.target.value) || 0)}
        />
      </label>
      <label className="admin-field">
        {copy.orders.customerName}
        <input className="admin-input" value={order.customer} onChange={(event) => set({ customer: event.target.value })} />
      </label>
      <label className="admin-field">
        {copy.orders.nationality}
        <select className="admin-input" value={order.nationality} onChange={(event) => set({ nationality: event.target.value })}>
          {nations.map((code) => (
            <option key={code} value={code}>
              {code in copy.nation ? adminNation(locale, code) : code}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        {copy.orders.channel}
        <select className="admin-input" value={order.channel} onChange={(event) => set({ channel: event.target.value })}>
          {channelOptions.map((item) => (
            <option key={item} value={item}>
              {labelChannel(locale, item, channels)}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        {copy.orders.status}
        <select className="admin-input" value={order.status} onChange={(event) => set({ status: event.target.value as OrderStatus })}>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {copy.orderStatus[item]}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        {copy.orders.id}
        <input className="admin-input font-mono" value={order.id} onChange={(event) => set({ id: event.target.value })} />
      </label>
      <label className="admin-field">
        {copy.orders.amount}
        <input
          className="admin-input"
          type="number"
          min={0}
          step={1}
          value={order.totalJpy}
          onChange={(event) => set({ totalJpy: Math.max(0, Number(event.target.value) || 0) })}
        />
      </label>
      <label className="admin-field">
        {copy.orders.email}
        <input className="admin-input" type="email" value={order.email} onChange={(event) => set({ email: event.target.value })} />
      </label>
      <label className="admin-field">
        {copy.orders.phone}
        <input className="admin-input" value={order.phone} onChange={(event) => set({ phone: event.target.value })} />
      </label>
      <label className="admin-field">
        {copy.orders.passport}
        <input className="admin-input" value={order.passport} onChange={(event) => set({ passport: event.target.value })} />
      </label>
      <label className="admin-field sm:col-span-2">
        {copy.orders.note}
        <textarea className="admin-input min-h-24" value={order.note} onChange={(event) => set({ note: event.target.value })} />
      </label>
    </div>
  );
}
