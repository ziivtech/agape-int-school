"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { isCloudinaryVideoUrl } from "../lib/cloudinary";
import { useSection } from "./content/ContentProvider";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.hero");
  const bg = c.background;
  const isVideo = isCloudinaryVideoUrl(bg.url);
  const hasCustomMedia = Boolean(bg.url);

  return (
    <section className="relative flex h-[92vh] min-h-[620px] w-full items-end overflow-hidden bg-[#19151C]">
      {/* Background Video / Photo (from Media CMS when uploaded to Cloudinary) */}
      {hasCustomMedia && isVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src={bg.url}
        />
      )}
      {hasCustomMedia && !isVideo && (
        <Image
          src={bg.url}
          alt={bg.alt}
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      )}

      {/* Neutral shading so the text stays readable over any photo */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-20 lg:px-10 lg:pb-24">
        {/* Eyebrow */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-white/60 sm:w-10" />

          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-xs">
            {c.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl font-serif text-4xl leading-[1.05] text-white sm:text-6xl lg:text-[76px]"
        >
          {c.line1}
          {c.line2 && (
            <>
              <br />
              {c.line2}
            </>
          )}
          {c.line3 && (
            <>
              <br />
              <span className="text-white/80">{c.line3}</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-white/80"
        >
          {c.intro}
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            href={c.primaryUrl}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-sans text-sm font-medium text-[#19151C] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
          >
            {c.primaryLabel}
            <ArrowRight size={16} />
          </Link>

          <Link
            href={c.secondaryUrl}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 font-sans text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            {c.secondaryLabel}
          </Link>
        </motion.div>
      </div>

      {/* Small video indicator */}
      {isVideo && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 right-6 z-10 hidden items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-md sm:flex"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
          <Play size={10} fill="currentColor" />
        </span>

        <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-white/60">
          Life at Agape
        </span>
      </motion.div>
      )}
    </section>
  );
}