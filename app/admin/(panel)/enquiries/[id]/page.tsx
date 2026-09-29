import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import { canAccess } from "@/lib/auth/session";
import EnquiryDetail from "@/components/admin/EnquiryDetail";

export default async function EnquiryPage({ params }: { params: { id: string } }) {
  const session = await requirePageArea("enquiries");
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) notFound();
  const db = requireDb();

  const [[enquiry], notes, staff] = await Promise.all([
    db.select().from(schema.enquiries).where(eq(schema.enquiries.id, params.id)),
    db
      .select({ n: schema.enquiryNotes, author: schema.users.name })
      .from(schema.enquiryNotes)
      .leftJoin(schema.users, eq(schema.enquiryNotes.authorId, schema.users.id))
      .where(eq(schema.enquiryNotes.enquiryId, params.id))
      .orderBy(asc(schema.enquiryNotes.createdAt)),
    db
      .select({ id: schema.users.id, name: schema.users.name, role: schema.users.role })
      .from(schema.users)
      .where(eq(schema.users.active, true))
      .orderBy(asc(schema.users.name)),
  ]);
  if (!enquiry) notFound();

  return (
    <EnquiryDetail
      canDelete={session.role === "admin"}
      staff={staff.filter((s) => canAccess(s.role, "enquiries"))}
      enquiry={{
        ...enquiry,
        createdAt: enquiry.createdAt.toISOString(),
        updatedAt: enquiry.updatedAt.toISOString(),
      }}
      notes={notes.map(({ n, author }) => ({
        id: n.id,
        body: n.body,
        kind: n.kind,
        authorName: author ?? "Someone",
        createdAt: n.createdAt.toISOString(),
      }))}
    />
  );
}
