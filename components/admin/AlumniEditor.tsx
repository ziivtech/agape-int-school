"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Mail, Phone, Trash2 } from "lucide-react";
import ImageField from "./ImageField";
import { Badge, Button, Card, api, inputClass, labelClass, useToast } from "./ui";
import { timeAgo } from "../../lib/format";

type Status = "pending" | "published" | "hidden";

type Profile = {
  id?: string;
  slug: string;
  fullName: string;
  classYear: string;
  photoUrl: string;
  headline: string;
  occupation: string;
  industry: string;
  university: string;
  fieldOfStudy: string;
  city: string;
  country: string;
  story: string;
  quote: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  consentPublic: boolean;
  openToMentor: boolean;
  featured: boolean;
  status: Status;
  createdAt?: string;
};

const BLANK: Profile = {
  slug: "",
  fullName: "",
  classYear: "",
  photoUrl: "",
  headline: "",
  occupation: "",
  industry: "",
  university: "",
  fieldOfStudy: "",
  city: "",
  country: "",
  story: "",
  quote: "",
  linkedinUrl: "",
  email: "",
  phone: "",
  consentPublic: false,
  openToMentor: false,
  featured: false,
  status: "pending",
};

export default function AlumniEditor({ initial, industries }: { initial?: Profile; industries: string[] }) {
  const [p, setP] = useState<Profile>(initial ?? BLANK);
  const [saving, setSaving] = useState<Status | null>(null);
  const toast = useToast();
  const router = useRouter();
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((x) => ({ ...x, [k]: v }));

  const save = async (status: Status) => {
    if (status === "published" && !p.consentPublic) {
      toast("error", "Only publish people who agreed to appear on the website. Tick “Happy to appear publicly” if they have told you so.");
      return;
    }
    setSaving(status);
    try {
      const payload = { ...p, status, classYear: p.classYear || null };
      const { alumnus } = await api<{ alumnus: { id: string; slug: string } }>("/api/admin/alumni", {
        method: p.id ? "PUT" : "POST",
        json: p.id ? payload : { ...payload, id: undefined },
      });
      setP((x) => ({ ...x, id: alumnus.id, slug: alumnus.slug, status }));
      toast(
        "success",
        status === "published" ? "Published — the profile is on the website." : status === "hidden" ? "Hidden from the website." : "Saved."
      );
      if (!p.id) router.replace(`/admin/alumni/${alumnus.id}`);
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(null);
    }
  };

  const remove = async () => {
    if (!p.id || !confirm(`Delete ${p.fullName}'s profile permanently?`)) return;
    try {
      await api(`/api/admin/alumni?id=${p.id}`, { method: "DELETE" });
      router.push("/admin/alumni");
      router.refresh();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Could not delete.");
    }
  };

  const field = (k: keyof Profile, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className={labelClass}>{label}</label>
      <input className={inputClass} value={p[k] as string} onChange={(e) => set(k, e.target.value as never)} {...props} />
    </div>
  );

  return (
    <div className="pb-10">
      <Link href="/admin/alumni" className="font-sans text-sm text-[#19151C]/55 hover:text-[#6C0798]">
        ← Alumni
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl sm:text-4xl">{p.id ? p.fullName || "Alumni profile" : "New alumni profile"}</h1>
        {p.id && (
          <Badge tone={p.status === "published" ? "green" : p.status === "pending" ? "red" : "neutral"}>
            {p.status === "published" ? "On the website" : p.status === "pending" ? "Waiting for approval" : "Hidden"}
          </Badge>
        )}
        {p.id && p.status === "published" && (
          <Link href={`/alumni/${p.slug}`} target="_blank" className="ml-auto inline-flex items-center gap-1.5 font-sans text-sm text-[#6C0798]">
            View on site <ExternalLink size={13} />
          </Link>
        )}
      </div>
      {p.createdAt && <p className="mt-1 font-sans text-xs text-[#19151C]/45">Signed up {timeAgo(p.createdAt)}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="space-y-5 p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
              {field("fullName", "Full name")}
              {field("classYear", "Class of", { inputMode: "numeric", placeholder: "e.g. 2019" })}
            </div>
            {field("headline", "One-line summary (shown under their name)", { placeholder: "e.g. Medical student at the University of Ghana", maxLength: 140 })}
            <div className="grid gap-4 sm:grid-cols-2">
              {field("university", "University / college")}
              {field("fieldOfStudy", "Studied")}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("occupation", "What they do now")}
              <div>
                <label className={labelClass}>Field</label>
                <select className={inputClass} value={p.industry} onChange={(e) => set("industry", e.target.value)}>
                  <option value="">—</option>
                  {industries.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("city", "City")}
              {field("country", "Country")}
            </div>
            <div>
              <label className={labelClass}>Their story</label>
              <textarea className={`${inputClass} min-h-[200px] leading-7`} value={p.story} onChange={(e) => set("story", e.target.value)} />
              <p className="mt-1 font-sans text-xs text-[#19151C]/45">Leave a blank line between paragraphs. Check spelling before publishing.</p>
            </div>
            {field("quote", "Short quote about Agape", { maxLength: 280 })}
            {field("linkedinUrl", "LinkedIn link", { placeholder: "https://linkedin.com/in/…" })}
            <div>
              <label className={labelClass}>Photo</label>
              <ImageField
                value={{ url: p.photoUrl, alt: p.fullName }}
                onChange={(v) => set("photoUrl", v.url)}
                label={`${p.fullName || "Alumni"} portrait`}
                aspect="4:5"
                uploadFolder="alumni"
                allowVideo={false}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="space-y-3 p-5">
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-[#19151C]/50">Private contact</p>
            {field("email", "Email", { type: "email" })}
            {field("phone", "Phone")}
            <div className="flex flex-wrap gap-2 pt-1">
              {p.email && (
                <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1.5 font-sans text-xs text-[#6C0798]">
                  <Mail size={13} /> Email
                </a>
              )}
              {p.phone && (
                <a href={`tel:${p.phone}`} className="inline-flex items-center gap-1.5 font-sans text-xs text-[#6C0798]">
                  <Phone size={13} /> Call
                </a>
              )}
            </div>
          </Card>

          <Card className="space-y-3 p-5">
            <label className="flex items-start gap-2.5 font-sans text-sm">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#6C0798]" checked={p.consentPublic} onChange={(e) => set("consentPublic", e.target.checked)} />
              <span>
                Happy to appear publicly
                <span className="block text-xs text-[#19151C]/50">Required before publishing.</span>
              </span>
            </label>
            <label className="flex items-center gap-2.5 font-sans text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[#6C0798]" checked={p.openToMentor} onChange={(e) => set("openToMentor", e.target.checked)} />
              Open to mentoring students
            </label>
            <label className="flex items-start gap-2.5 font-sans text-sm">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#6C0798]" checked={p.featured} onChange={(e) => set("featured", e.target.checked)} />
              <span>
                Feature on the Alumni page
                <span className="block text-xs text-[#19151C]/50">Up to three featured stories are shown at the top.</span>
              </span>
            </label>
          </Card>

          <Card className="space-y-2 p-5">
            <Button className="w-full" onClick={() => save("published")} loading={saving === "published"} disabled={!p.fullName.trim() || saving !== null}>
              {p.status === "published" ? "Save & keep published" : "Approve & publish"}
            </Button>
            {p.status === "published" ? (
              <Button variant="secondary" className="w-full" onClick={() => save("hidden")} loading={saving === "hidden"} disabled={saving !== null}>
                Hide from website
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => save(p.status === "hidden" ? "hidden" : "pending")}
                loading={saving === "pending" || saving === "hidden"}
                disabled={!p.fullName.trim() || saving !== null}
              >
                Save without publishing
              </Button>
            )}
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
