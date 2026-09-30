"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Plus, XCircle } from "lucide-react";
import { Button, api, useToast } from "./ui";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { optimizeImageInBrowser } from "../../lib/image-optimizer";

export type UploadedPhoto = {
  id: string;
  category: string;
  title: string;
  caption: string;
  url: string;
  sortOrder: number;
  albumId: string | null;
  createdAt: string;
};

type Job = { id: string; name: string; state: "waiting" | "working" | "done" | "failed"; error?: string };

// "IMG_2031 sports-day.jpg" -> "Sports day"
function titleFromFile(name: string) {
  const base = name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b(img|dsc|pxl|photo|image)\s*\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return base ? base[0].toUpperCase() + base.slice(1) : "";
}

const CONCURRENCY = 3;

/**
 * Pick or drag in many photos; each is resized in the browser, uploaded to
 * Cloudinary and saved to the gallery (optionally inside an album).
 */
export default function BulkPhotoUploader({
  category,
  albumId = null,
  folder = "gallery",
  onAdded,
  children,
}: {
  category: string;
  albumId?: string | null;
  folder?: string;
  onAdded: (photo: UploadedPhoto) => void;
  /** Extra controls shown before the button (e.g. a category picker). */
  children?: React.ReactNode;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const busy = jobs.some((j) => j.state === "waiting" || j.state === "working");

  const update = (id: string, patch: Partial<Job>) => setJobs((js) => js.map((j) => (j.id === id ? { ...j, ...patch } : j)));

  const uploadOne = async (file: File, job: Job, index: number) => {
    update(job.id, { state: "working" });
    try {
      const optimised = await optimizeImageInBrowser(file, { maxWidth: 2400, maxHeight: 2400, quality: 0.85 });
      const uploaded = await uploadToCloudinary(optimised.file, {
        section: folder,
        slotId: (albumId ?? category).toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40),
        resourceType: "image",
      });
      const { photo } = await api<{ photo: UploadedPhoto }>("/api/admin/gallery", {
        method: "POST",
        json: {
          category,
          albumId,
          title: titleFromFile(file.name) || category,
          caption: "",
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          // Keep albums in the order the files were chosen.
          sortOrder: albumId ? Date.now() % 1_000_000_000 + index : 0,
        },
      });
      onAdded(photo);
      update(job.id, { state: "done" });
      return true;
    } catch (err) {
      update(job.id, { state: "failed", error: err instanceof Error ? err.message : "Upload failed" });
      return false;
    }
  };

  const uploadMany = async (list: FileList | File[]) => {
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) {
      toast("error", "Choose image files (JPG, PNG or WebP).");
      return;
    }
    const newJobs: Job[] = files.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, state: "waiting" }));
    setJobs((js) => [...js.filter((j) => j.state !== "done"), ...newJobs]);

    let next = 0;
    let ok = 0;
    const worker = async () => {
      while (next < files.length) {
        const i = next++;
        if (await uploadOne(files[i], newJobs[i], i)) ok++;
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));

    const failed = files.length - ok;
    if (ok) toast("success", `Added ${ok} photo${ok === 1 ? "" : "s"}.`);
    if (failed) toast("error", `${failed} photo${failed === 1 ? "" : "s"} could not be uploaded. See the list for details.`);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!busy) uploadMany(e.dataTransfer.files);
      }}
      className={`rounded-xl border-2 border-dashed p-5 transition ${dragging ? "border-[#6C0798] bg-[#6C0798]/5" : "border-[#19151C]/15 bg-white"}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {children}
        <Button onClick={() => fileInput.current?.click()} loading={busy}>
          {!busy && <Plus size={15} />}
          {busy ? "Uploading…" : "Choose photos"}
        </Button>
        <span className="font-sans text-xs text-[#19151C]/45">or drag them here. You can select many at once.</span>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) uploadMany(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {jobs.length > 0 && (
        <ul className="mt-4 max-h-56 space-y-1.5 overflow-y-auto border-t border-[#19151C]/10 pt-4">
          {jobs.map((j) => (
            <li key={j.id} className="flex items-center gap-2 font-sans text-xs">
              {j.state === "done" ? (
                <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
              ) : j.state === "failed" ? (
                <XCircle size={14} className="shrink-0 text-red-600" />
              ) : j.state === "working" ? (
                <Loader2 size={14} className="shrink-0 animate-spin text-[#6C0798]" />
              ) : (
                <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-[#19151C]/25" />
              )}
              <span className="truncate text-[#19151C]/75">{j.name}</span>
              {j.error && <span className="truncate text-red-700">({j.error})</span>}
            </li>
          ))}
          {!busy && (
            <li>
              <button onClick={() => setJobs([])} className="font-sans text-xs text-[#19151C]/50 underline hover:text-[#19151C]">
                Clear list
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
