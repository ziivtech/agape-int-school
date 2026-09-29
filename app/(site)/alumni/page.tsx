"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Quote, Globe2, Users, Heart, Sparkles } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { useSection } from "@/components/content/ContentProvider";

const VALUE_ICONS = [GraduationCap, Heart, Globe2, Users];

export default function AlumniPage() {
  const hero = useSection("alumni.hero");
  const stories = useSection("alumni.stories").stories;
  const legacy = useSection("alumni.legacy");
  const connect = useSection("alumni.connect");

  return (
    <main className="overflow-hidden bg-[#FAF8F9] text-[#19151C]">
      {/* HERO */}
      <section className="relative min-h-[78svh] overflow-hidden bg-[#19151C] text-white sm:min-h-[86vh] lg:min-h-[92vh]">
        {hero.background.url && (
          <div className="absolute inset-0">
            <img src={hero.background.url} alt={hero.background.alt} className="h-full w-full object-cover object-center" />
          </div>
        )}
        <div className="absolute inset-0 bg-[#19151C]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#19151C] via-[#19151C]/65 to-[#19151C]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#19151C] via-[#19151C]/20 to-transparent" />
        <div className="pointer-events-none absolute -right-48 top-0 h-[32rem] w-[32rem] rounded-full bg-[#6C0798]/30 blur-[120px]" />

        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-end px-5 pb-10 sm:min-h-[86vh] sm:px-8 sm:pb-16 lg:min-h-[92vh] lg:px-10 lg:pb-20">
          <div className="max-w-5xl">
            <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-white/60 sm:mb-7">{hero.eyebrow}</p>
            <h1 className="font-serif text-[2.7rem] leading-[0.9] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-[5rem]">
              {hero.heading}
              <span className="block text-white/35">{hero.headingAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-sm leading-6 text-white/65 sm:mt-7 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              {hero.intro}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="#stay-connected"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 font-sans text-xs font-semibold text-[#19151C] transition duration-300 hover:bg-[#E12F41] hover:text-white sm:px-6 sm:py-3.5 sm:text-sm"
              >
                {hero.buttonLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#E12F41] sm:text-xs">{hero.introEyebrow}</span>
            <h2 className="mt-5 max-w-xl font-serif text-5xl leading-[0.9] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              {hero.introHeading}
              <span className="block text-[#6C0798]">{hero.introAccent}</span>
            </h2>
          </div>
          <div className="lg:pt-12">
            <p className="max-w-3xl font-sans text-lg leading-8 text-[#19151C]/60 sm:text-xl sm:leading-9">{hero.introText}</p>
          </div>
        </div>
      </section>

      {/* STORIES */}
      {stories.length > 0 && (
        <section className="bg-[#19151C] text-white">
          {stories.map((story, index) => (
            <article key={story.title + index} className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
              <div
                className={`relative min-h-[420px] overflow-hidden sm:min-h-[600px] lg:min-h-[760px] ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                {story.photo.url && (
                  <img
                    src={story.photo.url}
                    alt={story.photo.alt || story.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/80 via-transparent to-transparent" />
                <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
                  <span className="font-serif text-5xl text-white/30 sm:text-7xl">{String(index + 1).padStart(2, "0")}</span>
                </div>
              </div>

              <div className={`flex items-center px-6 py-16 sm:px-10 sm:py-24 lg:px-20 lg:py-32 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="max-w-xl">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#E12F41] sm:text-xs">{story.eyebrow}</span>
                  <h2 className="mt-5 font-serif text-5xl leading-[0.92] tracking-[-0.035em] sm:text-6xl lg:text-7xl">{story.title}</h2>
                  <p className="mt-7 whitespace-pre-line font-sans text-base leading-8 text-white/55 sm:text-lg">{story.text}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* LEGACY */}
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-[#6C0798]/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#6C0798] sm:text-xs">{legacy.eyebrow}</span>
            <h2 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.035em] sm:text-6xl lg:text-8xl">
              {legacy.heading} <span className="text-[#E12F41]">{legacy.headingAccent}</span>
            </h2>
            <p className="mt-7 max-w-2xl font-sans text-base leading-7 text-[#19151C]/55 sm:text-lg sm:leading-8">{legacy.description}</p>
          </div>

          {legacy.values.length > 0 && (
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {legacy.values.map((value, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <div
                    key={value + i}
                    className="group relative overflow-hidden rounded-2xl border border-[#19151C]/10 bg-white p-6 transition duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-7"
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#6C0798]/5 transition duration-500 group-hover:scale-150" />
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <span className="font-serif text-4xl text-[#6C0798]/35">{String(i + 1).padStart(2, "0")}</span>
                        <Icon className="h-5 w-5 text-[#E12F41]" />
                      </div>
                      <h3 className="mt-10 font-sans text-sm font-bold leading-6">{value}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* QUOTE */}
      {legacy.quote && (
        <section className="relative overflow-hidden bg-[#E12F41] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-white/10 blur-[100px]" />
          <div className="relative mx-auto max-w-6xl text-center">
            <Quote className="mx-auto h-9 w-9 text-white/35" />
            <blockquote className="mt-8 font-serif text-4xl leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-8xl">“{legacy.quote}”</blockquote>
            <div className="mx-auto mt-10 flex items-center justify-center gap-3">
              <GraduationCap className="h-5 w-5" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 sm:text-xs">{legacy.quoteBy}</span>
            </div>
          </div>
        </section>
      )}

      {/* STAY CONNECTED */}
      <section id="stay-connected" className="scroll-mt-20 px-5 py-5 sm:px-8 sm:py-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#19151C] px-6 py-16 text-white sm:rounded-[2rem] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#6C0798]/30 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[20rem] w-[20rem] rounded-full bg-[#E12F41]/10 blur-[100px]" />

          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#E12F41]" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 sm:text-xs">{connect.eyebrow}</span>
              </div>
              <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.9] tracking-[-0.035em] sm:text-6xl">
                {connect.heading}
                <span className="text-white/30"> {connect.headingAccent}</span>
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-7 text-white/50 sm:text-lg">{connect.description}</p>
            </div>

            <div className="rounded-2xl bg-white p-5 text-[#19151C] sm:p-8">
              <EnquiryForm type="alumni" showAlumni submitLabel="Stay in touch" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
