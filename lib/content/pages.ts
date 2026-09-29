/** Where each admin "page" group lives on the public site. */
export const PAGE_URLS: Record<string, string> = {
  "Site-wide": "/",
  Homepage: "/",
  About: "/about",
  Academics: "/academics",
  Admissions: "/admissions",
  Contact: "/contact",
  "Student Life": "/student-life",
  News: "/news",
  Events: "/events",
  Gallery: "/gallery",
  Alumni: "/alumni",
  Policies: "/privacy",
};

const SPECIFIC: Record<string, string> = {
  "studentLife.clubs": "/student-life/clubs",
  "studentLife.sports": "/student-life/sports",
  "studentLife.arts": "/student-life/arts",
  "studentLife.leadership": "/student-life/leadership",
  "studentLife.trips": "/student-life/trips",
  "studentLife.studentUnion": "/student-life/student-union",
  "legal.privacy": "/privacy",
  "legal.safeguarding": "/safeguarding",
  "legal.accessibility": "/accessibility",
};

export function publicUrlFor(key: string, page: string): string | undefined {
  return SPECIFIC[key] ?? PAGE_URLS[page];
}
