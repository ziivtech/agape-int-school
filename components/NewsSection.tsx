"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { useSection } from "./content/ContentProvider";
import { NewsCard, formatNewsDate } from "../lib/content/public-types";

export default function NewsSection({ articles }: { articles: NewsCard[] }) {
  const prefersReducedMotion = useReducedMotion();
  const c = useSection("home.news");
  if (articles.length === 0) return null;

  return (
    <section className="bg-white px-6 py-20 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={c.eyebrow} heading={c.heading} />
          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-2 font-sans text-sm font-medium text-[#6C0798] transition-colors hover:text-[#4B075F]"
          >
            {c.linkLabel}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-10 sm:mt-12 sm:grid-cols-3 sm:gap-8 lg:gap-10">
          {articles.map((article, i) => (
            <motion.article
              key={article.slug}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/news/${article.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F3EFF4]">
                  {article.coverUrl && (
                    <img
                      src={article.coverUrl}
                      alt={article.coverAlt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/35 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                </div>

                <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#E12F41]">
                  {article.category} · {formatNewsDate(article.publishedAt)}
                </p>
                <h3 className="mt-2 font-serif text-xl leading-tight text-[#19151C] transition-colors duration-300 group-hover:text-[#6C0798] sm:text-2xl">
                  {article.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[#19151C]/60">{article.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#19151C]/50 transition-all duration-300 group-hover:gap-3 group-hover:text-[#6C0798]">
                  Read story
                  <ArrowRight size={13} />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
