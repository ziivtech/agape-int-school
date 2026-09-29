import { asc, desc } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import { loadAllSectionsFresh } from "@/lib/content/server";
import { collectImages } from "@/lib/content/images";
import { GALLERY_CATEGORIES } from "@/lib/content/sections/more";
import MediaLibrary from "@/components/admin/MediaLibrary";

export default async function MediaPage({ searchParams }: { searchParams: { filter?: string; tab?: string } }) {
  await requirePageArea("media");
  const [sections, photos] = await Promise.all([
    loadAllSectionsFresh(),
    requireDb().select().from(schema.galleryPhotos).orderBy(asc(schema.galleryPhotos.sortOrder), desc(schema.galleryPhotos.createdAt)),
  ]);

  return (
    <MediaLibrary
      images={collectImages(sections)}
      gallery={photos.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }))}
      categories={GALLERY_CATEGORIES}
      initialFilter={searchParams.filter === "placeholder" ? "placeholder" : "all"}
      initialTab={searchParams.tab === "gallery" ? "gallery" : "site"}
    />
  );
}
