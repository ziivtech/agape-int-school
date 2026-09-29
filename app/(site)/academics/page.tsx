"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  Award,
  ClipboardCheck,
  Globe2,
  GraduationCap,
} from "lucide-react";

import { FadeUp, FadeIn, Stagger, StaggerItem, ParallaxImage, Reveal } from "@/components/Animations";
import AgapeCTA from "@/components/AgapeCTA";
import { useSection } from "@/components/content/ContentProvider";
import { isCloudinaryVideoUrl } from "@/lib/cloudinary";

const FORMAT_ICONS = [BookOpen, ClipboardCheck, Award, GraduationCap];
const BEYOND_ICONS = [GraduationCap, Globe2];

export default function AcademicsPage() {
  const hero = useSection("academics.hero");
  const approach = useSection("academics.approach");
  const journey = useSection("academics.stages");
  const curriculum = useSection("academics.curriculum");
  const support = useSection("academics.support");
  const pathways = useSection("academics.pathways");
  const cta = useSection("academics.cta");

  const isVideoHero = isCloudinaryVideoUrl(hero.background.url);

  return (
    <main className="overflow-hidden bg-[#FAF8F9] text-[#19151C]">
      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden bg-[#19151C] text-white">
        {isVideoHero ? (
          <video
            src={hero.background.url}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
          />
        ) : (
          hero.background.url && (
            <ParallaxImage
              src={hero.background.url}
              alt={hero.background.alt}
              className="absolute inset-0 h-full w-full opacity-45"
              intensity={8}
            />
          )
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[#19151C]/55 via-[#19151C]/35 to-[#19151C]" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-end px-6 pb-20 pt-36 lg:px-10 lg:pb-28">
          <Stagger className="w-full">
            <StaggerItem className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-white/60" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                {hero.eyebrow}
              </span>
            </StaggerItem>

            <StaggerItem>
              <h1 className="max-w-6xl font-serif text-5xl leading-[0.92] tracking-tight sm:text-7xl lg:text-[8rem]">
                {hero.heading}
                <span className="block text-white/50">{hero.headingAccent}</span>
              </h1>
            </StaggerItem>

            <div className="mt-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <StaggerItem>
                <p className="max-w-2xl font-sans text-base leading-7 text-white/70 sm:text-lg">{hero.intro}</p>
              </StaggerItem>

              <StaggerItem>
                <Link
                  href="#learning-journey"
                  className="group inline-flex items-center gap-3 rounded-full border border-white/25 px-6 py-3.5 font-sans text-sm font-medium text-white transition-all hover:bg-white hover:text-[#19151C]"
                >
                  {hero.buttonLabel}
                  <ArrowDown size={16} className="transition-transform group-hover:translate-y-1" />
                </Link>
              </StaggerItem>
            </div>
          </Stagger>
        </div>

        {hero.badge && (
          <FadeIn delay={1} className="absolute bottom-8 right-6 hidden lg:block lg:right-10">
            <div className="flex items-center gap-4 rounded-full border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
              <GraduationCap size={18} className="text-white/70" />
              <span className="font-sans text-xs tracking-wide text-white/65">{hero.badge}</span>
            </div>
          </FadeIn>
        )}
      </section>

      {/* INTRO */}
      <section className="px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <FadeUp>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6C0798]">
                {approach.eyebrow}
              </span>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {approach.heading}
                <span className="block text-[#6C0798]">{approach.headingAccent}</span>
              </h2>
            </FadeUp>

            <Stagger className="space-y-7">
              {approach.paragraphs.map((para, i) => (
                <StaggerItem key={i}>
                  <p className="font-sans text-lg leading-8 text-[#19151C]/70">{para}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {approach.stats.length > 0 && (
            <Stagger className="mt-20 grid border-y border-[#19151C]/10 sm:grid-cols-3">
              {approach.stats.map((stat, i) => (
                <StaggerItem
                  key={stat.label + i}
                  className="border-b border-[#19151C]/10 px-5 py-8 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <p className="font-serif text-4xl text-[#6C0798]">{stat.value}</p>
                  <p className="mt-2 font-sans text-sm text-[#19151C]/55">{stat.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* LEARNING JOURNEY */}
      <section id="learning-journey" className="scroll-mt-20 bg-white px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <Stagger className="mb-20 max-w-3xl">
            <StaggerItem>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6C0798]">
                {journey.eyebrow}
              </span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {journey.heading}
                <span className="block text-[#6C0798]">{journey.headingAccent}</span>
              </h2>
            </StaggerItem>
          </Stagger>

          <div className="space-y-24 lg:space-y-36">
            {journey.stages.map((stage, index) => {
              const reversed = index % 2 !== 0;

              return (
                <article
                  key={stage.anchor || index}
                  id={stage.anchor || undefined}
                  className={`scroll-mt-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
                    reversed ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Reveal direction={reversed ? "right" : "left"}>
                    <div className="relative">
                      {stage.photo.url ? (
                        <ParallaxImage
                          src={stage.photo.url}
                          alt={stage.photo.alt || `${stage.title} students`}
                          className="aspect-[4/3] rounded-[2rem] bg-[#19151C]"
                          intensity={8}
                        />
                      ) : (
                        <div className="aspect-[4/3] rounded-[2rem] bg-[#19151C]/10" />
                      )}

                      <FadeUp delay={0.15}>
                        <div className="absolute -bottom-5 left-5 rounded-2xl bg-white px-5 py-4 shadow-xl sm:left-8">
                          <span className="font-serif text-3xl text-[#6C0798]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="ml-3 font-sans text-xs font-medium uppercase tracking-[0.15em] text-[#19151C]/50">
                            {stage.age}
                          </span>
                        </div>
                      </FadeUp>
                    </div>
                  </Reveal>

                  <Stagger>
                    <StaggerItem>
                      <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6C0798]">
                        {stage.age}
                      </span>
                    </StaggerItem>
                    <StaggerItem>
                      <h3 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{stage.title}</h3>
                    </StaggerItem>
                    <StaggerItem>
                      <p className="mt-3 font-serif text-xl text-[#6C0798]">{stage.subtitle}</p>
                    </StaggerItem>
                    <StaggerItem>
                      <p className="mt-6 font-sans leading-7 text-[#19151C]/65">{stage.description}</p>
                    </StaggerItem>

                    <Stagger className="mt-8 space-y-3">
                      {stage.points.map((point) => (
                        <StaggerItem key={point}>
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6C0798]/10 text-[#6C0798]">
                              <Check size={12} strokeWidth={2.5} />
                            </span>
                            <span className="font-sans text-sm text-[#19151C]/65">{point}</span>
                          </div>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </Stagger>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section
        id="curriculum"
        className="scroll-mt-20 bg-[#6C0798] px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-24">
            <Stagger>
              <StaggerItem>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:text-xs">
                  {curriculum.eyebrow}
                </span>
              </StaggerItem>
              <StaggerItem>
                <h2 className="mt-4 max-w-xl font-serif text-[2.6rem] leading-[0.98] tracking-tight sm:mt-5 sm:text-5xl lg:text-6xl">
                  {curriculum.heading}
                  <span className="block text-white/40">{curriculum.headingAccent}</span>
                </h2>
              </StaggerItem>
            </Stagger>

            <FadeUp>
              <p className="max-w-2xl font-sans text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                {curriculum.intro}
              </p>
            </FadeUp>
          </div>

          {/* Feature */}
          <div className="mt-12 grid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] sm:mt-16 sm:rounded-[2rem] lg:grid-cols-[1fr_1fr]">
            <Reveal direction="left">
              <div className="relative min-h-[280px] overflow-hidden sm:min-h-[420px] lg:min-h-[560px]">
                {curriculum.photo.url && (
                  <img
                    src={curriculum.photo.url}
                    alt={curriculum.photo.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                {curriculum.photoBadge && (
                  <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
                    <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md sm:text-[10px]">
                      {curriculum.photoBadge}
                    </span>
                  </div>
                )}
              </div>
            </Reveal>

            <Stagger className="flex flex-col justify-center p-6 sm:p-10 lg:p-14 xl:p-16">
              <StaggerItem>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                  {curriculum.whyEyebrow}
                </span>
              </StaggerItem>
              <StaggerItem>
                <h3 className="mt-4 max-w-xl font-serif text-3xl leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
                  {curriculum.whyHeading}
                  <span className="text-white/40"> {curriculum.whyAccent}</span>
                </h3>
              </StaggerItem>
              {curriculum.whyParagraphs.map((para, i) => (
                <StaggerItem key={i}>
                  <p
                    className={`${i === 0 ? "mt-5 sm:mt-6" : "mt-4"} max-w-xl font-sans text-sm leading-6 text-white/60 sm:text-base sm:leading-7`}
                  >
                    {para}
                  </p>
                </StaggerItem>
              ))}
              {curriculum.linkLabel && curriculum.linkUrl && (
                <StaggerItem>
                  <a
                    href={curriculum.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3.5 font-sans text-xs font-semibold text-[#19151C] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 sm:mt-9 sm:px-6 sm:text-sm"
                  >
                    {curriculum.linkLabel}
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </StaggerItem>
              )}
            </Stagger>
          </div>

          {/* Format */}
          {curriculum.formatItems.length > 0 && (
            <div className="mt-16 sm:mt-20 lg:mt-28">
              <FadeUp>
                <div className="max-w-2xl">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                    {curriculum.formatEyebrow}
                  </span>
                  <h3 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                    {curriculum.formatHeading}
                    <span className="text-white/40"> {curriculum.formatAccent}</span>
                  </h3>
                </div>
              </FadeUp>

              <Stagger className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
                {curriculum.formatItems.map((item, i) => {
                  const Icon = FORMAT_ICONS[i % FORMAT_ICONS.length];
                  return (
                    <StaggerItem key={item.title + i}>
                      <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.09] sm:rounded-3xl sm:p-7">
                        <div className="flex items-start justify-between">
                          <Icon
                            size={21}
                            strokeWidth={1.5}
                            className="text-white/55 transition-transform duration-300 group-hover:scale-110"
                          />
                          <span className="font-serif text-2xl text-white/25 sm:text-3xl">{item.number}</span>
                        </div>
                        <h4 className="mt-9 font-serif text-xl sm:mt-12 sm:text-2xl">{item.title}</h4>
                        <p className="mt-2.5 font-sans text-xs leading-5 text-white/45 sm:text-sm sm:leading-6">
                          {item.text}
                        </p>
                      </article>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          )}

          {/* Beyond */}
          <div className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20 lg:mt-28 lg:pt-28">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <Reveal direction="left">
                <div>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                    {curriculum.beyondEyebrow}
                  </span>
                  <h3 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                    {curriculum.beyondHeading}
                    <span className="block text-white/40">{curriculum.beyondAccent}</span>
                  </h3>
                </div>
              </Reveal>

              <Stagger className="grid gap-4 sm:grid-cols-2">
                {curriculum.beyondCards.map((card, i) => {
                  const Icon = BEYOND_ICONS[i % BEYOND_ICONS.length];
                  return (
                    <StaggerItem key={card.title + i}>
                      <article className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-6 sm:rounded-3xl sm:p-7">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                          <Icon size={19} strokeWidth={1.5} className="text-white/70" />
                        </div>
                        <h4 className="mt-8 font-serif text-2xl">{card.title}</h4>
                        <p className="mt-3 font-sans text-sm leading-6 text-white/50">{card.text}</p>
                      </article>
                    </StaggerItem>
                  );
                })}

                {curriculum.scopeUrl && (
                  <StaggerItem className="sm:col-span-2">
                    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#19151C]/30 p-6 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:p-7">
                      <div className="max-w-xl">
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                          {curriculum.scopeLabel}
                        </span>
                        <p className="mt-2 font-sans text-sm leading-6 text-white/55">{curriculum.scopeText}</p>
                      </div>
                      <a
                        href={curriculum.scopeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-full border border-white/15 px-5 py-3 font-sans text-xs font-semibold text-white transition-all hover:border-white/30 hover:bg-white hover:text-[#19151C] sm:px-6 sm:py-3.5 sm:text-sm"
                      >
                        {curriculum.scopeLinkLabel}
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </StaggerItem>
                )}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING SUPPORT */}
      <section id="learning-support" className="scroll-mt-20 px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
            <Reveal direction="left">
              <div className="relative">
                {support.photo.url ? (
                  <ParallaxImage
                    src={support.photo.url}
                    alt={support.photo.alt}
                    className="aspect-[4/5] rounded-[2.5rem]"
                    intensity={7}
                  />
                ) : (
                  <div className="aspect-[4/5] rounded-[2.5rem] bg-[#19151C]/5" />
                )}
              </div>
            </Reveal>

            <Stagger>
              <StaggerItem>
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6C0798]">
                  {support.eyebrow}
                </span>
              </StaggerItem>
              <StaggerItem>
                <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  {support.heading}
                  <span className="block text-[#6C0798]">{support.headingAccent}</span>
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-7 font-sans text-lg leading-8 text-[#19151C]/65">{support.description}</p>
              </StaggerItem>

              <Stagger className="mt-8 space-y-4">
                {support.points.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-start gap-3 rounded-2xl border border-[#19151C]/10 bg-white p-4">
                      <span className="mt-0.5 text-[#6C0798]">
                        <Check size={17} />
                      </span>
                      <span className="font-sans text-sm leading-6 text-[#19151C]/65">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Stagger>
          </div>
        </div>
      </section>

      {/* UNIVERSITY PATHWAYS */}
      <section id="pathways" className="scroll-mt-20 overflow-hidden bg-[#19151C] text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2">
            <Stagger className="flex flex-col justify-center px-6 py-24 lg:px-10 lg:py-32">
              <StaggerItem>
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                  {pathways.eyebrow}
                </span>
              </StaggerItem>
              <StaggerItem>
                <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  {pathways.heading}
                  <span className="block text-white/40">{pathways.headingAccent}</span>
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-7 max-w-xl font-sans text-base leading-8 text-white/55 sm:text-lg">
                  {pathways.description}
                </p>
              </StaggerItem>
              {pathways.buttonLabel && (
                <StaggerItem>
                  <div className="mt-9">
                    <Link
                      href={pathways.buttonUrl}
                      className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 font-sans text-sm font-semibold text-[#19151C] transition-transform hover:-translate-y-1"
                    >
                      {pathways.buttonLabel}
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </StaggerItem>
              )}
            </Stagger>

            <div className="relative min-h-[550px] lg:min-h-full">
              {pathways.photo.url && (
                <ParallaxImage
                  src={pathways.photo.url}
                  alt={pathways.photo.alt}
                  className="absolute inset-0 h-full"
                  intensity={8}
                />
              )}
              <div className="absolute inset-0 bg-[#19151C]/20" />

              {pathways.cardTitle && (
                <FadeUp
                  delay={0.2}
                  className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/15 bg-[#19151C]/55 p-7 backdrop-blur-md lg:left-10 lg:right-10"
                >
                  <GraduationCap size={25} className="text-white/60" strokeWidth={1.5} />
                  <p className="mt-8 font-serif text-2xl">{pathways.cardTitle}</p>
                  <p className="mt-3 font-sans text-sm leading-6 text-white/50">{pathways.cardText}</p>
                </FadeUp>
              )}
            </div>
          </div>
        </div>
      </section>

      <AgapeCTA {...cta} />
    </main>
  );
}
