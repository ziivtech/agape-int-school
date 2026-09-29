import { NextRequest, NextResponse } from "next/server";
import { requireDb, schema } from "../../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../../lib/auth/server";
import { getSectionDef, isSectionKey } from "../../../../../lib/content/registry";
import { mergeSection } from "../../../../../lib/content/fields";
import { CONTENT_TAG, loadSectionFresh, refreshContent } from "../../../../../lib/content/server";

/**
 * Replace one image inside a section, addressed by a path such as
 * "photo" or "stages.2.photo". Used by the Media library.
 */
export const PATCH = handle(async (req: NextRequest) => {
  const session = await requireArea("media");
  const { key, path, url, alt } = await req.json();
  if (typeof key !== "string" || !isSectionKey(key)) throw new HttpError(400, "Unknown section.");
  if (typeof path !== "string" || !path) throw new HttpError(400, "Missing image path.");
  if (typeof url !== "string" || !url) throw new HttpError(400, "Missing image URL.");

  const def = getSectionDef(key);
  const current = structuredClone((await loadSectionFresh(key)).data) as Record<string, unknown>;

  const parts = path.split(".");
  let node: Record<string, unknown> | unknown[] = current;
  for (const part of parts.slice(0, -1)) {
    const next = (node as Record<string, unknown>)[part];
    if (!next || typeof next !== "object") throw new HttpError(400, "That image no longer exists.");
    node = next as Record<string, unknown>;
  }
  (node as Record<string, unknown>)[parts[parts.length - 1]] = { url, alt: typeof alt === "string" ? alt : "" };

  const clean = mergeSection(def, current);
  await requireDb()
    .insert(schema.contentSections)
    .values({ key, data: clean, updatedBy: session.userId, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.contentSections.key,
      set: { data: clean, updatedBy: session.userId, updatedAt: new Date() },
    });

  refreshContent(CONTENT_TAG);
  await logActivity(session.userId, "update", "image", `${key}:${path}`, `Replaced an image in ${def.page} › ${def.label}`);
  return NextResponse.json({ success: true });
});
