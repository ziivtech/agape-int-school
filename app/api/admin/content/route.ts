import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { getSectionDef, isSectionKey } from "../../../../lib/content/registry";
import { mergeSection } from "../../../../lib/content/fields";
import { CONTENT_TAG, refreshContent } from "../../../../lib/content/server";

/** Save a whole section. Anything that doesn't match the section's fields is dropped. */
export const PUT = handle(async (req: NextRequest) => {
  const session = await requireArea("content");
  const { key, data } = await req.json();
  if (typeof key !== "string" || !isSectionKey(key)) throw new HttpError(400, "Unknown section.");

  const def = getSectionDef(key);
  const clean = mergeSection(def, data);

  const db = requireDb();
  await db
    .insert(schema.contentSections)
    .values({ key, data: clean, updatedBy: session.userId, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.contentSections.key,
      set: { data: clean, updatedBy: session.userId, updatedAt: new Date() },
    });

  refreshContent(CONTENT_TAG);
  await logActivity(session.userId, "update", "content", key, `Edited ${def.page} › ${def.label}`);
  return NextResponse.json({ success: true, data: clean });
});

/** Reset a section back to the built-in wording. */
export const DELETE = handle(async (req: NextRequest) => {
  const session = await requireArea("content");
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!isSectionKey(key)) throw new HttpError(400, "Unknown section.");

  await requireDb().delete(schema.contentSections).where(eq(schema.contentSections.key, key));
  refreshContent(CONTENT_TAG);
  const def = getSectionDef(key);
  await logActivity(session.userId, "reset", "content", key, `Reset ${def.page} › ${def.label}`);
  return NextResponse.json({ success: true, data: def.defaults });
});
