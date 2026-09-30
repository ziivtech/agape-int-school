import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Counts the download, then sends the visitor to the file itself. */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  if (!db || !/^[0-9a-f-]{36}$/i.test(params.id)) {
    return NextResponse.redirect(new URL("/downloads", req.url));
  }

  const [row] = await db
    .update(schema.downloads)
    .set({ downloadCount: sql`${schema.downloads.downloadCount} + 1` })
    .where(and(eq(schema.downloads.id, params.id), eq(schema.downloads.published, true)))
    .returning({ fileUrl: schema.downloads.fileUrl });

  if (!row) return NextResponse.redirect(new URL("/downloads", req.url));
  return NextResponse.redirect(new URL(row.fileUrl, req.url), 302);
}
