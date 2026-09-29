"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useSection } from "./content/ContentProvider";

export default function Wellbeing() {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.wellbeing");

  return (
    <section className="px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#19151C]/5 shadow-sm"
          >
            <img
              src={c.photo.url || "/together.jpg"}
              alt={c.photo.alt}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
          <div>
            <SectionHeading
              eyebrow={c.eyebrow}
              heading={c.heading}
              description={c.description}
            />
            <div className="mt-8 flex flex-wrap gap-2.5">
              {c.areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-[#19151C]/12 px-4 py-2 font-sans text-sm text-[#19151C]/75"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
