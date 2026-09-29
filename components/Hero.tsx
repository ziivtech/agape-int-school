"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { isCloudinaryVideoUrl } from "../lib/cloudinary";
import { useSection } from "./content/ContentProvider";

const SLIDE_MS = 6500;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.hero");
  const bg = c.background;
  const slides = c.slides.filter((s) => s.photo.url);
  const useSlides = slides.length > 0;
  const isVideo = !useSlides && isCloudinaryVideoUrl(bg.url);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Advance automatically; restarting the timer whenever the slide changes
  // means a click on an indicator gets the full interval too.
  useEffect(() => {
    if (slides.length < 2 || paused || prefersReducedMotion) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, slides.length, paused, prefersReducedMotion]);

  // Pause while the tab is hidden so it doesn't race ahead in the background.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const current = slides[index % Math.max(slides.length, 1)];

  return (
    <section className="relative flex h-[92vh] min-h-[620px] w-full items-end overflow-hidden bg-[#19151C]">
      {useSlides ? (
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: (SLIDE_MS + 1400) / 1000, ease: "linear" }}
            >
              <Image
                src={current.photo.url}
                alt={current.photo.alt}
                fill
                priority={index === 0}
                unoptimized
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          {isVideo && <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" src={bg.url} />}
          {!isVideo && bg.url && <Image src={bg.url} alt={bg.alt} fill priority unoptimized className="object-cover object-center" />}
        </>
      )}

      {/* Preload the next slide so the fade never shows a blank frame */}
      {slides.length > 1 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slides[(index + 1) % slides.length].photo.url} alt="" aria-hidden="true" className="hidden" />
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

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-6 z-10 flex items-center gap-4 sm:bottom-10 lg:right-10">
          {current?.caption && <span className="hidden font-sans text-xs text-white/60 sm:block">{current.caption}</span>}
          <div className="flex gap-2" role="tablist" aria-label="Hero photos">
            {slides.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show photo ${i + 1}${s.photo.alt ? `: ${s.photo.alt}` : ""}`}
                onClick={() => setIndex(i)}
                className="group relative h-6 w-8 sm:w-10"
              >
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/30 group-hover:bg-white/50">
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-white"
                      initial={{ width: prefersReducedMotion || paused ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: prefersReducedMotion || paused ? 0 : SLIDE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

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