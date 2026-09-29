import type { Metadata } from "next";
import { eq, sql } from "drizzle-orm";
import AdminShell from "@/components/admin/AdminShell";
import { requirePageArea } from "@/lib/auth/page";
import { ROLE_ACCESS } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Staff admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isDatabaseConfigured()) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 font-sans">
        <h1 className="font-serif text-3xl">Database not connected</h1>
        <p className="mt-4 text-sm leading-6 text-[#19151C]/70">
          Set <code>DATABASE_URL</code> to your Neon connection string (Vercel › Project › Settings › Environment Variables), run
          the database migration, then reload this page. See the README for the full steps.
        </p>
      </main>
    );
  }

  const session = await requirePageArea("dashboard");
  const db = getDb()!;
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.enquiries)
    .where(eq(schema.enquiries.status, "new"));

  return (
    <AdminShell
      user={{ name: session.name, email: session.email, role: session.role }}
      areas={ROLE_ACCESS[session.role]}
      newEnquiries={ROLE_ACCESS[session.role].includes("enquiries") ? count : 0}
    >
      {children}
    </AdminShell>
  );
}
