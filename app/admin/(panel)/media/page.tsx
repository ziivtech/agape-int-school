import { asc, desc, eq, isNull, sql } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import { loadAllSectionsFresh } from "@/lib/content/server";
import { collectImages } from "@/lib/content/images";
import { GALLERY_CATEGORIES } from "@/lib/content/sections/more";
import MediaLibrary from "@/components/admin/MediaLibrary";

export default async function MediaPage({ searchParams }: { searchParams: { filter?: string; tab?: string } }) {
  await requirePageArea("media");
  const db = requireDb();
  const [sections, photos, albums] = await Promise.all([
    loadAllSectionsFresh(),
    db
      .select()
      .from(schema.galleryPhotos)
      .where(isNull(schema.galleryPhotos.albumId))
      .orderBy(asc(schema.galleryPhotos.sortOrder), desc(schema.galleryPhotos.createdAt)),
    db
      .select({
        a: schema.albums,
        photoCount: sql<number>`count(${schema.galleryPhotos.id})::int`,
        firstPhoto: sql<string | null>`(array_agg(${schema.galleryPhotos.url} order by ${schema.galleryPhotos.sortOrder}))[1]`,
      })
      .from(schema.albums)
      .leftJoin(schema.galleryPhotos, eq(schema.galleryPhotos.albumId, schema.albums.id))
      .groupBy(schema.albums.id)
      .orderBy(sql`${schema.albums.date} desc nulls last`, desc(schema.albums.createdAt)),
  ]);

  const tab = searchParams.tab === "gallery" || searchParams.tab === "albums" ? searchParams.tab : "site";

  return (
    <MediaLibrary
      images={collectImages(sections)}
      gallery={photos.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }))}
      albums={albums.map(({ a, photoCount, firstPhoto }) => ({
        id: a.id,
        title: a.title,
        date: a.date,
        coverUrl: a.coverUrl || firstPhoto || "",
        photoCount,
        published: a.published,
      }))}
      categories={GALLERY_CATEGORIES}
      initialFilter={searchParams.filter === "placeholder" ? "placeholder" : "all"}
      initialTab={tab}
    />
  );
}
