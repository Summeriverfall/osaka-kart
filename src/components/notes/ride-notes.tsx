"use client";

import {
  AlertTriangle,
  Cake,
  CloudRain,
  IdCard,
  RefreshCw,
  Shirt,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { appPageHref, isFileProtocol, navigateToHref } from "@/lib/file-href";
import { withSlash } from "@/lib/paths";
import { cn } from "@/lib/utils";

export const NOTE_ITEMS = [
  { key: "license", Icon: IdCard, more: true },
  { key: "age", Icon: Cake, more: false },
  { key: "clothes", Icon: Shirt, more: false },
  { key: "weather", Icon: CloudRain, more: false },
  { key: "cancel", Icon: RefreshCw, more: false },
] as const;

export type NoteKey = (typeof NOTE_ITEMS)[number]["key"];

export const NOTE_KEYS = NOTE_ITEMS.map((item) => item.key) as NoteKey[];

const DOC_SECTIONS = [
  { title: "noticeTitle", items: "noticeItems", taiwan: true },
  { title: "cautionTitle", items: "cautionItems" },
  { title: "restrictTitle", items: "restrictItems" },
  { title: "dressTitle", items: "dressItems" },
  { title: "accessTitle", items: "accessItems" },
  { title: "weatherLabel", items: "weatherItems" },
  { title: "cancelLabel", items: "cancelItems" },
] as const;

function noteList(t: { raw: (key: string) => unknown }, key: string) {
  const raw = t.raw(key);
  return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string") : [];
}

export function emptyNoteChecks(): Record<NoteKey, boolean> {
  return {
    license: false,
    age: false,
    clothes: false,
    weather: false,
    cancel: false,
  };
}

export function allNotesChecked(notes: Record<NoteKey, boolean>) {
  return NOTE_KEYS.every((key) => notes[key]);
}

export function filledNoteChecks(): Record<NoteKey, boolean> {
  return {
    license: true,
    age: true,
    clothes: true,
    weather: true,
    cancel: true,
  };
}

export function BookingNoticeDoc() {
  const t = useTranslations("Notes");

  return (
    <div className="ride-notes-doc">
      {DOC_SECTIONS.map((section) => (
        <section key={section.title}>
          <h3>{t(section.title)}</h3>
          <ul>
            {noteList(t, section.items).map((item) => (
              <li key={item}>{item}</li>
            ))}
            {"taiwan" in section && section.taiwan ? (
              <li>
                {t("taiwanHint")}{" "}
                <a href={t("taiwanHref")} target="_blank" rel="noopener noreferrer">
                  {t("taiwanLink")}
                </a>
              </li>
            ) : null}
          </ul>
        </section>
      ))}
    </div>
  );
}

type RideNotesProps = {
  compact?: boolean;
  title?: boolean;
};

export function RideNotes({ compact = false, title = true }: RideNotesProps) {
  const t = useTranslations("Notes");
  const locale = useLocale();
  const help = withSlash("/help");

  if (!compact) {
    return (
      <div className={cn("ride-notes", !title && "is-flush")}>
        {title ? (
          <h2>
            <AlertTriangle className="size-5" aria-hidden />
            {t("title")}
          </h2>
        ) : null}
        <BookingNoticeDoc />
      </div>
    );
  }

  return (
    <div className={cn("ride-notes", "is-compact", !title && "is-flush")}>
      {title ? (
      <h2>
        <AlertTriangle className="size-5" aria-hidden />
        {t("payTitle")}
      </h2>
      ) : null}
      <ul>
        {NOTE_ITEMS.map(({ key, Icon, more }) => (
          <li key={key}>
            <Icon className="size-4" aria-hidden />
            <p>
              <strong>{t(`${key}Label`)}</strong>
              {t(`${key}Body`)}
              {more ? (
                <>
                  {" "}
                  <a
                    href={appPageHref(help, locale)}
                    className="ride-notes-more"
                    suppressHydrationWarning
                    onClick={(event) => {
                      if (!isFileProtocol()) return;
                      event.preventDefault();
                      navigateToHref(help, locale);
                    }}
                  >
                    {t("more")}
                  </a>
                </>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

type RideNoteChecksProps = {
  keys?: readonly NoteKey[];
  checked: Record<NoteKey, boolean>;
  onToggle: (key: NoteKey, on: boolean) => void;
  title?: boolean;
  compact?: boolean;
};

export function RideNoteChecks({
  keys = NOTE_KEYS,
  checked,
  onToggle,
  title = true,
  compact = false,
}: RideNoteChecksProps) {
  const t = useTranslations("Notes");
  const locale = useLocale();
  const items = NOTE_ITEMS.filter((item) => keys.includes(item.key));
  const help = withSlash("/help");

  return (
    <div className={cn("ride-notes is-checks", !title && "is-flush", compact && "is-compact")}>
      {title && !compact ? (
        <h2>
          <AlertTriangle className="size-5" aria-hidden />
          {t("title")}
        </h2>
      ) : null}
      {title && !compact ? <p className="ride-notes-lead">{t("agreeLead")}</p> : null}
      <ul>
        {items.map(({ key, Icon, more }) => (
          <li key={key}>
            <label>
              <input
                type="checkbox"
                checked={Boolean(checked[key])}
                onChange={(event) => onToggle(key, event.target.checked)}
                required
              />
              <Icon className="size-4" aria-hidden />
              <p>
                <strong>{t(`${key}Label`)}</strong>
                {compact ? null : t(`${key}Body`)}
                {more ? (
                  <>
                    {" "}
                    <a
                      href={appPageHref(help, locale)}
                      className="ride-notes-more"
                      suppressHydrationWarning
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!isFileProtocol()) return;
                        event.preventDefault();
                        navigateToHref(help, locale);
                      }}
                    >
                      {t("more")}
                    </a>
                  </>
                ) : null}
              </p>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
