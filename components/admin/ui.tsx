"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

/* Small shared building blocks for the admin panel. */

export const inputClass =
  "w-full rounded-lg border border-[#19151C]/15 bg-white px-3 py-2.5 font-sans text-sm text-[#19151C] outline-none transition placeholder:text-[#19151C]/35 focus:border-[#6C0798] focus:ring-2 focus:ring-[#6C0798]/15";

export const labelClass = "mb-1.5 block font-sans text-xs font-semibold text-[#19151C]/75";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl text-[#19151C] sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-[#19151C]/60">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-[#19151C]/10 bg-white ${className}`}>{children}</div>;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
};

export function Button({ variant = "primary", loading, className = "", children, disabled, ...rest }: ButtonProps) {
  const styles = {
    primary: "bg-[#6C0798] text-white hover:bg-[#4B075F]",
    secondary: "border border-[#19151C]/15 bg-white text-[#19151C] hover:border-[#6C0798]/40 hover:text-[#6C0798]",
    danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
    ghost: "text-[#19151C]/60 hover:bg-[#19151C]/5 hover:text-[#19151C]",
  }[variant];
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-sans text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "purple" | "red" | "green" | "amber" }) {
  const styles = {
    neutral: "bg-[#19151C]/5 text-[#19151C]/65",
    purple: "bg-[#6C0798]/10 text-[#6C0798]",
    red: "bg-[#E12F41]/10 text-[#C4202F]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold ${styles}`}>{children}</span>;
}

/* ---------------- Toasts ---------------- */

type Toast = { id: number; type: "success" | "error"; message: string };
const ToastContext = createContext<(type: Toast["type"], message: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-[min(92vw,380px)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 font-sans text-sm shadow-lg ${
              t.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            {t.type === "success" ? <CheckCircle2 size={17} className="mt-0.5 shrink-0" /> : <AlertTriangle size={17} className="mt-0.5 shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/** fetch + JSON + throws the API's error message. */
export async function api<T = unknown>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.json !== undefined ? { "Content-Type": "application/json", ...init?.headers } : init?.headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  if (!res.ok || data.success === false) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export { timeAgo } from "../../lib/format";
