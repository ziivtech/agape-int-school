import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { DOWNLOADS_TAG, refreshContent } from "../../../../lib/content/server";
import { linkSchema } from "../../../../lib/enquiries";
import { fileTypeFrom } from "../../../../lib/downloads";

const downloadSchema = z.object({
  title: z.string().trim().min(2, "Give the document a title.").max(160),
  description: z.string().trim().max(400).default(""),
  category: z.string().trim().min(1).max(60),
  fileUrl: linkSchema.refine((v) => v.length > 0, "Upload a file or paste a link."),
  fileName: z.string().trim().max(200).nullish(),
  fileType: z.string().trim().max(10).nullish(),
  fileSize: z.number().int().nonnegative().nullish(),
  publicId: z.string().max(300).nullish(),
  published: z.boolean().default(true),
});

function values(d: z.infer<typeof downloadSchema>) {
  return {
    ...d,
    fileType: d.fileType || fileTypeFrom(d.fileName || d.fileUrl) || null,
    updatedAt: new Date(),
  };
}

export const POST = handle(async (req: NextRequest) => {
  const session = await requireArea("downloads");
  const parsed = downloadSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the document.");

  const db = requireDb();
  // New files go to the bottom of their category.
  const [{ next }] = await db
    .select({ next: sql<number>`coalesce(max(${schema.downloads.sortOrder}), -1)::int + 1` })
    .from(schema.downloads)
    .where(eq(schema.downloads.category, parsed.data.category));

  const [row] = await db.insert(schema.downloads).values({ ...values(parsed.data), sortOrder: next }).returning();
  refreshContent(DOWNLOADS_TAG);
  await logActivity(session.userId, "create", "download", row.id, `Added download “${row.title}”`);
  return NextResponse.json({ success: true, download: row });
});

export const PUT = handle(async (req: NextRequest) => {
  const session = await requireArea("downloads");
  const body = await req.json();
  if (typeof body.id !== "string") throw new HttpError(400, "Missing document id.");
  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the document.");

  const [row] = await requireDb()
    .update(schema.downloads)
    .set(values(parsed.data))
    .where(eq(schema.downloads.id, body.id))
    .returning();
  if (!row) throw new HttpError(404, "Document not found.");
  refreshContent(DOWNLOADS_TAG);
  await logActivity(session.userId, "update", "download", row.id, `Edited download “${row.title}”`);
  return NextResponse.json({ success: true, download: row });
});

/** Move a file up or down within its category. */
export const PATCH = handle(async (req: NextRequest) => {
  await requireArea("downloads");
  const { id, direction } = await req.json();
  if (typeof id !== "string" || (direction !== "up" && direction !== "down")) throw new HttpError(400, "Invalid move.");

  const db = requireDb();
  const [item] = await db.select().from(schema.downloads).where(eq(schema.downloads.id, id));
  if (!item) throw new HttpError(404, "Document not found.");

  const siblings = await db
    .select({ id: schema.downloads.id })
    .from(schema.downloads)
    .where(and(eq(schema.downloads.category, item.category)))
    .orderBy(schema.downloads.sortOrder, schema.downloads.createdAt);
  const order = siblings.map((s) => s.id);
  const from = order.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= order.length) return NextResponse.json({ success: true, order });

  [order[from], order[to]] = [order[to], order[from]];
  // Renumber the whole category so gaps and duplicates never build up.
  await Promise.all(order.map((rowId, i) => db.update(schema.downloads).set({ sortOrder: i }).where(eq(schema.downloads.id, rowId))));
  refreshContent(DOWNLOADS_TAG);
  return NextResponse.json({ success: true, order });
});

export const DELETE = handle(async (req: NextRequest) => {
  const session = await requireArea("downloads");
  const id = new URL(req.url).searchParams.get("id");
  if (!id) throw new HttpError(400, "Missing document id.");
  const [row] = await requireDb().delete(schema.downloads).where(eq(schema.downloads.id, id)).returning();
  refreshContent(DOWNLOADS_TAG);
  await logActivity(session.userId, "delete", "download", id, row ? `Deleted download “${row.title}”` : "Deleted a download");
  return NextResponse.json({ success: true });
});
