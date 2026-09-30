import { NextRequest, NextResponse } from "next/server";
import { getCalendarEvents, getSection } from "@/lib/content/server";
import { toEventItem } from "@/lib/content/public-types";
import { buildIcs } from "@/lib/calendar";
import { slugify } from "@/lib/slug";

// A single event as a downloadable .ics file (Apple Calendar, Outlook…).
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const [rows, identity] = await Promise.all([getCalendarEvents(), getSection("site.identity")]);
  const event = rows.map(toEventItem).find((e) => e.id === params.id && e.startsOn);
  if (!event) return NextResponse.redirect(new URL("/events", req.url));

  const ics = buildIcs([event], { calendarName: identity.schoolName, schoolName: identity.schoolName, host: req.nextUrl.host });
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slugify(event.title) || "event"}.ics"`,
    },
  });
}
