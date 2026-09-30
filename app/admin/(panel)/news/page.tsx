import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { timeAgo } from "@/lib/format";

export default async function NewsAdminPage() {
  await requirePageArea("news");
  const posts = await requireDb().select().from(schema.newsPosts).orderBy(desc(schema.newsPosts.updatedAt));

  return (
    <>
      <PageHeader
        title="News"
        description="Write stories for the News page. Published stories appear on the website straight away; the three newest also show on the homepage."
        actions={
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#6C0798] px-4 py-2.5 font-sans text-sm font-medium text-white hover:bg-[#4B075F]"
          >
            <Plus size={15} /> New story
          </Link>
        }
      />

      {posts.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="font-serif text-2xl">No stories yet</p>
          <p className="mt-2 font-sans text-sm text-[#19151C]/55">
            Sports day results, a trip, an achievement, a chapel reflection. Short, real stories work best.
          </p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-[#19151C]/10">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/news/${p.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAF8F9]">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-[#19151C]/5">
                    {p.coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm font-medium">{p.title}</p>
                    <p className="font-sans text-xs text-[#19151C]/50">
                      {p.category} · edited {timeAgo(p.updatedAt)}
                    </p>
                  </div>
                  {p.featured && <Badge tone="purple">Featured</Badge>}
                  <Badge tone={p.status === "published" ? "green" : "neutral"}>{p.status === "published" ? "Published" : "Draft"}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
