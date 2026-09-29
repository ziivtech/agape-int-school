import { Field, ImageValue, isPlaceholderImage } from "./fields";
import { SECTIONS, SectionKey, getSectionDef } from "./registry";

export interface ImageRef {
  key: SectionKey;
  path: string; // e.g. "photo" or "stages.2.photo"
  page: string;
  section: string;
  label: string;
  aspect?: string;
  value: ImageValue;
  placeholder: boolean;
}

/** Every image field across the site, for the Media library and dashboard. */
export function collectImages(sections: Record<string, { data: Record<string, unknown> }>): ImageRef[] {
  const out: ImageRef[] = [];

  const walk = (key: SectionKey, fields: Field[], data: Record<string, unknown>, prefix: string, labelPrefix: string) => {
    for (const field of fields) {
      const value = data?.[field.name];
      if (field.type === "image") {
        const v = (value as ImageValue) ?? { url: "", alt: "" };
        const def = getSectionDef(key);
        out.push({
          key,
          path: prefix + field.name,
          page: def.page,
          section: def.label,
          label: labelPrefix + field.label,
          aspect: field.aspect,
          value: v,
          placeholder: isPlaceholderImage(v.url),
        });
      } else if (field.type === "list" && Array.isArray(value)) {
        value.forEach((item, i) => {
          const itemName =
            (item as Record<string, unknown>).title || (item as Record<string, unknown>).name || `${field.itemLabel} ${i + 1}`;
          walk(key, field.fields, item as Record<string, unknown>, `${prefix}${field.name}.${i}.`, `${labelPrefix}${itemName} › `);
        });
      }
    }
  };

  for (const key of Object.keys(SECTIONS) as SectionKey[]) {
    const def = getSectionDef(key);
    walk(key, def.fields, sections[key]?.data ?? (def.defaults as Record<string, unknown>), "", "");
  }

  // Optional portraits left empty on purpose aren't placeholders worth nagging about.
  return out.filter((img) => img.value.url || !/optional/i.test(img.label));
}
