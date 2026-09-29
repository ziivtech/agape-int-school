"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, GraduationCap, Sparkles } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { FadeUp, ParallaxImage, Reveal } from "@/components/Animations";
import { useSection } from "@/components/content/ContentProvider";
import { NewsCard, formatNewsDate } from "@/lib/content/public-types";

export default function NewsPageClient({ articles }: { articles: NewsCard[] }) {
  const prefersReducedMotion = useReducedMotion();
  const hero = useSection("news.hero");
  const feature = useSection("news.feature");
  const cta = useSection("news.cta");
  const identity = useSection("site.identity");

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], ["0%", "18%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1.08, 1.2]);

  const categories = useMemo(() => Array.from(new Set(articles.map((a) => a.category))), [articles]);
  const [category, setCategory] = useState<string | null>(null);

  // Support links like /news?category=sports
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("category");
    if (!param) return;
    const match = categories.find((c) => c.toLowerCase().replace(/\s+/g, "-") === param.toLowerCase());
    if (match) setCategory(match);
  }, [categories]);

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a !== featured && (!category || a.category === category));

  return (
    <main className="overflow-hidden bg-[#FAF8F9] text-[#19151C]">
      {/* HERO */}
      <section className="relative min-h-[70svh] overflow-hidden bg-[#19151C] text-white sm:min-h-[80vh]">
        {hero.background.url && (
          <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-[-8%]">
            <Image
              src={hero.background.url}
              alt={hero.background.alt}
              fill
              priority
              quality={90}
              unoptimized={hero.background.url.startsWith("http")}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-[#19151C]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#19151C]/95 via-[#19151C]/55 to-[#19151C]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#19151C] via-transparent to-[#19151C]/20" />

        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl flex-col justify-end px-5 pb-10 sm:min-h-[80vh] sm:px-8 sm:pb-14 lg:px-10 lg:pb-20">
          <div className="max-w-5xl">
            <FadeUp>
              <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-white/60">{hero.eyebrow}</p>
              <h1 className="max-w-5xl font-serif text-[4rem] leading-[0.82] tracking-[-0.055em] sm:text-7xl md:text-8xl lg:text-[9rem]">
                {hero.heading}
                <span className="block text-white/35">{hero.headingAccent}</span>
              </h1>
            </FadeUp>
            <FadeUp>
              <p className="mt-8 max-w-xl font-sans text-base leading-7 text-white/65 sm:text-lg sm:leading-8">{hero.intro}</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <FadeUp>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">{hero.introEyebrow}</span>
              <h2 className="mt-5 font-serif text-5xl leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
                {hero.introHeading}
                <span className="block text-[#6C0798]">{hero.introAccent}</span>
              </h2>
            </FadeUp>
            <FadeUp>
              <div className="max-w-3xl">
                {hero.introParagraphs.map((para, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "font-sans text-lg leading-8 text-[#19151C]/65 sm:text-xl sm:leading-9"
                        : "mt-6 font-sans text-base leading-7 text-[#19151C]/50"
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {articles.length === 0 ? (
        <section className="px-5 pb-24 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl border-t border-[#19151C]/10 pt-10">
            <p className="font-sans text-[#19151C]/60">{hero.emptyText}</p>
          </div>
        </section>
      ) : (
        <>
          {/* FEATURED */}
          <section id="stories" className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10 lg:pb-32">
            <div className="mx-auto max-w-7xl">
              <motion.article
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/news/${featured.slug}`}
                  className="group relative block overflow-hidden rounded-[1.75rem] bg-[#19151C] text-white sm:rounded-[2.25rem]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9]">
                    {featured.coverUrl && (
                      <motion.img
                        src={featured.coverUrl}
                        alt={featured.coverAlt}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.045 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#19151C] via-[#19151C]/35 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#19151C]/70 via-transparent to-transparent" />

                    <div className="absolute left-6 right-6 top-6 flex items-center justify-between sm:left-10 sm:right-10 sm:top-10">
                      <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md">
                        {featured.category}
                      </span>
                      <span className="font-sans text-xs text-white/50">{formatNewsDate(featured.publishedAt)}</span>
                    </div>

                    <div className="absolute bottom-7 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 lg:bottom-14 lg:left-14">
                      <div className="max-w-4xl">
                        <h3 className="font-serif text-4xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">{featured.title}</h3>
                        <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                          <p className="max-w-xl font-sans text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
                            {featured.excerpt}
                          </p>
                          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#19151C] transition-transform duration-500 group-hover:rotate-45">
                            <ArrowUpRight className="h-5 w-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            </div>
          </section>

          {/* LATEST */}
          {articles.length > 1 && (
            <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col justify-between gap-6 border-b border-[#19151C]/10 pb-7 lg:flex-row lg:items-end">
                  <h2 className="font-serif text-5xl leading-none sm:text-6xl">More stories</h2>
                  {categories.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {[null, ...categories].map((cat) => (
                        <button
                          key={cat ?? "all"}
                          onClick={() => setCategory(cat)}
                          className={`rounded-full border px-4 py-2 font-sans text-xs font-semibold transition-colors ${
                            category === cat
                              ? "border-[#6C0798] bg-[#6C0798] text-white"
                              : "border-[#19151C]/10 text-[#19151C]/60 hover:border-[#6C0798]/40"
                          }`}
                        >
                          {cat ?? "All"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {rest.length === 0 ? (
                  <p className="mt-10 font-sans text-sm text-[#19151C]/55">No other stories in this category yet.</p>
                ) : (
                  <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {rest.map((article, index) => (
                      <motion.article
                        key={article.slug}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 45 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-70px" }}
                        transition={{ duration: 0.7, delay: (index % 3) * 0.08 }}
                        className="group"
                      >
                        <Link href={`/news/${article.slug}`} className="block">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#F3EFF4]">
                            {article.coverUrl && (
                              <img
                                src={article.coverUrl}
                                alt={article.coverAlt}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/40 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                          </div>
                          <div className="mt-5">
                            <div className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#E12F41]">
                              <span>{article.category}</span>
                              <span className="text-[#19151C]/20">•</span>
                              <span className="text-[#19151C]/35">{formatNewsDate(article.publishedAt)}</span>
                            </div>
                            <h3 className="mt-3 font-serif text-3xl leading-[0.98] transition-colors duration-300 group-hover:text-[#6C0798]">
                              {article.title}
                            </h3>
                            <p className="mt-3 font-sans text-sm leading-6 text-[#19151C]/55">{article.excerpt}</p>
                            <div className="mt-5 inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#19151C]/45 transition-all duration-300 group-hover:gap-3 group-hover:text-[#6C0798]">
                              Read story
                              <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* PHOTO BREAK */}
      <section className="relative overflow-hidden bg-[#FAF8F9]">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[55vh] overflow-hidden lg:min-h-[700px]">
            {feature.photo.url && (
              <ParallaxImage src={feature.photo.url} alt={feature.photo.alt} className="absolute inset-0 h-full w-full" intensity={12} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/60 via-transparent to-transparent" />
          </div>
          <div className="flex items-center bg-[#FAF8F9] px-6 py-20 sm:px-10 lg:px-20">
            <Reveal direction="right">
              <div className="max-w-xl">
                <GraduationCap className="h-8 w-8 text-[#6C0798]" />
                <span className="mt-8 block font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E12F41]">{feature.eyebrow}</span>
                <h2 className="mt-5 font-serif text-5xl leading-[0.93] sm:text-6xl lg:text-7xl">
                  {feature.heading}
                  <span className="block text-[#6C0798]">{feature.headingAccent}</span>
                </h2>
                <p className="mt-7 font-sans text-base leading-7 text-[#19151C]/55 sm:text-lg sm:leading-8">{feature.description}</p>
                {feature.linkLabel && (
                  <Link href={feature.linkUrl} className="group mt-8 inline-flex items-center gap-3 font-sans text-sm font-bold text-[#19151C]">
                    {feature.linkLabel}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C0798] text-white transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-5 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#6C0798] px-6 py-16 text-white sm:rounded-[2rem] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#E12F41]/20 blur-[100px]" />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-white/50">{cta.eyebrow}</span>
              <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.92] sm:text-6xl lg:text-8xl">
                {cta.heading}
                <span className="block text-white/35">{cta.headingAccent}</span>
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-7 text-white/60 sm:text-lg">{cta.description}</p>
            </div>
            <Link
              href={cta.buttonUrl}
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-7 font-sans text-sm font-bold text-[#19151C] transition-all duration-300 hover:bg-[#E12F41] hover:text-white"
            >
              {cta.buttonLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative mt-16 flex items-center gap-3 border-t border-white/10 pt-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-sans text-xs text-white/40">{identity.schoolName}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
