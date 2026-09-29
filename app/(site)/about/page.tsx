"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Heart,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import AgapeCTA from "@/components/AgapeCTA";
import { useSection } from "@/components/content/ContentProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const VALUE_ICONS = [Heart, BookOpen, ShieldCheck, Users, Lightbulb, Target];

export default function AboutPage() {
  const hero = useSection("about.hero");
  const story = useSection("about.story");
  const vision = useSection("about.vision");
  const leadership = useSection("about.leadership");
  const values = useSection("about.values");
  const why = useSection("about.why");
  const cta = useSection("about.cta");

  return (
    <main className="overflow-hidden bg-[#FAF8F9] text-[#19151C]">
      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-end overflow-hidden bg-[#6C0798] px-6 pb-20 pt-40 text-white lg:px-10 lg:pb-28">
        <motion.div
  className="absolute inset-0 overflow-hidden"
  initial={{ scale: 1.08 }}
  animate={{ scale: 1 }}
  transition={{
    duration: 1.6,
    ease: [0.22, 1, 0.36, 1],
  }}
>
  {hero.background.url && (
    <Image
      src={hero.background.url}
      alt={hero.background.alt}
      fill
      priority
      quality={90}
      unoptimized={hero.background.url.startsWith("http")}
      className="h-full w-full object-cover"
    />
  )}
</motion.div>

{/* Cinematic overlays */}
<div className="absolute inset-0 bg-[#19151C]/55" />

<div className="absolute inset-0 bg-gradient-to-r from-[#19151C]/85 via-[#19151C]/40 to-transparent" />

<div className="absolute inset-0 bg-gradient-to-t from-[#19151C] via-[#19151C]/20 to-transparent" />

{/* Brand glow */}
<motion.div
  animate={{
    x: [0, 60, 0],
    y: [0, -30, 0],
    opacity: [0.08, 0.16, 0.08],
  }}
  transition={{
    duration: 12,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#6C0798] blur-[100px]"
/>

        <div className="relative mx-auto w-full max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-5xl"
          >
            <motion.div variants={fadeUp} className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-white/60" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                {hero.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-5xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl"
            >
              {hero.heading}
              <span className="block text-white/60">{hero.headingAccent}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-2xl font-sans text-lg leading-8 text-white/75 sm:text-xl"
            >
              {hero.intro}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#our-story"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 font-sans text-sm font-semibold text-[#6C0798] transition-transform hover:-translate-y-0.5"
              >
                {hero.primaryLabel}
                <ArrowDown
                  size={16}
                  className="transition-transform group-hover:translate-y-1"
                />
              </Link>

              <Link
                href={hero.secondaryUrl}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {hero.secondaryLabel}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* INTRO / STORY */}
      <section
        id="our-story"
        className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6C0798]">
                {story.eyebrow}
              </span>

              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {story.heading}
                <span className="block text-[#6C0798]">{story.headingAccent}</span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              className="space-y-7 font-sans text-base leading-8 text-[#19151C]/70 sm:text-lg"
            >
              {story.paragraphs.map((para, i) => (
                <motion.p key={i} variants={fadeUp}>
                  {para}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* VISION / MISSION */}
      <section
        id="vision"
        className="scroll-mt-24 bg-white px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="mb-16 max-w-3xl"
          >
            <motion.span
              variants={fadeUp}
              className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6C0798]"
            >
              {vision.eyebrow}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="mt-5 font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              {vision.heading}
              <span className="text-[#6C0798]"> {vision.headingAccent}</span>
            </motion.h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="group rounded-[2rem] bg-[#6C0798] p-8 text-white sm:p-10 lg:p-12"
            >
              <div className="mb-16 flex items-center justify-between">
                <span className="rounded-full border border-white/20 px-4 py-2 font-sans text-xs uppercase tracking-[0.15em] text-white/70">
                  Our Vision
                </span>

                <Sparkles size={24} className="text-white/60" />
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl">
                {vision.visionTitle}
              </h3>

              <p className="mt-6 max-w-xl font-sans leading-7 text-white/70">
                {vision.visionBody}
              </p>
            </motion.article>

            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="group rounded-[2rem] border border-[#19151C]/10 bg-[#FAF8F9] p-8 sm:p-10 lg:p-12"
            >
              <div className="mb-16 flex items-center justify-between">
                <span className="rounded-full border border-[#6C0798]/20 px-4 py-2 font-sans text-xs uppercase tracking-[0.15em] text-[#6C0798]">
                  Our Mission
                </span>

                <Target size={24} className="text-[#6C0798]/60" />
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl">
                {vision.missionTitle}
              </h3>

              <p className="mt-6 max-w-xl font-sans leading-7 text-[#19151C]/65">
                {vision.missionBody}
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section
        id="leadership"
        className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6C0798]">
                {leadership.eyebrow}
              </span>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                {leadership.heading}
                <span className="block text-[#6C0798]">{leadership.headingAccent}</span>
              </h2>

              <p className="mt-6 max-w-md font-sans leading-7 text-[#19151C]/65">
                {leadership.description}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="space-y-4"
            >
              {leadership.cards.map((item, index) => (
                <motion.article
                  key={item.role + index}
                  variants={fadeUp}
                  className="group rounded-3xl border border-[#19151C]/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#6C0798]">
                        {item.role}
                      </span>

                      <h3 className="mt-3 font-serif text-2xl sm:text-3xl">
                        {item.title}
                      </h3>
                    </div>

                    <span className="font-serif text-3xl text-[#19151C]/10">
                      0{index + 1}
                    </span>
                  </div>

                  <p className="mt-5 max-w-2xl font-sans leading-7 text-[#19151C]/65">
                    {item.description}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </div>

          {leadership.people.length > 0 && (
            <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {leadership.people.map((person, i) => (
                <article key={person.name + i}>
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#19151C]/5">
                    {person.photo.url && (
                      <img src={person.photo.url} alt={person.photo.alt || person.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#6C0798]">{person.role}</p>
                  <h3 className="mt-1 font-serif text-2xl">{person.name}</h3>
                  {person.bio && <p className="mt-2 font-sans text-sm leading-6 text-[#19151C]/65">{person.bio}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VALUES */}
      <section
        id="values"
        className="scroll-mt-24 bg-[#19151C] px-6 py-24 text-white lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeUp}
              className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/45"
            >
              {values.eyebrow}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl"
            >
              {values.heading}
              <span className="text-white/40"> {values.headingAccent}</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl font-sans text-base leading-7 text-white/55 sm:text-lg"
            >
              {values.description}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {values.values.map((value, index) => {
              const Icon = VALUE_ICONS[index % VALUE_ICONS.length];

              return (
                <motion.article
                  key={value.title + index}
                  variants={fadeUp}
                  className="group bg-[#19151C] p-7 transition-colors duration-300 hover:bg-white/[0.06] sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <Icon
                      size={23}
                      strokeWidth={1.5}
                      className="text-white/50 transition-transform duration-300 group-hover:scale-110"
                    />

                    <span className="font-sans text-xs text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-14 font-serif text-2xl">
                    {value.title}
                  </h3>

                  <p className="mt-4 font-sans text-sm leading-6 text-white/50">
                    {value.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* WHY AGAPE */}
      <section
        id="why-agape"
        className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.span
                variants={fadeUp}
                className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6C0798]"
              >
                {why.eyebrow}
              </motion.span>

              <motion.h2
                variants={fadeUp}
                className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl"
              >
                {why.heading}
                <span className="block text-[#6C0798]">{why.headingAccent}</span>
              </motion.h2>

              {why.paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp}
                  className={`${i === 0 ? "mt-7" : "mt-5"} max-w-xl font-sans text-base leading-8 text-[#19151C]/65 sm:text-lg`}
                >
                  {para}
                </motion.p>
              ))}

              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  href="/admissions"
                  className="group inline-flex items-center gap-3 font-sans text-sm font-semibold text-[#6C0798]"
                >
                  {why.linkLabel}
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {why.photo.url ? (
                <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#19151C]/5">
                  <img src={why.photo.url} alt={why.photo.alt} className="h-full w-full object-cover" />
                </div>
              ) : (
              <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#6C0798] p-8 text-white sm:p-12">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/50">
                      The Agape Difference
                    </span>

                    <div className="mt-10 h-px w-full bg-white/15" />
                  </div>

                  <div>
                    <p className="font-serif text-4xl leading-tight sm:text-5xl">
                      “{why.quote}”
                    </p>

                    <p className="mt-6 max-w-md font-sans text-sm leading-6 text-white/60">
                      {why.quoteNote}
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full border border-white/10" />
                <div className="absolute -bottom-5 -right-5 h-24 w-24 rounded-full bg-[#E12F41]/70" />
              </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}

    
      <AgapeCTA {...cta} />
      

    </main>
  );
}

