import Link from "next/link";
import { Images } from "lucide-react";
import type { AlbumCard } from "../lib/content/server";
import { formatNewsDate } from "../lib/content/public-types";

export default function AlbumGrid({ albums }: { albums: AlbumCard[] }) {
  return (
    <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {albums.map((a) => (
        <Link key={a.id} href={`/gallery/${a.slug}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#19151C]/5">
            {a.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.coverUrl} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            )}
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 font-sans text-xs text-white backdrop-blur-sm">
              <Images size={12} /> {a.photoCount}
            </span>
          </div>
          {a.date && <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#E12F41]">{formatNewsDate(a.date)}</p>}
          <h3 className="mt-1 font-serif text-2xl leading-tight text-[#19151C] transition-colors group-hover:text-[#6C0798]">{a.title}</h3>
          {a.description && <p className="mt-1 line-clamp-2 font-sans text-sm leading-6 text-[#19151C]/60">{a.description}</p>}
        </Link>
      ))}
    </div>
  );
}
