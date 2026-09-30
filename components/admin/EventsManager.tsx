"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, MapPin, Pencil, Trash2 } from "lucide-react";
import ImageField from "./ImageField";
import { Badge, Button, Card, PageHeader, api, inputClass, labelClass, useToast } from "./ui";
import { formatEventDate } from "../../lib/content/public-types";

type Ev = {
  id?: string;
  title: string;
  category: string;
  startsOn: string;
  endsOn: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  description: string;
  imageUrl: string;
  status: "draft" | "published";
};

export default function EventsManager({ initial, categories }: { initial: Ev[]; categories: string[] }) {
  const [events, setEvents] = useState(initial);
  const [editing, setEditing] = useState<Ev | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const today = new Date().toISOString().slice(0, 10);
  const { upcoming, past } = useMemo(() => {
    const isPast = (e: Ev) => Boolean(e.startsOn) && (e.endsOn || e.startsOn) < today;
    return { upcoming: events.filter((e) => !isPast(e)), past: events.filter(isPast).reverse() };
  }, [events, today]);

  const blank = (): Ev => ({
    title: "",
    category: categories[0],
    startsOn: "",
    endsOn: "",
    dateLabel: "",
    timeLabel: "",
    location: "",
    description: "",
    imageUrl: "",
    status: "published",
  });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const { event } = await api<{ event: Ev & { id: string; startsOn: string | null; endsOn: string | null } }>("/api/admin/events", {
        method: editing.id ? "PUT" : "POST",
        json: editing,
      });
      const clean: Ev = {
        ...editing,
        id: event.id,
        startsOn: event.startsOn ?? "",
        endsOn: event.endsOn ?? "",
      };
      setEvents((list) => {
        const next = editing.id ? list.map((e) => (e.id === event.id ? clean : e)) : [...list, clean];
        return next.sort((a, b) => (a.startsOn || "0").localeCompare(b.startsOn || "0"));
      });
      setEditing(null);
      toast("success", "Event saved. The website is updated.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (e: Ev) => {
    if (!e.id || !confirm(`Delete “${e.title}”?`)) return;
    try {
      await api(`/api/admin/events?id=${e.id}`, { method: "DELETE" });
      setEvents((list) => list.filter((x) => x.id !== e.id));
      toast("success", "Event deleted.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not delete.");
    }
  };

  const Row = ({ e }: { e: Ev }) => (
    <li className="flex items-center gap-4 px-5 py-4">
      <div className="w-36 shrink-0 font-sans text-sm text-[#19151C]/70">{formatEventDate(e)}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-medium">{e.title}</p>
        <p className="flex items-center gap-2 font-sans text-xs text-[#19151C]/50">
          {e.category}
          {e.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} /> {e.location}
            </span>
          )}
        </p>
      </div>
      {e.status === "draft" && <Badge>Hidden</Badge>}
      <button onClick={() => setEditing(e)} className="rounded p-2 text-[#19151C]/55 hover:bg-[#19151C]/5 hover:text-[#6C0798]" aria-label="Edit">
        <Pencil size={15} />
      </button>
      <button onClick={() => remove(e)} className="rounded p-2 text-red-600/70 hover:bg-red-50 hover:text-red-700" aria-label="Delete">
        <Trash2 size={15} />
      </button>
    </li>
  );

  return (
    <>
      <PageHeader
        title="Events"
        description="The school calendar shown on the Events page and the homepage. Past events drop off the website automatically."
        actions={
          <Button onClick={() => setEditing(blank())}>
            <CalendarPlus size={15} /> Add event
          </Button>
        }
      />

      <Card>
        <h2 className="border-b border-[#19151C]/10 px-5 py-3 font-sans text-sm font-semibold text-[#19151C]/70">Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <p className="px-5 py-8 font-sans text-sm text-[#19151C]/55">Nothing scheduled. Add sports day, open days, parent meetings, trips…</p>
        ) : (
          <ul className="divide-y divide-[#19151C]/10">{upcoming.map((e) => <Row key={e.id} e={e} />)}</ul>
        )}
      </Card>

      {past.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer font-sans text-sm text-[#19151C]/60">Past events ({past.length})</summary>
          <Card className="mt-3">
            <ul className="divide-y divide-[#19151C]/10 opacity-70">{past.map((e) => <Row key={e.id} e={e} />)}</ul>
          </Card>
        </details>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#19151C]/50 p-4 sm:items-center" onClick={() => setEditing(null)}>
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl">{editing.id ? "Edit event" : "New event"}</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} autoFocus />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Starts</label>
                  <input type="date" className={inputClass} value={editing.startsOn} onChange={(e) => setEditing({ ...editing, startsOn: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Ends (optional)</label>
                  <input type="date" className={inputClass} value={editing.endsOn} onChange={(e) => setEditing({ ...editing, endsOn: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select className={inputClass} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              {!editing.startsOn && (
                <div>
                  <label className={labelClass}>Date text (when there&apos;s no exact date yet)</label>
                  <input
                    className={inputClass}
                    value={editing.dateLabel}
                    placeholder="e.g. Term 2 · To be confirmed"
                    onChange={(e) => setEditing({ ...editing, dateLabel: e.target.value })}
                  />
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Time</label>
                  <input className={inputClass} value={editing.timeLabel} placeholder="e.g. 9:00am – 2:00pm" onChange={(e) => setEditing({ ...editing, timeLabel: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input className={inputClass} value={editing.location} placeholder="e.g. School field" onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Details</label>
                <textarea className={`${inputClass} min-h-[100px]`} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Photo (optional)</label>
                <ImageField
                  value={{ url: editing.imageUrl, alt: editing.title }}
                  onChange={(v) => setEditing({ ...editing, imageUrl: v.url })}
                  label="Event photo"
                  aspect="16:9"
                  uploadFolder="events"
                  allowVideo={false}
                />
              </div>
              <label className="flex items-center gap-2.5 font-sans text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#6C0798]"
                  checked={editing.status === "published"}
                  onChange={(e) => setEditing({ ...editing, status: e.target.checked ? "published" : "draft" })}
                />
                Show on the website
              </label>
            </div>
            <div className="mt-8 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={save} loading={saving} disabled={!editing.title.trim()}>
                Save event
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
