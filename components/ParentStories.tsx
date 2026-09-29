"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useSection } from "./content/ContentProvider";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function ParentStories() {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.parentStories");
  if (c.parents.length === 0) return null;

  return (
    <section className="px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow={c.eyebrow} heading={c.heading} align="center" />

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {c.parents.map((parent, i) => (
            <motion.figure
              key={i}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4 rounded-2xl border border-[#19151C]/10 bg-white p-6 shadow-sm"
            >
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#6C0798]/10 font-sans text-sm font-semibold text-[#6C0798] shadow-md">
                {parent.photo.url ? (
                  <img src={parent.photo.url} alt={parent.photo.alt || parent.name} className="h-full w-full object-cover" />
                ) : (
                  initials(parent.name)
                )}
              </div>
              <div>
                <blockquote className="font-serif text-lg leading-snug text-[#19151C]/85">“{parent.quote}”</blockquote>
                <figcaption className="mt-3 font-sans text-sm text-[#19151C]/55">
                  <span className="font-medium text-[#19151C]/75">{parent.name}</span>
                  {parent.relation && <> · {parent.relation}</>}
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
