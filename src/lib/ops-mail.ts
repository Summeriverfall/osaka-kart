import type { MockSettings } from "@/lib/mock/settings";

const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";

export function mailSettingsOf(settings: MockSettings) {
  return {
    from: settings.mailFrom?.trim() ?? "",
    to: settings.mailTo?.trim() ?? "",
    publicKey: settings.mailPublicKey?.trim() ?? "",
    serviceId: settings.mailServiceId?.trim() ?? "",
    templateId: settings.mailTemplateId?.trim() ?? "",
  };
}

export function isMailConfigured(settings: MockSettings) {
  const mail = mailSettingsOf(settings);
  return Boolean(mail.from && mail.to && mail.publicKey && mail.serviceId && mail.templateId);
}

function uniqueEmails(...list: Array<string | undefined>) {
  return [...new Set(list.map((item) => item?.trim() ?? "").filter(Boolean))];
}

export async function sendMail(options: {
  to: string;
  subject: string;
  body: string;
  settings: MockSettings;
}) {
  const mail = mailSettingsOf(options.settings);
  if (!mail.from || !mail.to || !mail.publicKey || !mail.serviceId || !mail.templateId) {
    return { ok: false as const, message: "请先在系统设置填写发信箱、收件箱和 EmailJS 密钥" };
  }
  const to = options.to.trim();
  if (!to) return { ok: false as const, message: "没有收件地址" };

  const res = await fetch(EMAILJS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: mail.serviceId,
      template_id: mail.templateId,
      user_id: mail.publicKey,
      template_params: {
        to_email: to,
        to_name: to,
        from_name: "Future Kart Osaka",
        from_email: mail.from,
        reply_to: mail.from,
        subject: options.subject,
        message: options.body,
      },
    }),
  });
  const text = (await res.text()).trim();
  if (!res.ok) {
    return { ok: false as const, message: text || `发信失败（${res.status}）` };
  }
  return { ok: true as const, message: "OK" };
}

export async function sendMailToAll(options: {
  to: string[];
  subject: string;
  body: string;
  settings: MockSettings;
  copySubject?: string;
}) {
  const targets = uniqueEmails(...options.to);
  if (!targets.length) return { ok: false as const, sent: [] as string[], message: "没有收件地址" };

  const sent: string[] = [];
  const errors: string[] = [];
  for (const [index, to] of targets.entries()) {
    const subject = index > 0 && options.copySubject ? options.copySubject : options.subject;
    const result = await sendMail({ to, subject, body: options.body, settings: options.settings });
    if (result.ok) sent.push(to);
    else errors.push(`${to}：${result.message}`);
  }
  if (!sent.length) {
    return { ok: false as const, sent, message: errors[0] || "发信失败" };
  }
  const extra = errors.length ? `；未送到：${errors.join("；")}` : "";
  return {
    ok: true as const,
    sent,
    message: `已发送 → ${sent.join("、")}${extra}`,
  };
}