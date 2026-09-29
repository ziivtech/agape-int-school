"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  Compass,
  Crown,
  GraduationCap,
  Palette,
  Play,
  Quote,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FadeUp, ParallaxImage, Reveal, Stagger, StaggerItem } from "@/components/Animations";
import { useSection } from "@/components/content/ContentProvider";
import { isCloudinaryVideoUrl } from "@/lib/cloudinary";

const ACTIVITY_ICONS = [Sparkles, Trophy, Palette, Crown, Compass, Users];
const FOUNDATION_ICONS = [BookOpen, Users, Award];

export default function StudentLifePage() {
  const { scrollYProgress } = useScroll();
  const hero = useSection("studentLife.hero");
  const intro = useSection("studentLife.intro");
  const moments = useSection("studentLife.moments");
  const acts = useSection("studentLife.activities");
  const foundation = useSection("studentLife.foundation");
  const statement = useSection("studentLife.statement");
  const voice = useSection("studentLife.voice");
  const grid = useSection("studentLife.gallery");
  const cta = useSection("studentLife.cta");
  const identity = useSection("site.identity");

  const isVideoHero = isCloudinaryVideoUrl(hero.background.url);
  const isVideoMoments = isCloudinaryVideoUrl(moments.photo.url);

  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0%", "22%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1.08, 1.22]);

  const quickLinks = [
    ...acts.activities.filter((a) => a.href).map((a) => ({ label: a.title, href: a.href })),
    { label: "Alumni", href: "/alumni" },
  ];

  return (
    <main className="overflow-hidden bg-[#FAF8F9] text-[#19151C]">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-[#E12F41]"
      />

      {/* HERO */}
      <section className="relative min-h-[74svh] overflow-hidden bg-[#19151C] text-white sm:min-h-[82vh] lg:min-h-[94vh]">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-[-6%]">
          {isVideoHero ? (
            <video src={hero.background.url} autoPlay loop muted playsInline className="h-full w-full object-cover" />
          ) : (
            hero.background.url && (
              <img
                src={hero.background.url}
                alt={hero.background.alt}
                className="h-full w-full object-cover object-[58%_center] sm:object-center"
              />
            )
          )}
        </motion.div>

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
                    href="#experience"
                    className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-white px-6 font-sans text-sm font-semibold text-[#19151C] transition-all duration-300 hover:bg-[#E12F41] hover:text-white sm:w-auto"
                  >
                    {hero.primaryLabel}
                    <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                  </Link>
                  {hero.secondaryLabel && (
                    <Link
                      href={hero.secondaryUrl}
                      className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-6 font-sans text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:w-auto"
                    >
                      {hero.secondaryLabel}
                    </Link>
                  )}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAV */}
      <section className="sticky top-0 z-40 border-b border-[#19151C]/10 bg-[#FAF8F9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-max items-center gap-6 py-4">
            <span className="mr-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#6C0798]">Explore</span>
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-xs font-medium text-[#19151C]/55 transition hover:text-[#6C0798]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section id="experience" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <FadeUp>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">{intro.eyebrow}</span>
              </FadeUp>
              <FadeUp>
                <h2 className="mt-5 max-w-md font-serif text-4xl leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
                  {intro.heading} <span className="text-[#6C0798]">{intro.headingAccent}</span>
                </h2>
              </FadeUp>
            </div>

            <div>
              <FadeUp>
                <p className="max-w-2xl font-sans text-lg leading-8 text-[#19151C]/65 sm:text-xl sm:leading-9">
                  {intro.description}
                </p>
              </FadeUp>
              <FadeUp>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {intro.pillars.map((item, i) => (
                    <div key={item.title + i} className="border-t border-[#19151C]/15 pt-4">
                      <span className="font-sans text-xs font-bold text-[#6C0798]">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-3 font-serif text-2xl">{item.title}</h3>
                      <p className="mt-2 font-sans text-sm leading-6 text-[#19151C]/55">{item.text}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC SPLIT */}
      <section className="relative bg-[#19151C] text-white">
        <div className="mx-auto grid max-w-[1500px] lg:grid-cols-2">
          <div className="relative min-h-[65vh] overflow-hidden lg:min-h-[850px]">
            {isVideoMoments ? (
              <video
                src={moments.photo.url}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              moments.photo.url && (
                <ParallaxImage src={moments.photo.url} alt={moments.photo.alt} className="absolute inset-0 h-full w-full" intensity={12} />
              )
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/80 via-transparent to-transparent" />
            {moments.badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute bottom-8 left-5 sm:bottom-12 sm:left-10"
              >
                <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-4 py-3 backdrop-blur-md">
                  <Camera className="h-4 w-4" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em]">{moments.badge}</span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center px-5 py-20 sm:px-10 sm:py-24 lg:px-20">
            <div className="max-w-xl">
              <FadeUp>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">{moments.eyebrow}</span>
              </FadeUp>
              <FadeUp>
                <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                  {moments.heading}
                  <span className="block text-white/35">{moments.headingAccent}</span>
                </h2>
              </FadeUp>
              <FadeUp>
                <p className="mt-8 font-sans text-base leading-7 text-white/55 sm:text-lg sm:leading-8">{moments.description}</p>
              </FadeUp>
              {moments.note && (
                <FadeUp>
                  <div className="mt-10 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C0798]">
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    </div>
                    <span className="font-sans text-sm text-white/60">{moments.note}</span>
                  </div>
                </FadeUp>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITY MARQUEE */}
      <section className="overflow-hidden border-b border-[#19151C]/10 bg-[#6C0798] py-5 text-white">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center"
        >
          {[...acts.activities, ...acts.activities].map((activity, index) => (
            <div key={`${activity.title}-${index}`} className="flex items-center">
              <span className="mx-7 font-serif text-2xl sm:text-3xl">{activity.title}</span>
              <Sparkles className="h-4 w-4 text-white/40" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ACTIVITIES */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <div className="max-w-2xl">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">{acts.eyebrow}</span>
              <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                {acts.heading} <span className="text-[#6C0798]">{acts.headingAccent}</span>
              </h2>
              <p className="mt-6 font-sans text-base leading-7 text-[#19151C]/55 sm:text-lg">{acts.description}</p>
            </div>
          </FadeUp>

          <div className="mt-16 space-y-6 sm:mt-20 lg:mt-28">
            {acts.activities.map((activity, index) => {
              const Icon = ACTIVITY_ICONS[index % ACTIVITY_ICONS.length];
              return (
                <motion.article
                  key={activity.title + index}
                  id={activity.anchor || undefined}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className="group relative scroll-mt-24 overflow-hidden rounded-[1.5rem] bg-[#19151C] text-white sm:rounded-[2rem]"
                >
                  <div className="grid min-h-[470px] lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative min-h-[300px] overflow-hidden lg:min-h-[520px]">
                      {activity.photo.url && (
                        <motion.img
                          src={activity.photo.url}
                          alt={activity.photo.alt || activity.title}
                          className="absolute inset-0 h-full w-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#19151C]" />
                      <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md sm:left-7 sm:top-7">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="absolute bottom-5 left-5 font-serif text-6xl text-white/25 sm:bottom-7 sm:left-7 sm:text-8xl">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">{activity.eyebrow}</span>
                      <h3 className="mt-4 font-serif text-4xl leading-none sm:text-5xl lg:text-6xl">{activity.title}</h3>
                      <p className="mt-6 max-w-lg font-sans text-base leading-7 text-white/55 sm:text-lg sm:leading-8">{activity.text}</p>
                      {activity.href && (
                        <div className="mt-9">
                          <Link href={activity.href} className="group/link inline-flex items-center gap-3 font-sans text-sm font-semibold">
                            Discover more
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      )}
                      <div className="mt-12 h-px w-full bg-white/10">
                        <motion.div
                          initial={{ width: "0%" }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.2 }}
                          className="h-full bg-[#6C0798]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACADEMICS × LIFE */}
      <section className="relative overflow-hidden bg-[#FAF8F9] px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <div className="pointer-events-none absolute -right-40 top-20 h-[35rem] w-[35rem] rounded-full bg-[#6C0798]/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-24">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 80, rotate: -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]"
              >
                {foundation.photo.url ? (
                  <img src={foundation.photo.url} alt={foundation.photo.alt} className="aspect-[4/3] h-full w-full object-cover" />
                ) : (
                  <div className="aspect-[4/3] bg-[#19151C]/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/65 via-transparent to-transparent" />
                {foundation.photoTitle && (
                  <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                    <div className="rounded-2xl border border-white/15 bg-[#19151C]/60 p-5 backdrop-blur-xl">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{foundation.photoLabel}</span>
                      <p className="mt-2 font-serif text-2xl text-white">{foundation.photoTitle}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {foundation.motto && (
                <motion.div
                  initial={{ opacity: 0, x: 50, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="absolute -bottom-7 right-3 hidden w-52 rounded-2xl bg-[#6C0798] p-5 text-white shadow-2xl sm:block lg:-right-8"
                >
                  <BookOpen className="h-5 w-5" />
                  <p className="mt-5 whitespace-pre-line font-serif text-3xl">{foundation.motto}</p>
                </motion.div>
              )}
            </div>

            <div>
              <FadeUp>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">{foundation.eyebrow}</span>
              </FadeUp>
              <FadeUp>
                <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                  {foundation.heading} <span className="text-[#6C0798]">{foundation.headingAccent}</span>
                </h2>
              </FadeUp>
              <FadeUp>
                <p className="mt-7 font-sans text-base leading-7 text-[#19151C]/60 sm:text-lg sm:leading-8">{foundation.description}</p>
              </FadeUp>

              <Stagger className="mt-10 space-y-4">
                {foundation.items.map((item, i) => {
                  const Icon = FOUNDATION_ICONS[i % FOUNDATION_ICONS.length];
                  return (
                    <StaggerItem key={item.title + i}>
                      <div className="flex gap-4 rounded-2xl border border-[#19151C]/10 bg-white p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6C0798]/10 text-[#6C0798]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-sans text-sm font-bold">{item.title}</h3>
                          <p className="mt-1 font-sans text-sm leading-6 text-[#19151C]/50">{item.text}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* BIG STATEMENT */}
      <section className="relative overflow-hidden bg-[#E12F41] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-white/10 sm:h-[40rem] sm:w-[40rem]" />
        <div className="pointer-events-none absolute -bottom-48 -left-48 h-[32rem] w-[32rem] rounded-full border border-white/10 sm:h-[45rem] sm:w-[45rem]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <FadeUp>
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-white/60">{statement.eyebrow}</span>
          </FadeUp>
          <FadeUp>
            <h2 className="mt-7 font-serif text-5xl leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-[8rem]">
              {statement.line1}
              <br />
              {statement.line2} <span className="text-white/40">{statement.line2Accent}</span>
            </h2>
          </FadeUp>
          <FadeUp>
            <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
              {statement.description}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* STUDENT VOICE */}
      {voice.quote && (
        <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
              <FadeUp>
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#6C0798]">{voice.eyebrow}</span>
                  <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl">
                    {voice.heading} <span className="text-[#E12F41]">{voice.headingAccent}</span>
                  </h2>
                </div>
              </FadeUp>

              <Reveal direction="right">
                <div className="relative rounded-[1.5rem] bg-[#19151C] p-7 text-white sm:rounded-[2rem] sm:p-12 lg:p-16">
                  <Quote className="h-9 w-9 text-[#E12F41]" />
                  <blockquote className="mt-8 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                    “{voice.quote}”
                  </blockquote>
                  <div className="mt-10 flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6C0798]">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-semibold">{voice.name}</p>
                      <p className="mt-1 font-sans text-xs text-white/40">{voice.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* PHOTO GRID */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10 lg:pb-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[260px_260px]">
            <motion.div
              whileHover={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-[1.5rem] bg-[#19151C]/10 sm:rounded-[2rem] lg:col-span-7 lg:row-span-2"
            >
              {grid.mainPhoto.url && (
                <img
                  src={grid.mainPhoto.url}
                  alt={grid.mainPhoto.alt}
                  className="h-full min-h-[420px] w-full object-cover transition duration-1000 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60">{grid.mainLabel}</span>
                <h3 className="mt-2 font-serif text-3xl text-white sm:text-4xl">{grid.mainTitle}</h3>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-[1.5rem] bg-[#19151C]/10 sm:rounded-[2rem] lg:col-span-5"
            >
              {grid.secondPhoto.url && (
                <img
                  src={grid.secondPhoto.url}
                  alt={grid.secondPhoto.alt}
                  className="h-full min-h-[250px] w-full object-cover transition duration-1000 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-[#6C0798]/15" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-[1.5rem] bg-[#6C0798] sm:rounded-[2rem] lg:col-span-5"
            >
              <div className="flex h-full min-h-[250px] flex-col justify-between p-7 text-white sm:p-9">
                <Zap className="h-7 w-7" />
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/50">{grid.cardLabel}</span>
                  <p className="mt-3 max-w-sm font-serif text-3xl leading-tight sm:text-4xl">{grid.cardTitle}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#19151C] px-6 py-16 text-white sm:rounded-[2rem] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#6C0798]/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#E12F41]/20 blur-[100px]" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <FadeUp>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-white/40">{cta.eyebrow}</span>
              </FadeUp>
              <FadeUp>
                <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                  {cta.heading} <span className="text-white/35">{cta.headingAccent}</span>
                </h2>
              </FadeUp>
              <FadeUp>
                <p className="mt-6 max-w-xl font-sans text-base leading-7 text-white/50 sm:text-lg">{cta.description}</p>
              </FadeUp>
            </div>

            <FadeUp>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href={cta.primaryUrl}
                  className="group inline-flex h-13 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-sans text-sm font-semibold text-[#19151C] transition hover:bg-[#E12F41] hover:text-white"
                >
                  {cta.primaryLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                {cta.secondaryLabel && (
                  <Link
                    href={cta.secondaryUrl}
                    className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-7 py-4 font-sans text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {cta.secondaryLabel}
                  </Link>
                )}
              </div>
            </FadeUp>
          </div>

          <div className="relative mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6C0798]">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-sans text-xs text-white/40">{identity.schoolName}</span>
            </div>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/25">Excellence in Christ</span>
          </div>
        </div>
      </section>
    </main>
  );
}
