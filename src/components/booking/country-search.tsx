"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { COUNTRIES, filterCountries, regionName } from "@/lib/geo/countries";

type CountrySearchProps = {
  locale: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
};

export function CountrySearch({ locale, value, onChange, placeholder, error, id }: CountrySearchProps) {
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = COUNTRIES.find((item) => item.code === value);
  const label = selected ? regionName(selected.code, locale) : "";
  const list = useMemo(() => filterCountries(open ? query : "", locale).slice(0, 40), [open, query, locale]);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={cn("book-combo", error && "is-bad")} ref={box}>
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={open ? query : label}
        placeholder={placeholder}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
      />
      {open ? (
        <ul className="book-combo-list" role="listbox" id={listId}>
          {list.length ? (
            list.map((item) => (
              <li key={item.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item.code === value}
                  className={item.code === value ? "is-on" : undefined}
                  onClick={() => {
                    onChange(item.code);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <span>{regionName(item.code, locale)}</span>
                  <small>{item.code}</small>
                </button>
              </li>
            ))
          ) : (
            <li className="book-combo-empty">—</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
