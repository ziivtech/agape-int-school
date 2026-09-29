import type { Metadata } from "next";
import { CalendarDays, Clock3, Download, MapPin } from "lucide-react";
import GeoMark from "@/components/GeoMark";
import { getSection, getUpcomingEvents } from "@/lib/content/server";
import { formatEventDate, toEventItem } from "@/lib/content/public-types";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at Agape Academy International — sports days, fairs, trips, parent meetings and celebrations.",
};

export default async function EventsPage() {
  const [c, rows] = await Promise.all([getSection("events.page"), getUpcomingEvents()]);
  const events = rows.map(toEventItem);

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

      <section className="mx-auto max-w-4xl px-6 py-16 sm:px-10 sm:py-20">
        {events.length === 0 ? (
          <p className="font-sans text-[#19151C]/60">{c.emptyText}</p>
        ) : (
          <ol className="divide-y divide-[#19151C]/10 border-y border-[#19151C]/10">
            {events.map((e) => (
              <li key={e.id} className="grid gap-5 py-8 sm:grid-cols-[180px_1fr] sm:gap-10">
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#E12F41]">{e.category}</p>
                  <p className="mt-2 font-serif text-xl text-[#19151C]">{formatEventDate(e)}</p>
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#19151C] sm:text-3xl">{e.title}</h2>
                  {(e.timeLabel || e.location) && (
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-sans text-sm text-[#19151C]/55">
                      {e.timeLabel && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={14} />
                          {e.timeLabel}
                        </span>
                      )}
                      {e.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} />
                          {e.location}
                        </span>
                      )}
                    </div>
                  )}
                  {e.description && (
                    <p className="mt-4 whitespace-pre-line font-sans leading-relaxed text-[#19151C]/70">{e.description}</p>
                  )}
                  {e.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.imageUrl} alt={e.title} className="mt-6 aspect-[16/9] w-full rounded-xl object-cover" />
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-10 inline-flex items-center gap-2 font-sans text-sm text-[#19151C]/50">
          <CalendarDays size={15} />
          Dates may change — the school will confirm details with families.
        </p>
      </section>
    </main>
  );
}
