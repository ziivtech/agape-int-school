"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Incorrect email or password.");

      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FAF8F9] px-6 py-8 sm:px-10">
      <div className="mx-auto my-auto w-full max-w-md">
        <div className="rounded-2xl border border-[#19151C]/10 bg-white p-8 shadow-sm sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C0798]/10 text-[#6C0798]">
              <Lock size={20} />
            </div>
            <h1 className="mt-5 font-serif text-2xl text-[#19151C] sm:text-3xl">Staff sign in</h1>
            <p className="mt-2 font-sans text-xs leading-relaxed text-[#19151C]/60 sm:text-sm">
              Manage the website, news, events and enquiries.
            </p>
          </div>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-center font-sans text-xs text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block font-sans text-xs font-semibold text-[#19151C]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#19151C]/15 bg-[#FAF8F9] px-4 font-sans text-sm text-[#19151C] outline-none transition-all focus:border-[#6C0798] focus:bg-white focus:ring-1 focus:ring-[#6C0798]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-sans text-xs font-semibold text-[#19151C]">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#19151C]/15 bg-[#FAF8F9] px-4 font-sans text-sm text-[#19151C] outline-none transition-all focus:border-[#6C0798] focus:bg-white focus:ring-1 focus:ring-[#6C0798]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#6C0798] font-sans text-sm font-medium text-white shadow-sm transition-all hover:bg-[#4B075F] disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-xs text-[#19151C]/45">
            Forgotten your password? Ask a school admin to reset it.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl text-center font-sans text-xs text-[#19151C]/40">
        © {new Date().getFullYear()} Agape Academy International
      </div>
    </div>
  );
}
