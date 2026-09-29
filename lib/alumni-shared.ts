/* Alumni helpers safe to use in browser code (no validation library). */

import type { Alumnus } from "./db/schema";

export const INDUSTRIES = [
  "Still studying",
  "Business & finance",
  "Education",
  "Engineering & technology",
  "Health & medicine",
  "Law & public service",
  "Ministry & non-profit",
  "Arts, media & design",
  "Science & research",
  "Entrepreneurship",
  "Other",
];

/* ---------------- Public shape (no private contact details) ---------------- */

export interface AlumniCard {
  slug: string;
  fullName: string;
  classYear: number | null;
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
  openToMentor: boolean;
  featured: boolean;
}

export function toAlumniCard(a: Alumnus): AlumniCard {
  return {
    slug: a.slug,
    fullName: a.fullName,
    classYear: a.classYear,
    photoUrl: a.photoUrl ?? "",
    headline: a.headline ?? "",
    occupation: a.occupation ?? "",
    industry: a.industry ?? "",
    university: a.university ?? "",
    fieldOfStudy: a.fieldOfStudy ?? "",
    city: a.city ?? "",
    country: a.country ?? "",
    story: a.story,
    quote: a.quote ?? "",
    linkedinUrl: a.linkedinUrl ?? "",
    openToMentor: a.openToMentor,
    featured: a.featured,
  };
}

/** "Medical student, University of Ghana" — falls back to what we know. */
export function alumniSubtitle(a: Pick<AlumniCard, "headline" | "occupation" | "university">) {
  return a.headline || a.occupation || a.university;
}

export function alumniPlace(a: Pick<AlumniCard, "city" | "country">) {
  return [a.city, a.country].filter(Boolean).join(", ");
}
