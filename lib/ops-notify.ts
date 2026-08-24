import { formatYenShort } from "@/lib/format";
import { ORDER_STATUS_LABEL, type MockOrder, type OrderStatus } from "@/lib/mock/orders";
import type { MockEmailTemplate, MockSettings } from "@/lib/mock/settings";
import { isMailConfigured, mailSettingsOf, sendMail, sendMailToAll } from "@/lib/ops-mail";

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

function bodyWithoutSubject(body: string) {
  const lines = body.split("\n");
  const index = lines.findIndex((item) => item.trim());
  if (index < 0) return body.trim();
  return lines.slice(index + 1).join("\n").trim();
}

function templateTypeForStatus(status: OrderStatus) {
  if (status === "confirmed") return "预订确认";
  if (status === "cancelled") return "退款通知";
  if (status === "completed") return "回访评价";
  return "";
}

function localeOfOrder(order: MockOrder) {
  return order.nationality === "JP" ? "ja" : order.nationality === "KR" ? "en" : "zh-TW";
}

export async function sendStatusMail(
  status: OrderStatus,
  order: MockOrder,
  templates: MockEmailTemplate[],
  settings: MockSettings,
) {
  const type = templateTypeForStatus(status);
  if (!type) return `已改为${ORDER_STATUS_LABEL[status]}`;
  if (!isMailConfigured(settings)) {
    return `已改为${ORDER_STATUS_LABEL[status]}。尚未配置发信，请到系统设置填写发信箱、收件箱和 EmailJS`;
  }

  const template = pickTemplate(templates, type, localeOfOrder(order));
  const filled = template ? fillBody(template.body, order) : "";
  const subject = template
    ? subjectOf(filled)
    : `Furture Kart Osaka — ${ORDER_STATUS_LABEL[status]} ${order.id}`;
  const body = template
    ? bodyWithoutSubject(filled) || filled
    : `订单 ${order.id} 已改为${ORDER_STATUS_LABEL[status]}。`;

  const shop = mailSettingsOf(settings).to;
  const result = await sendMailToAll({
    to: [order.email, shop],
    subject,
    copySubject: `【抄送】${subject}`,
    body,
    settings,
  });
  if (result.ok) return `已改为${ORDER_STATUS_LABEL[status]}。${result.message}`;
  return `已改为${ORDER_STATUS_LABEL[status]}，但发信失败：${result.message}`;
}

export async function sendNewBookingMail(order: MockOrder, settings: MockSettings) {
  if (!isMailConfigured(settings)) return;
  const shop = mailSettingsOf(settings).to;
  const subject = `官网新订单 ${order.id}`;
  const body = [
    "官网刚完成一笔支付，待后台确认。",
    "",
    `预约号：${order.id}`,
    `客人：${order.customer}`,
    `邮箱：${order.email}`,
    `电话：${order.phone}`,
    `套餐：${order.planName}`,
    `日期：${order.date} ${order.time}`,
    `人数：${order.riders}`,
    `金额：${formatYenShort(order.totalJpy)}`,
  ].join("\n");
  await sendMail({ to: shop, subject, body, settings });
}

export async function sendTestMail(settings: MockSettings) {
  if (!isMailConfigured(settings)) {
    return { ok: false as const, message: "请先填写发信箱、收件箱和 EmailJS 三项密钥" };
  }
  const mail = mailSettingsOf(settings);
  const result = await sendMail({
    to: mail.to,
    subject: "Furture Kart Osaka 发信测试",
    body: `这是后台测试信。\n发信箱：${mail.from}\n收件箱：${mail.to}`,
    settings,
  });
  if (result.ok) return { ok: true as const, message: `测试信已发送 → ${mail.to}` };
  return result;
}