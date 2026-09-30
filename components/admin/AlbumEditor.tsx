"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import BulkPhotoUploader, { UploadedPhoto } from "./BulkPhotoUploader";
import { Badge, Button, Card, api, inputClass, labelClass, useToast } from "./ui";

type Album = {
  id?: string;
  slug?: string;
  title: string;
  description: string;
  date: string;
  coverUrl: string;
  eventId: string;
  newsPostId: string;
  published: boolean;
};

type Photo = UploadedPhoto;

export default function AlbumEditor({
  album: initial,
  photos: initialPhotos,
  events,
  posts,
}: {
  album?: Album;
  photos: Photo[];
  events: { id: string; title: string; startsOn: string | null }[];
  posts: { id: string; title: string }[];
}) {
  const [album, setAlbum] = useState<Album>(
    initial ?? { title: "", description: "", date: "", coverUrl: "", eventId: "", newsPostId: "", published: true }
  );
  const [photos, setPhotos] = useState(initialPhotos);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Photo | null>(null);
  const toast = useToast();
  const router = useRouter();
  const set = <K extends keyof Album>(k: K, v: Album[K]) => setAlbum((a) => ({ ...a, [k]: v }));
  const cover = album.coverUrl || photos[0]?.url || "";

  const save = async (patch: Partial<Album> = {}) => {
    const next = { ...album, ...patch };
    setSaving(true);
    try {
      const res = await api<{ album: Album & { id: string; slug: string } }>("/api/admin/albums", {
        method: next.id ? "PUT" : "POST",
        json: next,
      });
      setAlbum({ ...next, id: res.album.id, slug: res.album.slug });
      toast("success", next.id ? "Album saved." : "Album created. Now add the photos.");
      if (!next.id) router.replace(`/admin/media/albums/${res.album.id}`);
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const removeAlbum = async () => {
    if (!album.id || !confirm(`Delete “${album.title}” and all ${photos.length} of its photos? This can't be undone.`)) return;
    try {
      await api(`/api/admin/albums?id=${album.id}`, { method: "DELETE" });
      router.push("/admin/media?tab=albums");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not delete.");
    }
  };

  const savePhoto = async () => {
    if (!editing) return;
    try {
      await api("/api/admin/gallery", { method: "PATCH", json: { id: editing.id, title: editing.title, caption: editing.caption } });
      setPhotos((list) => list.map((p) => (p.id === editing.id ? editing : p)));
      setEditing(null);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save.");
    }
  };

  const removePhoto = async (p: Photo) => {
    if (!confirm("Remove this photo from the album?")) return;
    try {
      await api(`/api/admin/gallery?id=${p.id}`, { method: "DELETE" });
      setPhotos((list) => list.filter((x) => x.id !== p.id));
      if (album.coverUrl === p.url) save({ coverUrl: "" });
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not remove.");
    }
  };

  return (
    <div className="pb-10">
      <Link href="/admin/media?tab=albums" className="font-sans text-sm text-[#19151C]/55 hover:text-[#6C0798]">
        ← Albums
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl sm:text-4xl">{album.id ? album.title || "Album" : "New album"}</h1>
        {album.id && !album.published && <Badge>Hidden</Badge>}
        {album.id && album.published && photos.length > 0 && (
          <Link href={`/gallery/${album.slug}`} target="_blank" className="ml-auto inline-flex items-center gap-1.5 font-sans text-sm text-[#6C0798]">
            View on site <ExternalLink size={13} />
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {album.id ? (
            <>
              <BulkPhotoUploader category="Events" albumId={album.id} folder="albums" onAdded={(p) => setPhotos((list) => [...list, p])} />

              {photos.length === 0 ? (
                <Card className="p-10 text-center font-sans text-sm text-[#19151C]/55">
                  No photos yet. Drag the whole set in above. The album only appears on the website once it has photos.
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((p) => {
                    const isCover = cover === p.url;
                    return (
                      <Card key={p.id} className={`overflow-hidden ${isCover ? "ring-2 ring-[#6C0798]" : ""}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                        <div className="flex items-center gap-1 p-2">
                          <span className="min-w-0 flex-1 truncate font-sans text-xs text-[#19151C]/60">{p.caption || p.title}</span>
                          <button
                            onClick={() => save({ coverUrl: p.url })}
                            className={`rounded p-1.5 ${isCover ? "text-[#6C0798]" : "text-[#19151C]/45 hover:bg-[#19151C]/5"}`}
                            aria-label="Use as cover"
                            title={isCover ? "Cover photo" : "Use as cover"}
                          >
                            <Star size={14} fill={isCover ? "currentColor" : "none"} />
                          </button>
                          <button onClick={() => setEditing(p)} className="rounded p-1.5 text-[#19151C]/45 hover:bg-[#19151C]/5" aria-label="Edit caption">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => removePhoto(p)} className="rounded p-1.5 text-red-600/70 hover:bg-red-50" aria-label="Remove">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <Card className="p-8 font-sans text-sm text-[#19151C]/60">Give the album a title and save it, then you can add photos.</Card>
          )}
        </div>

        <Card className="h-fit space-y-4 p-5">
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={album.title} placeholder="e.g. Sports Day 2026" onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" className={inputClass} value={album.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Description (optional)</label>
            <textarea className={`${inputClass} min-h-[80px]`} value={album.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Linked event</label>
            <select className={inputClass} value={album.eventId} onChange={(e) => set("eventId", e.target.value)}>
              <option value="">None</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                  {ev.startsOn ? ` (${ev.startsOn})` : ""}
                </option>
              ))}
            </select>
            <p className="mt-1 font-sans text-xs text-[#19151C]/45">Adds a “View photos” link to the event.</p>
          </div>
          <div>
            <label className={labelClass}>Linked news story</label>
            <select className={inputClass} value={album.newsPostId} onChange={(e) => set("newsPostId", e.target.value)}>
              <option value="">None</option>
              {posts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <p className="mt-1 font-sans text-xs text-[#19151C]/45">Shows the photos at the end of the story.</p>
          </div>
          <label className="flex items-center gap-2.5 font-sans text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[#6C0798]" checked={album.published} onChange={(e) => set("published", e.target.checked)} />
            Show on the website
          </label>
          <Button className="w-full" onClick={() => save()} loading={saving} disabled={!album.title.trim()}>
            {album.id ? "Save album" : "Create album"}
          </Button>
          {album.id && (
            <Button variant="ghost" className="w-full text-red-700" onClick={removeAlbum}>
              <Trash2 size={14} /> Delete album
            </Button>
          )}
        </Card>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19151C]/50 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl">Caption</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={editing.url} alt="" className="mt-4 max-h-56 w-full rounded-lg object-cover" />
            <textarea
              className={`${inputClass} mt-4 min-h-[80px]`}
              value={editing.caption}
              placeholder="e.g. Year 5 relay team crossing the line"
              onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={savePhoto}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
