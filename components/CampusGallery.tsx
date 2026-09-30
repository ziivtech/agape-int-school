"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryImage = {
  id: string;
  category: string;
  title: string;
  caption: string;
  src: string;
};

// The school's own photos, shown until staff upload a gallery in the admin.
const FALLBACK: GalleryImage[] = [
  { id: "f1", category: "Graduation", title: "Graduation day", caption: "Senior students celebrating graduation.", src: "/grad_01.jpg" },
  { id: "f2", category: "Graduation", title: "Honouring our graduates", caption: "Achievement and character recognised on graduation day.", src: "/girl_grad.jpg" },
  { id: "f3", category: "Sport", title: "Sports day", caption: "Inter-house competition.", src: "/games_1.jpg" },
  { id: "f4", category: "Sport", title: "On the track", caption: "Students racing on sports day.", src: "/games_2.jpg" },
  { id: "f5", category: "Sport", title: "Team spirit", caption: "Cheering on classmates.", src: "/games_3.jpg" },
  { id: "f6", category: "Sport", title: "Competition", caption: "A close finish.", src: "/games_4.jpg" },
  { id: "f7", category: "Sport", title: "Sports day", caption: "Taking part together.", src: "/games_5.jpg" },
  { id: "f8", category: "Student Life", title: "Together", caption: "Students on campus.", src: "/together.jpg" },
  { id: "f9", category: "Classrooms", title: "In conversation", caption: "A teacher with students.", src: "/cover.jpg" },
];

export default function CampusGallery({
  photos,
  useFallback = true,
  bare = false,
}: {
  photos: GalleryImage[];
  /** Show the school's built-in photos when there are none (general gallery only). */
  useFallback?: boolean;
  /** Drop the section padding (when embedded in another page). */
  bare?: boolean;
}) {
  const [active, setActive] = useState<string>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const galleryImages = photos.length > 0 || !useFallback ? photos : FALLBACK;
  // Only offer filters for categories that actually have photos.
  const categories = useMemo(
    () => Array.from(new Set(galleryImages.map((img) => img.category))),
    [galleryImages]
  );

  const filtered = useMemo(
    () => (active === "All" ? galleryImages : galleryImages.filter((img) => img.category === active)),
    [active, galleryImages]
  );

  const openImage = filtered[openIndex ?? -1] ?? null;

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, filtered.length]);

  return (
    <section className={bare ? "" : "px-6 py-16 sm:px-10 sm:py-20 lg:px-16"}>
      {/* Category filter */}
      {categories.length > 1 && (
      <div className="mx-auto mb-10 flex max-w-6xl flex-wrap gap-2">
        <button
          onClick={() => setActive("All")}
          className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
            active === "All"
              ? "border-[#6C0798] bg-[#6C0798] text-white"
              : "border-[#19151C]/15 text-[#19151C]/70 hover:border-[#6C0798]/40"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
              active === cat
                ? "border-[#6C0798] bg-[#6C0798] text-white"
                : "border-[#19151C]/15 text-[#19151C]/70 hover:border-[#6C0798]/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      )}

      {/* Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {filtered.map((image, i) => (
          <motion.button
            key={image.id}
            layout
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : (i % 8) * 0.03 }}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-[#19151C]/5 text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#19151C]/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-3 left-3 font-sans text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {image.title}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {openImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#19151C]/90 px-4"
            onClick={() => setOpenIndex(null)}
          >
            <button
              aria-label="Close gallery"
              onClick={() => setOpenIndex(null)}
              className="absolute right-5 top-5 text-white/80 hover:text-white"
            >
              <X size={28} />
            </button>

            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
              }}
              className="absolute left-4 text-white/70 hover:text-white sm:left-8"
            >
              <ChevronLeft size={32} />
            </button>

            <motion.div
              initial={prefersReducedMotion ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-sm bg-[#FAF8F9]"
            >
              <div className="relative aspect-[4/3] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={openImage.src} alt={openImage.title} className="h-full w-full object-contain bg-[#19151C]" />
              </div>
              <div className="p-6">
                <p className="font-sans text-xs font-medium uppercase tracking-wide text-[#E12F41]">
                  {openImage.category}
                </p>
                <h3 className="mt-1 font-serif text-2xl text-[#19151C]">{openImage.title}</h3>
                <p className="mt-2 font-sans text-[#19151C]/70">{openImage.caption}</p>
              </div>
            </motion.div>

            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i + 1) % filtered.length));
              }}
              className="absolute right-4 text-white/70 hover:text-white sm:right-8"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
