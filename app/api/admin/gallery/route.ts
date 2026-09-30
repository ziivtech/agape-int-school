import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { GALLERY_TAG, refreshContent } from "../../../../lib/content/server";
import { linkSchema } from "../../../../lib/enquiries";

const photoSchema = z.object({
  category: z.string().trim().min(1).max(60),
  title: z.string().trim().min(1).max(160),
  caption: z.string().trim().max(500).default(""),
  url: linkSchema.refine((v) => v.length > 0, "Missing photo."),
  publicId: z.string().max(300).nullish(),
  sortOrder: z.number().int().default(0),
  albumId: z.string().uuid().nullish(),
});

export const POST = handle(async (req: NextRequest) => {
  const session = await requireArea("media");
  const parsed = photoSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid photo.");

  const [photo] = await requireDb().insert(schema.galleryPhotos).values(parsed.data).returning();
  refreshContent(GALLERY_TAG);
  await logActivity(session.userId, "create", "gallery", photo.id, `Added “${photo.title}” to the gallery`);
  return NextResponse.json({ success: true, photo });
});

export const PATCH = handle(async (req: NextRequest) => {
  const session = await requireArea("media");
  const body = await req.json();
  if (typeof body.id !== "string") throw new HttpError(400, "Missing photo id.");
  const parsed = photoSchema.partial().safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid photo.");

  const [photo] = await requireDb()
    .update(schema.galleryPhotos)
    .set(parsed.data)
    .where(eq(schema.galleryPhotos.id, body.id))
    .returning();
  if (!photo) throw new HttpError(404, "Photo not found.");
  refreshContent(GALLERY_TAG);
  await logActivity(session.userId, "update", "gallery", photo.id, `Edited gallery photo “${photo.title}”`);
  return NextResponse.json({ success: true, photo });
});

export const DELETE = handle(async (req: NextRequest) => {
  const session = await requireArea("media");
  const id = new URL(req.url).searchParams.get("id");
  if (!id) throw new HttpError(400, "Missing photo id.");
  await requireDb().delete(schema.galleryPhotos).where(eq(schema.galleryPhotos.id, id));
  refreshContent(GALLERY_TAG);
  await logActivity(session.userId, "delete", "gallery", id, "Removed a gallery photo");
  return NextResponse.json({ success: true });
});
