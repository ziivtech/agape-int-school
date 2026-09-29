"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import GeoMark from "./GeoMark";

import { useSection } from "./content/ContentProvider";

export default function ChristianEducation() {
  const c = useSection("home.faith");
  return (
    <section className="relative overflow-hidden bg-[#4B075F] px-6 py-20 text-white sm:py-28 lg:px-10">
      <GeoMark className="pointer-events-none absolute -left-32 -bottom-32 h-[480px] w-[480px]" opacity={0.07} />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <SectionHeading
            eyebrow={c.eyebrow}
            heading={c.heading}
            description={c.description}
            tone="dark"
          />

          <div>
            <div className="flex flex-wrap gap-2.5">
              {c.values.map((value) => (
                <span
                  key={value}
                  className="rounded-full border border-white/20 px-4 py-2 font-sans text-sm text-white/85"
                >
                  {value}
                </span>
              ))}
            </div>

            <Link
              href={c.buttonUrl}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-sans text-sm font-medium text-[#4B075F] transition-colors hover:bg-white/90"
            >
              {c.buttonLabel}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
