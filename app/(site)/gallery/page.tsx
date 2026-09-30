import type { Metadata } from "next";
import CampusGallery from "@/components/CampusGallery";
import AlbumGrid from "@/components/AlbumGrid";
import { getGalleryPhotos, getPublishedAlbums, getSection } from "@/lib/content/server";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A look inside life at Agape Academy International: classrooms, chapel, sport, the arts and the campus our students call home.",
};

export default async function GalleryPage() {
  const [c, photos, albums] = await Promise.all([getSection("gallery.page"), getGalleryPhotos(), getPublishedAlbums()]);

  return (
    <main className="bg-[#FAF8F9]">
      <section className="relative overflow-hidden bg-[#4B075F] px-6 pb-20 pt-40 text-white sm:px-10 sm:pt-48 lg:px-16">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -right-24 -top-24 h-[460px] w-[460px] opacity-[0.08]"
        >
          <g fill="none" stroke="#FFFFFF" strokeWidth="1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <rect
                key={i}
                x={40 + i * 22}
                y={40 + i * 22}
                width={320 - i * 44}
                height={320 - i * 44}
                transform="rotate(45 200 200)"
              />
            ))}
          </g>
        </svg>

        <div className="relative mx-auto max-w-5xl">
          <p className="font-sans text-sm font-medium tracking-wide text-[#E9C7DE]">{c.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
            {c.heading}
            {c.headingAccent && (
              <>
                <br />
                {c.headingAccent}
              </>
            )}
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-white/80">{c.description}</p>
        </div>
      </section>

      {albums.length > 0 && (
        <section className="px-6 pt-16 sm:px-10 sm:pt-20 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 font-serif text-3xl text-[#19151C] sm:text-4xl">Albums</h2>
            <AlbumGrid albums={albums} />
            <h2 className="mb-2 mt-20 font-serif text-3xl text-[#19151C] sm:text-4xl">Around campus</h2>
          </div>
        </section>
      )}

      <CampusGallery
        photos={photos.map((p) => ({ id: p.id, category: p.category, title: p.title, caption: p.caption, src: p.url }))}
      />
    </main>
  );
}
