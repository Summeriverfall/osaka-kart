import { formatYenShort } from "@/lib/format";
import { ORDER_STATUS_LABEL, type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import type { MockEmailTemplate } from "@/lib/mock/settings";

function fillBody(body: string, order: MockOrder) {
  return body
    .replaceAll("{{customer_name}}", order.customer)
    .replaceAll("{{booking_id}}", order.id)
    .replaceAll("{{date}}", order.date)
    .replaceAll("{{time}}", order.time)
    .replaceAll("{{plan_name}}", order.planName)
    .replaceAll("{{riders}}", String(order.riders))
    .replaceAll("{{total}}", formatYenShort(order.totalJpy));
}

function pickTemplate(templates: MockEmailTemplate[], type: string, locale: string) {
  const code = locale.startsWith("ja") ? "ja" : locale.startsWith("zh") ? "zh-TW" : "en";
  return (
    templates.find((item) => item.type === type && item.locale === code) ||
    templates.find((item) => item.type === type)
  );
}

function subjectOf(body: string) {
  const line = body.split("\n").find((item) => item.trim()) ?? "";
  return line.replace(/^(主旨：|Subject:\s*|件名：)/, "").trim();
}

export function mailNoticeForStatus(
  status: OrderStatus,
  order: MockOrder,
  templates: MockEmailTemplate[],
) {
  const type =
    status === "confirmed"
      ? "预订确认"
      : status === "cancelled"
        ? "退款通知"
        : status === "completed"
          ? "回访评价"
          : "";
  if (!type) return `已改为${ORDER_STATUS_LABEL[status]}`;
  const template = pickTemplate(templates, type, order.nationality === "JP" ? "ja" : "zh-TW");
  if (!template) return `已改为${ORDER_STATUS_LABEL[status]}，将通知 ${order.email}`;
  const subject = subjectOf(fillBody(template.body, order));
  return `已模拟发送「${subject}」→ ${order.email}`;
}
