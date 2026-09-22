"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { NeonToggle } from "@/components/ui/neon-toggle";
import { adminCopy } from "@/lib/admin/copy";
import { SITE_CONTACT } from "@/lib/contact";
import {
  DEFAULT_SOCIAL_DOCK,
  MOCK_CMS,
  SOCIAL_DOCK_KEYS,
  socialDockOf,
  type CmsSite,
  type SocialDockKey,
} from "@/lib/mock/cms";
import { b2Copy } from "@/lib/admin/b2-copy";
import { useOpsStore } from "@/stores/ops-store";
import { useToastStore } from "@/stores/toast-store";
import { appPageHref } from "@/lib/file-href";

const DOCK_META: { id: SocialDockKey; socialKey: "instagram" | "tiktok" | "facebook" | "tripadvisor" | "x"; fallback: string }[] = [
  { id: "instagram", socialKey: "instagram", fallback: SITE_CONTACT.instagram },
  { id: "tiktok", socialKey: "tiktok", fallback: SITE_CONTACT.tiktok },
  { id: "facebook", socialKey: "facebook", fallback: SITE_CONTACT.facebook },
  { id: "tripadvisor", socialKey: "tripadvisor", fallback: SITE_CONTACT.tripadvisor },
  { id: "twitter", socialKey: "x", fallback: SITE_CONTACT.x },
];

function dockLabel(copy: ReturnType<typeof adminCopy>, id: SocialDockKey) {
  if (id === "twitter") return copy.cms.twitter;
  if (id === "tripadvisor") return copy.cms.tripadvisor;
  return copy.cms[id];
}

export function AdminSocialDockView() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const b2 = b2Copy(locale);
  const cms = useOpsStore((state) => state.cms);
  const patchCms = useOpsStore((state) => state.patchCms);
  const notify = useToastStore((state) => state.notify);
  const [site, setSite] = useState<CmsSite>(cms.site);

  useEffect(() => {
    setSite(cms.site);
  }, [cms.site]);

  const dock = socialDockOf(site);

  function setHref(key: (typeof DOCK_META)[number]["socialKey"], value: string) {
    setSite({ ...site, social: { ...site.social, [key]: value } });
  }

  function setShow(id: SocialDockKey, show: boolean) {
    setSite({ ...site, socialDock: { ...dock, [id]: show } });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-slate-500">{copy.pages["/admin/settings/social"]?.lead}</p>
      <div className="space-y-3">
        {DOCK_META.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">{dockLabel(copy, item.id)}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{dock[item.id] ? copy.cms.on : copy.cms.off}</span>
                <NeonToggle checked={dock[item.id]} onChange={(next) => setShow(item.id, next)} label={dockLabel(copy, item.id)} />
              </div>
            </div>
            <label className="admin-field">
              {copy.cms.link}
              <input
                className="admin-input"
                value={site.social[item.socialKey] ?? ""}
                placeholder={item.fallback}
                onChange={(event) => setHref(item.socialKey, event.target.value)}
              />
            </label>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="cta-btn px-5 py-2.5"
          onClick={() => {
            patchCms({ site: { ...site, socialDock: socialDockOf(site) } });
            notify(copy.cms.saved);
          }}
        >
          {copy.common.save}
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm"
          onClick={() => {
            const next = {
              ...MOCK_CMS.site,
              social: { ...MOCK_CMS.site.social },
              socialDock: { ...DEFAULT_SOCIAL_DOCK },
            };
            setSite(next);
            patchCms({ site: next });
            notify(copy.cms.saved);
          }}
        >
          {copy.cms.restore}
        </button>
        <a className="rounded-full border border-slate-200 px-4 py-2 text-sm text-blue-600" href={appPageHref("/", locale)} target="_blank" rel="noreferrer">
          {b2.previewFront}
        </a>
      </div>
    </div>
  );
}
