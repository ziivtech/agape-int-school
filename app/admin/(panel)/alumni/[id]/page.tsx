import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import { INDUSTRIES } from "@/lib/alumni-shared";
import AlumniEditor from "@/components/admin/AlumniEditor";

export default async function EditAlumnusPage({ params }: { params: { id: string } }) {
  await requirePageArea("alumni");
  if (params.id === "new") return <AlumniEditor industries={INDUSTRIES} />;

  if (!/^[0-9a-f-]{36}$/i.test(params.id)) notFound();
  const [a] = await requireDb().select().from(schema.alumni).where(eq(schema.alumni.id, params.id));
  if (!a) notFound();

  return (
    <AlumniEditor
      industries={INDUSTRIES}
      initial={{
        id: a.id,
        slug: a.slug,
        fullName: a.fullName,
        classYear: a.classYear ? String(a.classYear) : "",
        photoUrl: a.photoUrl ?? "",
        headline: a.headline ?? "",
        occupation: a.occupation ?? "",
        industry: a.industry ?? "",
        university: a.university ?? "",
        fieldOfStudy: a.fieldOfStudy ?? "",
        city: a.city ?? "",
        country: a.country ?? "",
        story: a.story,
        quote: a.quote ?? "",
        linkedinUrl: a.linkedinUrl ?? "",
        email: a.email ?? "",
        phone: a.phone ?? "",
        consentPublic: a.consentPublic,
        openToMentor: a.openToMentor,
        featured: a.featured,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
      }}
    />
  );
}
