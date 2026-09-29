import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { NEWS_TAG, refreshContent } from "../../../../lib/content/server";
import { slugify } from "../../../../lib/slug";
import { linkSchema } from "../../../../lib/enquiries";

const postSchema = z.object({
  title: z.string().trim().min(3, "Give the story a title.").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "The web address can only use lowercase letters, numbers and hyphens.")
    .optional(),
  category: z.string().trim().min(1).max(60),
  excerpt: z.string().trim().max(400).default(""),
  body: z.string().max(50000).default(""),
  coverUrl: linkSchema.nullish(),
  coverAlt: z.string().max(300).nullish(),
  author: z.string().trim().max(120).nullish(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().nullish(),
});

async function uniqueSlug(base: string, excludeId?: string) {
  const db = requireDb();
  let slug = base || "story";
  for (let i = 2; ; i++) {
    const clash = await db
      .select({ id: schema.newsPosts.id })
      .from(schema.newsPosts)
      .where(excludeId ? and(eq(schema.newsPosts.slug, slug), ne(schema.newsPosts.id, excludeId)) : eq(schema.newsPosts.slug, slug));
    if (clash.length === 0) return slug;
    slug = `${base}-${i}`;
  }
}

function toValues(data: z.infer<typeof postSchema>, existingPublishedAt?: Date | null) {
  const publishedAt =
    data.status === "published"
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : existingPublishedAt ?? new Date()
      : data.publishedAt
        ? new Date(data.publishedAt)
        : null;
  return {
    title: data.title,
    category: data.category,
    excerpt: data.excerpt,
    body: data.body,
    coverUrl: data.coverUrl || null,
    coverAlt: data.coverAlt || null,
    author: data.author || null,
    featured: data.featured,
    status: data.status,
    publishedAt,
    updatedAt: new Date(),
  };
}

export const POST = handle(async (req: NextRequest) => {
  const session = await requireArea("news");
  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the story.");

  const slug = await uniqueSlug(parsed.data.slug || slugify(parsed.data.title));
  const [post] = await requireDb()
    .insert(schema.newsPosts)
    .values({ ...toValues(parsed.data), slug })
    .returning();

  refreshContent(NEWS_TAG);
  await logActivity(session.userId, "create", "news", post.id, `Created story “${post.title}”`);
  return NextResponse.json({ success: true, post });
});

export const PUT = handle(async (req: NextRequest) => {
  const session = await requireArea("news");
  const body = await req.json();
  if (typeof body.id !== "string") throw new HttpError(400, "Missing story id.");
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the story.");

  const db = requireDb();
  const [existing] = await db.select().from(schema.newsPosts).where(eq(schema.newsPosts.id, body.id));
  if (!existing) throw new HttpError(404, "Story not found.");

  const slug = await uniqueSlug(parsed.data.slug || existing.slug, existing.id);
  const [post] = await db
    .update(schema.newsPosts)
    .set({ ...toValues(parsed.data, existing.publishedAt), slug })
    .where(eq(schema.newsPosts.id, existing.id))
    .returning();

  refreshContent(NEWS_TAG);
  await logActivity(session.userId, "update", "news", post.id, `Edited story “${post.title}”`);
  return NextResponse.json({ success: true, post });
});

export const DELETE = handle(async (req: NextRequest) => {
  const session = await requireArea("news");
  const id = new URL(req.url).searchParams.get("id");
  if (!id) throw new HttpError(400, "Missing story id.");
  const [post] = await requireDb().delete(schema.newsPosts).where(eq(schema.newsPosts.id, id)).returning();
  refreshContent(NEWS_TAG);
  await logActivity(session.userId, "delete", "news", id, post ? `Deleted story “${post.title}”` : "Deleted a story");
  return NextResponse.json({ success: true });
});
