"use client";

import { createContext, useContext } from "react";
import type { SectionKey, SectionData } from "../../lib/content/registry";
import type { SiteContent } from "../../lib/content/server";

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

/** Editable content for one section, as saved in the admin (or its defaults). */
export function useSection<K extends SectionKey>(key: K): SectionData<K> {
  const content = useContext(ContentContext);
  if (!content) throw new Error("useSection must be used inside <ContentProvider> (app/layout.tsx).");
  return content[key];
}
