import Link from "next/link";
import { desc, eq, gte, sql } from "drizzle-orm";
import { ArrowRight, ImageOff } from "lucide-react";
import { requirePageArea } from "@/lib/auth/page";
import { canAccess } from "@/lib/auth/session";
import { requireDb, schema } from "@/lib/db";
import { loadAllSectionsFresh } from "@/lib/content/server";
import { collectImages } from "@/lib/content/images";
import { ENQUIRY_STATUSES, STATUS_LABELS, TYPE_LABELS } from "@/lib/enquiries";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { timeAgo } from "@/lib/format";

export default async function DashboardPage() {
  const session = await requirePageArea("dashboard");
  const db = requireDb();
  const seesEnquiries = canAccess(session.role, "enquiries");
  const seesContent = canAccess(session.role, "content");

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [statusCounts, [{ thisMonth }], recent, activity, sections] = await Promise.all([
    seesEnquiries
      ? db.select({ status: schema.enquiries.status, count: sql<number>`count(*)::int` }).from(schema.enquiries).groupBy(schema.enquiries.status)
      : Promise.resolve([]),
    seesEnquiries
      ? db.select({ thisMonth: sql<number>`count(*)::int` }).from(schema.enquiries).where(gte(schema.enquiries.createdAt, monthStart))
      : Promise.resolve([{ thisMonth: 0 }]),
    seesEnquiries ? db.select().from(schema.enquiries).orderBy(desc(schema.enquiries.createdAt)).limit(6) : Promise.resolve([]),
    db
      .select({ a: schema.activityLog, who: schema.users.name })
      .from(schema.activityLog)
      .leftJoin(schema.users, eq(schema.activityLog.userId, schema.users.id))
      .orderBy(desc(schema.activityLog.createdAt))
      .limit(8),
    seesContent ? loadAllSectionsFresh() : Promise.resolve({}),
  ]);

  const counts = Object.fromEntries(statusCounts.map((r) => [r.status, r.count])) as Record<string, number>;
  const placeholders = seesContent ? collectImages(sections).filter((i) => i.placeholder) : [];

  return (
    <>
      <PageHeader title={`Hello, ${session.name.split(" ")[0]}`} description="Here's what's happening on the website." />

      {seesEnquiries && (
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="New enquiries" value={counts.new ?? 0} href="/admin/enquiries?status=new" highlight />
            <Stat label="Received this month" value={thisMonth} href="/admin/enquiries" />
            <Stat label="Visits booked" value={counts.visit_booked ?? 0} href="/admin/enquiries?status=visit_booked" />
            <Stat label="Enrolled" value={counts.enrolled ?? 0} href="/admin/enquiries?status=enrolled" />
          </div>

          <Card className="mt-3 p-5">
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-[#19151C]/50">Admissions pipeline</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ENQUIRY_STATUSES.map((s) => (
                <Link
                  key={s}
                  href={`/admin/enquiries?status=${s}`}
                  className="rounded-lg border border-[#19151C]/10 px-3 py-2 font-sans text-sm hover:border-[#6C0798]/40"
                >
                  <span className="text-[#19151C]/60">{STATUS_LABELS[s]}</span>{" "}
                  <span className="font-semibold">{counts[s] ?? 0}</span>
                </Link>
              ))}
            </div>
          </Card>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {seesEnquiries && (
          <Card>
            <div className="flex items-center justify-between border-b border-[#19151C]/10 px-5 py-4">
              <h2 className="font-serif text-xl">Latest enquiries</h2>
              <Link href="/admin/enquiries" className="inline-flex items-center gap-1 font-sans text-sm text-[#6C0798]">
                All <ArrowRight size={14} />
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="px-5 py-8 font-sans text-sm text-[#19151C]/55">
                No enquiries yet. They&apos;ll appear here as soon as someone uses a form on the website.
              </p>
            ) : (
              <ul className="divide-y divide-[#19151C]/10">
                {recent.map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAF8F9]">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-sm font-medium">{e.name}</p>
                        <p className="truncate font-sans text-xs text-[#19151C]/50">
                          {TYPE_LABELS[e.type]}
                          {e.gradeOfInterest && ` · ${e.gradeOfInterest}`}
                        </p>
                      </div>
                      <Badge tone={e.status === "new" ? "red" : "neutral"}>{STATUS_LABELS[e.status]}</Badge>
                      <span className="hidden w-20 text-right font-sans text-xs text-[#19151C]/45 sm:block">{timeAgo(e.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        <div className="space-y-6">
          {seesContent && (
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${placeholders.length ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                  <ImageOff size={18} />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-xl">
                    {placeholders.length ? `${placeholders.length} stock photos left` : "All photos are your own"}
                  </h2>
                  <p className="mt-1 font-sans text-sm leading-6 text-[#19151C]/60">
                    {placeholders.length
                      ? "Stock and missing images make the site feel generic. Replace them with real photos of Agape."
                      : "Every image on the site is a real school photo."}
                  </p>
                  {placeholders.length > 0 && (
                    <Link href="/admin/media?filter=placeholder" className="mt-3 inline-flex items-center gap-1 font-sans text-sm font-medium text-[#6C0798]">
                      Replace them <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )}

          <Card>
            <h2 className="border-b border-[#19151C]/10 px-5 py-4 font-serif text-xl">Recent activity</h2>
            {activity.length === 0 ? (
              <p className="px-5 py-6 font-sans text-sm text-[#19151C]/55">Nothing yet.</p>
            ) : (
              <ul className="divide-y divide-[#19151C]/10">
                {activity.map(({ a, who }) => (
                  <li key={a.id} className="px-5 py-3">
                    <p className="font-sans text-sm">
                      <span className="font-medium">{who ?? "Someone"}</span>{" "}
                      <span className="text-[#19151C]/65">{a.summary ?? `${a.action} ${a.entity}`}</span>
                    </p>
                    <p className="mt-0.5 font-sans text-xs text-[#19151C]/45">{timeAgo(a.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, href, highlight }: { label: string; value: number; href: string; highlight?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-xl border p-4 transition hover:-translate-y-0.5 ${
        highlight && value > 0 ? "border-[#E12F41]/30 bg-[#E12F41]/5" : "border-[#19151C]/10 bg-white"
      }`}
    >
      <p className="font-sans text-xs text-[#19151C]/55">{label}</p>
      <p className={`mt-1 font-serif text-3xl ${highlight && value > 0 ? "text-[#C4202F]" : ""}`}>{value}</p>
    </Link>
  );
}
