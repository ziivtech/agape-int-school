import { SectionDef } from "./fields";
import { siteSections } from "./sections/site";
import { aboutSections } from "./sections/about";
import { academicsSections } from "./sections/academics";
import { admissionsSections } from "./sections/admissions";
import { contactSections } from "./sections/contact";
import { studentLifeSections } from "./sections/student-life";
import { studentLifeSubpageSections } from "./sections/student-life-subpages";
import { moreSections } from "./sections/more";
import { homeSections } from "./sections/home";

// Every editable section on the website. Add a section here and it
// automatically appears in the admin Content editor.
export const SECTIONS = {
  ...siteSections,
  ...homeSections,
  ...aboutSections,
  ...academicsSections,
  ...admissionsSections,
  ...contactSections,
  ...studentLifeSections,
  ...studentLifeSubpageSections,
  ...moreSections,
};

export type SectionKey = keyof typeof SECTIONS;
export type SectionData<K extends SectionKey> = (typeof SECTIONS)[K]["defaults"];

export function isSectionKey(key: string): key is SectionKey {
  return Object.prototype.hasOwnProperty.call(SECTIONS, key);
}

export function getSectionDef(key: SectionKey): SectionDef {
  return SECTIONS[key] as unknown as SectionDef;
}

/** Sections grouped by page, in registry order, for the admin. */
export function sectionsByPage(): { page: string; sections: { key: SectionKey; def: SectionDef }[] }[] {
  const groups = new Map<string, { key: SectionKey; def: SectionDef }[]>();
  for (const key of Object.keys(SECTIONS) as SectionKey[]) {
    const def = getSectionDef(key);
    if (!groups.has(def.page)) groups.set(def.page, []);
    groups.get(def.page)!.push({ key, def });
  }
  return Array.from(groups, ([page, sections]) => ({ page, sections }));
}
