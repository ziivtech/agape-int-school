import type { Metadata } from "next";
import { Download } from "lucide-react";
import EventsCalendar from "@/components/events/EventsCalendar";
import GeoMark from "@/components/GeoMark";
import { getCalendarEvents, getPublishedAlbums, getSection } from "@/lib/content/server";
import { toEventItem } from "@/lib/content/public-types";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at Agape Academy International: sports days, fairs, trips, parent meetings and celebrations.",
};

export default async function EventsPage() {
  const [c, rows, albums] = await Promise.all([getSection("events.page"), getCalendarEvents(), getPublishedAlbums()]);
  const events = rows.map(toEventItem);
  const albumByEvent = Object.fromEntries(albums.filter((a) => a.eventId).map((a) => [a.eventId!, a.slug]));

  return (
    <main className="bg-[#FAF8F9]">
      <section className="relative overflow-hidden bg-[#4B075F] px-6 pb-16 pt-40 text-white sm:px-10 sm:pt-48 lg:px-16">
        <GeoMark className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px]" opacity={0.08} />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-sans text-sm font-medium text-[#E9C7DE]">{c.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] sm:text-6xl">{c.heading}</h1>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/80">{c.description}</p>
          {c.calendarUrl && (
            <a
              href={c.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-sans text-sm font-semibold text-[#4B075F] hover:bg-white/90"
            >
              <Download size={16} />
              Download the term calendar
            </a>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 sm:px-10 sm:py-20">
        <EventsCalendar events={events} albumByEvent={albumByEvent} emptyText={c.emptyText} />

        <p className="mt-12 font-sans text-sm text-[#19151C]/50">Dates may change. The school will confirm details with families.</p>
      </section>
    </main>
  );
}
