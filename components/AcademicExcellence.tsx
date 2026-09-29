"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useSection } from "./content/ContentProvider";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion || to === 0) {
      setValue(to);
      return;
    }
    const duration = 900;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

// Animates the leading number of a figure like "25+" or "98%"; anything
// else (e.g. "1:12") is shown exactly as typed.
function Figure({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return <>{value}</>;
  return <Counter to={Number(match[1])} suffix={match[2]} />;
}

export default function AcademicExcellence() {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.academics");

  return (
    <section className="px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <SectionHeading eyebrow={c.eyebrow} heading={c.heading} description={c.description} />

          <div className="flex flex-wrap content-start gap-2.5">
            {c.subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full border border-[#19151C]/12 px-4 py-2 font-sans text-sm text-[#19151C]/75"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {c.stats.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-[#19151C]/10 pt-12 sm:grid-cols-4">
            {c.stats.map((stat, i) => (
              <motion.div
                key={stat.label + i}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <p className="font-serif text-4xl text-[#6C0798] sm:text-5xl">
                  <Figure value={stat.value} />
                </p>
                <p className="mt-2 font-sans text-sm text-[#19151C]/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
