"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { dialLabel, dialOptions, type DialOption } from "@/lib/geo/countries";

type PhoneFieldProps = {
  locale: string;
  dial: string;
  number: string;
  onDial: (dial: string) => void;
  onNumber: (value: string) => void;
  error?: string;
};

export function PhoneField({ locale, dial, number, onDial, onNumber, error }: PhoneFieldProps) {
  const box = useRef<HTMLDivElement>(null);
  const options = useMemo(() => dialOptions(), []);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const current = options.find((item) => item.dial === dial) ?? options[0];

  const list = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return options;
    return options.filter((item) => {
      const label = dialLabel(item, locale).toLowerCase();
      return label.includes(q) || item.dial.includes(q) || item.codes.some((code) => code.toLowerCase().includes(q));
    });
  }, [options, query, locale]);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(item: DialOption) {
    onDial(item.dial);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className={cn("book-phone", error && "is-bad")}>
      <div className="book-combo book-phone-dial" ref={box}>
        <button type="button" className="book-phone-dial-btn" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          +{current?.dial ?? dial}
        </button>
        {open ? (
          <div className="book-combo-pop">
            <input
              autoFocus
              value={query}
              placeholder="+"
              onChange={(event) => setQuery(event.target.value)}
            />
            <ul className="book-combo-list" role="listbox">
              {list.slice(0, 40).map((item) => (
                <li key={item.dial}>
                  <button type="button" className={item.dial === dial ? "is-on" : undefined} onClick={() => pick(item)}>
                    <span>{dialLabel(item, locale)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={number}
        onChange={(event) => onNumber(event.target.value.replace(/[^\d\s-]/g, ""))}
      />
    </div>
  );
}
