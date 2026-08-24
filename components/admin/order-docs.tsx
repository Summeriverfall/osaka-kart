"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { adminCopy } from "@/lib/admin/copy";
import { asset } from "@/lib/asset";

type DocKey = "passport" | "license" | "idp";

const DOCS: { key: DocKey; src: string }[] = [
  { key: "passport", src: "/images/docs/passport.jpg" },
  { key: "license", src: "/images/docs/license.jpg" },
  { key: "idp", src: "/images/docs/idp.jpg" },
];

export function OrderDocs({ locale }: { locale: string }) {
  const copy = adminCopy(locale);
  const [preview, setPreview] = useState<DocKey | null>(null);
  const labels: Record<DocKey, string> = {
    passport: copy.orders.docPassport,
    license: copy.orders.docLicense,
    idp: copy.orders.docIdp,
  };
  const current = DOCS.find((doc) => doc.key === preview);

  useEffect(() => {
    if (!preview) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      setPreview(null);
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [preview]);

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-bold text-slate-900">{copy.orders.docsTitle}</h4>
      <p className="mt-1 text-xs text-slate-500">{copy.orders.docsHint}</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {DOCS.map((doc) => (
          <button
            key={doc.key}
            type="button"
            className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:border-blue-400"
            onClick={() => setPreview(doc.key)}
          >
            <span className="block aspect-[4/3] bg-slate-100">
              <img src={asset(doc.src)} alt={labels[doc.key]} className="h-full w-full object-contain" />
            </span>
            <span className="block px-1.5 py-1.5 text-center text-xs font-medium text-slate-700">{labels[doc.key]}</span>
          </button>
        ))}
      </div>
      {current
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4"
              onClick={() => setPreview(null)}
              role="dialog"
              aria-modal="true"
              aria-label={labels[current.key]}
            >
              <button
                type="button"
                className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white text-slate-800"
                onClick={() => setPreview(null)}
                aria-label={copy.common.close}
              >
                <X className="size-4" />
              </button>
              <img
                src={asset(current.src)}
                alt={labels[current.key]}
                className="max-h-[86vh] max-w-[min(92vw,880px)] rounded-lg object-contain shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
