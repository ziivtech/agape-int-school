"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, Send } from "lucide-react";
import { useSection } from "../content/ContentProvider";
import { INDUSTRIES } from "../../lib/alumni-shared";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { optimizeImageInBrowser } from "../../lib/image-optimizer";

const input =
  "h-12 w-full rounded-lg border border-[#19151C]/10 bg-[#FAF8F9] px-3.5 font-sans text-sm text-[#19151C] outline-none transition-all placeholder:text-[#19151C]/30 focus:border-[#6C0798]/40 focus:bg-white focus:ring-4 focus:ring-[#6C0798]/10";
const label = "mb-1.5 block font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#19151C]/55";
const Optional = () => <span className="ml-1.5 font-normal normal-case tracking-normal text-[#19151C]/30">Optional</span>;

export default function AlumniRegisterForm() {
  const identity = useSection("site.identity");
  const { thanks } = useSection("alumni.connect");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();

    try {
      let photoUrl: string | null = null;
      if (photo) {
        const optimised = await optimizeImageInBrowser(photo.file, { maxWidth: 1000, maxHeight: 1250, quality: 0.85 });
        photoUrl = (await uploadToCloudinary(optimised.file, { section: "alumni", slotId: "signup", resourceType: "image" })).secure_url;
      }

      const res = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: get("fullName"),
          classYear: get("classYear"),
          email: get("email"),
          phone: get("phone"),
          headline: get("headline"),
          occupation: get("occupation"),
          industry: get("industry"),
          university: get("university"),
          fieldOfStudy: get("fieldOfStudy"),
          city: get("city"),
          country: get("country"),
          story: get("story"),
          quote: get("quote"),
          linkedinUrl: get("linkedinUrl"),
          photoUrl,
          openToMentor: form.get("openToMentor") === "on",
          consentPublic: form.get("consentPublic") === "on",
          website: get("website"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center rounded-xl bg-[#6C0798]/5 px-6 py-14 text-center">
        <CheckCircle2 className="h-10 w-10 text-[#6C0798]" strokeWidth={1.5} />
        <p className="mt-5 font-serif text-2xl text-[#19151C]">Welcome back to Agape.</p>
        <p className="mt-2 max-w-md font-sans text-sm leading-6 text-[#19151C]/60">{thanks}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-4">
        <legend className="mb-3 font-serif text-xl text-[#19151C]">About you</legend>
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <div>
            <label htmlFor="al-name" className={label}>Full name</label>
            <input id="al-name" name="fullName" required autoComplete="name" className={input} />
          </div>
          <div>
            <label htmlFor="al-year" className={label}>Year you left</label>
            <input id="al-year" name="classYear" inputMode="numeric" placeholder="e.g. 2019" required className={input} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="al-email" className={label}>Email</label>
            <input id="al-email" name="email" type="email" required autoComplete="email" className={input} />
          </div>
          <div>
            <label htmlFor="al-phone" className={label}>Phone / WhatsApp<Optional /></label>
            <input id="al-phone" name="phone" type="tel" autoComplete="tel" className={input} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="al-city" className={label}>City<Optional /></label>
            <input id="al-city" name="city" className={input} />
          </div>
          <div>
            <label htmlFor="al-country" className={label}>Country<Optional /></label>
            <input id="al-country" name="country" autoComplete="country-name" className={input} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-3 font-serif text-xl text-[#19151C]">Since Agape</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="al-uni" className={label}>University / college<Optional /></label>
            <input id="al-uni" name="university" className={input} />
          </div>
          <div>
            <label htmlFor="al-field" className={label}>What you studied<Optional /></label>
            <input id="al-field" name="fieldOfStudy" className={input} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="al-job" className={label}>What you do now<Optional /></label>
            <input id="al-job" name="occupation" placeholder="e.g. Software engineer at …" className={input} />
          </div>
          <div>
            <label htmlFor="al-industry" className={label}>Field<Optional /></label>
            <select id="al-industry" name="industry" defaultValue="" className={`${input} appearance-none`}>
              <option value="">Choose one</option>
              {INDUSTRIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="al-headline" className={label}>Describe yourself in one line<Optional /></label>
          <input id="al-headline" name="headline" maxLength={140} placeholder="e.g. Medical student at the University of Ghana" className={input} />
        </div>
        <div>
          <label htmlFor="al-story" className={label}>Your story<Optional /></label>
          <textarea
            id="al-story"
            name="story"
            rows={5}
            maxLength={4000}
            placeholder="What have you done since leaving Agape? What did Agape give you that you still carry?"
            className="w-full resize-y rounded-lg border border-[#19151C]/10 bg-[#FAF8F9] px-3.5 py-3 font-sans text-sm leading-6 outline-none focus:border-[#6C0798]/40 focus:bg-white focus:ring-4 focus:ring-[#6C0798]/10"
          />
        </div>
        <div>
          <label htmlFor="al-quote" className={label}>A short quote about Agape<Optional /></label>
          <input id="al-quote" name="quote" maxLength={280} className={input} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="al-linkedin" className={label}>LinkedIn<Optional /></label>
            <input id="al-linkedin" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/…" className={input} />
          </div>
          <div>
            <span className={label}>Photo<Optional /></span>
            <label className="flex h-12 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#19151C]/20 bg-[#FAF8F9] px-3.5 font-sans text-sm text-[#19151C]/60 hover:border-[#6C0798]/40">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.preview} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <ImagePlus size={17} />
              )}
              <span className="truncate">{photo ? photo.file.name : "Add a head-and-shoulders photo"}</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPhoto({ file: f, preview: URL.createObjectURL(f) });
                }}
              />
            </label>
          </div>
        </div>
      </fieldset>

      <div className="space-y-3 rounded-xl bg-[#FAF8F9] p-4">
        <label className="flex items-start gap-3 font-sans text-sm leading-5 text-[#19151C]/75">
          <input type="checkbox" name="openToMentor" className="mt-0.5 h-4 w-4 shrink-0 accent-[#6C0798]" />
          I&apos;d be happy to mentor current students or speak at a careers event.
        </label>
        <label className="flex items-start gap-3 font-sans text-sm leading-5 text-[#19151C]/75">
          <input type="checkbox" name="consentPublic" className="mt-0.5 h-4 w-4 shrink-0 accent-[#6C0798]" />
          Show my name, photo and story on the {identity.schoolName} website. (Your email and phone are never shown.)
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#6C0798] px-6 py-4 font-sans text-sm font-semibold text-white transition hover:bg-[#5B0680] disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            Join the alumni network <Send size={15} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
