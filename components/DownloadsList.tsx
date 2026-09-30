"use client";

import { useMemo, useState } from "react";
import { Download, FileImage, FileSpreadsheet, FileText, FileArchive, Presentation, Search } from "lucide-react";
import { DownloadItem, fileTypeLabel, formatFileSize } from "../lib/downloads";

function FileIcon({ type }: { type: string }) {
  const label = fileTypeLabel(type);
  const Icon =
    label === "Excel" ? FileSpreadsheet : label === "PowerPoint" ? Presentation : label === "Image" ? FileImage : label === "ZIP" ? FileArchive : FileText;
  const tone =
    label === "PDF"
      ? "bg-[#E12F41]/10 text-[#C4202F]"
      : label === "Word"
        ? "bg-blue-50 text-blue-700"
        : label === "Excel"
          ? "bg-emerald-50 text-emerald-700"
          : label === "PowerPoint"
            ? "bg-orange-50 text-orange-700"
            : "bg-[#6C0798]/10 text-[#6C0798]";
  return (
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
      <Icon size={20} strokeWidth={1.7} />
    </span>
  );
}

export default function DownloadsList({ items }: { items: DownloadItem[] }) {
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const [category, setCategory] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const shown = items.filter(
    (i) =>
      (!category || i.category === category) &&
      (!q || `${i.title} ${i.description} ${i.category}`.toLowerCase().includes(q.toLowerCase()))
  );
  const groups = categories
    .map((cat) => ({ cat, files: shown.filter((i) => i.category === cat) }))
    .filter((g) => g.files.length > 0);

  return (
    <>
      {items.length > 5 && (
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[null, ...categories].map((cat) => (
              <button
                key={cat ?? "all"}
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                  category === cat
                    ? "border-[#6C0798] bg-[#6C0798] text-white"
                    : "border-[#19151C]/15 bg-white text-[#19151C]/70 hover:border-[#6C0798]/40"
                }`}
              >
                {cat ?? "All"}
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#19151C]/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search documents"
              className="h-11 w-full rounded-full border border-[#19151C]/15 bg-white pl-10 pr-4 font-sans text-sm outline-none focus:border-[#6C0798]/50"
            />
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <p className="font-sans text-sm text-[#19151C]/55">No documents match your search.</p>
      ) : (
        <div className="space-y-12">
          {groups.map(({ cat, files }) => (
            <section key={cat}>
              <h2 className="font-serif text-2xl text-[#19151C] sm:text-3xl">{cat}</h2>
              <ul className="mt-5 divide-y divide-[#19151C]/10 overflow-hidden rounded-2xl border border-[#19151C]/10 bg-white">
                {files.map((f) => {
                  const meta = [
                    fileTypeLabel(f.fileType),
                    formatFileSize(f.fileSize),
                    `Updated ${new Date(f.updatedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`,
                  ]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li key={f.id}>
                      <a
                        href={`/downloads/file/${f.id}`}
                        target="_blank"
                        rel="noopener"
                        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FAF8F9] sm:px-6 sm:py-5"
                      >
                        <FileIcon type={f.fileType} />
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-[15px] font-semibold text-[#19151C] group-hover:text-[#6C0798]">{f.title}</p>
                          {f.description && <p className="mt-0.5 font-sans text-sm leading-5 text-[#19151C]/60">{f.description}</p>}
                          <p className="mt-1 font-sans text-xs text-[#19151C]/45">{meta}</p>
                        </div>
                        <span className="hidden shrink-0 items-center gap-2 rounded-full border border-[#19151C]/15 px-4 py-2 font-sans text-sm font-medium text-[#19151C]/75 transition-colors group-hover:border-[#6C0798] group-hover:bg-[#6C0798] group-hover:text-white sm:inline-flex">
                          <Download size={15} /> Download
                        </span>
                        <Download size={18} className="shrink-0 text-[#6C0798] sm:hidden" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
