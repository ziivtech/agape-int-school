/* "Add to calendar" helpers. School events are all-day (times are free text),
   so everything here uses whole dates. Safe to import in browser code. */

import type { EventItem } from "./content/public-types";

type CalEvent = Pick<EventItem, "id" | "title" | "startsOn" | "endsOn" | "timeLabel" | "location" | "description">;

const compact = (iso: string) => iso.replace(/-/g, "");

/** The day after the last day, because calendar apps treat all-day end dates as exclusive. */
export function exclusiveEnd(e: Pick<EventItem, "startsOn" | "endsOn">): string {
  const last = new Date(`${e.endsOn || e.startsOn}T12:00:00Z`);
  last.setUTCDate(last.getUTCDate() + 1);
  return last.toISOString().slice(0, 10);
}

function details(e: CalEvent, schoolName: string) {
  return [e.timeLabel && `Time: ${e.timeLabel}`, e.description, schoolName].filter(Boolean).join("\n\n");
}

export function googleCalendarUrl(e: CalEvent, schoolName: string): string | null {
  if (!e.startsOn) return null;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${compact(e.startsOn)}/${compact(exclusiveEnd(e))}`,
    details: details(e, schoolName),
    location: e.location || schoolName,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(e: CalEvent, schoolName: string): string | null {
  if (!e.startsOn) return null;
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: e.title,
    startdt: e.startsOn,
    enddt: exclusiveEnd(e),
    allday: "true",
    body: details(e, schoolName),
    location: e.location || schoolName,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

/* ---------------- iCalendar (.ics) ---------------- */

function escapeIcs(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/** RFC 5545 says lines over 75 octets must be folded. */
function fold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
}

export function buildIcs(events: CalEvent[], opts: { calendarName: string; schoolName: string; host: string }): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Agape Academy International//School Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(opts.calendarName)}`,
    "X-WR-TIMEZONE:Africa/Accra",
    // Ask subscribed calendars to check for changes twice a day.
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
  ];
  for (const e of events) {
    if (!e.startsOn) continue;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@${opts.host}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(e.startsOn)}`,
      `DTEND;VALUE=DATE:${compact(exclusiveEnd(e))}`,
      `SUMMARY:${escapeIcs(e.title)}`,
      `DESCRIPTION:${escapeIcs(details(e, opts.schoolName))}`,
      `LOCATION:${escapeIcs(e.location || opts.schoolName)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
