CREATE TYPE "public"."alumni_status" AS ENUM('pending', 'published', 'hidden');--> statement-breakpoint
CREATE TABLE "alumni" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"full_name" text NOT NULL,
	"class_year" integer,
	"photo_url" text,
	"headline" text,
	"occupation" text,
	"industry" text,
	"university" text,
	"field_of_study" text,
	"city" text,
	"country" text,
	"story" text DEFAULT '' NOT NULL,
	"quote" text,
	"linkedin_url" text,
	"email" text,
	"phone" text,
	"consent_public" boolean DEFAULT false NOT NULL,
	"open_to_mentor" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"status" "alumni_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "alumni_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "alumni_status_idx" ON "alumni" USING btree ("status");--> statement-breakpoint
CREATE INDEX "alumni_class_year_idx" ON "alumni" USING btree ("class_year");