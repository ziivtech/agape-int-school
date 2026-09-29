import { z } from "zod";
import { linkSchema } from "./enquiries";
export * from "./alumni-shared";

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

const thisYear = new Date().getFullYear();

const classYear = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((v, ctx) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1950 || n > thisYear + 1) {
      ctx.addIssue({ code: "custom", message: "Enter the year you left Agape, e.g. 2019." });
      return z.NEVER;
    }
    return n;
  });

/** Fields an alumnus can fill in about themselves. */
const profileFields = {
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  classYear,
  headline: text(140),
  occupation: text(140),
  industry: text(60),
  university: text(160),
  fieldOfStudy: text(120),
  city: text(80),
  country: text(80),
  story: z.string().trim().max(4000).default(""),
  quote: text(280),
  linkedinUrl: linkSchema
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  photoUrl: linkSchema
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  openToMentor: z.boolean().default(false),
};

/** Public "join the alumni network" form. */
export const alumniRegistrationSchema = z.object({
  ...profileFields,
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  phone: text(40),
  consentPublic: z.boolean().default(false),
  website: z.string().optional(), // honeypot
});

/** Admin create / edit. */
export const alumniAdminSchema = z.object({
  ...profileFields,
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "The web address can only use lowercase letters, numbers and hyphens.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(200)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  phone: text(40),
  consentPublic: z.boolean().default(false),
  featured: z.boolean().default(false),
  status: z.enum(["pending", "published", "hidden"]).default("pending"),
});

