import { adminCopy, adminOrderStatus } from "@/lib/admin/copy";
import { formatYenShort } from "@/lib/format";
import { type MockOrder, type OrderStatus } from "@/lib/mock/orders";
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
  uiLocale = "zh-TW",
) {
  const copy = adminCopy(uiLocale);
  const label = adminOrderStatus(uiLocale, status);
  const type = templateTypeForStatus(status);
  if (!type) return copy.notify.status(label);
  if (!isMailConfigured(settings)) {
    return copy.notify.statusNoMail(label);
  }

  const template = pickTemplate(templates, type, localeOfOrder(order));
  const filled = template ? fillBody(template.body, order) : "";
  const subject = template ? subjectOf(filled) : `Furture Kart Osaka — ${label} ${order.id}`;
  const body = template ? bodyWithoutSubject(filled) || filled : copy.notify.status(label);

  const shop = mailSettingsOf(settings).to;
  const result = await sendMailToAll({
    to: [order.email, shop],
    subject,
    copySubject: `【抄送】${subject}`,
    body,
    settings,
  });
  if (result.ok) return copy.notify.statusOk(label, result.message);
  return copy.notify.statusFail(label, result.message);
}

export async function sendNewBookingMail(order: MockOrder, settings: MockSettings, uiLocale = "zh-TW") {
  if (!isMailConfigured(settings)) return;
  const copy = adminCopy(uiLocale);
  const shop = mailSettingsOf(settings).to;
  const subject = copy.notify.newOrderSubject(order.id);
  const body = copy.notify.newOrderBody({
    id: order.id,
    customer: order.customer,
    email: order.email,
    phone: order.phone,
    planName: order.planName,
    date: order.date,
    time: order.time,
    riders: order.riders,
    total: formatYenShort(order.totalJpy),
  });
  await sendMail({ to: shop, subject, body, settings });
}

export async function sendTestMail(settings: MockSettings, uiLocale = "zh-TW") {
  const copy = adminCopy(uiLocale);
  if (!isMailConfigured(settings)) {
    return { ok: false as const, message: copy.notify.testNeed };
  }
  const mail = mailSettingsOf(settings);
  const result = await sendMail({
    to: mail.to,
    subject: copy.notify.testSubject,
    body: copy.notify.testBody(mail.from, mail.to),
    settings,
  });
  if (result.ok) return { ok: true as const, message: copy.notify.testOk(mail.to) };
  return result;
}
