import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  jsonb,
  date,
  pgEnum,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

/* ---------------------------------------------------------------
   Staff accounts
--------------------------------------------------------------- */

export const userRole = pgEnum("user_role", ["admin", "editor", "admissions"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("editor"),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ---------------------------------------------------------------
   Website content (CMS)
--------------------------------------------------------------- */

// One row per edited section of the site, e.g. "home.hero" (text and images).
// Sections never edited have no row; the code defaults are shown instead.
export const contentSections = pgTable("content_sections", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull().$type<Record<string, unknown>>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
});

export const galleryPhotos = pgTable("gallery_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  caption: text("caption").notNull().default(""),
  url: text("url").notNull(),
  publicId: text("public_id"),
  sortOrder: integer("sort_order").notNull().default(0),
  // Photos in an album are deleted with it; photos without one are the general gallery.
  albumId: uuid("album_id").references((): AnyPgColumn => albums.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const publishStatus = pgEnum("publish_status", ["draft", "published"]);

export const newsPosts = pgTable(
  "news_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    body: text("body").notNull().default(""),
    coverUrl: text("cover_url"),
    coverAlt: text("cover_alt"),
    author: text("author"),
    featured: boolean("featured").notNull().default(false),
    status: publishStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("news_status_published_idx").on(t.status, t.publishedAt)]
);

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    category: text("category").notNull().default("School"),
    startsOn: date("starts_on"),
    endsOn: date("ends_on"),
    // Free text for dates not yet fixed ("Term 2", "To be confirmed").
    dateLabel: text("date_label"),
    timeLabel: text("time_label"),
    location: text("location"),
    description: text("description").notNull().default(""),
    imageUrl: text("image_url"),
    status: publishStatus("status").notNull().default("published"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("events_starts_on_idx").on(t.startsOn)]
);

/* ---------------------------------------------------------------
   Photo albums (e.g. "Sports Day 2026")
--------------------------------------------------------------- */

export const albums = pgTable(
  "albums",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    date: date("date"),
    coverUrl: text("cover_url"),
    eventId: uuid("event_id").references(() => events.id, { onDelete: "set null" }),
    newsPostId: uuid("news_post_id").references(() => newsPosts.id, { onDelete: "set null" }),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("albums_date_idx").on(t.date)]
);

/* ---------------------------------------------------------------
   Enquiries (CRM)
--------------------------------------------------------------- */

export const enquiryType = pgEnum("enquiry_type", ["general", "admissions", "visit", "alumni"]);

export const enquiryStatus = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "visit_booked",
  "applied",
  "enrolled",
  "closed",
]);

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: enquiryType("type").notNull().default("general"),
    status: enquiryStatus("status").notNull().default("new"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    studentName: text("student_name"),
    gradeOfInterest: text("grade_of_interest"),
    entryYear: text("entry_year"),
    subject: text("subject"),
    message: text("message").notNull().default(""),
    sourcePage: text("source_page"),
    // Extra form fields that don't warrant their own column.
    details: jsonb("details").$type<Record<string, string>>().notNull().default({}),
    assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("enquiries_status_idx").on(t.status),
    index("enquiries_created_idx").on(t.createdAt),
  ]
);

export const enquiryNotes = pgTable("enquiry_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiryId: uuid("enquiry_id")
    .notNull()
    .references(() => enquiries.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  body: text("body").notNull(),
  // "note" for staff notes, "status" for automatic status-change entries.
  kind: text("kind").notNull().default("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ---------------------------------------------------------------
   Alumni
--------------------------------------------------------------- */

export const alumniStatus = pgEnum("alumni_status", ["pending", "published", "hidden"]);

export const alumni = pgTable(
  "alumni",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    fullName: text("full_name").notNull(),
    classYear: integer("class_year"),
    photoUrl: text("photo_url"),
    // One line under their name, e.g. "Medical student, University of Ghana".
    headline: text("headline"),
    occupation: text("occupation"),
    industry: text("industry"),
    university: text("university"),
    fieldOfStudy: text("field_of_study"),
    city: text("city"),
    country: text("country"),
    story: text("story").notNull().default(""),
    quote: text("quote"),
    linkedinUrl: text("linkedin_url"),
    // Private: never shown on the website.
    email: text("email"),
    phone: text("phone"),
    consentPublic: boolean("consent_public").notNull().default(false),
    openToMentor: boolean("open_to_mentor").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    status: alumniStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("alumni_status_idx").on(t.status), index("alumni_class_year_idx").on(t.classYear)]
);

/* ---------------------------------------------------------------
   Downloads centre
--------------------------------------------------------------- */

export const downloads = pgTable(
  "downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    category: text("category").notNull(),
    fileUrl: text("file_url").notNull(),
    fileName: text("file_name"),
    // e.g. "pdf", "docx"
    fileType: text("file_type"),
    fileSize: integer("file_size"),
    publicId: text("public_id"),
    published: boolean("published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    downloadCount: integer("download_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("downloads_category_idx").on(t.category, t.sortOrder)]
);

/* ---------------------------------------------------------------
   Audit trail
--------------------------------------------------------------- */

export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Role = (typeof userRole.enumValues)[number];
export type NewsPost = typeof newsPosts.$inferSelect;
export type SchoolEvent = typeof events.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type EnquiryStatus = (typeof enquiryStatus.enumValues)[number];
export type EnquiryType = (typeof enquiryType.enumValues)[number];
export type GalleryPhotoRow = typeof galleryPhotos.$inferSelect;
export type Alumnus = typeof alumni.$inferSelect;
export type AlumniStatus = (typeof alumniStatus.enumValues)[number];
export type DownloadRow = typeof downloads.$inferSelect;
export type AlbumRow = typeof albums.$inferSelect;
