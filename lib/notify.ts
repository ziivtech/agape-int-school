import type { Enquiry } from "./db/schema";
import { TYPE_LABELS } from "./enquiries";

/**
 * Emails staff when a new enquiry arrives, via Resend's HTTP API.
 * Silently does nothing unless RESEND_API_KEY and ENQUIRY_NOTIFY_EMAIL are set.
 */
export async function notifyNewEnquiry(enquiry: Enquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const from = process.env.ENQUIRY_FROM_EMAIL || "Agape Website <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const lines = [
    `Type: ${TYPE_LABELS[enquiry.type]}`,
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    enquiry.phone && `Phone: ${enquiry.phone}`,
    enquiry.studentName && `Student: ${enquiry.studentName}`,
    enquiry.gradeOfInterest && `Grade of interest: ${enquiry.gradeOfInterest}`,
    enquiry.entryYear && `Entry: ${enquiry.entryYear}`,
    enquiry.subject && `Subject: ${enquiry.subject}`,
    ...Object.entries(enquiry.details ?? {}).map(([k, v]) => `${k}: ${v}`),
    "",
    enquiry.message,
    "",
    siteUrl && `Open in admin: ${siteUrl}/admin/enquiries/${enquiry.id}`,
  ].filter((l): l is string => typeof l === "string");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: enquiry.email,
        subject: `New ${TYPE_LABELS[enquiry.type].toLowerCase()} enquiry from ${enquiry.name}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) console.error("Enquiry notification failed", res.status, await res.text());
  } catch (err) {
    console.error("Enquiry notification failed", err);
  }
}

/** Tells staff someone has joined the alumni network and needs approving. */
export async function notifyNewAlumnus(a: { id: string; fullName: string; classYear: number | null; email: string | null; consentPublic: boolean }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const text = [
    `${a.fullName}${a.classYear ? ` (class of ${a.classYear})` : ""} joined the alumni network.`,
    a.email ? `Email: ${a.email}` : "",
    a.consentPublic ? "They are happy to appear on the website — review and approve their profile." : "They asked not to appear publicly.",
    siteUrl ? `Review: ${siteUrl}/admin/alumni/${a.id}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL || "Agape Website <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()),
        reply_to: a.email ?? undefined,
        subject: `New alumni sign-up: ${a.fullName}`,
        text,
      }),
    });
  } catch (err) {
    console.error("Alumni notification failed", err);
  }
}
