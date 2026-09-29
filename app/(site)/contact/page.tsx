"use client";

import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import AgapeCTA from "@/components/AgapeCTA";
import EnquiryForm from "@/components/EnquiryForm";
import { useSection } from "@/components/content/ContentProvider";
import { FadeUp, Reveal, Stagger, StaggerItem } from "@/components/Animations";

const TIP_ICONS = [Clock3, MessageCircle];

export default function ContactPage() {
  const contact = useSection("site.contact");
  const identity = useSection("site.identity");
  const hero = useSection("contact.hero");
  const form = useSection("contact.form");
  const visit = useSection("contact.visit");
  const cta = useSection("contact.cta");

  const details = [
    contact.phone && {
      icon: Phone,
      label: "Call us",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^+\d]/g, "")}`,
    },
    contact.email && { icon: Mail, label: "Email us", value: contact.email, href: `mailto:${contact.email}` },
    contact.address && {
      icon: MapPin,
      label: "Visit us",
      value: contact.address.replace(/\n/g, ", "),
      href: contact.mapUrl || "#visit",
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string }[];

  return (
    <main className="overflow-hidden bg-[#FAF8F9] text-[#19151C]">
      {/* HERO */}
      <section className="relative min-h-[72svh] overflow-hidden bg-[#19151C] text-white sm:min-h-[76vh]">
        {hero.background.url && (
          <img
            src={hero.background.url}
            alt={hero.background.alt}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-[#19151C]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#19151C]/20 via-[#19151C]/45 to-[#19151C]" />

        <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-7xl items-end px-5 pb-10 pt-28 sm:min-h-[76vh] sm:px-6 sm:pb-16 lg:px-10 lg:pb-24">
          <Stagger className="w-full">
            <StaggerItem>
              <div className="mb-5 flex items-center gap-3 sm:mb-7">
                <span className="h-px w-8 bg-white/50 sm:w-10" />
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-xs sm:tracking-[0.22em]">
                  {hero.eyebrow}
                </span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className="max-w-5xl font-serif text-[3.15rem] leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-[7.5rem]">
                {hero.heading}
                <span className="block text-white/40">{hero.headingAccent}</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-7 max-w-xl font-sans text-sm leading-6 text-white/70 sm:mt-10 sm:text-base sm:leading-7 lg:text-lg">
                {hero.intro}
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* QUICK CONTACT */}
      {details.length > 0 && (
        <section className="relative z-20 px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <Stagger
              className={`overflow-hidden rounded-2xl border border-[#19151C]/10 bg-white shadow-[0_20px_70px_rgba(25,21,28,0.08)] sm:grid sm:rounded-[2rem] ${
                details.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
              }`}
            >
              {details.map((item) => {
                const Icon = item.icon;
                const external = item.href.startsWith("http");
                return (
                  <StaggerItem key={item.label} className="h-full">
                    <a
                      href={item.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex min-h-[76px] items-center gap-3 border-b border-[#19151C]/10 px-4 py-4 transition-colors last:border-b-0 hover:bg-[#FAF8F9] sm:min-h-[100px] sm:gap-4 sm:border-b-0 sm:border-r sm:px-6 sm:py-5 sm:last:border-r-0"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6C0798]/10 text-[#6C0798] transition-all group-hover:scale-105 group-hover:bg-[#6C0798] group-hover:text-white sm:h-11 sm:w-11 sm:rounded-2xl">
                        <Icon size={17} strokeWidth={1.7} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#19151C]/40 sm:text-[10px]">
                          {item.label}
                        </span>
                        <span className="mt-1 block truncate font-sans text-xs font-medium text-[#19151C]/75 sm:text-sm">
                          {item.value}
                        </span>
                      </span>
                    </a>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      )}

      {/* MAIN CONTACT AREA */}
      <section id="contact-form" className="scroll-mt-16 px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <Reveal direction="left">
              <div className="lg:sticky lg:top-32">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6C0798] sm:text-xs sm:tracking-[0.2em]">
                  {form.eyebrow}
                </span>
                <h2 className="mt-4 max-w-xl font-serif text-[2.4rem] leading-[1] sm:mt-5 sm:text-5xl lg:text-6xl">
                  {form.heading}
                  <span className="block text-[#6C0798]">{form.headingAccent}</span>
                </h2>
                <p className="mt-5 max-w-lg font-sans text-sm leading-6 text-[#19151C]/60 sm:mt-7 sm:text-base sm:leading-7 lg:text-lg">
                  {form.description}
                </p>

                {form.tips.length > 0 && (
                  <div className="mt-7 space-y-4 sm:mt-10">
                    {form.tips.map((tip, i) => {
                      const Icon = TIP_ICONS[i % TIP_ICONS.length];
                      return (
                        <div key={tip.title + i} className="flex items-start gap-3 sm:gap-4">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${
                              i % 2 ? "bg-[#E12F41]/10 text-[#E12F41]" : "bg-[#6C0798]/10 text-[#6C0798]"
                            }`}
                          >
                            <Icon size={17} />
                          </div>
                          <div>
                            <p className="font-sans text-sm font-semibold">{tip.title}</p>
                            <p className="mt-1 font-sans text-xs leading-5 text-[#19151C]/50 sm:text-sm sm:leading-6">
                              {tip.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {contact.officeHours && (
                  <p className="mt-8 whitespace-pre-line font-sans text-sm leading-6 text-[#19151C]/55">
                    <span className="font-semibold text-[#19151C]/75">Office hours</span>
                    <br />
                    {contact.officeHours}
                  </p>
                )}

                {form.quote && (
                  <div className="mt-8 border-l-2 border-[#6C0798]/20 pl-4 sm:mt-12 sm:pl-5">
                    <p className="font-serif text-lg leading-7 text-[#19151C]/70 sm:text-xl sm:leading-8">
                      &ldquo;{form.quote}&rdquo;
                    </p>
                    <p className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#19151C]/35 sm:text-xs sm:tracking-[0.15em]">
                      {identity.schoolName}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>

            <FadeUp>
              <div className="mx-auto w-full max-w-2xl rounded-[1.5rem] border border-[#19151C]/10 bg-white p-4 shadow-[0_20px_60px_rgba(25,21,28,0.07)] sm:rounded-[2rem] sm:p-7 lg:p-9">
                <div className="mb-6 sm:mb-8">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6C0798] sm:text-xs sm:tracking-[0.2em]">
                    {form.formEyebrow}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl sm:mt-3 sm:text-4xl">{form.formTitle}</h3>
                  <p className="mt-2 font-sans text-xs leading-5 text-[#19151C]/50 sm:mt-3 sm:text-sm sm:leading-6">
                    {form.formIntro}
                  </p>
                </div>
                <EnquiryForm type="general" showTopic />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* VISIT CAMPUS */}
      <section id="visit" className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-[1.5rem] bg-[#19151C] sm:rounded-[2rem] lg:grid-cols-2">
            <Reveal direction="left">
              <div className="relative min-h-[300px] overflow-hidden sm:min-h-[420px] lg:min-h-[620px]">
                {contact.mapQuery && (
                  <iframe
                    title={`${identity.schoolName} location`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`}
                    className="absolute inset-0 h-full w-full border-0 grayscale-[20%]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" />
              </div>
            </Reveal>

            <Stagger className="flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
              <StaggerItem>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:text-xs sm:tracking-[0.2em]">
                  {visit.eyebrow}
                </span>
              </StaggerItem>
              <StaggerItem>
                <h2 className="mt-4 font-serif text-3xl leading-tight text-white sm:mt-5 sm:text-5xl">
                  {visit.heading}
                  <span className="block text-white/40">{visit.headingAccent}</span>
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-5 max-w-lg font-sans text-sm leading-6 text-white/55 sm:mt-7 sm:text-base sm:leading-7">
                  {visit.description}
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="mt-7 flex items-start gap-3 sm:mt-9 sm:gap-4">
                  <MapPin size={18} className="mt-1 shrink-0 text-white/50 sm:size-5" />
                  <div>
                    <p className="font-sans text-sm font-medium text-white/80">{identity.schoolName}</p>
                    <p className="mt-1 whitespace-pre-line font-sans text-xs leading-5 text-white/45 sm:text-sm sm:leading-6">
                      {contact.address}
                    </p>
                  </div>
                </div>
              </StaggerItem>
              {contact.mapUrl && (
                <StaggerItem>
                  <a
                    href={contact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full border border-white/15 px-5 py-3 font-sans text-xs font-medium text-white transition-all hover:bg-white hover:text-[#19151C] sm:mt-9 sm:px-6 sm:py-3.5 sm:text-sm"
                  >
                    {visit.buttonLabel}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </StaggerItem>
              )}
            </Stagger>
          </div>
        </div>
      </section>

      <AgapeCTA {...cta} />
    </main>
  );
}
