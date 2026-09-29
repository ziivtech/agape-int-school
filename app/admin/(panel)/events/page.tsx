import { asc, desc, sql } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import { EVENT_CATEGORIES } from "@/lib/content/sections/more";
import EventsManager from "@/components/admin/EventsManager";

export default async function EventsAdminPage() {
  await requirePageArea("events");
  const rows = await requireDb()
    .select()
    .from(schema.events)
    // Undated first, then soonest; past events sink to the bottom via the client split.
    .orderBy(sql`${schema.events.startsOn} is not null`, asc(schema.events.startsOn), desc(schema.events.createdAt));

  return (
    <EventsManager
      categories={EVENT_CATEGORIES}
      initial={rows.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        startsOn: e.startsOn ?? "",
        endsOn: e.endsOn ?? "",
        dateLabel: e.dateLabel ?? "",
        timeLabel: e.timeLabel ?? "",
        location: e.location ?? "",
        description: e.description,
        imageUrl: e.imageUrl ?? "",
        status: e.status,
      }))}
    />
  );
}
