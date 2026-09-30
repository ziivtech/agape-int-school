"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { useSection } from "../content/ContentProvider";
import { googleCalendarUrl, outlookCalendarUrl } from "../../lib/calendar";
import type { EventItem } from "../../lib/content/public-types";

export default function AddToCalendar({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  const { schoolName } = useSection("site.identity");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!event.startsOn) return null;
  const google = googleCalendarUrl(event, schoolName);
  const outlook = outlookCalendarUrl(event, schoolName);

  const item = "block px-4 py-2.5 font-sans text-sm text-[#19151C]/80 hover:bg-[#FAF8F9] hover:text-[#6C0798]";

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border border-[#19151C]/15 bg-white font-sans font-medium text-[#19151C]/75 transition-colors hover:border-[#6C0798]/40 hover:text-[#6C0798] ${
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
        }`}
      >
        <CalendarPlus size={compact ? 13 : 15} />
        Add to calendar
        <ChevronDown size={compact ? 12 : 14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-[#19151C]/10 bg-white py-1 shadow-xl">
          {google && (
            <a href={google} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
              Google Calendar
            </a>
          )}
          <a href={`/events/ics/${event.id}`} className={item} onClick={() => setOpen(false)}>
            Apple Calendar / Outlook (.ics)
          </a>
          {outlook && (
            <a href={outlook} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
              Outlook.com
            </a>
          )}
        </div>
      )}
    </div>
  );
}
