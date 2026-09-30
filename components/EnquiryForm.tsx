"use client";

import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useSection } from "./content/ContentProvider";

type EnquiryType = "general" | "admissions" | "visit" | "alumni";

interface EnquiryFormProps {
  type: EnquiryType;
  /** Contact page: lets the visitor say what the enquiry is about. */
  showTopic?: boolean;
  /** Admissions/visit: ask about the child. */
  showStudent?: boolean;
  /** Visit: ask for preferred dates. */
  showVisitDate?: boolean;
  /** Alumni: graduation year and current occupation. */
  showAlumni?: boolean;
  submitLabel?: string;
  tone?: "light" | "dark";
}

const TOPICS: { value: string; label: string; type: EnquiryType }[] = [
  { value: "Admissions", label: "Admissions", type: "admissions" },
  { value: "Campus visit", label: "Book a campus visit", type: "visit" },
  { value: "Academics", label: "Academics", type: "general" },
  { value: "Student life", label: "Student life", type: "general" },
  { value: "General", label: "General enquiry", type: "general" },
];

const input =
  "h-12 w-full rounded-lg border border-[#19151C]/10 bg-[#FAF8F9] px-3.5 font-sans text-xs text-[#19151C] outline-none transition-all placeholder:text-[#19151C]/30 focus:border-[#6C0798]/40 focus:bg-white focus:ring-4 focus:ring-[#6C0798]/10 sm:h-14 sm:rounded-xl sm:px-4 sm:text-sm";
const label = "mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[#19151C]/55 sm:mb-2 sm:text-xs";

function Optional() {
  return <span className="ml-1.5 font-normal normal-case tracking-normal text-[#19151C]/30">Optional</span>;
}

export default function EnquiryForm({
  type,
  showTopic = false,
  showStudent = false,
  showVisitDate = false,
  showAlumni = false,
  submitLabel = "Send my enquiry",
}: EnquiryFormProps) {
  const pathname = usePathname();
  const identity = useSection("site.identity");
  const stages = useSection("academics.stages").stages;
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("sending");

    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    const topic = TOPICS.find((t) => t.value === get("topic"));

    const details: Record<string, string> = {};
    if (showVisitDate && get("preferredDate")) details["Preferred visit date"] = get("preferredDate");
    if (showAlumni) {
      if (get("graduationYear")) details["Graduation year"] = get("graduationYear");
      if (get("occupation")) details["Currently"] = get("occupation");
    }

    const payload = {
      type: topic?.type ?? type,
      subject: topic?.value,
      name: `${get("firstName")} ${get("lastName")}`.trim(),
      email: get("email"),
      phone: get("phone"),
      studentName: get("studentName"),
      gradeOfInterest: get("grade"),
      entryYear: get("entryYear"),
      message: get("message"),
      sourcePage: pathname,
      details,
      website: get("website"),
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <div className="flex flex-col items-center rounded-xl bg-[#6C0798]/5 px-6 py-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-[#6C0798]" strokeWidth={1.5} />
        <p className="mt-5 font-serif text-2xl text-[#19151C]">Thank you, we&apos;ve received your message.</p>
        <p className="mt-2 max-w-sm font-sans text-sm leading-6 text-[#19151C]/55">
          A member of our team will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left sm:space-y-5">
      {/* Honeypot: hidden from people, tempting to bots */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${type}-firstName`} className={label}>
            First name
          </label>
          <input id={`${type}-firstName`} name="firstName" autoComplete="given-name" required className={input} />
        </div>
        <div>
          <label htmlFor={`${type}-lastName`} className={label}>
            Last name
          </label>
          <input id={`${type}-lastName`} name="lastName" autoComplete="family-name" required className={input} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${type}-email`} className={label}>
            Email address
          </label>
          <input id={`${type}-email`} name="email" type="email" autoComplete="email" required className={input} />
        </div>
        <div>
          <label htmlFor={`${type}-phone`} className={label}>
            Phone number
            {!showStudent && <Optional />}
          </label>
          <input
            id={`${type}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            required={showStudent}
            placeholder="+233..."
            className={input}
          />
        </div>
      </div>

      {showTopic && (
        <div>
          <label htmlFor={`${type}-topic`} className={label}>
            What can we help with?
          </label>
          <select id={`${type}-topic`} name="topic" required defaultValue="" className={`${input} appearance-none`}>
            <option value="" disabled>
              Select an enquiry type
            </option>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {(showStudent || showTopic) && (
        <div className={`grid gap-4 ${showStudent ? "md:grid-cols-3" : ""}`}>
          {showStudent && (
            <div>
              <label htmlFor={`${type}-studentName`} className={label}>
                Child&apos;s name
              </label>
              <input id={`${type}-studentName`} name="studentName" className={input} />
            </div>
          )}
          <div>
            <label htmlFor={`${type}-grade`} className={label}>
              {showStudent ? "Level" : "Student's level"}
              {!showStudent && <Optional />}
            </label>
            <select id={`${type}-grade`} name="grade" defaultValue="" className={`${input} appearance-none`}>
              <option value="">Select a level</option>
              {stages.map((s) => (
                <option key={s.title} value={s.title}>
                  {s.title} ({s.age})
                </option>
              ))}
            </select>
          </div>
          {showStudent && (
            <div>
              <label htmlFor={`${type}-entryYear`} className={label}>
                Starting
                <Optional />
              </label>
              <input id={`${type}-entryYear`} name="entryYear" placeholder="e.g. September 2027" className={input} />
            </div>
          )}
        </div>
      )}

      {showVisitDate && (
        <div>
          <label htmlFor={`${type}-preferredDate`} className={label}>
            Preferred date
            <Optional />
          </label>
          <input id={`${type}-preferredDate`} name="preferredDate" type="date" className={input} />
        </div>
      )}

      {showAlumni && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor={`${type}-graduationYear`} className={label}>
              Year you left Agape
            </label>
            <input id={`${type}-graduationYear`} name="graduationYear" inputMode="numeric" className={input} />
          </div>
          <div>
            <label htmlFor={`${type}-occupation`} className={label}>
              What you&apos;re doing now
              <Optional />
            </label>
            <input id={`${type}-occupation`} name="occupation" className={input} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${type}-message`} className={label}>
          {showVisitDate ? "Anything we should know?" : "Your message"}
          {(showVisitDate || showStudent) && <Optional />}
        </label>
        <textarea
          id={`${type}-message`}
          name="message"
          required={!showVisitDate && !showStudent}
          rows={4}
          className="min-h-[120px] w-full resize-none rounded-lg border border-[#19151C]/10 bg-[#FAF8F9] px-3.5 py-3 font-sans text-xs leading-5 text-[#19151C] outline-none transition-all placeholder:text-[#19151C]/30 focus:border-[#6C0798]/40 focus:bg-white focus:ring-4 focus:ring-[#6C0798]/10 sm:rounded-xl sm:px-4 sm:py-4 sm:text-sm sm:leading-6"
        />
      </div>

      <div className="flex items-start gap-2.5 pt-0.5 sm:gap-3 sm:pt-1">
        <input
          id={`${type}-privacy`}
          name="privacy"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#19151C]/20 accent-[#6C0798]"
        />
        <label htmlFor={`${type}-privacy`} className="font-sans text-[10px] leading-4 text-[#19151C]/50 sm:text-xs sm:leading-5">
          I agree that {identity.schoolName} may use the information provided to respond to my enquiry.
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-xs text-red-800 sm:text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#6C0798] px-5 font-sans text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#5B0680] hover:shadow-xl hover:shadow-[#6C0798]/20 active:translate-y-0 disabled:opacity-60 sm:h-14 sm:rounded-xl sm:gap-3 sm:px-6 sm:text-sm"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            {submitLabel}
            <Send size={15} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
