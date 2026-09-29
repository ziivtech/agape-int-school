import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireDb, schema } from "../../../../lib/db";
import { handle, HttpError, logActivity, requireArea } from "../../../../lib/auth/server";
import { EVENTS_TAG, refreshContent } from "../../../../lib/content/server";
import { linkSchema } from "../../../../lib/enquiries";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .nullish()
  .or(z.literal("").transform(() => null));

const eventSchema = z
  .object({
    title: z.string().trim().min(2, "Give the event a title.").max(200),
    category: z.string().trim().min(1).max(60),
    startsOn: isoDate,
    endsOn: isoDate,
    dateLabel: z.string().trim().max(80).nullish(),
    timeLabel: z.string().trim().max(80).nullish(),
    location: z.string().trim().max(160).nullish(),
    description: z.string().max(5000).default(""),
    imageUrl: linkSchema.nullish().transform((v) => v || null),
    status: z.enum(["draft", "published"]).default("published"),
  })
  .refine((e) => !e.startsOn || !e.endsOn || e.endsOn >= e.startsOn, {
    message: "The end date can't be before the start date.",
  });

export const POST = handle(async (req: NextRequest) => {
  const session = await requireArea("events");
  const parsed = eventSchema.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the event.");

  const [event] = await requireDb().insert(schema.events).values(parsed.data).returning();
  refreshContent(EVENTS_TAG);
  await logActivity(session.userId, "create", "event", event.id, `Added event “${event.title}”`);
  return NextResponse.json({ success: true, event });
});

export const PUT = handle(async (req: NextRequest) => {
  const session = await requireArea("events");
  const body = await req.json();
  if (typeof body.id !== "string") throw new HttpError(400, "Missing event id.");
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? "Please check the event.");

  const [event] = await requireDb()
    .update(schema.events)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.events.id, body.id))
    .returning();
  if (!event) throw new HttpError(404, "Event not found.");
  refreshContent(EVENTS_TAG);
  await logActivity(session.userId, "update", "event", event.id, `Edited event “${event.title}”`);
  return NextResponse.json({ success: true, event });
});

export const DELETE = handle(async (req: NextRequest) => {
  const session = await requireArea("events");
  const id = new URL(req.url).searchParams.get("id");
  if (!id) throw new HttpError(400, "Missing event id.");
  const [event] = await requireDb().delete(schema.events).where(eq(schema.events.id, id)).returning();
  refreshContent(EVENTS_TAG);
  await logActivity(session.userId, "delete", "event", id, event ? `Deleted event “${event.title}”` : "Deleted an event");
  return NextResponse.json({ success: true });
});
