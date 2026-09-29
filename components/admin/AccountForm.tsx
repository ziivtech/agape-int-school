"use client";

import { useState } from "react";
import { Button, Card, api, inputClass, labelClass, useToast } from "./ui";

export default function AccountForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      toast("error", "The new passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await api("/api/admin/account", { method: "PATCH", json: { currentPassword: current, newPassword: next } });
      setCurrent("");
      setNext("");
      setConfirm("");
      toast("success", "Password changed.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not change the password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="max-w-md p-6">
      <h2 className="font-serif text-2xl">Change password</h2>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className={labelClass}>Current password</label>
          <input type="password" autoComplete="current-password" className={inputClass} value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>New password</label>
          <input type="password" autoComplete="new-password" minLength={10} className={inputClass} value={next} onChange={(e) => setNext(e.target.value)} required />
          <p className="mt-1 font-sans text-xs text-[#19151C]/45">At least 10 characters. A short phrase is easier to remember.</p>
        </div>
        <div>
          <label className={labelClass}>Repeat new password</label>
          <input type="password" autoComplete="new-password" className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        <Button type="submit" loading={busy}>
          Change password
        </Button>
      </form>
    </Card>
  );
}
