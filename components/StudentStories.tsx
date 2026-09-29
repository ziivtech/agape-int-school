"use client";

import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";

import { useSection } from "./content/ContentProvider";

export default function StudentStories() {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.studentStories");
  if (c.students.length === 0) return null;

  return (
    <section className="bg-white px-6 py-16 sm:py-24 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <SectionHeading
          eyebrow={c.eyebrow}
          heading={c.heading}
        />

        {/* Introductory image */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative mt-8 overflow-hidden rounded-2xl sm:mt-10"
        >
          <img
            src={c.bannerPhoto.url}
            alt={c.bannerPhoto.alt}
            className="h-[260px] w-full object-cover sm:h-[380px] lg:h-[500px]"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/65 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 max-w-md sm:bottom-8 sm:left-8">
            <p className="font-serif text-2xl leading-tight text-white sm:text-3xl">
              {c.bannerText}
            </p>
          </div>
        </motion.div>

        {/* Student stories */}
        <div className="mt-14 grid gap-12 sm:mt-16 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {c.students.map((student, i) => (
            <motion.article
              key={student.name + i}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: 24 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
              }}
            >
              {/* Student image */}
              <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F3EFF4]">
                {student.photo.url && (
                  <img
                    src={student.photo.url}
                    alt={student.photo.alt || `${student.name}, ${student.grade}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                )}

                {/* Subtle brand gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/35 via-transparent to-transparent opacity-70" />
              </div>

              {/* Student information */}
              <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#E12F41]">
                {student.grade}
              </p>

              <h3 className="mt-1 font-serif text-2xl text-[#19151C]">
                {student.name}
              </h3>

              <p className="mt-3 font-serif text-lg leading-snug text-[#19151C]/85">
                “{student.quote}”
              </p>

              <dl className="mt-5 space-y-1.5 font-sans text-sm leading-relaxed text-[#19151C]/55">
                <div>
                  <dt className="inline font-medium text-[#19151C]/70">
                    Interests:{" "}
                  </dt>
                  <dd className="inline">{student.interests}</dd>
                </div>

                <div>
                  <dt className="inline font-medium text-[#19151C]/70">
                    Ambition:{" "}
                  </dt>
                  <dd className="inline">{student.ambition}</dd>
                </div>
              </dl>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}