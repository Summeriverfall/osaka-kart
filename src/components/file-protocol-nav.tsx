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

function shouldHandleHref(href: string | null) {
  if (!href) return false;
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (/^javascript:/i.test(href)) return false;
  if (/^https?:/i.test(href)) return false;
  return true;
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
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const node = event.target as Element | null;
      const link = node?.closest?.("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!shouldHandleHref(href)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      navigateToHref(href as string);
    }

    window.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
