import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getNewsBySlug, getPublishedNews } from "@/lib/content/server";
import { formatNewsDate, toNewsCard } from "@/lib/content/public-types";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getNewsBySlug(params.slug);
  if (!post) return { title: "Story not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.coverUrl ? [post.coverUrl] : undefined },
  };
}

/**
 * Story bodies are plain text: blank lines separate paragraphs,
 * and a line starting with "## " becomes a subheading.
 */
function StoryBody({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-6">
      {blocks.map((block, i) =>
        block.startsWith("## ") ? (
          <h2 key={i} className="pt-4 font-serif text-3xl text-[#19151C]">
            {block.slice(3)}
          </h2>
        ) : (
          <p key={i} className="whitespace-pre-line font-sans text-lg leading-8 text-[#19151C]/75">
            {block}
          </p>
        )
      )}
    </div>
  );
}

export default async function NewsArticlePage({ params }: Props) {
  const row = await getNewsBySlug(params.slug);
  if (!row) notFound();
  const post = toNewsCard(row);
  const more = (await getPublishedNews(4)).map(toNewsCard).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="bg-[#FAF8F9] text-[#19151C]">
      <article>
        <header className="bg-[#19151C] px-6 pb-14 pt-36 text-white sm:px-10 sm:pt-44 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <Link href="/news" className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white/55 hover:text-white">
              <ArrowLeft size={14} />
              All stories
            </Link>
            <p className="mt-8 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#E12F41]">
              {post.category} · {formatNewsDate(post.publishedAt)}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.02] sm:text-6xl">{post.title}</h1>
            {post.excerpt && <p className="mt-6 font-sans text-lg leading-8 text-white/65">{post.excerpt}</p>}
            {post.author && <p className="mt-6 font-sans text-sm text-white/45">By {post.author}</p>}
          </div>
        </header>

        {post.coverUrl && (
          <div className="mx-auto -mb-2 max-w-5xl px-6 pt-10 sm:px-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverUrl} alt={post.coverAlt} className="w-full rounded-2xl object-cover" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-20">
          <StoryBody body={post.body} />
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-[#19151C]/10 bg-white px-6 py-16 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-3xl">More from Agape</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {more.map((p) => (
                <Link key={p.slug} href={`/news/${p.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#F3EFF4]">
                    {p.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverUrl} alt={p.coverAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#E12F41]">{p.category}</p>
                  <h3 className="mt-1 font-serif text-xl leading-tight group-hover:text-[#6C0798]">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
