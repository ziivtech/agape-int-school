import { unstable_cache, revalidateTag } from "next/cache";
import { and, asc, desc, eq, gte, isNull, or } from "drizzle-orm";
import { getDb, schema } from "../db";
import { SECTIONS, SectionKey, SectionData, getSectionDef } from "./registry";
import { mergeSection } from "./fields";
import { getOptimizedCloudinaryUrl } from "../cloudinary";

export const CONTENT_TAG = "site-content";
export const NEWS_TAG = "news";
export const EVENTS_TAG = "events";
export const GALLERY_TAG = "gallery";

export type SiteContent = { [K in SectionKey]: SectionData<K> };

function optimiseImages(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(optimiseImages);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.url === "string" && "alt" in obj) {
      return { ...obj, url: getOptimizedCloudinaryUrl(obj.url) };
    }
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, optimiseImages(v)]));
  }
  return value;
}

/** Raw stored overrides keyed by section. Cached until an admin saves. */
const loadStoredSections = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const db = getDb();
    if (!db) return {};
    try {
      const rows = await db.select().from(schema.contentSections);
      return Object.fromEntries(rows.map((r) => [r.key, r.data]));
    } catch (err) {
      console.error("Failed to load site content; using defaults", err);
      return {};
    }
  },
  ["site-content"],
  { tags: [CONTENT_TAG] }
);

/** All site content: stored values merged over code defaults. */
export async function getSiteContent(): Promise<SiteContent> {
  const stored = await loadStoredSections();
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(SECTIONS) as SectionKey[]) {
    out[key] = optimiseImages(mergeSection(getSectionDef(key), stored[key]));
  }
  return out as SiteContent;
}

export async function getSection<K extends SectionKey>(key: K): Promise<SectionData<K>> {
  return (await getSiteContent())[key];
}

/* ---------------------------------------------------------------
   Collections
--------------------------------------------------------------- */

export const getPublishedNews = unstable_cache(
  async (limit?: number) => {
    const db = getDb();
    if (!db) return [];
    try {
      const q = db
        .select()
        .from(schema.newsPosts)
        .where(eq(schema.newsPosts.status, "published"))
        .orderBy(desc(schema.newsPosts.publishedAt));
      return limit ? await q.limit(limit) : await q;
    } catch (err) {
      console.error("Failed to load news", err);
      return [];
    }
  },
  ["news-published"],
  { tags: [NEWS_TAG] }
);

export const getNewsBySlug = unstable_cache(
  async (slug: string) => {
    const db = getDb();
    if (!db) return null;
    const [post] = await db
      .select()
      .from(schema.newsPosts)
      .where(and(eq(schema.newsPosts.slug, slug), eq(schema.newsPosts.status, "published")));
    return post ?? null;
  },
  ["news-by-slug"],
  { tags: [NEWS_TAG] }
);

export const getUpcomingEvents = unstable_cache(
  async (limit?: number) => {
    const db = getDb();
    if (!db) return [];
    try {
      const today = new Date().toISOString().slice(0, 10);
      const q = db
        .select()
        .from(schema.events)
        .where(
          and(
            eq(schema.events.status, "published"),
            // Undated events ("To be confirmed") stay listed until removed.
            or(isNull(schema.events.startsOn), gte(schema.events.endsOn, today), gte(schema.events.startsOn, today))
          )
        )
        .orderBy(asc(schema.events.startsOn));
      return limit ? await q.limit(limit) : await q;
    } catch (err) {
      console.error("Failed to load events", err);
      return [];
    }
  },
  ["events-upcoming"],
  { tags: [EVENTS_TAG], revalidate: 3600 }
);

export const getGalleryPhotos = unstable_cache(
  async () => {
    const db = getDb();
    if (!db) return [];
    try {
      const rows = await db
        .select()
        .from(schema.galleryPhotos)
        .orderBy(asc(schema.galleryPhotos.sortOrder), desc(schema.galleryPhotos.createdAt));
      return rows.map((r) => ({ ...r, url: getOptimizedCloudinaryUrl(r.url) }));
    } catch (err) {
      console.error("Failed to load gallery", err);
      return [];
    }
  },
  ["gallery"],
  { tags: [GALLERY_TAG] }
);

export function refreshContent(tag: string) {
  revalidateTag(tag);
}

/* ---------------------------------------------------------------
   Uncached reads for the admin (always the latest saved values)
--------------------------------------------------------------- */

export async function loadSectionFresh<K extends SectionKey>(key: K): Promise<{ data: SectionData<K>; updatedAt: Date | null; customised: boolean }> {
  const def = getSectionDef(key);
  const db = getDb();
  if (!db) return { data: def.defaults as SectionData<K>, updatedAt: null, customised: false };
  const [row] = await db.select().from(schema.contentSections).where(eq(schema.contentSections.key, key));
  return {
    data: mergeSection(def, row?.data) as SectionData<K>,
    updatedAt: row?.updatedAt ?? null,
    customised: Boolean(row),
  };
}

export async function loadAllSectionsFresh(): Promise<Record<string, { data: Record<string, unknown>; updatedAt: Date | null }>> {
  const db = getDb();
  const rows = db ? await db.select().from(schema.contentSections) : [];
  const stored = new Map(rows.map((r) => [r.key, r]));
  const out: Record<string, { data: Record<string, unknown>; updatedAt: Date | null }> = {};
  for (const key of Object.keys(SECTIONS) as SectionKey[]) {
    const row = stored.get(key);
    out[key] = { data: mergeSection(getSectionDef(key), row?.data), updatedAt: row?.updatedAt ?? null };
  }
  return out;
}

/* ---------------------------------------------------------------
   Alumni (only published profiles with consent ever leave here)
--------------------------------------------------------------- */

export const ALUMNI_TAG = "alumni";

export const getPublishedAlumni = unstable_cache(
  async () => {
    const db = getDb();
    if (!db) return [];
    try {
      return await db
        .select()
        .from(schema.alumni)
        .where(and(eq(schema.alumni.status, "published"), eq(schema.alumni.consentPublic, true)))
        .orderBy(desc(schema.alumni.featured), desc(schema.alumni.classYear), asc(schema.alumni.fullName));
    } catch (err) {
      console.error("Failed to load alumni", err);
      return [];
    }
  },
  ["alumni-published"],
  { tags: [ALUMNI_TAG] }
);
