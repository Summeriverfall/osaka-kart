"use client";

import { cn } from "@/lib/utils";

type NeonToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
};

export function NeonToggle({ checked, onChange, label }: NeonToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 rounded-full border transition",
        checked ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-slate-200",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition",
          checked ? "left-6" : "left-0.5",
        )}
      />
    </button>
  );
}
