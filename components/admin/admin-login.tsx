"use client";

import { useState, type FormEvent } from "react";
import { goToAppPath } from "@/lib/file-href";
import { MOCK_STORES } from "@/lib/mock/settings";
import { boundStoreIdFromEmail, staffRecordForEmail } from "@/lib/staff-bind";
import { ROLE_LABEL, roleFromEmail, useAdminStore } from "@/stores/admin-store";
import { useAdminNavStore } from "@/stores/admin-nav-store";

export function AdminLoginForm() {
  const login = useAdminStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    login(email);
    useAdminNavStore.getState().reset();
    goToAppPath("/admin/dashboard");
  }

  const previewRole = email.trim() ? ROLE_LABEL[roleFromEmail(email)] : "店长";
  const previewStore =
    email.trim() && roleFromEmail(email) === "manager"
      ? staffRecordForEmail(email)?.store
        ?? MOCK_STORES.find((item) => item.id === boundStoreIdFromEmail(email))?.name
        ?? "难波本店"
      : null;

  return (
    <div className="admin-app flex min-h-dvh items-center justify-center bg-[#f5f6f8] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <p className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase">
          Admin
        </p>
        <h1 className="mt-3 text-2xl font-black text-slate-900">Furture Kart Osaka</h1>
        <p className="mt-2 text-sm text-slate-500">管理后台登录</p>

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
            placeholder="任意密码"
          />
        </label>

        <p className="mt-4 text-xs text-slate-500">
          超管：admin@test.com（仪表盘默认全店合计，可点进分店）
          <br />
          店长：manager@test.com（绑定难波本店）
          <br />
          任意密码都能登录。当前将以「{previewRole}」进入
          {previewStore ? `，只能查看「${previewStore}」` : ""}。
        </p>

        <button type="submit" className="cta-btn mt-6 h-11 w-full text-sm">
          登录
        </button>
      </form>
    </div>
  );
}
