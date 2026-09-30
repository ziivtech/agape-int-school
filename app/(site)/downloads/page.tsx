import type { Metadata } from "next";
import Link from "next/link";
import GeoMark from "@/components/GeoMark";
import DownloadsList from "@/components/DownloadsList";
import { getPublishedDownloads, getSection } from "@/lib/content/server";
import { DOWNLOAD_CATEGORIES } from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Prospectus, fee schedules, term calendars, uniform lists and forms from Agape Academy International.",
};

export default async function DownloadsPage() {
  const [c, rows] = await Promise.all([getSection("downloads.page"), getPublishedDownloads()]);

  // Keep the admin's category order, with any custom categories after.
  const rank = (cat: string) => {
    const i = DOWNLOAD_CATEGORIES.indexOf(cat);
    return i === -1 ? DOWNLOAD_CATEGORIES.length : i;
  };
  const items = rows
    .map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      category: d.category,
      fileType: d.fileType ?? "",
      fileSize: d.fileSize,
      updatedAt: new Date(d.updatedAt).toISOString(),
    }))
    .sort((a, b) => rank(a.category) - rank(b.category));

  return (
    <main className="min-h-screen bg-[#FAF8F9]">
      <section className="relative overflow-hidden bg-[#4B075F] px-6 pb-16 pt-40 text-white sm:px-10 sm:pt-48 lg:px-16">
        <GeoMark className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px]" opacity={0.08} />
        <div className="relative mx-auto max-w-5xl">
          <p className="font-sans text-sm font-medium text-[#E9C7DE]">{c.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] sm:text-6xl">{c.heading}</h1>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/80">{c.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 sm:px-10 sm:py-20">
        {items.length === 0 ? (
          <p className="max-w-xl font-sans leading-relaxed text-[#19151C]/65">{c.emptyText}</p>
        ) : (
          <DownloadsList items={items} />
        )}

        {c.helpText && (
          <p className="mt-14 border-t border-[#19151C]/10 pt-6 font-sans text-sm text-[#19151C]/55">
            {c.helpText}{" "}
            <Link href="/contact" className="font-medium text-[#6C0798] underline underline-offset-2">
              Contact us
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
