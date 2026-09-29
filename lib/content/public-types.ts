import type { NewsPost, SchoolEvent } from "../db/schema";

// Plain, serialisable shapes passed from server pages to client components.
// (Cached rows come back with dates as strings, so everything is normalised here.)

export interface NewsCard {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  coverAlt: string;
  author: string;
  featured: boolean;
  publishedAt: string | null;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  startsOn: string | null;
  endsOn: string | null;
  dateLabel: string;
  timeLabel: string;
  location: string;
  description: string;
  imageUrl: string;
}

const iso = (d: Date | string | null | undefined) => (d ? new Date(d).toISOString() : null);

export function toNewsCard(p: NewsPost): NewsCard {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    excerpt: p.excerpt,
    body: p.body,
    coverUrl: p.coverUrl ?? "",
    coverAlt: p.coverAlt ?? p.title,
    author: p.author ?? "",
    featured: p.featured,
    publishedAt: iso(p.publishedAt),
  };
}

export function toEventItem(e: SchoolEvent): EventItem {
  return {
    id: e.id,
    title: e.title,
    category: e.category,
    startsOn: e.startsOn,
    endsOn: e.endsOn,
    dateLabel: e.dateLabel ?? "",
    timeLabel: e.timeLabel ?? "",
    location: e.location ?? "",
    description: e.description,
    imageUrl: e.imageUrl ?? "",
  };
}

export function formatNewsDate(isoDate: string | null): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** "12 March 2026", "12–14 March 2026", or the free-text label. */
export function formatEventDate(e: Pick<EventItem, "startsOn" | "endsOn" | "dateLabel">): string {
  if (!e.startsOn) return e.dateLabel || "Date to be confirmed";
  const fmt = (d: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", opts);
  const full: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  if (!e.endsOn || e.endsOn === e.startsOn) return fmt(e.startsOn, full);
  const sameMonth = e.startsOn.slice(0, 7) === e.endsOn.slice(0, 7);
  return sameMonth
    ? `${fmt(e.startsOn, { day: "numeric" })}–${fmt(e.endsOn, full)}`
    : `${fmt(e.startsOn, { day: "numeric", month: "long" })} – ${fmt(e.endsOn, full)}`;
}
