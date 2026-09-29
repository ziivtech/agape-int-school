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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Content */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 sm:pb-20 lg:px-10 lg:pb-24"
      >
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-white/60">{c.eyebrow}</p>

        <h1 className="mt-5 max-w-3xl font-serif text-[2.5rem] leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-[64px]">
          {c.line1}
          {c.line2 && <> {c.line2}</>}
          {c.line3 && <span className="text-white/60"> {c.line3}</span>}
        </h1>

        <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-white/70">{c.intro}</p>

        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href={c.primaryUrl}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-sans text-[13px] font-medium text-[#19151C] transition-colors duration-200 hover:bg-white/85"
          >
            {c.primaryLabel}
            <ArrowRight size={14} />
          </Link>

          {c.secondaryLabel && (
            <Link
              href={c.secondaryUrl}
              className="group inline-flex items-center gap-2 font-sans text-[13px] font-medium text-white/85 transition-colors hover:text-white"
            >
              <span className="border-b border-white/30 pb-0.5 transition-colors group-hover:border-white">{c.secondaryLabel}</span>
            </Link>
          )}
        </div>
      </motion.div>

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