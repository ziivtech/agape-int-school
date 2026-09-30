"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Images, LayoutGrid, List, MapPin, Rss } from "lucide-react";
import AddToCalendar from "./AddToCalendar";
import { EventItem, formatEventDate } from "../../lib/content/public-types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function occursOn(e: EventItem, day: string) {
  if (!e.startsOn) return false;
  return day >= e.startsOn && day <= (e.endsOn || e.startsOn);
}

function EventRow({ e, albumSlug }: { e: EventItem; albumSlug?: string }) {
  return (
    <li className="grid gap-5 py-8 sm:grid-cols-[180px_1fr] sm:gap-10">
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#E12F41]">{e.category}</p>
        <p className="mt-2 font-serif text-xl text-[#19151C]">{formatEventDate(e)}</p>
      </div>
      <div>
        <h3 className="font-serif text-2xl text-[#19151C] sm:text-3xl">{e.title}</h3>
        {(e.timeLabel || e.location) && (
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-sans text-sm text-[#19151C]/55">
            {e.timeLabel && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} /> {e.timeLabel}
              </span>
            )}
            {e.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> {e.location}
              </span>
            )}
          </div>
        )}
        {e.description && <p className="mt-4 whitespace-pre-line font-sans leading-relaxed text-[#19151C]/70">{e.description}</p>}
        {e.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.imageUrl} alt={e.title} className="mt-6 aspect-[16/9] w-full rounded-xl object-cover" />
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <AddToCalendar event={e} compact />
          {albumSlug && (
            <Link
              href={`/gallery/${albumSlug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#6C0798]/10 px-3 py-1.5 font-sans text-xs font-medium text-[#6C0798] hover:bg-[#6C0798]/15"
            >
              <Images size={13} /> View photos
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

export default function EventsCalendar({
  events,
  albumByEvent,
  emptyText,
}: {
  events: EventItem[];
  albumByEvent: Record<string, string>;
  emptyText: string;
}) {
  const [view, setView] = useState<"list" | "month">("list");
  const [today, setToday] = useState(() => iso(new Date()));
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  // Dates depend on the visitor's clock, so settle them after hydration.
  useEffect(() => {
    setToday(iso(new Date()));
    setOrigin(window.location.host);
  }, []);

  const upcoming = events.filter((e) => !e.startsOn || (e.endsOn || e.startsOn) >= today);
  const past = events
    .filter((e) => e.startsOn && (e.endsOn || e.startsOn) < today)
    .reverse()
    .slice(0, 6);

  const days = useMemo(() => {
    const first = new Date(cursor);
    const offset = (first.getDay() + 6) % 7; // Monday-first grid
    const start = new Date(first);
    start.setDate(first.getDate() - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);
  const weeks = days[35].getMonth() !== cursor.getMonth() ? days.slice(0, 35) : days;

  const selectedEvents = selected ? events.filter((e) => occursOn(e, selected)) : [];
  const monthLabel = cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const feed = origin ? `webcal://${origin}/events/calendar.ics` : "";

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-full border border-[#19151C]/10 bg-white p-1">
          {(
            [
              ["list", "List", List],
              ["month", "Month", LayoutGrid],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-sm transition ${
                view === id ? "bg-[#19151C] text-white" : "text-[#19151C]/60 hover:text-[#19151C]"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
        {feed && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm">
            <span className="inline-flex items-center gap-1.5 text-[#19151C]/55">
              <Rss size={14} /> Subscribe:
            </span>
            <a href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(feed)}`} target="_blank" rel="noopener noreferrer" className="font-medium text-[#6C0798] hover:underline">
              Google Calendar
            </a>
            <a href={feed} className="font-medium text-[#6C0798] hover:underline">
              iPhone / Outlook
            </a>
          </div>
        )}
      </div>

      {view === "list" ? (
        upcoming.length === 0 ? (
          <p className="font-sans text-[#19151C]/60">{emptyText}</p>
        ) : (
          <ol className="divide-y divide-[#19151C]/10 border-y border-[#19151C]/10">
            {upcoming.map((e) => (
              <EventRow key={e.id} e={e} albumSlug={albumByEvent[e.id]} />
            ))}
          </ol>
        )
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-3xl">{monthLabel}</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const d = new Date();
                  setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
                  setSelected(null);
                }}
                className="rounded-full px-3 py-1.5 font-sans text-sm text-[#19151C]/60 hover:bg-[#19151C]/5"
              >
                Today
              </button>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                className="rounded-full p-2 hover:bg-[#19151C]/5"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                className="rounded-full p-2 hover:bg-[#19151C]/5"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#19151C]/10 bg-white">
            <div className="grid grid-cols-7 border-b border-[#19151C]/10 bg-[#FAF8F9]">
              {WEEKDAYS.map((d) => (
                <div key={d} className="px-2 py-2 text-center font-sans text-[11px] font-semibold uppercase tracking-wide text-[#19151C]/45">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {weeks.map((d) => {
                const key = iso(d);
                const inMonth = d.getMonth() === cursor.getMonth();
                const dayEvents = events.filter((e) => occursOn(e, key));
                const isToday = key === today;
                const isSelected = key === selected;
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(dayEvents.length ? (isSelected ? null : key) : null)}
                    className={`min-h-[64px] border-b border-r border-[#19151C]/10 p-1.5 text-left align-top transition-colors sm:min-h-[104px] sm:p-2 [&:nth-child(7n)]:border-r-0 ${
                      inMonth ? "bg-white" : "bg-[#FAF8F9] text-[#19151C]/35"
                    } ${isSelected ? "ring-2 ring-inset ring-[#6C0798]" : dayEvents.length ? "hover:bg-[#6C0798]/5" : "cursor-default"}`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-sans text-xs ${
                        isToday ? "bg-[#E12F41] font-semibold text-white" : ""
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {/* Titles on larger screens, dots on phones */}
                    <div className="mt-1 hidden space-y-1 sm:block">
                      {dayEvents.slice(0, 2).map((e) => (
                        <span key={e.id} className="block truncate rounded bg-[#6C0798]/10 px-1.5 py-0.5 font-sans text-[11px] font-medium text-[#6C0798]">
                          {e.title}
                        </span>
                      ))}
                      {dayEvents.length > 2 && <span className="block font-sans text-[11px] text-[#19151C]/50">+{dayEvents.length - 2} more</span>}
                    </div>
                    {dayEvents.length > 0 && (
                      <span className="mt-1 flex gap-0.5 sm:hidden">
                        {dayEvents.slice(0, 3).map((e) => (
                          <span key={e.id} className="h-1.5 w-1.5 rounded-full bg-[#6C0798]" />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selected && selectedEvents.length > 0 ? (
            <div className="mt-8">
              <h3 className="font-sans text-sm font-semibold text-[#19151C]/60">
                {new Date(`${selected}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </h3>
              <ol className="divide-y divide-[#19151C]/10 border-b border-[#19151C]/10">
                {selectedEvents.map((e) => (
                  <EventRow key={e.id} e={e} albumSlug={albumByEvent[e.id]} />
                ))}
              </ol>
            </div>
          ) : (
            <p className="mt-4 inline-flex items-center gap-2 font-sans text-sm text-[#19151C]/50">
              <CalendarDays size={15} /> Tap a highlighted day to see its events.
            </p>
          )}
        </div>
      )}

      {view === "list" && past.length > 0 && (
        <details className="mt-12">
          <summary className="cursor-pointer font-sans text-sm font-medium text-[#19151C]/60">Recent events</summary>
          <ol className="mt-2 divide-y divide-[#19151C]/10 opacity-80">
            {past.map((e) => (
              <EventRow key={e.id} e={e} albumSlug={albumByEvent[e.id]} />
            ))}
          </ol>
        </details>
      )}
    </>
  );
}
