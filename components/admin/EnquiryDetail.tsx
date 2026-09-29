"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { Button, Card, api, inputClass, labelClass, useToast } from "./ui";
import { timeAgo } from "../../lib/format";
import { ENQUIRY_STATUSES, STATUS_LABELS, TYPE_LABELS } from "../../lib/enquiry-labels";

type Status = (typeof ENQUIRY_STATUSES)[number];

type Enquiry = {
  id: string;
  type: keyof typeof TYPE_LABELS;
  status: Status;
  name: string;
  email: string;
  phone: string | null;
  studentName: string | null;
  gradeOfInterest: string | null;
  entryYear: string | null;
  subject: string | null;
  message: string;
  sourcePage: string | null;
  details: Record<string, string>;
  assignedTo: string | null;
  createdAt: string;
  updatedAt?: string;
};

type Note = { id: string; body: string; kind: string; authorName: string; createdAt: string };

export default function EnquiryDetail({
  enquiry,
  notes: initialNotes,
  staff,
  canDelete,
}: {
  enquiry: Enquiry;
  notes: Note[];
  staff: { id: string; name: string }[];
  canDelete: boolean;
}) {
  const [status, setStatus] = useState<Status>(enquiry.status);
  const [owner, setOwner] = useState(enquiry.assignedTo ?? "");
  const [notes, setNotes] = useState(initialNotes);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const whatsapp = enquiry.phone?.replace(/[^\d]/g, "");

  const update = async (patch: { status?: Status; assignedTo?: string | null }) => {
    setBusy(true);
    try {
      await api(`/api/admin/enquiries/${enquiry.id}`, { method: "PATCH", json: patch });
      if (patch.status) setStatus(patch.status);
      if (patch.assignedTo !== undefined) setOwner(patch.assignedTo ?? "");
      toast("success", "Updated.");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not update.");
    } finally {
      setBusy(false);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      const res = await api<{ note: Note & { createdAt: string } }>(`/api/admin/enquiries/${enquiry.id}`, {
        method: "POST",
        json: { body: note },
      });
      setNotes((n) => [...n, { ...res.note, kind: "note" }]);
      setNote("");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not add note.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Permanently delete the enquiry from ${enquiry.name}?`)) return;
    try {
      await api(`/api/admin/enquiries/${enquiry.id}`, { method: "DELETE" });
      router.push("/admin/enquiries");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not delete.");
    }
  };

  const facts: [string, string | null | undefined][] = [
    ["Type", enquiry.subject ?? TYPE_LABELS[enquiry.type]],
    ["Child", enquiry.studentName],
    ["Level", enquiry.gradeOfInterest],
    ["Starting", enquiry.entryYear],
    ...Object.entries(enquiry.details ?? {}),
    ["Sent from", enquiry.sourcePage],
    ["Received", new Date(enquiry.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })],
  ];

  return (
    <>
      <Link href="/admin/enquiries" className="font-sans text-sm text-[#19151C]/55 hover:text-[#6C0798]">
        ← Enquiries
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl">{enquiry.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#19151C]/15 bg-white px-3 py-2 font-sans text-sm hover:text-[#6C0798]">
              <Mail size={14} /> {enquiry.email}
            </a>
            {enquiry.phone && (
              <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#19151C]/15 bg-white px-3 py-2 font-sans text-sm hover:text-[#6C0798]">
                <Phone size={14} /> {enquiry.phone}
              </a>
            )}
            {whatsapp && whatsapp.length >= 9 && (
              <a
                href={`https://wa.me/${whatsapp.startsWith("0") ? `233${whatsapp.slice(1)}` : whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#19151C]/15 bg-white px-3 py-2 font-sans text-sm hover:text-emerald-700"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
          </div>
        </div>
        {canDelete && (
          <Button variant="ghost" className="text-red-700" onClick={remove}>
            <Trash2 size={14} /> Delete
          </Button>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wide text-[#19151C]/50">Message</h2>
            <p className="mt-3 whitespace-pre-line font-sans text-[15px] leading-7">{enquiry.message || <span className="text-[#19151C]/45">No message.</span>}</p>
          </Card>

          <Card>
            <h2 className="border-b border-[#19151C]/10 px-5 py-4 font-serif text-xl">Timeline</h2>
            <ul className="space-y-4 px-5 py-5">
              <li className="font-sans text-sm text-[#19151C]/55">
                Enquiry received · {timeAgo(enquiry.createdAt)}
              </li>
              {notes.map((n) =>
                n.kind === "status" ? (
                  <li key={n.id} className="font-sans text-sm text-[#19151C]/55">
                    <span className="font-medium text-[#19151C]/75">{n.authorName}</span> · {n.body} · {timeAgo(n.createdAt)}
                  </li>
                ) : (
                  <li key={n.id} className="rounded-lg bg-[#FAF8F9] p-4">
                    <p className="whitespace-pre-line font-sans text-sm leading-6">{n.body}</p>
                    <p className="mt-2 font-sans text-xs text-[#19151C]/50">
                      {n.authorName} · {timeAgo(n.createdAt)}
                    </p>
                  </li>
                )
              )}
            </ul>
            <div className="border-t border-[#19151C]/10 p-5">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                placeholder="Add a note — e.g. “Called mum, visit arranged for Tuesday 10am”"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <Button onClick={addNote} loading={busy && note.length > 0} disabled={!note.trim()}>
                  Add note
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="space-y-4 p-5">
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass} value={status} disabled={busy} onChange={(e) => update({ status: e.target.value as Status })}>
                {ENQUIRY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Owner</label>
              <select className={inputClass} value={owner} disabled={busy} onChange={(e) => update({ assignedTo: e.target.value || null })}>
                <option value="">Unassigned</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <Card className="p-5">
            <dl className="space-y-3">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-sans text-xs text-[#19151C]/50">{k}</dt>
                    <dd className="font-sans text-sm">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
