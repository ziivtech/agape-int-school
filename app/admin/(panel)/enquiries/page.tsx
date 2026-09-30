import Link from "next/link";
import { and, desc, eq, ilike, or, sql, SQL } from "drizzle-orm";
import { Download, Search } from "lucide-react";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import type { EnquiryStatus, EnquiryType } from "@/lib/db/schema";
import { ENQUIRY_STATUSES, ENQUIRY_TYPES, STATUS_LABELS, TYPE_LABELS } from "@/lib/enquiries";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { timeAgo } from "@/lib/format";

const PAGE_SIZE = 50;

type Search = { status?: string; type?: string; q?: string; mine?: string; page?: string };

const STATUS_TONE: Record<EnquiryStatus, "red" | "amber" | "purple" | "green" | "neutral"> = {
  new: "red",
  contacted: "amber",
  visit_booked: "purple",
  applied: "purple",
  enrolled: "green",
  closed: "neutral",
};

export default async function EnquiriesPage({ searchParams }: { searchParams: Search }) {
  const session = await requirePageArea("enquiries");
  const db = requireDb();

  const status = ENQUIRY_STATUSES.includes(searchParams.status as EnquiryStatus) ? (searchParams.status as EnquiryStatus) : undefined;
  const type = ENQUIRY_TYPES.includes(searchParams.type as EnquiryType) ? (searchParams.type as EnquiryType) : undefined;
  const q = searchParams.q?.trim().slice(0, 100);
  const mine = searchParams.mine === "1";
  const page = Math.max(1, Number(searchParams.page) || 1);

  const conditions: SQL[] = [];
  if (status) conditions.push(eq(schema.enquiries.status, status));
  if (type) conditions.push(eq(schema.enquiries.type, type));
  if (mine) conditions.push(eq(schema.enquiries.assignedTo, session.userId));
  if (q) {
    const like = `%${q.replace(/[%_]/g, "\\$&")}%`;
    conditions.push(
      or(
        ilike(schema.enquiries.name, like),
        ilike(schema.enquiries.email, like),
        ilike(schema.enquiries.phone, like),
        ilike(schema.enquiries.studentName, like),
        ilike(schema.enquiries.message, like)
      )!
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ total }], statusCounts] = await Promise.all([
    db
      .select({ e: schema.enquiries, owner: schema.users.name })
      .from(schema.enquiries)
      .leftJoin(schema.users, eq(schema.enquiries.assignedTo, schema.users.id))
      .where(where)
      .orderBy(desc(schema.enquiries.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: sql<number>`count(*)::int` }).from(schema.enquiries).where(where),
    db.select({ status: schema.enquiries.status, count: sql<number>`count(*)::int` }).from(schema.enquiries).groupBy(schema.enquiries.status),
  ]);
  const counts = Object.fromEntries(statusCounts.map((r) => [r.status, r.count])) as Record<string, number>;

  const link = (patch: Partial<Search>) => {
    const params = new URLSearchParams();
    const merged = { status, type, q, mine: mine ? "1" : undefined, ...patch };
    Object.entries(merged).forEach(([k, v]) => v && params.set(k, v));
    const s = params.toString();
    return `/admin/enquiries${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Every message sent through the website's contact, admissions, visit and alumni forms. Move families through the pipeline as you speak to them."
        actions={
          <a
            href="/api/admin/enquiries/export"
            className="inline-flex items-center gap-2 rounded-lg border border-[#19151C]/15 bg-white px-4 py-2.5 font-sans text-sm font-medium hover:border-[#6C0798]/40 hover:text-[#6C0798]"
          >
            <Download size={15} /> Export CSV
          </a>
        }
      />

      {/* Pipeline tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
        <Link
          href={link({ status: undefined, page: undefined })}
          className={`shrink-0 rounded-lg px-3.5 py-2 font-sans text-sm ${!status ? "bg-[#19151C] text-white" : "bg-white text-[#19151C]/65 hover:text-[#19151C]"}`}
        >
          All
        </Link>
        {ENQUIRY_STATUSES.map((s) => (
          <Link
            key={s}
            href={link({ status: s, page: undefined })}
            className={`shrink-0 rounded-lg px-3.5 py-2 font-sans text-sm ${
              status === s ? "bg-[#19151C] text-white" : "bg-white text-[#19151C]/65 hover:text-[#19151C]"
            }`}
          >
            {STATUS_LABELS[s]} <span className="ml-1 opacity-60">{counts[s] ?? 0}</span>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <form className="mb-5 flex flex-col gap-2 sm:flex-row" action="/admin/enquiries">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#19151C]/40" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, phone, child or message"
            className="w-full rounded-lg border border-[#19151C]/15 bg-white py-2.5 pl-9 pr-3 font-sans text-sm outline-none focus:border-[#6C0798]"
          />
        </div>
        <select name="type" defaultValue={type ?? ""} className="rounded-lg border border-[#19151C]/15 bg-white px-3 py-2.5 font-sans text-sm">
          <option value="">All types</option>
          {ENQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 rounded-lg border border-[#19151C]/15 bg-white px-3 py-2.5 font-sans text-sm">
          <input type="checkbox" name="mine" value="1" defaultChecked={mine} className="accent-[#6C0798]" /> Assigned to me
        </label>
        <button className="rounded-lg bg-[#6C0798] px-4 py-2.5 font-sans text-sm font-medium text-white hover:bg-[#4B075F]">Filter</button>
      </form>

      <Card>
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center font-sans text-sm text-[#19151C]/55">
            {conditions.length ? "No enquiries match these filters." : "No enquiries yet. Messages from the website's forms will appear here."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] font-sans text-sm">
              <thead className="border-b border-[#19151C]/10 text-left text-xs text-[#19151C]/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Child / level</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 text-right font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#19151C]/10">
                {rows.map(({ e, owner }) => (
                  <tr key={e.id} className={`relative hover:bg-[#FAF8F9] ${e.status === "new" ? "font-medium" : ""}`}>
                    <td className="px-5 py-3">
                      <Link href={`/admin/enquiries/${e.id}`} className="after:absolute after:inset-0">
                        {e.name}
                      </Link>
                      <p className="text-xs font-normal text-[#19151C]/50">{e.email}</p>
                    </td>
                    <td className="px-3 py-3 font-normal text-[#19151C]/70">{e.subject ?? TYPE_LABELS[e.type]}</td>
                    <td className="px-3 py-3 font-normal text-[#19151C]/70">
                      {[e.studentName, e.gradeOfInterest].filter(Boolean).join(" · ") || "Not given"}
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={STATUS_TONE[e.status]}>{STATUS_LABELS[e.status]}</Badge>
                    </td>
                    <td className="px-3 py-3 font-normal text-[#19151C]/60">{owner ?? "Unassigned"}</td>
                    <td className="px-5 py-3 text-right font-normal text-[#19151C]/50">{timeAgo(e.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {total > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between font-sans text-sm text-[#19151C]/60">
          <span>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={link({ page: String(page - 1) })} className="rounded-lg border border-[#19151C]/15 bg-white px-3 py-1.5">
                Previous
              </Link>
            )}
            {page * PAGE_SIZE < total && (
              <Link href={link({ page: String(page + 1) })} className="rounded-lg border border-[#19151C]/15 bg-white px-3 py-1.5">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
