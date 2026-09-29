"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CircleHelp,
  FileText,
  Globe2,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  School,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { FadeUp, ParallaxImage, Reveal, Stagger, StaggerItem } from "@/components/Animations";
import EnquiryForm from "@/components/EnquiryForm";
import { useSection } from "@/components/content/ContentProvider";

const NAV = [
  { id: "how-to-apply", title: "How to Apply" },
  { id: "requirements", title: "Requirements" },
  { id: "fees", title: "Fees" },
  { id: "scholarships", title: "Scholarships" },
  { id: "international", title: "International" },
  { id: "book-a-visit", title: "Book a Visit" },
];

const PILLAR_ICONS = [School, Users, Heart];
const STEP_ICONS = [MessageCircle, FileText, Users, GraduationCap];
const FEE_ICONS = [GraduationCap, CalendarDays, WalletCards];
const INTL_ICONS = [Globe2, School, MapPin];

const num = (n: number) => String(n).padStart(2, "0");

export default function AdmissionsPage() {
  const { scrollYProgress } = useScroll();
  const contact = useSection("site.contact");
  const identity = useSection("site.identity");
  const hero = useSection("admissions.hero");
  const intro = useSection("admissions.intro");
  const apply = useSection("admissions.apply");
  const reqs = useSection("admissions.requirements");
  const fees = useSection("admissions.fees");
  const scholarships = useSection("admissions.scholarships");
  const intl = useSection("admissions.international");
  const visit = useSection("admissions.visit");
  const faq = useSection("admissions.faq");
  const cta = useSection("admissions.cta");

  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(scrollYProgress, [0, 0.35], ["0%", "18%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1.08, 1.18]);

  return (
    <main className="scroll-smooth overflow-hidden bg-[#FAF8F9] text-[#19151C]">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-[#E12F41]"
      />

      {/* HERO */}
      <section className="relative min-h-[74svh] overflow-hidden bg-[#19151C] text-white sm:min-h-[82vh] lg:min-h-[94vh]">
        {hero.background.url && (
          <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-[-6%]">
            <Image
              src={hero.background.url}
              alt={hero.background.alt}
              fill
              priority
              quality={90}
              unoptimized={hero.background.url.startsWith("http")}
              className="h-full w-full object-cover object-[58%_center] sm:object-center"
            />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-[#19151C]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#19151C]/85 via-[#19151C]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/95 via-transparent to-[#19151C]/20" />

        <div className="relative z-10 mx-auto flex min-h-[74svh] max-w-7xl flex-col px-5 pb-5 pt-6 sm:min-h-[82vh] sm:px-8 sm:pb-8 sm:pt-8 lg:min-h-[94vh] lg:px-10 lg:py-10">
          <div className="flex flex-1 items-end pb-12 sm:pb-16 lg:items-center lg:pb-0">
            <div className="max-w-4xl">
              <FadeUp>
                <div className="mb-4 flex items-center gap-3 pt-8 sm:mb-6 sm:pt-16 lg:pt-24 xl:pt-32">
                  <span className="h-px w-8 bg-[#E12F41] sm:w-10" />
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65 sm:text-xs sm:tracking-[0.25em]">
                    {hero.eyebrow}
                  </span>
                </div>
              </FadeUp>

              <FadeUp>
                <h1 className="max-w-[21rem] font-serif text-[3.4rem] leading-[0.86] tracking-[-0.05em] sm:max-w-3xl sm:text-7xl sm:leading-[0.88] md:text-8xl lg:max-w-5xl lg:text-[8rem]">
                  {hero.heading}
                  <span className="mt-2 block text-white/40 sm:mt-0">{hero.headingAccent}</span>
                </h1>
              </FadeUp>

              <FadeUp>
                <p className="mt-6 max-w-[22rem] font-sans text-sm leading-[1.55] text-white/70 sm:mt-8 sm:max-w-xl sm:text-lg sm:leading-8">
                  {hero.intro}
                </p>
              </FadeUp>

              <FadeUp>
                <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                  <Link
                    href="#how-to-apply"
                    className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-white px-6 font-sans text-sm font-semibold text-[#19151C] transition-all duration-300 hover:bg-[#E12F41] hover:text-white sm:w-auto"
                  >
                    {hero.primaryLabel}
                    <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                  </Link>
                  <Link
                    href="#book-a-visit"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-6 font-sans text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:w-auto"
                  >
                    {hero.secondaryLabel}
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY ADMISSIONS NAV */}
      <nav className="sticky top-0 z-50 border-b border-[#19151C]/10 bg-[#FAF8F9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-max items-center gap-6 py-4">
            <span className="mr-1 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#E12F41]">
              Admissions
            </span>
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-2 font-sans text-xs font-medium text-[#19151C]/50 transition hover:text-[#6C0798]"
              >
                <span className="text-[9px] text-[#6C0798]/50">{num(i + 1)}</span>
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* INTRO */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <FadeUp>
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#6C0798]">
                  {intro.eyebrow}
                </span>
                <h2 className="mt-5 max-w-md font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl">
                  {intro.heading} <span className="text-[#E12F41]">{intro.headingAccent}</span>
                </h2>
              </div>
            </FadeUp>

            <div>
              <FadeUp>
                <p className="max-w-3xl font-sans text-lg leading-8 text-[#19151C]/60 sm:text-xl sm:leading-9">
                  {intro.description}
                </p>
              </FadeUp>

              <FadeUp>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {intro.pillars.map((item, i) => {
                    const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
                    return (
                      <div key={item.title + i} className="rounded-2xl border border-[#19151C]/10 bg-white p-5">
                        <Icon className="h-5 w-5 text-[#6C0798]" />
                        <h3 className="mt-5 font-serif text-2xl">{item.title}</h3>
                        <p className="mt-2 font-sans text-sm leading-6 text-[#19151C]/50">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO APPLY */}
      <section
        id="how-to-apply"
        className="scroll-mt-20 bg-[#19151C] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <FadeUp>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">
                  01 / {apply.eyebrow}
                </span>
                <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl">
                  {apply.heading} <span className="text-white/35">{apply.headingAccent}</span>
                </h2>
                <p className="mt-6 max-w-md font-sans leading-7 text-white/50">{apply.description}</p>

                {apply.keyDates.length > 0 && (
                  <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
                    {apply.keyDates.map((d, i) => (
                      <div key={d.label + i} className="flex items-baseline justify-between gap-6 py-3">
                        <dt className="font-sans text-sm text-white/60">{d.label}</dt>
                        <dd className="font-sans text-sm font-semibold text-white">{d.date}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </FadeUp>
            </div>

            <Stagger className="space-y-4">
              {apply.steps.map((step, i) => {
                const Icon = STEP_ICONS[i % STEP_ICONS.length];
                return (
                  <StaggerItem key={step.title + i}>
                    <div className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 transition duration-500 hover:bg-white/[0.07] sm:p-8">
                      <div className="flex gap-5">
                        <span className="font-serif text-3xl text-[#E12F41]/70">{num(i + 1)}</span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-serif text-2xl sm:text-3xl">{step.title}</h3>
                            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6C0798] sm:flex">
                              <Icon className="h-4 w-4" />
                            </div>
                          </div>
                          <p className="mt-3 max-w-xl font-sans text-sm leading-6 text-white/45 sm:text-base">{step.text}</p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>

          <FadeUp>
            <div id="apply-form" className="mt-12 grid gap-8 rounded-[1.5rem] bg-white p-6 text-[#19151C] sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:p-12">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#6C0798]">
                  {apply.formEyebrow}
                </span>
                <h3 className="mt-3 font-serif text-3xl sm:text-4xl">{apply.formTitle}</h3>
                <p className="mt-4 font-sans text-sm leading-6 text-[#19151C]/55 sm:text-base sm:leading-7">
                  {apply.formIntro}
                </p>
              </div>
              <EnquiryForm type="admissions" showStudent submitLabel="Send to admissions" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section id="requirements" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-24">
            <Reveal direction="left">
              <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                {reqs.photo.url ? (
                  <ParallaxImage src={reqs.photo.url} alt={reqs.photo.alt} className="aspect-[4/3] h-full w-full" intensity={8} />
                ) : (
                  <div className="aspect-[4/3] bg-[#19151C]/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/70 via-transparent to-transparent" />
                {reqs.photoCaption && (
                  <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                    <div className="rounded-2xl border border-white/15 bg-[#19151C]/60 p-5 backdrop-blur-xl">
                      <FileText className="h-5 w-5 text-white" />
                      <p className="mt-3 font-serif text-2xl text-white">{reqs.photoCaption}</p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            <div>
              <FadeUp>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">
                  02 / {reqs.eyebrow}
                </span>
                <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl">
                  {reqs.heading} <span className="text-[#6C0798]">{reqs.headingAccent}</span>
                </h2>
                <p className="mt-6 font-sans text-base leading-7 text-[#19151C]/55 sm:text-lg sm:leading-8">
                  {reqs.description}
                </p>
              </FadeUp>

              <Stagger className="mt-9 space-y-3">
                {reqs.items.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-center gap-4 rounded-xl border border-[#19151C]/10 bg-white p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6C0798]/10 text-[#6C0798]">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="font-sans text-sm text-[#19151C]/65">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {reqs.note && <p className="mt-6 font-sans text-xs leading-5 text-[#19151C]/40">{reqs.note}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* FEES */}
      <section id="fees" className="scroll-mt-20 bg-[#F1EDF3] px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <FadeUp>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#6C0798]">
                03 / {fees.eyebrow}
              </span>
              <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl">
                {fees.heading} <span className="text-[#E12F41]">{fees.headingAccent}</span>
              </h2>
              <p className="mt-6 font-sans text-base leading-7 text-[#19151C]/55 sm:text-lg sm:leading-8">
                {fees.description}
              </p>
            </FadeUp>
          </div>

          {fees.feeRows.length > 0 ? (
            <FadeUp>
              <div className="mt-12 overflow-hidden rounded-[1.5rem] bg-white lg:mt-16">
                {fees.academicYear && (
                  <p className="border-b border-[#19151C]/10 px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#6C0798] sm:px-8">
                    {fees.academicYear}
                  </p>
                )}
                <table className="w-full text-left font-sans text-sm">
                  <thead className="sr-only">
                    <tr>
                      <th>Level</th>
                      <th>Fee</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#19151C]/10">
                    {fees.feeRows.map((row, i) => (
                      <tr key={row.level + i} className="flex flex-col gap-1 px-6 py-5 sm:table-row sm:px-8">
                        <td className="font-serif text-xl sm:py-5 sm:pl-8">{row.level}</td>
                        <td className="font-semibold text-[#19151C] sm:py-5">{row.amount}</td>
                        <td className="text-[#19151C]/50 sm:py-5 sm:pr-8">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fees.feeNotes.length > 0 && (
                <ul className="mt-5 space-y-1.5 font-sans text-xs leading-5 text-[#19151C]/50 sm:text-sm">
                  {fees.feeNotes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              )}
            </FadeUp>
          ) : (
            <div className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16">
              {fees.cards.map((item, i) => {
                const Icon = FEE_ICONS[i % FEE_ICONS.length];
                return (
                  <FadeUp key={item.title + i}>
                    <div className="h-full rounded-[1.5rem] bg-white p-7 sm:p-8">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6C0798]/10 text-[#6C0798]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-7 font-serif text-3xl">{item.title}</h3>
                      <p className="mt-3 font-sans text-sm leading-6 text-[#19151C]/50">{item.text}</p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          )}

          <FadeUp>
            <div className="mt-5 flex flex-col gap-5 rounded-[1.5rem] bg-[#19151C] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/35">{fees.boxLabel}</span>
                <p className="mt-2 font-serif text-2xl">{fees.boxTitle}</p>
              </div>
              <Link
                href="#apply-form"
                className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-white px-6 font-sans text-sm font-semibold text-[#19151C] transition hover:bg-[#E12F41] hover:text-white"
              >
                {fees.buttonLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SCHOLARSHIPS */}
      <section id="scholarships" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <FadeUp>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">
                04 / {scholarships.eyebrow}
              </span>
              <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl">
                {scholarships.heading} <span className="text-[#6C0798]">{scholarships.headingAccent}</span>
              </h2>
            </FadeUp>

            <div>
              <FadeUp>
                <p className="max-w-2xl font-sans text-lg leading-8 text-[#19151C]/60">{scholarships.description}</p>
              </FadeUp>

              <div className="mt-10 rounded-[1.5rem] bg-[#6C0798] p-7 text-white sm:p-10">
                <Sparkles className="h-6 w-6" />
                <h3 className="mt-8 font-serif text-3xl sm:text-4xl">{scholarships.cardTitle}</h3>
                <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-white/60 sm:text-base">{scholarships.cardText}</p>
                <Link href="#apply-form" className="group mt-8 inline-flex items-center gap-3 font-sans text-sm font-semibold">
                  {scholarships.linkLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNATIONAL STUDENTS */}
      <section id="international" className="scroll-mt-20 overflow-hidden bg-[#19151C] text-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[480px] overflow-hidden sm:min-h-[600px] lg:min-h-[760px]">
            {intl.photo.url && (
              <ParallaxImage src={intl.photo.url} alt={intl.photo.alt} className="absolute inset-0 h-full w-full" intensity={10} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/80 via-transparent to-[#19151C]/10" />
            {intl.badge && (
              <div className="absolute bottom-7 left-5 sm:bottom-10 sm:left-10">
                <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-4 py-3 backdrop-blur-xl">
                  <Globe2 className="h-4 w-4" />
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    {intl.badge}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center px-5 py-20 sm:px-10 sm:py-28 lg:px-20 lg:py-32">
            <div className="max-w-xl">
              <FadeUp>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">
                  05 / {intl.eyebrow}
                </span>
                <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">{intl.heading}</h2>
                <p className="mt-7 font-sans text-base leading-7 text-white/55 sm:text-lg sm:leading-8">{intl.description}</p>
              </FadeUp>

              <Stagger className="mt-10 space-y-3">
                {intl.items.map((item, i) => {
                  const Icon = INTL_ICONS[i % INTL_ICONS.length];
                  return (
                    <StaggerItem key={item.title + i}>
                      <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6C0798]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-sans text-sm font-semibold">{item.title}</h3>
                          <p className="mt-1 font-sans text-sm leading-6 text-white/40">{item.text}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>

              <FadeUp>
                <Link
                  href="#apply-form"
                  className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-sans text-sm font-semibold text-[#19151C] transition hover:bg-[#E12F41] hover:text-white"
                >
                  {intl.buttonLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK A VISIT */}
      <section id="book-a-visit" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[1.75rem] bg-[#E12F41] text-white sm:rounded-[2rem]">
            <div className="grid lg:grid-cols-[1fr_1fr]">
              <div className="p-7 sm:p-10 lg:p-16">
                <FadeUp>
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                    06 / {visit.eyebrow}
                  </span>
                  <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                    {visit.heading}
                    <span className="block text-white/40">{visit.headingAccent}</span>
                  </h2>
                  <p className="mt-7 max-w-xl font-sans text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                    {visit.description}
                  </p>
                  <div className="mt-9 flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-sans text-sm font-semibold">{identity.schoolName}</p>
                      <p className="mt-1 whitespace-pre-line font-sans text-xs leading-5 text-white/70">{contact.address}</p>
                    </div>
                  </div>
                </FadeUp>
              </div>

              <div className="bg-white p-6 text-[#19151C] sm:p-10 lg:p-12">
                <h3 className="mb-6 font-serif text-2xl sm:text-3xl">{visit.formTitle}</h3>
                <EnquiryForm type="visit" showStudent showVisitDate submitLabel="Request a visit" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq.items.length > 0 && (
        <section className="bg-[#F1EDF3] px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <FadeUp>
                <CircleHelp className="mx-auto h-7 w-7 text-[#6C0798]" />
                <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl">{faq.heading}</h2>
                <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-6 text-[#19151C]/50 sm:text-base">
                  {faq.description}
                </p>
              </FadeUp>
            </div>

            <div className="mt-12 space-y-3 sm:mt-16">
              {faq.items.map((item, index) => (
                <motion.details
                  key={item.question + index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  className="group rounded-2xl border border-[#19151C]/10 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 font-serif text-xl sm:p-7 sm:text-2xl [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6C0798]/10 text-[#6C0798] transition duration-300 group-open:rotate-45">
                      <span className="text-xl font-light">+</span>
                    </span>
                  </summary>
                  <div className="px-5 pb-6 sm:px-7 sm:pb-8">
                    <p className="max-w-3xl whitespace-pre-line font-sans text-sm leading-7 text-[#19151C]/55 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="px-5 pb-5 pt-20 sm:px-8 sm:pb-8 sm:pt-28 lg:px-10 lg:pb-10 lg:pt-36">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#19151C] px-6 py-16 text-white sm:rounded-[2rem] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#6C0798]/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#E12F41]/20 blur-[100px]" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <FadeUp>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-white/35">{cta.eyebrow}</span>
              <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                {cta.heading} <span className="text-white/35">{cta.headingAccent}</span>
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-7 text-white/50 sm:text-lg">{cta.description}</p>
            </FadeUp>

            <FadeUp>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href={cta.primaryUrl}
                  className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-white px-7 font-sans text-sm font-semibold text-[#19151C] transition hover:bg-[#E12F41] hover:text-white"
                >
                  {cta.primaryLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                {cta.secondaryLabel && (
                  <Link
                    href={cta.secondaryUrl}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-7 font-sans text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {cta.secondaryLabel}
                  </Link>
                )}
              </div>
            </FadeUp>
          </div>

          <div className="relative mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6C0798]">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <span className="font-sans text-xs text-white/35">{identity.schoolName}</span>
            </div>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/20">Excellence in Christ</span>
          </div>
        </div>
      </section>
    </main>
  );
}
