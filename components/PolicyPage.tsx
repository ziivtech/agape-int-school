import GeoMark from "./GeoMark";
import { getSection } from "../lib/content/server";

type PolicyKey = "legal.privacy" | "legal.safeguarding" | "legal.accessibility";

export default async function PolicyPage({ sectionKey }: { sectionKey: PolicyKey }) {
  const c = await getSection(sectionKey);
  const contact = await getSection("site.contact");

  return (
    <main className="bg-[#FAF8F9]">
      <section className="relative overflow-hidden bg-[#4B075F] px-6 pb-16 pt-40 text-white sm:px-10 sm:pt-48 lg:px-16">
        <GeoMark className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px]" opacity={0.08} />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-sans text-sm font-medium text-[#E9C7DE]">Policies</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] sm:text-6xl">{c.heading}</h1>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/80">{c.description}</p>
          {c.updated && <p className="mt-4 font-sans text-sm text-white/55">Last updated {c.updated}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-20">
        {c.sections.length > 0 ? (
          <div className="space-y-12">
            {c.sections.map((section, i) => (
              <div key={section.title + i}>
                <h2 className="font-serif text-2xl text-[#19151C]">{section.title}</h2>
                {section.body
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((para, j) => (
                    <p key={j} className="mt-3 whitespace-pre-line font-sans leading-relaxed text-[#19151C]/70">
                      {para}
                    </p>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="font-sans leading-relaxed text-[#19151C]/70">
            For a copy of this policy, please contact the school
            {contact.email && (
              <>
                {" "}
                at{" "}
                <a href={`mailto:${contact.email}`} className="text-[#6C0798] underline underline-offset-2">
                  {contact.email}
                </a>
              </>
            )}
            .
          </p>
        )}
      </section>
    </main>
  );
}
