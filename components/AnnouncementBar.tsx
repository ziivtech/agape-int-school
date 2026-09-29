"use client";

import Link from "next/link";
import { useSection } from "./content/ContentProvider";

export default function AnnouncementBar() {
  const { message, linkLabel, linkUrl } = useSection("site.announcement");
  if (!message.trim()) return null;

  return (
    <div className="relative z-[60] bg-[#E12F41] px-6 py-2 text-center font-sans text-xs text-white sm:text-sm">
      <span>{message}</span>
      {linkLabel && linkUrl && (
        <Link href={linkUrl} className="ml-2 font-medium underline underline-offset-2 hover:text-white/85">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
