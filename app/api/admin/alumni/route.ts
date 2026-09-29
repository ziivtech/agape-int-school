import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { alumniAdminSchema } from "../../../../lib/alumni";
import { slugify } from "../../../../lib/slug";
import { ALUMNI_TAG, refreshContent } from "../../../../lib/content/server";

async function uniqueSlug(base: string, excludeId?: string) {
  const db = requireDb();
  let slug = base || "alumnus";
  for (let i = 2; ; i++) {
    const clash = await db
      .select({ id: schema.alumni.id })
      .from(schema.alumni)
      .where(excludeId ? and(eq(schema.alumni.slug, slug), ne(schema.alumni.id, excludeId)) : eq(schema.alumni.slug, slug));
    if (clash.length === 0) return slug;
    slug = `${base}-${i}`;
  }
}

export const POST = handle(async (req: NextRequest) => {
  const session = await requireArea("alumni");
  const parsed = alumniAdminSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the profile.");

  const { slug: wanted, ...data } = parsed.data;
  if (data.status === "published" && !data.consentPublic) {
    throw new HttpError(400, "Only publish people who agreed to appear on the website.");
  }
  const slug = await uniqueSlug(wanted || slugify(`${data.fullName}${data.classYear ? `-${data.classYear}` : ""}`));
  const [row] = await requireDb().insert(schema.alumni).values({ ...data, slug }).returning();

  refreshContent(ALUMNI_TAG);
  await logActivity(session.userId, "create", "alumni", row.id, `Added alumni profile for ${row.fullName}`);
  return NextResponse.json({ success: true, alumnus: row });
});

export const PUT = handle(async (req: NextRequest) => {
  const session = await requireArea("alumni");
  const body = await req.json();
  if (typeof body.id !== "string") throw new HttpError(400, "Missing profile id.");
  const parsed = alumniAdminSchema.safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the profile.");

  const db = requireDb();
  const [existing] = await db.select().from(schema.alumni).where(eq(schema.alumni.id, body.id));
  if (!existing) throw new HttpError(404, "Profile not found.");

  const { slug: wanted, ...data } = parsed.data;
  if (data.status === "published" && !data.consentPublic) {
    throw new HttpError(400, "This person hasn't agreed to appear on the website. Tick “Happy to appear publicly” only if they have told you so.");
  }
  const slug = await uniqueSlug(wanted || existing.slug, existing.id);
  const [row] = await db
    .update(schema.alumni)
    .set({ ...data, slug, updatedAt: new Date() })
    .where(eq(schema.alumni.id, existing.id))
    .returning();

  refreshContent(ALUMNI_TAG);
  const what = existing.status !== row.status ? ` (${existing.status} → ${row.status})` : "";
  await logActivity(session.userId, "update", "alumni", row.id, `Edited alumni profile for ${row.fullName}${what}`);
  return NextResponse.json({ success: true, alumnus: row });
});

export const DELETE = handle(async (req: NextRequest) => {
  const session = await requireArea("alumni");
  const id = new URL(req.url).searchParams.get("id");
  if (!id) throw new HttpError(400, "Missing profile id.");
  const [row] = await requireDb().delete(schema.alumni).where(eq(schema.alumni.id, id)).returning();
  refreshContent(ALUMNI_TAG);
  await logActivity(session.userId, "delete", "alumni", id, row ? `Deleted alumni profile for ${row.fullName}` : "Deleted an alumni profile");
  return NextResponse.json({ success: true });
});
