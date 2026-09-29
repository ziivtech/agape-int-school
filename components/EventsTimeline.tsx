"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { useSection } from "./content/ContentProvider";
import { EventItem, formatEventDate } from "../lib/content/public-types";

export default function EventsTimeline({ events }: { events: EventItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.events");

  return (
    <section className="px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={c.eyebrow} heading={c.heading} />
          {events.length > 0 && (
            <Link
              href="/events"
              className="inline-flex shrink-0 items-center gap-2 font-sans text-sm font-medium text-[#6C0798] hover:text-[#4B075F]"
            >
              Full calendar
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <p className="mt-10 border-t border-[#19151C]/10 pt-6 font-sans text-sm text-[#19151C]/55">{c.emptyText}</p>
        ) : (
          <div className="mt-10 divide-y divide-[#19151C]/10 border-t border-[#19151C]/10">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-serif text-lg text-[#19151C]">{event.title}</span>
                <span className="font-sans text-sm text-[#19151C]/50">
                  {formatEventDate(event)}
                  {event.location && ` · ${event.location}`}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
