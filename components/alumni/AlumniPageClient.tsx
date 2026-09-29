"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  GraduationCap,
  HandHeart,
  Mic,
  PartyPopper,
  Quote,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useSection } from "../content/ContentProvider";
import AlumniAvatar from "./AlumniAvatar";
import AlumniRegisterForm from "./AlumniRegisterForm";
import { AlumniCard, alumniPlace, alumniSubtitle } from "../../lib/alumni-shared";
import { EventItem, formatEventDate } from "../../lib/content/public-types";

const GIVE_ICONS = [Users, Mic, Briefcase, PartyPopper];

/** Most common values first, ignoring blanks. */
function tally(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values.map((x) => x.trim()).filter(Boolean)) counts.set(v, (counts.get(v) ?? 0) + 1);
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default function AlumniPageClient({ alumni, events }: { alumni: AlumniCard[]; events: EventItem[] }) {
  const hero = useSection("alumni.hero");
  const fallbackStories = useSection("alumni.stories").stories;
  const dir = useSection("alumni.directory");
  const give = useSection("alumni.giveBack");
  const ev = useSection("alumni.events");
  const legacy = useSection("alumni.legacy");
  const connect = useSection("alumni.connect");

  const featured = alumni.filter((a) => a.featured).slice(0, 3);
  const universities = useMemo(() => tally(alumni.map((a) => a.university)), [alumni]);
  const countries = useMemo(() => tally(alumni.map((a) => a.country)), [alumni]);
  const years = useMemo(
    () => Array.from(new Set(alumni.map((a) => a.classYear).filter((y): y is number => Boolean(y)))).sort((a, b) => b - a),
    [alumni]
  );
  const industries = useMemo(() => tally(alumni.map((a) => a.industry)).map((i) => i.name), [alumni]);
  const mentors = alumni.filter((a) => a.openToMentor).length;

  const [q, setQ] = useState("");
  const [year, setYear] = useState("");
  const [industry, setIndustry] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = alumni.filter((a) => {
    if (year && String(a.classYear) !== year) return false;
    if (industry && a.industry !== industry) return false;
    if (q) {
      const hay = [a.fullName, a.headline, a.occupation, a.university, a.fieldOfStudy, a.city, a.country].join(" ").toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  const visible = showAll ? filtered : filtered.slice(0, 12);

  // Only show figures once there are enough profiles for them to mean something.
  const stats =
    alumni.length >= 3
      ? [
          { value: alumni.length, label: "alumni in the network" },
          countries.length > 1 && { value: countries.length, label: "countries" },
          universities.length > 1 && { value: universities.length, label: "universities" },
          years.length > 1 && { value: `${years[years.length - 1]}–${String(years[0]).slice(-2)}`, label: "graduating classes" },
          mentors > 0 && { value: mentors, label: "ready to mentor" },
        ].filter(Boolean)
      : [];

  return (
    <main className="overflow-hidden bg-[#FAF8F9] text-[#19151C]">
      {/* HERO */}
      <section className="relative min-h-[78svh] overflow-hidden bg-[#19151C] text-white sm:min-h-[86vh]">
        {hero.background.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.background.url} alt={hero.background.alt} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-end px-5 pb-12 sm:min-h-[86vh] sm:px-8 sm:pb-16 lg:px-10 lg:pb-20">
          <div className="max-w-4xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-white/60">{hero.eyebrow}</p>
            <h1 className="mt-5 font-serif text-[2.7rem] leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[5.5rem]">
              {hero.heading}
              <span className="block text-white/45">{hero.headingAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-7 text-white/70 sm:text-lg">{hero.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="#join"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-sans text-[13px] font-medium text-[#19151C] hover:bg-white/85"
              >
                {hero.buttonLabel} <ArrowRight size={14} />
              </Link>
              {alumni.length > 0 && (
                <Link href="#directory" className="border-b border-white/30 pb-0.5 font-sans text-[13px] font-medium text-white/85 hover:border-white hover:text-white">
                  Browse the directory
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INTRO + NUMBERS */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#E12F41]">{hero.introEyebrow}</span>
              <h2 className="mt-5 max-w-xl font-serif text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl">
                {hero.introHeading}
                <span className="block text-[#6C0798]">{hero.introAccent}</span>
              </h2>
            </div>
            <p className="max-w-3xl font-sans text-lg leading-8 text-[#19151C]/60 sm:text-xl sm:leading-9 lg:pt-10">{hero.introText}</p>
          </div>

          {stats.length > 0 && (
            <dl className="mt-16 grid grid-cols-2 border-t border-[#19151C]/10 sm:grid-cols-3 lg:grid-cols-5">
              {(stats as { value: string | number; label: string }[]).map((s) => (
                <div key={s.label} className="flex flex-col-reverse border-b border-[#19151C]/10 py-6 pr-4">
                  <dt className="mt-1 font-sans text-sm text-[#19151C]/55">{s.label}</dt>
                  <dd className="font-serif text-4xl text-[#6C0798] sm:text-5xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* FEATURED STORIES */}
      <section className="bg-[#19151C] text-white">
        {featured.length > 0
          ? featured.map((a, index) => (
              <article key={a.slug} className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
                <div className={`relative min-h-[420px] overflow-hidden sm:min-h-[560px] lg:min-h-[680px] ${index % 2 ? "lg:order-2" : ""}`}>
                  <AlumniAvatar name={a.fullName} photoUrl={a.photoUrl} className="absolute inset-0 h-full w-full" textClass="text-8xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/70 via-transparent to-transparent" />
                </div>
                <div className={`flex items-center px-6 py-16 sm:px-10 sm:py-24 lg:px-20 ${index % 2 ? "lg:order-1" : ""}`}>
                  <div className="max-w-xl">
                    {a.classYear && (
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#E12F41]">Class of {a.classYear}</span>
                    )}
                    <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">{a.fullName}</h2>
                    {alumniSubtitle(a) && <p className="mt-4 font-sans text-lg text-white/70">{alumniSubtitle(a)}</p>}
                    {a.quote ? (
                      <blockquote className="mt-8 border-l-2 border-[#E12F41] pl-5 font-serif text-2xl leading-snug text-white/85">“{a.quote}”</blockquote>
                    ) : (
                      a.story && <p className="mt-8 line-clamp-5 font-sans text-base leading-8 text-white/55">{a.story}</p>
                    )}
                    <Link href={`/alumni/${a.slug}`} className="group mt-10 inline-flex items-center gap-2 font-sans text-sm font-semibold">
                      Read {a.fullName.split(" ")[0]}&apos;s story
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          : fallbackStories.map((story, index) => (
              <article key={story.title + index} className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
                <div className={`relative min-h-[420px] overflow-hidden sm:min-h-[560px] lg:min-h-[680px] ${index % 2 ? "lg:order-2" : ""}`}>
                  {story.photo.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={story.photo.url} alt={story.photo.alt || story.title} className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#19151C]/80 via-transparent to-transparent" />
                </div>
                <div className={`flex items-center px-6 py-16 sm:px-10 sm:py-24 lg:px-20 ${index % 2 ? "lg:order-1" : ""}`}>
                  <div className="max-w-xl">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#E12F41]">{story.eyebrow}</span>
                    <h2 className="mt-5 font-serif text-5xl leading-[0.92] tracking-[-0.035em] sm:text-6xl">{story.title}</h2>
                    <p className="mt-7 whitespace-pre-line font-sans text-base leading-8 text-white/55 sm:text-lg">{story.text}</p>
                  </div>
                </div>
              </article>
            ))}
      </section>

      {/* DIRECTORY */}
      <section id="directory" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#6C0798]">{dir.eyebrow}</span>
            <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">
              {dir.heading} <span className="text-[#E12F41]">{dir.headingAccent}</span>
            </h2>
            <p className="mt-5 font-sans text-base leading-7 text-[#19151C]/60 sm:text-lg">{dir.description}</p>
          </div>

          {alumni.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-[#19151C]/15 bg-white p-10 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-[#6C0798]/60" strokeWidth={1.5} />
              <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-6 text-[#19151C]/60">{dir.emptyText}</p>
              <Link href="#join" className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#6C0798]">
                Add your profile <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#19151C]/35" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by name, university, job or city"
                    className="h-12 w-full rounded-full border border-[#19151C]/10 bg-white pl-11 pr-4 font-sans text-sm outline-none focus:border-[#6C0798]/40"
                  />
                </div>
                {years.length > 1 && (
                  <select value={year} onChange={(e) => setYear(e.target.value)} className="h-12 rounded-full border border-[#19151C]/10 bg-white px-4 font-sans text-sm">
                    <option value="">All classes</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        Class of {y}
                      </option>
                    ))}
                  </select>
                )}
                {industries.length > 1 && (
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="h-12 rounded-full border border-[#19151C]/10 bg-white px-4 font-sans text-sm">
                    <option value="">All fields</option>
                    {industries.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                )}
              </div>

              {filtered.length === 0 ? (
                <p className="mt-10 font-sans text-sm text-[#19151C]/55">No alumni match that search.</p>
              ) : (
                <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                  {visible.map((a) => (
                    <Link key={a.slug} href={`/alumni/${a.slug}`} className="group block">
                      <div className="overflow-hidden rounded-2xl">
                        <AlumniAvatar
                          name={a.fullName}
                          photoUrl={a.photoUrl}
                          className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.04]"
                          textClass="text-5xl"
                        />
                      </div>
                      <p className="mt-4 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#E12F41]">
                        {a.classYear ? `Class of ${a.classYear}` : "Agape alumni"}
                      </p>
                      <h3 className="mt-1 font-serif text-2xl leading-tight transition-colors group-hover:text-[#6C0798]">{a.fullName}</h3>
                      {alumniSubtitle(a) && <p className="mt-1 line-clamp-2 font-sans text-sm leading-5 text-[#19151C]/60">{alumniSubtitle(a)}</p>}
                      {alumniPlace(a) && <p className="mt-1 font-sans text-xs text-[#19151C]/45">{alumniPlace(a)}</p>}
                      {a.openToMentor && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#6C0798]/10 px-2.5 py-0.5 font-sans text-[11px] font-semibold text-[#6C0798]">
                          <HandHeart size={12} /> Mentor
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {filtered.length > visible.length && (
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="rounded-full border border-[#19151C]/15 bg-white px-6 py-3 font-sans text-sm font-medium hover:border-[#6C0798]/40 hover:text-[#6C0798]"
                  >
                    Show all {filtered.length} alumni
                  </button>
                </div>
              )}

              {/* Destinations */}
              {(universities.length > 0 || countries.length > 1) && (
                <div className="mt-20 grid gap-10 border-t border-[#19151C]/10 pt-12 lg:grid-cols-[0.8fr_1.2fr]">
                  <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{dir.destinationsHeading}</h3>
                  <div className="space-y-6">
                    {universities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {universities.map((u) => (
                          <span key={u.name} className="rounded-full border border-[#6C0798]/20 bg-white px-4 py-2 font-sans text-sm text-[#19151C]/75">
                            {u.name}
                            {u.count > 1 && <span className="ml-1.5 text-[#6C0798]">×{u.count}</span>}
                          </span>
                        ))}
                      </div>
                    )}
                    {countries.length > 1 && (
                      <p className="font-sans text-sm leading-6 text-[#19151C]/55">
                        Living in {countries.map((c) => c.name).join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* GIVE BACK */}
      {give.ways.length > 0 && (
        <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#E12F41]">{give.eyebrow}</span>
                <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">
                  {give.heading} <span className="text-[#6C0798]">{give.headingAccent}</span>
                </h2>
                <p className="mt-6 max-w-md font-sans text-base leading-7 text-[#19151C]/60 sm:text-lg">{give.description}</p>
                <Link href="#join" className="group mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#6C0798]">
                  Tell us how you&apos;d like to help <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid gap-px overflow-hidden rounded-2xl bg-[#19151C]/10 sm:grid-cols-2">
                {give.ways.map((w, i) => {
                  const Icon = GIVE_ICONS[i % GIVE_ICONS.length];
                  return (
                    <div key={w.title + i} className="bg-white p-7">
                      <Icon className="h-5 w-5 text-[#6C0798]" strokeWidth={1.6} />
                      <h3 className="mt-6 font-serif text-2xl">{w.title}</h3>
                      <p className="mt-2 font-sans text-sm leading-6 text-[#19151C]/60">{w.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALUMNI EVENTS */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-4xl sm:text-5xl">{ev.heading}</h2>
          {events.length === 0 ? (
            <p className="mt-6 border-t border-[#19151C]/10 pt-6 font-sans text-sm leading-6 text-[#19151C]/55">{ev.emptyText}</p>
          ) : (
            <ul className="mt-8 divide-y divide-[#19151C]/10 border-y border-[#19151C]/10">
              {events.map((e) => (
                <li key={e.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="inline-flex w-48 shrink-0 items-center gap-2 font-sans text-sm text-[#6C0798]">
                    <CalendarDays size={15} /> {formatEventDate(e)}
                  </span>
                  <div>
                    <p className="font-serif text-2xl">{e.title}</p>
                    {(e.location || e.timeLabel) && (
                      <p className="mt-1 font-sans text-sm text-[#19151C]/55">{[e.timeLabel, e.location].filter(Boolean).join(" · ")}</p>
                    )}
                    {e.description && <p className="mt-2 font-sans text-sm leading-6 text-[#19151C]/65">{e.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* QUOTE */}
      {legacy.quote && (
        <section className="relative overflow-hidden bg-[#E12F41] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-10">
          <div className="relative mx-auto max-w-5xl text-center">
            <Quote className="mx-auto h-9 w-9 text-white/35" />
            <blockquote className="mt-8 font-serif text-4xl leading-[0.98] tracking-[-0.03em] sm:text-6xl">“{legacy.quote}”</blockquote>
            <p className="mt-10 font-sans text-xs font-bold uppercase tracking-[0.25em] text-white/60">{legacy.quoteBy}</p>
          </div>
        </section>
      )}

      {/* JOIN */}
      <section id="join" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-[#E12F41]" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#19151C]/50">{connect.eyebrow}</span>
            </div>
            <h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">
              {connect.heading} <span className="text-[#6C0798]">{connect.headingAccent}</span>
            </h2>
            <p className="mt-6 max-w-md font-sans text-base leading-7 text-[#19151C]/60 sm:text-lg">{connect.description}</p>
            {alumni.length > 0 && (
              <div className="mt-8 flex -space-x-3">
                {alumni.slice(0, 6).map((a) => (
                  <AlumniAvatar
                    key={a.slug}
                    name={a.fullName}
                    photoUrl={a.photoUrl}
                    className="h-11 w-11 rounded-full border-2 border-[#FAF8F9]"
                    textClass="text-sm"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-[#19151C]/10 bg-white p-5 shadow-[0_20px_60px_rgba(25,21,28,0.06)] sm:p-9">
            <AlumniRegisterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
