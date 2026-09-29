import Link from "next/link";
import { and, asc, desc, eq, ilike, or, sql, SQL } from "drizzle-orm";
import { Plus, Search } from "lucide-react";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import type { AlumniStatus } from "@/lib/db/schema";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import AlumniAvatar from "@/components/alumni/AlumniAvatar";
import { timeAgo } from "@/lib/format";

const TABS: { id: AlumniStatus | "all"; label: string }[] = [
  { id: "pending", label: "Waiting for approval" },
  { id: "published", label: "On the website" },
  { id: "hidden", label: "Hidden" },
  { id: "all", label: "All" },
];

export default async function AlumniAdminPage({ searchParams }: { searchParams: { status?: string; q?: string } }) {
  await requirePageArea("alumni");
  const db = requireDb();

  const counts = Object.fromEntries(
    (await db.select({ status: schema.alumni.status, count: sql<number>`count(*)::int` }).from(schema.alumni).groupBy(schema.alumni.status)).map(
      (r) => [r.status, r.count]
    )
  ) as Record<string, number>;

  const status = (TABS.find((t) => t.id === searchParams.status)?.id ?? ((counts.pending ?? 0) > 0 ? "pending" : "all")) as AlumniStatus | "all";
  const q = searchParams.q?.trim().slice(0, 100);

  const conditions: SQL[] = [];
  if (status !== "all") conditions.push(eq(schema.alumni.status, status));
  if (q) {
    const like = `%${q.replace(/[%_]/g, "\\$&")}%`;
    conditions.push(
      or(
        ilike(schema.alumni.fullName, like),
        ilike(schema.alumni.email, like),
        ilike(schema.alumni.university, like),
        ilike(schema.alumni.occupation, like)
      )!
    );
  }

  const rows = await db
    .select()
    .from(schema.alumni)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(schema.alumni.featured), desc(schema.alumni.createdAt), asc(schema.alumni.fullName));

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader
        title="Alumni"
        description="Profiles for the alumni directory. Past students who sign up on the website wait here for approval — nothing appears publicly until you publish it, and only if they agreed to be shown."
        actions={
          <Link
            href="/admin/alumni/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#6C0798] px-4 py-2.5 font-sans text-sm font-medium text-white hover:bg-[#4B075F]"
          >
            <Plus size={15} /> Add alumnus
          </Link>
        }
      />

      <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const n = t.id === "all" ? total : counts[t.id] ?? 0;
          return (
            <Link
              key={t.id}
              href={`/admin/alumni?status=${t.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`shrink-0 rounded-lg px-3.5 py-2 font-sans text-sm ${
                status === t.id ? "bg-[#19151C] text-white" : "bg-white text-[#19151C]/65 hover:text-[#19151C]"
              }`}
            >
              {t.label}
              <span className={`ml-1.5 ${t.id === "pending" && n > 0 && status !== t.id ? "font-semibold text-[#C4202F]" : "opacity-60"}`}>{n}</span>
            </Link>
          );
        })}
      </div>

      <form action="/admin/alumni" className="mb-5">
        <input type="hidden" name="status" value={status} />
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#19151C]/40" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, university or job"
            className="w-full rounded-lg border border-[#19151C]/15 bg-white py-2.5 pl-9 pr-3 font-sans text-sm outline-none focus:border-[#6C0798]"
          />
        </div>
      </form>

      <Card>
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center font-sans text-sm text-[#19151C]/55">
            {total === 0
              ? "No alumni yet. Share the Alumni page with past students, or add profiles yourself."
              : status === "pending"
                ? "Nothing waiting for approval."
                : "No profiles match."}
          </p>
        ) : (
          <ul className="divide-y divide-[#19151C]/10">
            {rows.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/alumni/${a.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAF8F9]">
                  <AlumniAvatar name={a.fullName} photoUrl={a.photoUrl ?? ""} className="h-11 w-11 shrink-0 rounded-full" textClass="text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm font-medium">
                      {a.fullName}
                      {a.classYear && <span className="font-normal text-[#19151C]/50"> · Class of {a.classYear}</span>}
                    </p>
                    <p className="truncate font-sans text-xs text-[#19151C]/50">
                      {a.headline || a.occupation || a.university || a.email || "—"}
                    </p>
                  </div>
                  <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                    {a.featured && <Badge tone="purple">Featured</Badge>}
                    {a.openToMentor && <Badge>Mentor</Badge>}
                    {!a.consentPublic && <Badge tone="amber">Private</Badge>}
                    <Badge tone={a.status === "published" ? "green" : a.status === "pending" ? "red" : "neutral"}>
                      {a.status === "published" ? "Published" : a.status === "pending" ? "Waiting" : "Hidden"}
                    </Badge>
                  </div>
                  <span className="hidden w-20 text-right font-sans text-xs text-[#19151C]/45 md:block">{timeAgo(a.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
