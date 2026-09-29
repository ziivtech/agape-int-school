import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireDb, schema } from "../../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../../lib/auth/server";
import { ENQUIRY_STATUSES, STATUS_LABELS } from "../../../../../lib/enquiries";

type Ctx = { params: { id: string } };

const patchSchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  assignedTo: z.string().uuid().nullable().optional(),
});

/** Change status or owner. Status changes are recorded on the timeline. */
export const PATCH = handle(async (req: NextRequest, { params }: Ctx) => {
  const session = await requireArea("enquiries");
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, "Invalid update.");

  const db = requireDb();
  const [existing] = await db.select().from(schema.enquiries).where(eq(schema.enquiries.id, params.id));
  if (!existing) throw new HttpError(404, "Enquiry not found.");

  const [enquiry] = await db
    .update(schema.enquiries)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.enquiries.id, params.id))
    .returning();

  if (parsed.data.status && parsed.data.status !== existing.status) {
    await db.insert(schema.enquiryNotes).values({
      enquiryId: params.id,
      authorId: session.userId,
      kind: "status",
      body: `${STATUS_LABELS[existing.status]} → ${STATUS_LABELS[parsed.data.status]}`,
    });
  }
  if (parsed.data.assignedTo !== undefined && parsed.data.assignedTo !== existing.assignedTo) {
    let who = "nobody";
    if (parsed.data.assignedTo) {
      const [u] = await db.select({ name: schema.users.name }).from(schema.users).where(eq(schema.users.id, parsed.data.assignedTo));
      who = u?.name ?? "a staff member";
    }
    await db.insert(schema.enquiryNotes).values({
      enquiryId: params.id,
      authorId: session.userId,
      kind: "status",
      body: `Assigned to ${who}`,
    });
  }

  await logActivity(session.userId, "update", "enquiry", params.id, `Updated enquiry from ${existing.name}`);
  return NextResponse.json({ success: true, enquiry });
});

/** Add a note to the timeline. */
export const POST = handle(async (req: NextRequest, { params }: Ctx) => {
  const session = await requireArea("enquiries");
  const { body } = await req.json();
  if (typeof body !== "string" || !body.trim()) throw new HttpError(400, "Write a note first.");

  const db = requireDb();
  const [note] = await db
    .insert(schema.enquiryNotes)
    .values({ enquiryId: params.id, authorId: session.userId, body: body.trim().slice(0, 5000) })
    .returning();
  await db.update(schema.enquiries).set({ updatedAt: new Date() }).where(eq(schema.enquiries.id, params.id));
  return NextResponse.json({ success: true, note: { ...note, authorName: session.name } });
});

export const DELETE = handle(async (_req: NextRequest, { params }: Ctx) => {
  const session = await requireArea("enquiries");
  if (session.role !== "admin") throw new HttpError(403, "Only admins can delete enquiries.");
  const [e] = await requireDb().delete(schema.enquiries).where(eq(schema.enquiries.id, params.id)).returning();
  await logActivity(session.userId, "delete", "enquiry", params.id, e ? `Deleted enquiry from ${e.name}` : "Deleted an enquiry");
  return NextResponse.json({ success: true });
});
