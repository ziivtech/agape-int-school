import { NextRequest } from "next/server";
import { getCalendarEvents, getSection } from "@/lib/content/server";
import { toEventItem } from "@/lib/content/public-types";
import { buildIcs } from "@/lib/calendar";

// Always built fresh (events change); the CDN caches it for an hour.
export const dynamic = "force-dynamic";

// The whole school calendar as a subscribable feed (webcal:// or "add by URL").
export async function GET(req: NextRequest) {
  const [rows, identity] = await Promise.all([getCalendarEvents(), getSection("site.identity")]);
  const ics = buildIcs(rows.map(toEventItem), {
    calendarName: `${identity.schoolName} calendar`,
    schoolName: identity.schoolName,
    host: req.nextUrl.host,
  });
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="agape-school-calendar.ics"',
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
