"use client";

import Link from "next/link";
import GeoMark from "./GeoMark";
import { useSection } from "./content/ContentProvider";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Academics", href: "/academics" },
      { label: "Student Life", href: "/student-life" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { label: "How to Apply", href: "/admissions#how-to-apply" },
      { label: "Fees", href: "/admissions#fees" },
      { label: "Scholarships", href: "/admissions#scholarships" },
      { label: "International Students", href: "/admissions#international" },
      { label: "Book a Visit", href: "/admissions#book-a-visit" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Alumni", href: "/alumni" },
      { label: "News", href: "/news" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
};

export default function Footer() {
  const identity = useSection("site.identity");
  const contact = useSection("site.contact");
  const social = useSection("site.social");
  const portals = useSection("site.portals");

  const portalLinks = [
    { label: "Parent Portal", href: portals.parentPortal },
    { label: "Student Portal", href: portals.studentPortal },
    { label: "Staff Portal", href: portals.staffPortal },
  ].filter((l) => l.href);
  const columns = portalLinks.length ? [...COLUMNS, { title: "Portals", links: portalLinks }] : COLUMNS;
  const socialLinks = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="relative overflow-hidden bg-[#19151C] px-6 pb-10 pt-16 text-white sm:pt-20 lg:px-10">
      <GeoMark className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px]" opacity={0.06} />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="font-serif text-2xl">{identity.schoolName}</p>
            <p className="mt-4 max-w-xs font-serif text-lg leading-snug text-white/70">
              {identity.tagline}
            </p>
            <div className="mt-6 space-y-1 font-sans text-sm text-white/60">
              <p className="whitespace-pre-line">{contact.address}</p>
              {contact.phone && (
                <p>
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-white">
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.admissionsEmail && (
                <p>
                  <a href={`mailto:${contact.admissionsEmail}`} className="hover:text-white">
                    {contact.admissionsEmail}
                  </a>
                </p>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-sans text-sm">
                {socialLinks.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 underline-offset-4 hover:text-white hover:underline"
                  >
                    {SOCIAL_LABELS[key] ?? key}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-sans text-sm font-medium text-white">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} {identity.schoolName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5 font-sans text-xs text-white/50">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/safeguarding" className="hover:text-white">Safeguarding</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
