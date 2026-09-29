"use client";

import { useState } from "react";
import { KeyRound, UserPlus } from "lucide-react";
import { Badge, Button, Card, PageHeader, api, inputClass, labelClass, useToast } from "./ui";
import { timeAgo } from "../../lib/format";

type Role = "admin" | "editor" | "admissions";
type User = { id: string; name: string; email: string; role: Role; active: boolean; lastLoginAt: string | null };

const ROLES: { value: Role; label: string; help: string }[] = [
  { value: "admin", label: "Admin", help: "Everything, including staff accounts." },
  { value: "editor", label: "Editor", help: "Website content, photos, news and events." },
  { value: "admissions", label: "Admissions", help: "Enquiries only." },
];

function randomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export default function UsersManager({ initial, currentUserId }: { initial: User[]; currentUserId: string }) {
  const [users, setUsers] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "editor" as Role, password: "" });
  const [issued, setIssued] = useState<{ email: string; password: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const create = async () => {
    setBusy(true);
    const password = form.password || randomPassword();
    try {
      const { user } = await api<{ user: User }>("/api/admin/users", { method: "POST", json: { ...form, password } });
      setUsers((u) => [...u, { ...user, lastLoginAt: null }].sort((a, b) => a.name.localeCompare(b.name)));
      setIssued({ email: user.email, password });
      setForm({ name: "", email: "", role: "editor", password: "" });
      setAdding(false);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not add the account.");
    } finally {
      setBusy(false);
    }
  };

  const patch = async (u: User, changes: Partial<User> & { password?: string }) => {
    try {
      const { user } = await api<{ user: User }>("/api/admin/users", { method: "PATCH", json: { id: u.id, ...changes } });
      setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, ...user } : x)));
      if (!changes.password) toast("success", `${u.name} updated.`);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not update.");
    }
  };

  const resetPassword = async (u: User) => {
    if (!confirm(`Reset ${u.name}'s password? You'll be shown a new temporary password to give them.`)) return;
    const password = randomPassword();
    await patch(u, { password });
    setIssued({ email: u.email, password });
  };

  return (
    <>
      <PageHeader
        title="Staff accounts"
        description="Give each person their own login so you can see who changed what. Choose the smallest role they need."
        actions={
          <Button onClick={() => setAdding(true)}>
            <UserPlus size={15} /> Add staff member
          </Button>
        }
      />

      {issued && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50 p-5">
          <p className="font-sans text-sm font-semibold text-emerald-900">Share these sign-in details privately</p>
          <p className="mt-2 font-mono text-sm text-emerald-900">
            {issued.email}
            <br />
            {issued.password}
          </p>
          <p className="mt-2 font-sans text-xs text-emerald-800">
            They sign in at /admin/login and can change the password under their name. This password won&apos;t be shown again.
          </p>
          <button onClick={() => setIssued(null)} className="mt-3 font-sans text-xs font-medium text-emerald-900 underline">
            Done
          </button>
        </Card>
      )}

      {adding && (
        <Card className="mb-6 p-5 sm:p-6">
          <h2 className="font-serif text-2xl">New staff member</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Full name</label>
              <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label} — {r.help}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Password (leave blank to generate one)</label>
              <input className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 10 characters" />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button onClick={create} loading={busy} disabled={!form.name || !form.email}>
              Create account
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <ul className="divide-y divide-[#19151C]/10">
          {users.map((u) => (
            <li key={u.id} className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center ${u.active ? "" : "opacity-55"}`}>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-medium">
                  {u.name} {u.id === currentUserId && <span className="font-normal text-[#19151C]/45">(you)</span>}
                </p>
                <p className="font-sans text-xs text-[#19151C]/50">
                  {u.email} · {u.lastLoginAt ? `last signed in ${timeAgo(u.lastLoginAt)}` : "never signed in"}
                </p>
              </div>
              {!u.active && <Badge tone="red">Deactivated</Badge>}
              <select
                className="rounded-lg border border-[#19151C]/15 bg-white px-3 py-2 font-sans text-sm"
                value={u.role}
                disabled={u.id === currentUserId}
                onChange={(e) => patch(u, { role: e.target.value as Role })}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-1">
                <Button variant="ghost" className="!px-3 text-xs" onClick={() => resetPassword(u)}>
                  <KeyRound size={13} /> Reset password
                </Button>
                {u.id !== currentUserId && (
                  <Button variant="ghost" className="!px-3 text-xs" onClick={() => patch(u, { active: !u.active })}>
                    {u.active ? "Deactivate" : "Reactivate"}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
