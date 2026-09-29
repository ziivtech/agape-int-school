import { z } from "zod";

import { ENQUIRY_TYPES } from "./enquiry-labels";

export * from "./enquiry-labels";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

// What the public forms may send.
export const enquirySchema = z.object({
  type: z.enum(ENQUIRY_TYPES).default("general"),
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  phone: optional(40),
  studentName: optional(120),
  gradeOfInterest: optional(80),
  entryYear: optional(40),
  subject: optional(120),
  message: z.string().trim().max(5000).default(""),
  sourcePage: optional(200),
  details: z.record(z.string(), z.string().max(500)).optional(),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** An image/link reference: an absolute http(s) URL or a site path like "/photo.jpg". */
export const linkSchema = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), "Links must start with https:// or /");
