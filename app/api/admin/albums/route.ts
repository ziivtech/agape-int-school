import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { GALLERY_TAG, EVENTS_TAG, NEWS_TAG, refreshContent } from "../../../../lib/content/server";
import { linkSchema } from "../../../../lib/enquiries";
import { slugify } from "../../../../lib/slug";

const albumSchema = z.object({
  title: z.string().trim().min(2, "Give the album a title.").max(160),
  description: z.string().trim().max(1000).default(""),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullish()
    .or(z.literal("").transform(() => null)),
  coverUrl: linkSchema.nullish().transform((v) => v || null),
  eventId: z.string().uuid().nullish().or(z.literal("").transform(() => null)),
  newsPostId: z.string().uuid().nullish().or(z.literal("").transform(() => null)),
  published: z.boolean().default(true),
});

async function uniqueSlug(base: string, excludeId?: string) {
  const db = requireDb();
  let slug = base || "album";
  for (let i = 2; ; i++) {
    const clash = await db
      .select({ id: schema.albums.id })
      .from(schema.albums)
      .where(excludeId ? and(eq(schema.albums.slug, slug), ne(schema.albums.id, excludeId)) : eq(schema.albums.slug, slug));
    if (clash.length === 0) return slug;
    slug = `${base}-${i}`;
  }
}

// Albums show on the gallery, event and news pages, so refresh all three.
function refresh() {
  refreshContent(GALLERY_TAG);
  refreshContent(EVENTS_TAG);
  refreshContent(NEWS_TAG);
}

export const POST = handle(async (req: NextRequest) => {
  const session = await requireArea("media");
  const parsed = albumSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the album.");
  const d = parsed.data;
  const slug = await uniqueSlug(slugify(`${d.title}${d.date && !/\d{4}/.test(d.title) ? `-${d.date.slice(0, 4)}` : ""}`));
  const [album] = await requireDb().insert(schema.albums).values({ ...d, slug }).returning();
  refresh();
  await logActivity(session.userId, "create", "album", album.id, `Created album “${album.title}”`);
  return NextResponse.json({ success: true, album });
});

export const PUT = handle(async (req: NextRequest) => {
  const session = await requireArea("media");
  const body = await req.json();
  if (typeof body.id !== "string") throw new HttpError(400, "Missing album id.");
  const parsed = albumSchema.safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the album.");

  const [album] = await requireDb()
    .update(schema.albums)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.albums.id, body.id))
    .returning();
  if (!album) throw new HttpError(404, "Album not found.");
  refresh();
  await logActivity(session.userId, "update", "album", album.id, `Edited album “${album.title}”`);
  return NextResponse.json({ success: true, album });
});

export const DELETE = handle(async (req: NextRequest) => {
  const session = await requireArea("media");
  const id = new URL(req.url).searchParams.get("id");
  if (!id) throw new HttpError(400, "Missing album id.");
  // Photos in the album are removed with it (ON DELETE CASCADE).
  const [album] = await requireDb().delete(schema.albums).where(eq(schema.albums.id, id)).returning();
  refresh();
  await logActivity(session.userId, "delete", "album", id, album ? `Deleted album “${album.title}”` : "Deleted an album");
  return NextResponse.json({ success: true });
});
