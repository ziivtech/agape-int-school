"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Images, ImageOff, Pencil, Plus, Trash2, UploadCloud } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";
import { Badge, Button, Card, PageHeader, api, inputClass, useToast } from "./ui";
import type { ImageRef } from "../../lib/content/images";
import { isCloudinaryVideoUrl } from "../../lib/cloudinary";
import BulkPhotoUploader from "./BulkPhotoUploader";
import { formatNewsDate } from "../../lib/content/public-types";

type AlbumSummary = {
  id: string;
  title: string;
  date: string | null;
  coverUrl: string;
  photoCount: number;
  published: boolean;
};

type Photo = {
  id: string;
  category: string;
  title: string;
  caption: string;
  url: string;
  sortOrder: number;
  createdAt: string;
};

function Thumb({ url, className = "" }: { url: string; className?: string }) {
  if (!url)
    return (
      <div className={`flex items-center justify-center bg-[#19151C]/5 text-[#19151C]/30 ${className}`}>
        <ImageOff size={22} />
      </div>
    );
  if (isCloudinaryVideoUrl(url)) return <video src={url} muted className={`object-cover ${className}`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" loading="lazy" className={`object-cover ${className}`} />;
}

export default function MediaLibrary({
  images,
  gallery,
  albums,
  categories,
  initialFilter,
  initialTab,
}: {
  images: ImageRef[];
  gallery: Photo[];
  albums: AlbumSummary[];
  categories: string[];
  initialFilter: "all" | "placeholder";
  initialTab: "site" | "gallery" | "albums";
}) {
  const [tab, setTab] = useState(initialTab);
  const placeholders = images.filter((i) => i.placeholder).length;

  return (
    <>
      <PageHeader
        title="Photos & media"
        description="Replace any image on the website, and manage the photo gallery. Real photos of Agape students, staff and campus make the site feel genuine, so stock photos are flagged so you can replace them."
      />

      <div className="mb-6 flex gap-1 rounded-lg bg-[#19151C]/5 p-1 sm:w-fit">
        {(
          [
            ["site", `Website images${placeholders ? ` (${placeholders} to replace)` : ""}`],
            ["gallery", `Gallery (${gallery.length})`],
            ["albums", `Albums (${albums.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-md px-4 py-2 font-sans text-sm font-medium transition sm:flex-none ${
              tab === id ? "bg-white shadow-sm" : "text-[#19151C]/60 hover:text-[#19151C]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "site" && <SiteImages images={images} initialFilter={initialFilter} />}
      {tab === "gallery" && <Gallery photos={gallery} categories={categories} />}
      {tab === "albums" && <Albums albums={albums} />}
    </>
  );
}

function SiteImages({ images, initialFilter }: { images: ImageRef[]; initialFilter: "all" | "placeholder" }) {
  const [filter, setFilter] = useState<string>(initialFilter);
  const [target, setTarget] = useState<ImageRef | null>(null);
  const toast = useToast();
  const router = useRouter();

  const pages = useMemo(() => Array.from(new Set(images.map((i) => i.page))), [images]);
  const shown = images.filter((i) => (filter === "all" ? true : filter === "placeholder" ? i.placeholder : i.page === filter));

  const replace = async (img: ImageRef, url: string, alt: string) => {
    try {
      await api("/api/admin/content/image", { method: "PATCH", json: { key: img.key, path: img.path, url, alt } });
      toast("success", "Photo replaced. The website is updated.");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save the photo.");
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ["all", "All"],
          ["placeholder", "Needs replacing"],
          ...pages.map((p) => [p, p]),
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium transition ${
              filter === id ? "border-[#6C0798] bg-[#6C0798] text-white" : "border-[#19151C]/15 bg-white text-[#19151C]/65 hover:border-[#6C0798]/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <Card className="p-10 text-center font-sans text-sm text-[#19151C]/55">
          {filter === "placeholder" ? "Nothing to replace. Every image is a real school photo." : "No images here."}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((img) => (
            <Card key={`${img.key}:${img.path}`} className="overflow-hidden">
              <Thumb url={img.value.url} className="aspect-[16/10] w-full" />
              <div className="p-4">
                <div className="mb-1.5 flex flex-wrap gap-1.5">
                  <Badge>{img.page}</Badge>
                  {img.placeholder && <Badge tone="amber">{img.value.url ? "Stock photo" : "Missing"}</Badge>}
                </div>
                <p className="font-sans text-sm font-medium leading-5">{img.section}</p>
                <p className="mt-0.5 font-sans text-xs text-[#19151C]/55">{img.label}</p>
                <div className="mt-3 flex gap-2">
                  <Button className="flex-1 !py-2 text-xs" onClick={() => setTarget(img)}>
                    <UploadCloud size={14} /> Replace
                  </Button>
                  <Link
                    href={`/admin/content/${img.key}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#19151C]/15 px-3 py-2 font-sans text-xs text-[#19151C]/70 hover:text-[#6C0798]"
                  >
                    <Pencil size={13} /> Section
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {target && (
        <ImageUploadModal
          isOpen
          onClose={() => setTarget(null)}
          onSuccess={(d) => replace(target, d.cloudinaryUrl, d.altText || target.value.alt)}
          title={`${target.section}: ${target.label}`}
          section={target.key.split(".")[0]}
          slotId={target.path.replace(/\./g, "_")}
          targetAspectRatio={target.aspect ?? "4:3"}
          initialAltText={target.value.alt}
          allowVideo
        />
      )}
    </>
  );
}

function Gallery({ photos, categories }: { photos: Photo[]; categories: string[] }) {
  const [items, setItems] = useState(photos);
  const [category, setCategory] = useState(categories[0]);
  const [editing, setEditing] = useState<Photo | null>(null);
  const toast = useToast();

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const { photo } = await api<{ photo: Photo }>("/api/admin/gallery", {
        method: "PATCH",
        json: { id: editing.id, title: editing.title, caption: editing.caption, category: editing.category },
      });
      setItems((p) => p.map((x) => (x.id === photo.id ? photo : x)));
      setEditing(null);
      toast("success", "Photo updated.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save.");
    }
  };

  const remove = async (p: Photo) => {
    if (!confirm(`Remove “${p.title}” from the gallery?`)) return;
    try {
      await api(`/api/admin/gallery?id=${p.id}`, { method: "DELETE" });
      setItems((list) => list.filter((x) => x.id !== p.id));
      toast("success", "Photo removed.");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not remove.");
    }
  };

  return (
    <>
      <div className="mb-6">
        <BulkPhotoUploader category={category} onAdded={(photo) => setItems((p) => [photo, ...p])}>
          <span className="font-sans text-sm text-[#19151C]/70">Add photos to</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} sm:w-56`}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </BulkPhotoUploader>
      </div>

      {items.length === 0 ? (
        <Card className="p-10 text-center font-sans text-sm text-[#19151C]/55">
          The gallery is empty, so the website is showing the school&apos;s built-in photos. Upload your own to replace them.
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <Thumb url={p.url} className="aspect-[4/5] w-full" />
              <div className="p-3">
                <p className="truncate font-sans text-sm font-medium">{p.title}</p>
                <p className="font-sans text-xs text-[#19151C]/50">{p.category}</p>
                <div className="mt-2 flex gap-1">
                  <button onClick={() => setEditing(p)} className="rounded p-1.5 text-[#19151C]/55 hover:bg-[#19151C]/5 hover:text-[#6C0798]" aria-label="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => remove(p)} className="rounded p-1.5 text-red-600/70 hover:bg-red-50 hover:text-red-700" aria-label="Remove">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19151C]/50 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-xl border border-[#19151C]/10 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              <h2 className="font-serif text-2xl">Edit photo</h2>
              <input className={inputClass} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Title" />
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={editing.caption}
                onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
                placeholder="Caption"
              />
              <select className={inputClass} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Albums({ albums }: { albums: AlbumSummary[] }) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl font-sans text-sm text-[#19151C]/60">
          An album groups the photos from one occasion, like Sports Day or Graduation. Link it to an event or news story and the photos appear there too.
        </p>
        <Link
          href="/admin/media/albums/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#6C0798] px-4 py-2.5 font-sans text-sm font-medium text-white hover:bg-[#4B075F]"
        >
          <Plus size={15} /> New album
        </Link>
      </div>

      {albums.length === 0 ? (
        <Card className="p-10 text-center">
          <Images className="mx-auto h-8 w-8 text-[#6C0798]/50" strokeWidth={1.5} />
          <p className="mt-4 font-serif text-2xl">No albums yet</p>
          <p className="mx-auto mt-2 max-w-md font-sans text-sm text-[#19151C]/55">Create one after your next event and drag all the photos in at once.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {albums.map((a) => (
            <Link key={a.id} href={`/admin/media/albums/${a.id}`} className="group">
              <Card className="overflow-hidden">
                <Thumb url={a.coverUrl} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                <div className="p-3">
                  <p className="truncate font-sans text-sm font-medium group-hover:text-[#6C0798]">{a.title}</p>
                  <p className="font-sans text-xs text-[#19151C]/50">
                    {[a.date && formatNewsDate(a.date), `${a.photoCount} photo${a.photoCount === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}
                  </p>
                  {!a.published && (
                    <span className="mt-1 inline-block">
                      <Badge>Hidden</Badge>
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
