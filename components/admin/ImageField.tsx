"use client";

import { useState } from "react";
import { ImageOff, Link2, Trash2, UploadCloud } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";
import { Badge, inputClass } from "./ui";
import { isCloudinaryVideoUrl } from "../../lib/cloudinary";
import { isPlaceholderImage, type ImageValue } from "../../lib/content/fields";

const DIMENSIONS: Record<string, string> = {
  "16:9": "1920×1080",
  "21:9": "2400×1030",
  "4:3": "1600×1200",
  "4:5": "1200×1500",
  "3:4": "1200×1600",
  "1:1": "800×800",
};

export default function ImageField({
  value,
  onChange,
  label,
  aspect = "4:3",
  uploadFolder,
  allowVideo = true,
}: {
  value: ImageValue;
  onChange: (v: ImageValue) => void;
  label: string;
  aspect?: string;
  uploadFolder: string;
  allowVideo?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [linkMode, setLinkMode] = useState(false);
  const isVideo = isCloudinaryVideoUrl(value.url);
  const placeholder = value.url && isPlaceholderImage(value.url);

  return (
    <div className="rounded-lg border border-[#19151C]/10 bg-[#FAF8F9] p-3">
      <div className="flex gap-3">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md bg-[#19151C]/10">
          {value.url ? (
            isVideo ? (
              <video src={value.url} muted className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.url} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#19151C]/30">
              <ImageOff size={20} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {placeholder && <Badge tone="amber">Stock photo — replace</Badge>}
            {isVideo && <Badge tone="purple">Video</Badge>}
            <span className="font-sans text-[11px] text-[#19151C]/45">
              {aspect} · ideally {DIMENSIONS[aspect] ?? "1600px wide"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#6C0798] px-3 py-1.5 font-sans text-xs font-medium text-white hover:bg-[#4B075F]"
            >
              <UploadCloud size={13} /> {value.url ? "Replace" : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => setLinkMode((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#19151C]/15 bg-white px-3 py-1.5 font-sans text-xs text-[#19151C]/70 hover:text-[#19151C]"
            >
              <Link2 size={13} /> Use a link
            </button>
            {value.url && (
              <button
                type="button"
                onClick={() => onChange({ url: "", alt: "" })}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-sans text-xs text-red-700 hover:bg-red-50"
              >
                <Trash2 size={13} /> Remove
              </button>
            )}
          </div>
          {linkMode && (
            <input
              className={inputClass}
              placeholder="https://…"
              value={value.url}
              onChange={(e) => onChange({ ...value, url: e.target.value })}
            />
          )}
          <input
            className={inputClass}
            placeholder="Describe the photo for screen readers (alt text)"
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
          />
        </div>
      </div>

      {open && (
        <ImageUploadModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSuccess={(d) => onChange({ url: d.cloudinaryUrl, alt: d.altText || value.alt })}
          title={label}
          section={uploadFolder}
          slotId={label.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40)}
          targetAspectRatio={aspect}
          recommendedDimensions={DIMENSIONS[aspect] ?? "1600x1200"}
          initialAltText={value.alt}
          allowVideo={allowVideo}
        />
      )}
    </div>
  );
}
