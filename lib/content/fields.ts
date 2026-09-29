/* ---------------------------------------------------------------
   Field definitions for editable site content.

   A section declares its fields (drives the admin form) and its
   defaults (what the site shows until staff change something).
--------------------------------------------------------------- */

export interface ImageValue {
  url: string;
  alt: string;
}

interface BaseField {
  name: string;
  label: string;
  help?: string;
}

export interface TextField extends BaseField {
  type: "text" | "textarea" | "url";
}

export interface ImageField extends BaseField {
  type: "image";
  /** e.g. "16:9", used as guidance in the uploader */
  aspect?: string;
}

export interface StringsField extends BaseField {
  type: "strings";
  itemLabel?: string;
}

export interface ListField extends BaseField {
  type: "list";
  itemLabel: string;
  fields: (TextField | ImageField | StringsField)[];
}

export type Field = TextField | ImageField | StringsField | ListField;

export interface SectionDef<T extends Record<string, unknown> = Record<string, unknown>> {
  page: string;
  label: string;
  description?: string;
  fields: Field[];
  defaults: T;
}

export function defineSection<T extends Record<string, unknown>>(def: SectionDef<T>): SectionDef<T> {
  return def;
}

export const img = (url: string, alt: string): ImageValue => ({ url, alt });

/* Images that should be replaced with real school photography. */
export function isPlaceholderImage(url: string | undefined | null): boolean {
  if (!url) return true;
  return url.includes("images.unsplash.com") || url.startsWith("/images/");
}

/* ---------------------------------------------------------------
   Merging stored values over defaults.
   Anything malformed in the database is ignored field-by-field,
   so a bad save can never blank out a whole section.
--------------------------------------------------------------- */

function isImage(v: unknown): v is ImageValue {
  return typeof v === "object" && v !== null && typeof (v as ImageValue).url === "string";
}

function coerce(field: Field, stored: unknown, fallback: unknown): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
    case "url":
      return typeof stored === "string" ? stored : fallback;
    case "image":
      if (!isImage(stored)) return fallback;
      return { url: stored.url || (fallback as ImageValue)?.url || "", alt: stored.alt ?? "" };
    case "strings":
      return Array.isArray(stored) ? stored.filter((s) => typeof s === "string") : fallback;
    case "list": {
      if (!Array.isArray(stored)) return fallback;
      return stored
        .filter((item) => typeof item === "object" && item !== null)
        .map((item, i) => {
          const base = ((fallback as Record<string, unknown>[])?.[i] ?? {}) as Record<string, unknown>;
          const out: Record<string, unknown> = {};
          for (const sub of field.fields) {
            out[sub.name] = coerce(sub, (item as Record<string, unknown>)[sub.name], base[sub.name] ?? emptyValue(sub));
          }
          return out;
        });
    }
  }
}

export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "image":
      return { url: "", alt: "" };
    case "strings":
    case "list":
      return [];
    default:
      return "";
  }
}

export function mergeSection<T extends Record<string, unknown>>(def: SectionDef<T>, stored: unknown): T {
  if (!stored || typeof stored !== "object") return def.defaults;
  const out: Record<string, unknown> = { ...def.defaults };
  for (const field of def.fields) {
    if (field.name in (stored as object)) {
      out[field.name] = coerce(field, (stored as Record<string, unknown>)[field.name], def.defaults[field.name]);
    }
  }
  return out as T;
}
