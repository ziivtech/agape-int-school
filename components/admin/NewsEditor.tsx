"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import ImageField from "./ImageField";
import { Button, Card, api, inputClass, labelClass, useToast } from "./ui";
import { slugify } from "../../lib/slug";

type Post = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  coverAlt: string;
  author: string;
  featured: boolean;
  status: "draft" | "published";
  publishedAt: string;
};

export default function NewsEditor({ post, categories, defaultAuthor }: { post?: Post; categories: string[]; defaultAuthor: string }) {
  const [p, setP] = useState<Post>(
    post ?? {
      slug: "",
      title: "",
      category: categories[0],
      excerpt: "",
      body: "",
      coverUrl: "",
      coverAlt: "",
      author: defaultAuthor,
      featured: false,
      status: "draft",
      publishedAt: "",
    }
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [saving, setSaving] = useState<null | "draft" | "published">(null);
  const toast = useToast();
  const router = useRouter();
  const set = <K extends keyof Post>(k: K, v: Post[K]) => setP((x) => ({ ...x, [k]: v }));

  const save = async (status: "draft" | "published") => {
    setSaving(status);
    try {
      const payload = { ...p, status, slug: p.slug || undefined, publishedAt: p.publishedAt || null };
      const res = await api<{ post: { id: string; slug: string } }>("/api/admin/news", {
        method: p.id ? "PUT" : "POST",
        json: p.id ? { ...payload, id: p.id } : payload,
      });
      setP((x) => ({ ...x, id: res.post.id, slug: res.post.slug, status }));
      toast("success", status === "published" ? "Published — it's live on the website." : "Draft saved.");
      if (!p.id) router.replace(`/admin/news/${res.post.id}`);
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(null);
    }
  };

  const remove = async () => {
    if (!p.id || !confirm(`Delete “${p.title}”? This can't be undone.`)) return;
    try {
      await api(`/api/admin/news?id=${p.id}`, { method: "DELETE" });
      toast("success", "Story deleted.");
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not delete.");
    }
  };

  return (
    <div className="pb-10">
      <Link href="/admin/news" className="font-sans text-sm text-[#19151C]/55 hover:text-[#6C0798]">
        ← News
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl sm:text-4xl">{p.id ? "Edit story" : "New story"}</h1>
        {p.id && p.status === "published" && (
          <Link href={`/news/${p.slug}`} target="_blank" className="inline-flex items-center gap-1.5 font-sans text-sm text-[#6C0798]">
            View on site <ExternalLink size={13} />
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5 p-5 sm:p-7">
          <div>
            <label className={labelClass}>Headline</label>
            <input
              className={`${inputClass} font-serif !text-xl`}
              value={p.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              placeholder="e.g. Grade 9 win the inter-school debate"
            />
          </div>
          <div>
            <label className={labelClass}>Summary</label>
            <textarea
              className={`${inputClass} min-h-[70px]`}
              value={p.excerpt}
              maxLength={400}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="One or two sentences shown on the news listing and in search results."
            />
          </div>
          <div>
            <label className={labelClass}>Story</label>
            <textarea
              className={`${inputClass} min-h-[380px] leading-7`}
              value={p.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder={"Write the story here.\n\nLeave a blank line between paragraphs.\n\n## A line starting with ## becomes a subheading"}
            />
            <p className="mt-1 font-sans text-xs text-[#19151C]/45">Blank line = new paragraph. Start a line with “## ” for a subheading.</p>
          </div>
          <div>
            <label className={labelClass}>Cover photo</label>
            <ImageField
              value={{ url: p.coverUrl, alt: p.coverAlt }}
              onChange={(v) => setP((x) => ({ ...x, coverUrl: v.url, coverAlt: v.alt }))}
              label="Story cover"
              aspect="16:9"
              uploadFolder="news"
              allowVideo={false}
            />
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-4 p-5">
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={p.category} onChange={(e) => set("category", e.target.value)}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Author</label>
              <input className={inputClass} value={p.author} onChange={(e) => set("author", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Date shown</label>
              <input type="date" className={inputClass} value={p.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
              <p className="mt-1 font-sans text-xs text-[#19151C]/45">Leave empty to use the day you publish.</p>
            </div>
            <div>
              <label className={labelClass}>Web address</label>
              <div className="flex items-center rounded-lg border border-[#19151C]/15 bg-white pl-3 focus-within:border-[#6C0798]">
                <span className="font-sans text-xs text-[#19151C]/45">/news/</span>
                <input
                  className="w-full bg-transparent px-1 py-2.5 font-sans text-sm outline-none"
                  value={p.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
              </div>
            </div>
            <label className="flex items-center gap-2.5 font-sans text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[#6C0798]" checked={p.featured} onChange={(e) => set("featured", e.target.checked)} />
              Feature at the top of the News page
            </label>
          </Card>

          <Card className="space-y-2 p-5">
            <p className="font-sans text-sm text-[#19151C]/60">
              Status: <span className="font-semibold text-[#19151C]">{p.status === "published" ? "Published" : "Draft"}</span>
            </p>
            <Button className="w-full" onClick={() => save("published")} loading={saving === "published"} disabled={!p.title.trim() || saving !== null}>
              {p.status === "published" ? "Update" : "Publish"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => save("draft")}
              loading={saving === "draft"}
              disabled={!p.title.trim() || saving !== null}
            >
              {p.status === "published" ? "Unpublish (save as draft)" : "Save draft"}
            </Button>
            {p.id && (
              <Button variant="ghost" className="w-full text-red-700" onClick={remove}>
                <Trash2 size={14} /> Delete
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
