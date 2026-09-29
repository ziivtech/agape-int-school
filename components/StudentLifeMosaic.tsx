"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useSection } from "./content/ContentProvider";

const TINTS = ["#8B176F", "#E12F41", "#4B075F", "#19151C", "#6C0798"];

export default function StudentLifeMosaic() {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.studentLife");

  return (
    <section className="px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={c.eyebrow} heading={c.heading} />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="group relative col-span-2 row-span-2 flex min-h-[280px] items-end overflow-hidden rounded-xl p-5 sm:min-h-[340px]"
          >
            {c.featurePhoto.url && (
              <img
                src={c.featurePhoto.url}
                alt={c.featurePhoto.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/85 via-[#19151C]/25 to-transparent" />
            <div className="relative z-10">
              <h3 className="font-serif text-2xl text-white sm:text-3xl">{c.featureTitle}</h3>
              {c.featureText && (
                <p className="mt-1 hidden font-sans text-xs text-white/75 sm:block">{c.featureText}</p>
              )}
            </div>
          </motion.div>

          {c.activities.map((name, i) => (
            <motion.div
              key={name + i}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: ((i + 1) % 5) * 0.05 }}
              className="group relative flex aspect-square items-end overflow-hidden rounded-xl p-5"
              style={{ background: `linear-gradient(150deg, ${TINTS[i % TINTS.length]}22 0%, #19151C10 100%)` }}
            >
              <span className="font-sans text-sm font-medium text-[#19151C]/70 transition-colors group-hover:text-[#19151C]">
                {name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
