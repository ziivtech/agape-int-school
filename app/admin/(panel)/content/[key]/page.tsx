import { notFound } from "next/navigation";
import { requirePageArea } from "@/lib/auth/page";
import { getSectionDef, isSectionKey } from "@/lib/content/registry";
import { loadSectionFresh } from "@/lib/content/server";
import { publicUrlFor } from "@/lib/content/pages";
import SectionEditor from "@/components/admin/SectionEditor";

export default async function EditSectionPage({ params }: { params: { key: string } }) {
  await requirePageArea("content");
  const key = decodeURIComponent(params.key);
  if (!isSectionKey(key)) notFound();

  const def = getSectionDef(key);
  const { data, customised } = await loadSectionFresh(key);

  return (
    <SectionEditor
      sectionKey={key}
      page={def.page}
      label={def.label}
      description={def.description}
      fields={def.fields}
      initial={data as Record<string, unknown>}
      customised={customised}
      viewUrl={publicUrlFor(key, def.page)}
    />
  );
}
