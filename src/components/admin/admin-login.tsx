"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { AdminLangSwitch } from "@/components/admin/admin-lang-switch";
import { adminCopy, adminRoleLabel, adminStoreName } from "@/lib/admin/copy";
import { goToAppPath } from "@/lib/file-href";
import { MOCK_STORES } from "@/lib/mock/settings";
import { boundStoreIdFromEmail, staffRecordForEmail } from "@/lib/staff-bind";
import { roleFromEmail, useAdminStore } from "@/stores/admin-store";
import { useAdminNavStore } from "@/stores/admin-nav-store";

export function AdminLoginForm() {
  const locale = useLocale();
  const copy = adminCopy(locale);
  const login = useAdminStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    login(email);
    useAdminNavStore.getState().reset();
    goToAppPath("/admin/dashboard", locale);
  }

  const previewRole = email.trim()
    ? adminRoleLabel(locale, roleFromEmail(email))
    : copy.manager;
  const previewStore =
    email.trim() && roleFromEmail(email) === "manager"
      ? adminStoreName(
          locale,
          boundStoreIdFromEmail(email),
          staffRecordForEmail(email)?.store
            ?? MOCK_STORES.find((item) => item.id === boundStoreIdFromEmail(email))?.name
            ?? copy.nambaStore,
        )
      : null;

  return (
    <div className="admin-app flex min-h-dvh items-center justify-center bg-[#f5f6f8] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase">
            Admin
          </p>
          <AdminLangSwitch locale={locale} path="/admin/login" />
        </div>
        <h1 className="mt-3 text-2xl font-black text-slate-900">Future Kart Osaka</h1>
        <p className="mt-2 text-sm text-slate-500">{copy.loginLead}</p>

        <label className="mt-8 block text-sm text-slate-600">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="username"
            className="admin-input mt-2 h-11"
            placeholder="admin@osakakart.jp"
          />
        </label>

        <label className="mt-4 block text-sm text-slate-600">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="admin-input mt-2 h-11"
            placeholder={copy.passwordPh}
          />
        </label>

        <p className="mt-4 text-xs text-slate-500">
          {copy.loginHintAdmin}
          <br />
          {copy.loginHintManager}
          <br />
          {copy.loginHintAny.replace("{role}", previewRole)}
          {previewStore ? copy.loginOnly.replace("{store}", previewStore) : ""}
        </p>

        <button type="submit" className="cta-btn mt-6 h-11 w-full text-sm">
          {copy.login}
        </button>
      </form>
    </div>
  );
}
