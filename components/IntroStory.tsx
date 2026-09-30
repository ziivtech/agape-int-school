"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Image from "next/image";

import { useSection } from "./content/ContentProvider";

export default function IntroStory() {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.intro");

  return (
    <section id="our-story" className="px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#19151C]/5 shadow-sm lg:order-2"
        >
          {/* Editorial photograph: a teacher and students in conversation */}
          <Image
            src={c.photo.url || "/cover.jpg"}
            alt={c.photo.alt}
            width={800}
            height={1000}
            priority
            quality={90}
            unoptimized={c.photo.url.startsWith("http")}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </motion.div>

        <div className="lg:order-1">
          <SectionHeading
            eyebrow={c.eyebrow}
            heading={c.heading}
            description={c.description}
          />

          <div className="mt-10 space-y-6">
            {c.pillars.map((pillar) => (
              <div key={pillar.title} className="border-l-2 border-[#6C0798]/25 pl-5">
                <h3 className="font-serif text-lg text-[#19151C]">{pillar.title}</h3>
                <p className="mt-1 font-sans text-sm leading-relaxed text-[#19151C]/65">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-10 inline-flex items-center gap-2 font-sans text-sm font-medium text-[#6C0798] hover:text-[#4B075F]"
          >
            {c.linkLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
