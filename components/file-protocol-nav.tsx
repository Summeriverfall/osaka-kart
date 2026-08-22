"use client";

import { useEffect } from "react";
import { fileSiteRoot, isFileProtocol, navigateToHref } from "@/lib/file-href";

function rewritePublicSrc(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/_next")) return null;
  if (value.startsWith("/images/") || value.startsWith("/videos/") || value.startsWith("/favicon")) {
    return `${fileSiteRoot()}${value.replace(/^\//, "")}`;
  }
  return null;
}

export function FileProtocolNav() {
  useEffect(() => {
    if (!isFileProtocol()) return;

    function rewriteAssets(root: ParentNode = document) {
      root.querySelectorAll("img[src], video[src], video[poster], source[src], audio[src]").forEach((node) => {
        const el = node as HTMLImageElement & HTMLVideoElement;
        const src = rewritePublicSrc(el.getAttribute("src"));
        if (src) el.setAttribute("src", src);
        const poster = rewritePublicSrc(el.getAttribute("poster"));
        if (poster) el.setAttribute("poster", poster);
      });
    }

    rewriteAssets();
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) rewriteAssets(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const node = event.target as Element | null;
      const link = node?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (href.startsWith("//")) return;
      event.preventDefault();
      navigateToHref(href);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
