import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requirePageArea } from "@/lib/auth/page";
import { sectionsByPage } from "@/lib/content/registry";
import { loadAllSectionsFresh } from "@/lib/content/server";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { timeAgo } from "@/lib/format";

export default async function ContentIndexPage() {
  await requirePageArea("content");
  const stored = await loadAllSectionsFresh();
  const groups = sectionsByPage();

  return (
    <>
      <PageHeader
        title="Website content"
        description="Every piece of text and every photo on the website, organised by page. Changes go live as soon as you save."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {groups.map(({ page, sections }) => (
          <Card key={page}>
            <h2 className="border-b border-[#19151C]/10 px-5 py-4 font-serif text-xl">{page}</h2>
            <ul className="divide-y divide-[#19151C]/10">
              {sections.map(({ key, def }) => {
                const updatedAt = stored[key]?.updatedAt;
                return (
                  <li key={key}>
                    <Link href={`/admin/content/${key}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAF8F9]">
                      <span className="flex-1 font-sans text-sm">{def.label}</span>
                      {updatedAt ? (
                        <span className="font-sans text-xs text-[#19151C]/45">edited {timeAgo(updatedAt)}</span>
                      ) : (
                        <Badge>original</Badge>
                      )}
                      <ChevronRight size={16} className="text-[#19151C]/30" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
