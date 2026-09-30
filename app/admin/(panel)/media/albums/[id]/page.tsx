import { notFound } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import AlbumEditor from "@/components/admin/AlbumEditor";

export default async function AlbumPage({ params }: { params: { id: string } }) {
  await requirePageArea("media");
  const db = requireDb();

  const [events, posts] = await Promise.all([
    db
      .select({ id: schema.events.id, title: schema.events.title, startsOn: schema.events.startsOn })
      .from(schema.events)
      .orderBy(desc(schema.events.startsOn))
      .limit(100),
    db
      .select({ id: schema.newsPosts.id, title: schema.newsPosts.title })
      .from(schema.newsPosts)
      .orderBy(desc(schema.newsPosts.updatedAt))
      .limit(100),
  ]);

  if (params.id === "new") return <AlbumEditor events={events} posts={posts} photos={[]} />;
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) notFound();

  const [[album], photos] = await Promise.all([
    db.select().from(schema.albums).where(eq(schema.albums.id, params.id)),
    db
      .select()
      .from(schema.galleryPhotos)
      .where(eq(schema.galleryPhotos.albumId, params.id))
      .orderBy(asc(schema.galleryPhotos.sortOrder), asc(schema.galleryPhotos.createdAt)),
  ]);
  if (!album) notFound();

  return (
    <AlbumEditor
      events={events}
      posts={posts}
      album={{
        id: album.id,
        slug: album.slug,
        title: album.title,
        description: album.description,
        date: album.date ?? "",
        coverUrl: album.coverUrl ?? "",
        eventId: album.eventId ?? "",
        newsPostId: album.newsPostId ?? "",
        published: album.published,
      }}
      photos={photos.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }))}
    />
  );
}
