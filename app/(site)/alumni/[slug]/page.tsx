import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, HandHeart, Linkedin } from "lucide-react";
import AlumniAvatar from "@/components/alumni/AlumniAvatar";
import { getPublishedAlumni } from "@/lib/content/server";
import { AlumniCard, alumniPlace, alumniSubtitle, toAlumniCard } from "@/lib/alumni-shared";

type Props = { params: { slug: string } };

async function load(slug: string) {
  const all = (await getPublishedAlumni()).map(toAlumniCard);
  return { person: all.find((a) => a.slug === slug), all };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { person } = await load(params.slug);
  if (!person) return { title: "Alumni" };
  const sub = alumniSubtitle(person);
  return {
    title: `${person.fullName}${person.classYear ? `, Class of ${person.classYear}` : ""}`,
    description: sub || `${person.fullName} is a graduate of Agape Academy International.`,
    openGraph: person.photoUrl ? { images: [person.photoUrl] } : undefined,
  };
}

export default async function AlumniProfilePage({ params }: Props) {
  const { person, all } = await load(params.slug);
  if (!person) notFound();

  const facts: [string, string][] = (
    [
      ["Class of", person.classYear ? String(person.classYear) : ""],
      ["Studied", [person.fieldOfStudy, person.university].filter(Boolean).join(" at ")],
      ["Now", person.occupation],
      ["Field", person.industry],
      ["Based in", alumniPlace(person)],
    ] as [string, string][]
  ).filter(([, v]) => v);

  const classmates: AlumniCard[] = all
    .filter((a) => a.slug !== person.slug && person.classYear && a.classYear === person.classYear)
    .slice(0, 4);
  const more = classmates.length ? classmates : all.filter((a) => a.slug !== person.slug).slice(0, 4);

  return (
    <main className="bg-[#FAF8F9] text-[#19151C]">
      <section className="bg-[#19151C] px-5 pb-16 pt-32 text-white sm:px-8 sm:pt-40 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/alumni#directory" className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white/55 hover:text-white">
            <ArrowLeft size={14} /> Alumni directory
          </Link>

          <div className="mt-10 grid items-end gap-10 md:grid-cols-[320px_1fr] md:gap-14">
            <div className="overflow-hidden rounded-2xl">
              <AlumniAvatar name={person.fullName} photoUrl={person.photoUrl} className="aspect-[4/5] w-full" textClass="text-7xl" />
            </div>
            <div>
              {person.classYear && (
                <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#E12F41]">Class of {person.classYear}</p>
              )}
              <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-7xl">{person.fullName}</h1>
              {alumniSubtitle(person) && <p className="mt-5 max-w-xl font-sans text-lg leading-7 text-white/70">{alumniSubtitle(person)}</p>}
              <div className="mt-7 flex flex-wrap gap-3">
                {person.linkedinUrl && (
                  <a
                    href={person.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-sans text-sm hover:bg-white/10"
                  >
                    <Linkedin size={15} /> LinkedIn
                  </a>
                )}
                {person.openToMentor && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-sans text-sm text-white/85">
                    <HandHeart size={15} /> Happy to mentor students
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[320px_1fr] md:gap-14">
          {facts.length > 0 && (
            <dl className="space-y-5 self-start border-t border-[#19151C]/10 pt-6">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#19151C]/45">{k}</dt>
                  <dd className="mt-1 font-sans text-base">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className={facts.length ? "" : "md:col-span-2"}>
            {person.quote && (
              <blockquote className="mb-10 border-l-2 border-[#E12F41] pl-6 font-serif text-3xl leading-snug text-[#19151C]/85">“{person.quote}”</blockquote>
            )}
            {person.story ? (
              <div className="max-w-2xl space-y-5">
                {person.story
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="whitespace-pre-line font-sans text-lg leading-8 text-[#19151C]/75">
                      {para}
                    </p>
                  ))}
              </div>
            ) : (
              !person.quote && <p className="font-sans text-[#19151C]/55">{person.fullName.split(" ")[0]} hasn&apos;t shared their story yet.</p>
            )}
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="border-t border-[#19151C]/10 bg-white px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-serif text-3xl sm:text-4xl">
                {classmates.length ? `More from the class of ${person.classYear}` : "More Agape alumni"}
              </h2>
              <Link href="/alumni#directory" className="hidden items-center gap-1.5 font-sans text-sm font-medium text-[#6C0798] sm:inline-flex">
                Full directory <ArrowRight size={15} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {more.map((a) => (
                <Link key={a.slug} href={`/alumni/${a.slug}`} className="group block">
                  <div className="overflow-hidden rounded-xl">
                    <AlumniAvatar name={a.fullName} photoUrl={a.photoUrl} className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.04]" textClass="text-4xl" />
                  </div>
                  <h3 className="mt-3 font-serif text-xl group-hover:text-[#6C0798]">{a.fullName}</h3>
                  {alumniSubtitle(a) && <p className="line-clamp-1 font-sans text-sm text-[#19151C]/55">{alumniSubtitle(a)}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 py-16 text-center sm:px-8 lg:px-10">
        <p className="font-serif text-3xl">Are you an Agape graduate?</p>
        <Link
          href="/alumni#join"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6C0798] px-6 py-3 font-sans text-sm font-medium text-white hover:bg-[#4B075F]"
        >
          Join the alumni network <ArrowRight size={15} />
        </Link>
      </section>
    </main>
  );
}
