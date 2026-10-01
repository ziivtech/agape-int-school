"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  Download,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { ToastProvider } from "./ui";
import { AppBadge, InstallAppButton } from "./PwaSupport";
import type { Role } from "../../lib/auth/session";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, area: "dashboard" },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, area: "enquiries" },
  { href: "/admin/content", label: "Website content", icon: FileText, area: "content" },
  { href: "/admin/media", label: "Photos & media", icon: ImageIcon, area: "media" },
  { href: "/admin/news", label: "News", icon: Newspaper, area: "news" },
  { href: "/admin/events", label: "Events", icon: CalendarDays, area: "events" },
  { href: "/admin/alumni", label: "Alumni", icon: GraduationCap, area: "alumni" },
  { href: "/admin/downloads", label: "Downloads", icon: Download, area: "downloads" },
  { href: "/admin/users", label: "Staff accounts", icon: Users, area: "users" },
];

const ROLE_LABEL: Record<Role, string> = { admin: "Admin", editor: "Editor", admissions: "Admissions" };

export default function AdminShell({
  user,
  areas,
  newEnquiries,
  children,
}: {
  user: { name: string; email: string; role: Role };
  areas: string[];
  newEnquiries: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {NAV.filter((n) => areas.includes(n.area)).map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition ${
            isActive(href) ? "bg-[#6C0798] text-white" : "text-[#19151C]/70 hover:bg-[#19151C]/5 hover:text-[#19151C]"
          }`}
        >
          <Icon size={17} />
          <span className="flex-1">{label}</span>
          {href === "/admin/enquiries" && newEnquiries > 0 && (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isActive(href) ? "bg-white/20 text-white" : "bg-[#E12F41] text-white"
              }`}
            >
              {newEnquiries}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-[#19151C]/10 pt-4">
      <InstallAppButton />
      <Link href="/admin/account" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#19151C]/5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6C0798]/10 font-sans text-xs font-semibold text-[#6C0798]">
          {user.name
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-sans text-sm font-medium text-[#19151C]">{user.name}</span>
          <span className="block font-sans text-xs text-[#19151C]/50">{ROLE_LABEL[user.role]}</span>
        </span>
        <UserCog size={15} className="text-[#19151C]/40" />
      </Link>
      <div className="mt-2 flex gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-sans text-xs text-[#19151C]/60 hover:bg-[#19151C]/5 hover:text-[#19151C]"
        >
          View site <ExternalLink size={12} />
        </Link>
        <button
          onClick={logout}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-sans text-xs text-[#19151C]/60 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={12} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <AppBadge count={newEnquiries} />
      <div className="min-h-screen bg-[#F6F4F7] text-[#19151C]">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[#19151C]/10 bg-white px-4 py-5 lg:flex">
          <Link href="/admin" className="mb-6 flex items-center gap-2.5 px-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/school_logo.png" alt="" className="h-9 w-9 object-contain" />
            <span>
              <span className="block font-serif text-base leading-tight">Agape Academy</span>
              <span className="block font-sans text-[11px] text-[#19151C]/50">Staff admin</span>
            </span>
          </Link>
          <div className="flex-1 overflow-y-auto">{nav}</div>
          {footer}
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#19151C]/10 bg-white px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/school_logo.png" alt="" className="h-8 w-8 object-contain" />
            <span className="font-serif text-base">Staff admin</span>
          </Link>
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2 hover:bg-[#19151C]/5">
            <Menu size={20} />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-[#19151C]/40" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white px-4 py-5">
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="mb-4 self-end rounded-lg p-2 hover:bg-[#19151C]/5">
                <X size={20} />
              </button>
              <div className="flex-1 overflow-y-auto">{nav}</div>
              {footer}
            </aside>
          </div>
        )}

        <main className="px-4 py-8 sm:px-8 lg:ml-64 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
