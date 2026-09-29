import { defineSection, img } from "../fields";
import { headingFields, heroFields } from "./shared";

export const studentLifeSections = {
  "studentLife.hero": defineSection({
    page: "Student Life",
    label: "1. Hero",
    fields: [
      ...heroFields,
      { name: "primaryLabel", label: "Main button text", type: "text" },
      { name: "secondaryLabel", label: "Second button text", type: "text" },
      { name: "secondaryUrl", label: "Second button link", type: "url" },
    ],
    defaults: {
      background: img("https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=2400&q=90", "Student life at Agape Academy"),
      eyebrow: "Beyond the classroom",
      heading: "Where students",
      headingAccent: "become more.",
      intro:
        "Sport. Creativity. Leadership. Friendship. Faith. Student life at Agape is where the lessons of the classroom become experiences that shape who students are becoming.",
      primaryLabel: "Explore student life",
      secondaryLabel: "Visit Agape",
      secondaryUrl: "/admissions#book-a-visit",
    },
  }),

  "studentLife.intro": defineSection({
    page: "Student Life",
    label: "2. The Agape experience",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      {
        name: "pillars",
        label: "Pillars",
        type: "list",
        itemLabel: "Pillar",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "text" },
        ],
      },
    ],
    defaults: {
      eyebrow: "The Agape experience",
      heading: "Education should shape the",
      headingAccent: "whole person.",
      description:
        "At Agape, student life works alongside our Christian educational philosophy. The Abeka curriculum provides a structured academic foundation, while life beyond the classroom gives students opportunities to practise responsibility, creativity, teamwork and service.",
      pillars: [
        { title: "Learn", text: "Build knowledge and understanding." },
        { title: "Discover", text: "Find interests, talents and passions." },
        { title: "Become", text: "Grow in character and confidence." },
      ],
    },
  }),

  "studentLife.moments": defineSection({
    page: "Student Life",
    label: "3. The moments students remember",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "note", label: "Closing line", type: "text" },
      { name: "photo", label: "Photo or video", type: "image", aspect: "4:5" },
      { name: "badge", label: "Photo badge", type: "text" },
    ],
    defaults: {
      eyebrow: "More than a timetable",
      heading: "The moments",
      headingAccent: "students remember.",
      description:
        "Some of the most important lessons happen when students are working together, performing on stage, competing on the field, travelling, serving others or simply finding their place in a community.",
      note: "Every experience is part of the education.",
      photo: img("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1800&q=90", "Student participating in school life"),
      badge: "Life in motion",
    },
  }),

  "studentLife.activities": defineSection({
    page: "Student Life",
    label: "4. Activities",
    description: "Each activity links to its own page. Keep the anchors as they are — the menu links to them.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      {
        name: "activities",
        label: "Activities",
        type: "list",
        itemLabel: "Activity",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "eyebrow", label: "Small label", type: "text" },
          { name: "text", label: "Description", type: "textarea" },
          { name: "href", label: "Link", type: "url" },
          { name: "anchor", label: "Anchor", type: "text" },
          { name: "photo", label: "Photo", type: "image", aspect: "4:3" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Find your place",
      heading: "Six ways to",
      headingAccent: "belong.",
      description:
        "A rich student experience gives every learner multiple ways to discover what they enjoy, what they are good at and how they can contribute.",
      activities: [
        {
          title: "Clubs",
          eyebrow: "Discover",
          text: "Students explore interests beyond the classroom through clubs that encourage curiosity, collaboration and confidence.",
          href: "/student-life/clubs",
          anchor: "clubs",
          photo: img("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=90", "Students in a club activity"),
        },
        {
          title: "Sports",
          eyebrow: "Compete",
          text: "Sport develops discipline, resilience, teamwork and the confidence to perform under pressure.",
          href: "/student-life/sports",
          anchor: "sports",
          photo: img("/games_3.jpg", "Students competing on sports day"),
        },
        {
          title: "Arts & Music",
          eyebrow: "Create",
          text: "Music, drama and visual art give students space to communicate ideas, express themselves and discover new talents.",
          href: "/student-life/arts",
          anchor: "arts",
          photo: img("https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1400&q=90", "Students performing music"),
        },
        {
          title: "Leadership",
          eyebrow: "Lead",
          text: "Students are encouraged to take responsibility, serve others and develop the character required to lead with purpose.",
          href: "/student-life/leadership",
          anchor: "leadership",
          photo: img("https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=90", "Student leaders"),
        },
        {
          title: "Trips & Experiences",
          eyebrow: "Experience",
          text: "Learning extends beyond school through excursions, experiences and opportunities to understand the world first-hand.",
          href: "/student-life/trips",
          anchor: "trips",
          photo: img("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=90", "A school trip"),
        },
        {
          title: "Student Union",
          eyebrow: "Belong",
          text: "The Student Union gives students a voice and creates opportunities to organise, represent and serve their community.",
          href: "/student-life/student-union",
          anchor: "union",
          photo: img("https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=90", "Student Union members"),
        },
      ],
    },
  }),

  "studentLife.foundation": defineSection({
    page: "Student Life",
    label: "5. Academics × life",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      {
        name: "items",
        label: "Points",
        type: "list",
        itemLabel: "Point",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "text" },
        ],
      },
      { name: "photo", label: "Photo", type: "image", aspect: "4:3" },
      { name: "photoLabel", label: "Photo card: small label", type: "text" },
      { name: "photoTitle", label: "Photo card: text", type: "text" },
      { name: "motto", label: "Purple card (one line per row)", type: "textarea" },
    ],
    defaults: {
      eyebrow: "Academics × life",
      heading: "Knowledge is only the",
      headingAccent: "beginning.",
      description:
        "Agape combines the structured academic foundation of the Abeka curriculum with opportunities for students to develop socially, creatively, physically and spiritually.",
      items: [
        { title: "Structured learning", text: "A Christian educational foundation designed to build strong academic habits." },
        { title: "Community", text: "Students learn how to collaborate, communicate and contribute." },
        { title: "Character", text: "Leadership, service and responsibility are woven into school life." },
      ],
      photo: img("/abek.jpg", "Abeka curriculum"),
      photoLabel: "Our academic foundation",
      photoTitle: "Excellence in Christ.",
      motto: "Learn.\nLive.\nLead.",
    },
  }),

  "studentLife.statement": defineSection({
    page: "Student Life",
    label: "6. Big statement",
    fields: [
      { name: "eyebrow", label: "Small label", type: "text" },
      { name: "line1", label: "Line 1", type: "text" },
      { name: "line2", label: "Line 2", type: "text" },
      { name: "line2Accent", label: "Line 2 (faded part)", type: "text" },
      { name: "description", label: "Paragraph", type: "textarea" },
    ],
    defaults: {
      eyebrow: "The goal",
      line1: "Confident enough",
      line2: "to",
      line2Accent: "explore.",
      description: "Courageous enough to try. Humble enough to learn. Grounded enough to serve.",
    },
  }),

  "studentLife.voice": defineSection({
    page: "Student Life",
    label: "7. Student voice",
    description: "Use a real quote from a student with their name and year group where possible.",
    fields: [
      ...headingFields,
      { name: "quote", label: "Quote", type: "textarea" },
      { name: "name", label: "Who said it", type: "text" },
      { name: "role", label: "Their year group / role", type: "text" },
    ],
    defaults: {
      eyebrow: "Student voice",
      heading: "A school is also a",
      headingAccent: "community.",
      quote: "The experiences outside the classroom give students the confidence to discover what they can do.",
      name: "Student experience",
      role: "Agape Academy International",
    },
  }),

  "studentLife.gallery": defineSection({
    page: "Student Life",
    label: "8. Photo grid",
    fields: [
      { name: "mainPhoto", label: "Large photo", type: "image", aspect: "4:3" },
      { name: "mainLabel", label: "Large photo: small label", type: "text" },
      { name: "mainTitle", label: "Large photo: caption", type: "text" },
      { name: "secondPhoto", label: "Small photo", type: "image", aspect: "16:9" },
      { name: "cardLabel", label: "Purple card: small label", type: "text" },
      { name: "cardTitle", label: "Purple card: text", type: "text" },
    ],
    defaults: {
      mainPhoto: img("/together.jpg", "Students growing together"),
      mainLabel: "Together",
      mainTitle: "Growing together.",
      secondPhoto: img("https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=90", "Students collaborating"),
      cardLabel: "Every student",
      cardTitle: "Has somewhere to shine.",
    },
  }),

  "studentLife.cta": defineSection({
    page: "Student Life",
    label: "9. Closing call to action",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "primaryLabel", label: "Main button text", type: "text" },
      { name: "primaryUrl", label: "Main button link", type: "url" },
      { name: "secondaryLabel", label: "Second button text", type: "text" },
      { name: "secondaryUrl", label: "Second button link", type: "url" },
    ],
    defaults: {
      eyebrow: "Begin the journey",
      heading: "Give your child a school life",
      headingAccent: "worth remembering.",
      description: "Discover a school where academic learning and meaningful experiences come together.",
      primaryLabel: "Apply to Agape",
      primaryUrl: "/admissions#how-to-apply",
      secondaryLabel: "Book a visit",
      secondaryUrl: "/admissions#book-a-visit",
    },
  }),
};
