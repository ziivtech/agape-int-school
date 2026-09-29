import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireDb, schema } from "../../../lib/db";
import { alumniRegistrationSchema } from "../../../lib/alumni";
import { slugify } from "../../../lib/slug";
import { notifyNewAlumnus } from "../../../lib/notify";

// Public "join the alumni network" endpoint. Everything lands as "pending";
// nothing appears on the site until staff approve it.

const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 3;
}

export async function POST(req: NextRequest) {
  const parsed = alumniRegistrationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ success: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ success: false, error: "Too many sign-ups from this connection. Please try again later." }, { status: 429 });
  }

  try {
    const db = requireDb();
    const base = slugify(`${data.fullName}${data.classYear ? `-${data.classYear}` : ""}`) || "alumnus";
    let slug = base;
    for (let i = 2; (await db.select({ id: schema.alumni.id }).from(schema.alumni).where(eq(schema.alumni.slug, slug))).length; i++) {
      slug = `${base}-${i}`;
    }

    const [row] = await db
      .insert(schema.alumni)
      .values({ ...data, slug, status: "pending", featured: false })
      .returning();
    await notifyNewAlumnus(row);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save alumni sign-up", err);
    return NextResponse.json(
      { success: false, error: "We couldn't save your details just now. Please email the school instead." },
      { status: 500 }
    );
  }
}
