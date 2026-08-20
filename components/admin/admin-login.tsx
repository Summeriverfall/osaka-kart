"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { withSlash } from "@/lib/paths";
import { ROLE_LABEL, roleFromEmail, useAdminStore } from "@/stores/admin-store";
import { useAdminNavStore } from "@/stores/admin-nav-store";

export function AdminLoginForm() {
  const router = useRouter();
  const login = useAdminStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    login(email);
    useAdminNavStore.getState().reset();
    router.push(withSlash("/admin/dashboard"));
  }

  const preview = email.trim()
    ? ROLE_LABEL[roleFromEmail(email)]
    : "店长";

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
          Admin login: admin@test.com / Manager login: manager@test.com
          <br />
          任意密码都能登录。当前将以「{preview}」进入。
        </p>

        <button type="submit" className="cta-btn mt-6 h-11 w-full text-sm">
          登录
        </button>
      </form>
    </div>
  );
}
