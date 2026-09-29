import AlumniPageClient from "@/components/alumni/AlumniPageClient";
import { getPublishedAlumni, getUpcomingEvents } from "@/lib/content/server";
import { toAlumniCard } from "@/lib/alumni";
import { toEventItem } from "@/lib/content/public-types";

export default async function AlumniPage() {
  const [alumni, events] = await Promise.all([getPublishedAlumni(), getUpcomingEvents()]);

  return (
    <AlumniPageClient
      alumni={alumni.map(toAlumniCard)}
      events={events.filter((e) => e.category === "Alumni").map(toEventItem)}
    />
  );
}
