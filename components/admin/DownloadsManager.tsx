"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, EyeOff, FilePlus2, FileText, Link2, Loader2, Pencil, Trash2, UploadCloud } from "lucide-react";
import { Badge, Button, Card, PageHeader, api, inputClass, labelClass, useToast } from "./ui";
import { uploadDocumentToCloudinary } from "../../lib/cloudinary";
import { ACCEPTED_FILES, MAX_FILE_BYTES, fileTypeFrom, fileTypeLabel, formatFileSize } from "../../lib/downloads";
import { timeAgo } from "../../lib/format";

type Doc = {
  id?: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number | null;
  publicId: string;
  published: boolean;
  sortOrder?: number;
  downloadCount?: number;
  updatedAt?: string;
};

// "Term-1_Calendar 2026.pdf" -> "Term 1 calendar 2026"
function titleFromFile(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return base ? base[0].toUpperCase() + base.slice(1) : "";
}

export default function DownloadsManager({ initial, categories }: { initial: Doc[]; categories: string[] }) {
  const [docs, setDocs] = useState(initial);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [linkMode, setLinkMode] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const blank = (): Doc => ({
    title: "",
    description: "",
    category: categories[0],
    fileUrl: "",
    fileName: "",
    fileType: "",
    fileSize: null,
    publicId: "",
    published: true,
  });

  const pickFile = async (file: File) => {
    if (!editing) return;
    if (file.size > MAX_FILE_BYTES) {
      toast("error", `That file is ${formatFileSize(file.size)}. The limit is ${formatFileSize(MAX_FILE_BYTES)}. Try compressing the PDF first.`);
      return;
    }
    setUploading(true);
    try {
      const res = await uploadDocumentToCloudinary(file);
      setEditing((e) =>
        e
          ? {
              ...e,
              fileUrl: res.secure_url,
              publicId: res.public_id,
              fileName: file.name,
              fileType: fileTypeFrom(file.name),
              fileSize: file.size,
              title: e.title || titleFromFile(file.name),
            }
          : e
      );
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { ...editing, fileType: editing.fileType || fileTypeFrom(editing.fileName || editing.fileUrl) };
      const { download } = await api<{ download: Doc & { id: string; updatedAt: string } }>("/api/admin/downloads", {
        method: editing.id ? "PUT" : "POST",
        json: payload,
      });
      const row: Doc = { ...editing, ...download, fileName: download.fileName ?? "", fileType: download.fileType ?? "", publicId: download.publicId ?? "" };
      setDocs((list) => (editing.id ? list.map((d) => (d.id === row.id ? row : d)) : [...list, row]));
      setEditing(null);
      toast("success", row.published ? "Saved. It's on the Downloads page." : "Saved (hidden from the website).");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (d: Doc) => {
    try {
      const { download } = await api<{ download: Doc }>("/api/admin/downloads", { method: "PUT", json: { ...d, published: !d.published } });
      setDocs((list) => list.map((x) => (x.id === d.id ? { ...x, published: download.published } : x)));
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not update.");
    }
  };

  const move = async (d: Doc, direction: "up" | "down") => {
    try {
      const { order } = await api<{ order: string[] }>("/api/admin/downloads", { method: "PATCH", json: { id: d.id, direction } });
      setDocs((list) => list.map((x) => (order.includes(x.id!) ? { ...x, sortOrder: order.indexOf(x.id!) } : x)));
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not move.");
    }
  };

  const remove = async (d: Doc) => {
    if (!confirm(`Delete “${d.title}”? It will disappear from the website.`)) return;
    try {
      await api(`/api/admin/downloads?id=${d.id}`, { method: "DELETE" });
      setDocs((list) => list.filter((x) => x.id !== d.id));
      toast("success", "Deleted.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not delete.");
    }
  };

  const grouped = [...categories, ...Array.from(new Set(docs.map((d) => d.category))).filter((c) => !categories.includes(c))]
    .map((cat) => ({
      cat,
      items: docs.filter((d) => d.category === cat).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader
        title="Downloads"
        description="Files parents can download from the website: prospectus, fee schedules, calendars, uniform lists and forms. Upload a new version whenever something changes; the link on the website stays the same."
        actions={
          <>
            <a
              href="/downloads"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#19151C]/15 bg-white px-4 py-2.5 font-sans text-sm hover:text-[#6C0798]"
            >
              View page <ExternalLink size={13} />
            </a>
            <Button
              onClick={() => {
                setLinkMode(false);
                setEditing(blank());
              }}
            >
              <FilePlus2 size={15} /> Add document
            </Button>
          </>
        }
      />

      {grouped.length === 0 ? (
        <Card className="p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-[#6C0798]/50" strokeWidth={1.5} />
          <p className="mt-4 font-serif text-2xl">No documents yet</p>
          <p className="mx-auto mt-2 max-w-md font-sans text-sm text-[#19151C]/55">
            Start with the prospectus, this year&apos;s fee schedule and the term calendar. They&apos;re what parents ask for most.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ cat, items }) => (
            <Card key={cat}>
              <h2 className="border-b border-[#19151C]/10 px-5 py-3 font-sans text-sm font-semibold text-[#19151C]/70">{cat}</h2>
              <ul className="divide-y divide-[#19151C]/10">
                {items.map((d, i) => (
                  <li key={d.id} className={`flex items-center gap-3 px-5 py-3.5 ${d.published ? "" : "opacity-60"}`}>
                    <div className="flex flex-col">
                      <button disabled={i === 0} onClick={() => move(d, "up")} className="rounded p-0.5 text-[#19151C]/40 hover:text-[#19151C] disabled:opacity-20" aria-label="Move up">
                        <ArrowUp size={14} />
                      </button>
                      <button
                        disabled={i === items.length - 1}
                        onClick={() => move(d, "down")}
                        className="rounded p-0.5 text-[#19151C]/40 hover:text-[#19151C] disabled:opacity-20"
                        aria-label="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-sm font-medium">{d.title}</p>
                      <p className="truncate font-sans text-xs text-[#19151C]/50">
                        {[fileTypeLabel(d.fileType), formatFileSize(d.fileSize), d.updatedAt && `updated ${timeAgo(d.updatedAt)}`].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {!d.published && <Badge>Hidden</Badge>}
                    <span className="hidden w-24 text-right font-sans text-xs text-[#19151C]/50 sm:block">
                      {d.downloadCount ?? 0} download{d.downloadCount === 1 ? "" : "s"}
                    </span>
                    <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="rounded p-2 text-[#19151C]/55 hover:bg-[#19151C]/5" aria-label="Open file">
                      <ExternalLink size={15} />
                    </a>
                    <button onClick={() => togglePublished(d)} className="rounded p-2 text-[#19151C]/55 hover:bg-[#19151C]/5" aria-label={d.published ? "Hide" : "Show"} title={d.published ? "Hide from website" : "Show on website"}>
                      <EyeOff size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setLinkMode(false);
                        setEditing(d);
                      }}
                      className="rounded p-2 text-[#19151C]/55 hover:bg-[#19151C]/5 hover:text-[#6C0798]"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(d)} className="rounded p-2 text-red-600/70 hover:bg-red-50 hover:text-red-700" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#19151C]/50 p-4 sm:items-center" onClick={() => !uploading && setEditing(null)}>
          <div className="my-8 w-full max-w-xl rounded-xl bg-white p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl">{editing.id ? "Edit document" : "Add a document"}</h2>

            <div className="mt-6 space-y-4">
              {/* File */}
              <div>
                <label className={labelClass}>File</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f) pickFile(f);
                  }}
                  className="rounded-lg border-2 border-dashed border-[#19151C]/15 bg-[#FAF8F9] p-4"
                >
                  {uploading ? (
                    <p className="flex items-center gap-2 font-sans text-sm text-[#19151C]/70">
                      <Loader2 size={16} className="animate-spin text-[#6C0798]" /> Uploading…
                    </p>
                  ) : editing.fileUrl ? (
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="shrink-0 text-[#6C0798]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-sm font-medium">{editing.fileName || editing.fileUrl}</p>
                        <p className="font-sans text-xs text-[#19151C]/50">
                          {[fileTypeLabel(editing.fileType || fileTypeFrom(editing.fileName || editing.fileUrl)), formatFileSize(editing.fileSize)].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <button onClick={() => fileInput.current?.click()} className="font-sans text-xs font-medium text-[#6C0798] hover:underline">
                        Replace
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-3 text-center">
                      <UploadCloud size={22} className="text-[#6C0798]" />
                      <button onClick={() => fileInput.current?.click()} className="font-sans text-sm font-medium text-[#6C0798] hover:underline">
                        Choose a file
                      </button>
                      <p className="font-sans text-xs text-[#19151C]/45">or drag it here · PDF, Word, Excel, PowerPoint · up to {formatFileSize(MAX_FILE_BYTES)}</p>
                    </div>
                  )}
                  <input
                    ref={fileInput}
                    type="file"
                    accept={ACCEPTED_FILES}
                    hidden
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) pickFile(f);
                      e.target.value = "";
                    }}
                  />
                </div>
                <button onClick={() => setLinkMode((v) => !v)} className="mt-2 inline-flex items-center gap-1.5 font-sans text-xs text-[#19151C]/55 hover:text-[#19151C]">
                  <Link2 size={12} /> Link to a file hosted elsewhere (e.g. Google Drive) instead
                </button>
                {linkMode && (
                  <input
                    className={`${inputClass} mt-2`}
                    placeholder="https://…"
                    value={editing.fileUrl}
                    onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value, fileName: "", fileSize: null, publicId: "", fileType: fileTypeFrom(e.target.value) })}
                  />
                )}
              </div>

              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass} value={editing.title} placeholder="e.g. Fee schedule 2026/27" onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Short description (optional)</label>
                <input
                  className={inputClass}
                  value={editing.description}
                  maxLength={400}
                  placeholder="e.g. Tuition and other fees for every year group"
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select className={inputClass} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2.5 font-sans text-sm">
                <input type="checkbox" className="h-4 w-4 accent-[#6C0798]" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Show on the website
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)} disabled={uploading}>
                Cancel
              </Button>
              <Button onClick={save} loading={saving} disabled={uploading || !editing.title.trim() || !editing.fileUrl}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
