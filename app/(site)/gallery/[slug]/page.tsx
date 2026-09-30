import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import CampusGallery from "@/components/CampusGallery";
import AlbumGrid from "@/components/AlbumGrid";
import { getAlbumPhotos, getCalendarEvents, getPublishedAlbums, getPublishedNews } from "@/lib/content/server";
import { formatNewsDate } from "@/lib/content/public-types";

type Props = { params: { slug: string } };

async function load(slug: string) {
  const albums = await getPublishedAlbums();
  return { album: albums.find((a) => a.slug === slug), albums };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { album } = await load(params.slug);
  if (!album) return { title: "Gallery" };
  return {
    title: album.title,
    description: album.description || `${album.photoCount} photos from ${album.title} at Agape Academy International.`,
    openGraph: album.coverUrl ? { images: [album.coverUrl] } : undefined,
  };
}

export default async function AlbumPage({ params }: Props) {
  const { album, albums } = await load(params.slug);
  if (!album) notFound();

  const [photos, news, events] = await Promise.all([
    getAlbumPhotos(album.id),
    album.newsPostId ? getPublishedNews() : Promise.resolve([]),
    album.eventId ? getCalendarEvents() : Promise.resolve([]),
  ]);
  const story = news.find((n) => n.id === album.newsPostId);
  const event = events.find((e) => e.id === album.eventId);
  const others = albums.filter((a) => a.id !== album.id).slice(0, 3);

  return (
    <main className="bg-[#FAF8F9]">
      <section className="bg-[#19151C] px-6 pb-14 pt-36 text-white sm:px-10 sm:pt-44 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Link href="/gallery" className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white/55 hover:text-white">
            <ArrowLeft size={14} /> Gallery
          </Link>
          <p className="mt-8 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#E12F41]">
            {[album.date && formatNewsDate(album.date), `${album.photoCount} photos`].filter(Boolean).join(" · ")}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.02] sm:text-6xl">{album.title}</h1>
          {album.description && <p className="mt-5 max-w-2xl font-sans text-lg leading-8 text-white/65">{album.description}</p>}
          {(story || event) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {story && (
                <Link href={`/news/${story.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-sans text-sm hover:bg-white/10">
                  <Newspaper size={15} /> Read the story
                </Link>
              )}
              {event && (
                <Link href="/events" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-sans text-sm hover:bg-white/10">
                  <CalendarDays size={15} /> {event.title}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <CampusGallery
            bare
            useFallback={false}
            photos={photos.map((p) => ({ id: p.id, category: album.title, title: p.caption || p.title, caption: p.caption, src: p.url }))}
          />
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-[#19151C]/10 bg-white px-6 py-16 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 font-serif text-3xl sm:text-4xl">More albums</h2>
            <AlbumGrid albums={others} />
          </div>
        </section>
      )}
    </main>
  );
}
