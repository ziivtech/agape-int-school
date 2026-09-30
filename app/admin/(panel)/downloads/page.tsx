import { asc, desc } from "drizzle-orm";
import { requirePageArea } from "@/lib/auth/page";
import { requireDb, schema } from "@/lib/db";
import { DOWNLOAD_CATEGORIES } from "@/lib/downloads";
import DownloadsManager from "@/components/admin/DownloadsManager";

export default async function DownloadsAdminPage() {
  await requirePageArea("downloads");
  const rows = await requireDb()
    .select()
    .from(schema.downloads)
    .orderBy(asc(schema.downloads.category), asc(schema.downloads.sortOrder), desc(schema.downloads.createdAt));

  return (
    <DownloadsManager
      categories={DOWNLOAD_CATEGORIES}
      initial={rows.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        category: d.category,
        fileUrl: d.fileUrl,
        fileName: d.fileName ?? "",
        fileType: d.fileType ?? "",
        fileSize: d.fileSize,
        publicId: d.publicId ?? "",
        published: d.published,
        sortOrder: d.sortOrder,
        downloadCount: d.downloadCount,
        updatedAt: d.updatedAt.toISOString(),
      }))}
    />
  );
}
