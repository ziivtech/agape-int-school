"use client";

import Link from "next/link";
import GeoMark from "./GeoMark";
import { useSection } from "./content/ContentProvider";

export default function AdmissionsCTA() {
  const c = useSection("home.cta");
  return (
    <section className="relative overflow-hidden bg-[#6C0798] px-6 py-20 text-white sm:py-28 lg:px-10">
      <GeoMark className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px]" opacity={0.08} />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
          {c.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-white/80 sm:text-lg">
          {c.description}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
         
          <Link
            href={c.primaryUrl}
            className="rounded-full bg-[#E12F41] px-6 py-3.5 font-sans text-sm font-medium text-white transition-colors hover:bg-[#c72638]"
          >
            {c.primaryLabel}
          </Link>
          <Link
            href={c.secondaryUrl}
            className="rounded-full border border-white/40 px-6 py-3.5 font-sans text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {c.secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
