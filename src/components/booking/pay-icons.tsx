import type { JSX } from "react";

export type PayMethod = "card" | "paypay" | "apple" | "alipay" | "wechat" | "stripe";

function CardMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <rect x="3" y="7" width="26" height="18" rx="3" fill="#e5e7eb" />
      <rect x="3" y="11" width="26" height="5" fill="#111827" />
      <rect x="6" y="19" width="10" height="2.4" rx="1.2" fill="#9ca3af" />
      <rect x="20" y="18.4" width="6" height="3.6" rx="0.8" fill="#f59e0b" />
    </svg>
  );
}

function PayPayMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#ff0033" />
      <path
        fill="#fff"
        d="M8.2 7.4h8.1c3.7 0 6.1 2.1 6.1 5.4 0 3.5-2.6 5.6-6.4 5.6h-4.3V24.6H8.2V7.4zm3.5 8h4.3c1.8 0 2.9-1 2.9-2.5s-1.1-2.5-2.9-2.5h-4.3v5z"
      />
      <circle cx="23.4" cy="22.8" r="3.3" fill="#fff" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#fff"
        d="M16.37 12.84c.03 3.24 2.84 4.32 2.87 4.33-.02.08-.45 1.54-1.48 3.05-1.03 1.5-2.1 3-3.78 3.03-1.65.04-2.18-1-4.07-1-1.88 0-2.47.97-4.03 1.03-1.62.07-2.86-1.62-3.9-3.1C.03 17.3-1.5 12.3.63 8.94c1.05-1.67 2.93-2.73 4.97-2.76 1.55-.03 3.02 1.05 3.97 1.05.94 0 2.71-1.3 4.57-1.11.78.03 2.97.31 4.37 2.36-.11.07-2.61 1.52-2.58 4.36zM13.5 5.4c.84-1.02 1.4-2.44 1.25-3.86-1.2.05-2.66.8-3.52 1.82-.77.9-1.45 2.35-1.27 3.74 1.35.1 2.73-.69 3.54-1.7z"
      />
    </svg>
  );
}

function AlipayMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#1677ff" />
      <path
        fill="#fff"
        d="M8.2 20.6c2.4-1.4 4.8-2.2 7.4-2.2 1.6 0 3.2.3 4.7.8l1.5-3.7H9.4V13h14.3l-2.1 5.3c1.7.9 3.1 2.1 4.1 3.5-2.4 2.1-6 3.5-10.1 3.5-4.8 0-8.6-2.2-9.8-5.3.8.2 1.5.4 2.4.6z"
      />
      <path fill="#fff" d="M12.6 8.2h6.8l-1.1 2.8h-6.8z" />
    </svg>
  );
}

function WeChatMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#07c160" />
      <path
        fill="#fff"
        d="M13.1 8.2c-4.5 0-8.1 3-8.1 6.7 0 2.1 1.1 4 2.9 5.3l-.7 2.6 2.9-1.5c.8.2 1.6.4 2.5.4.3 0 .6 0 .9-.1-.4-.9-.7-1.9-.7-2.9 0-3.9 3.8-7.1 8.5-7.1.2 0 .4 0 .6 0-1.2-2-3.8-3.4-6.8-3.4z"
      />
      <path
        fill="#fff"
        d="M23.7 14.3c-3.9 0-7 2.6-7 5.8 0 3.2 3.1 5.8 7 5.8.7 0 1.3-.1 1.9-.2l2.4 1.2-.5-2.1c1.4-1 2.3-2.5 2.3-4.7 0-3.2-3.1-5.8-7.1-5.8z"
      />
    </svg>
  );
}

function StripeMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#635bff" />
      <path
        fill="#fff"
        d="M13.4 14.3c0-.8.7-1.1 1.8-1.1 1.6 0 3.6.5 5.2 1.4V10c-1.6-.6-3.2-1-5.2-1-4.3 0-7.1 2.2-7.1 5.9 0 5.8 8 4.9 8 7.4 0 .9-.8 1.2-2 1.2-1.7 0-4-.7-5.7-1.6v4.7c1.8.8 3.6 1.1 5.7 1.1 4.4 0 7.4-2.1 7.4-6-.1-6.2-8.1-5.1-8.1-7.3z"
      />
    </svg>
  );
}

const MARKS: Record<PayMethod, () => JSX.Element> = {
  card: CardMark,
  paypay: PayPayMark,
  apple: AppleMark,
  alipay: AlipayMark,
  wechat: WeChatMark,
  stripe: StripeMark,
};

export function PayMethodMark({ id }: { id: PayMethod }) {
  const Mark = MARKS[id];
  return (
    <span className={`pay-mark pay-mark-${id}`} aria-hidden>
      <Mark />
    </span>
  );
}
