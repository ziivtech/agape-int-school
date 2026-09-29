import { defineSection, img } from "../fields";
import { headingFields, heroFields } from "./shared";

/* News, events, gallery, alumni and policy pages. */

export const NEWS_CATEGORIES = ["Academics", "Student Life", "Faith", "Sports", "Arts", "Community", "Achievements", "Announcements"];
export const EVENT_CATEGORIES = ["School", "Academic", "Sports", "Faith", "Arts", "Parents", "Admissions", "Trips", "Alumni", "Holiday"];
export const GALLERY_CATEGORIES = ["Classrooms", "Science", "Library", "Sport", "Creative Spaces", "Chapel", "Outdoor", "Student Life", "Events", "Graduation"];

const policy = (heading: string, description: string) =>
  defineSection({
    page: "Policies",
    label: heading,
    description: "Add each part of the policy as a section with its own heading.",
    fields: [
      { name: "heading", label: "Page title", type: "text" },
      { name: "description", label: "Intro", type: "textarea" },
      { name: "updated", label: "Last updated (e.g. September 2026)", type: "text" },
      {
        name: "sections",
        label: "Sections",
        type: "list",
        itemLabel: "Section",
        fields: [
          { name: "title", label: "Heading", type: "text" },
          { name: "body", label: "Text", type: "textarea", help: "Leave a blank line between paragraphs." },
        ],
      },
    ],
    defaults: { heading, description, updated: "", sections: [] as { title: string; body: string }[] },
  });

export const moreSections = {
  "news.hero": defineSection({
    page: "News",
    label: "1. Hero & intro",
    description: "Stories themselves are managed under Admin › News.",
    fields: [
      ...heroFields,
      { name: "introEyebrow", label: "Intro: small label", type: "text" },
      { name: "introHeading", label: "Intro: heading", type: "text" },
      { name: "introAccent", label: "Intro: heading (coloured part)", type: "text" },
      { name: "introParagraphs", label: "Intro: paragraphs", type: "strings", itemLabel: "Paragraph" },
      { name: "emptyText", label: "Text shown when there are no stories yet", type: "text" },
    ],
    defaults: {
      background: img("/grad_01.jpg", "Agape Academy students"),
      eyebrow: "News & stories",
      heading: "Life at",
      headingAccent: "Agape.",
      intro:
        "Academic discovery. Student voices. Faith. Sport. Creativity. Community. Stories from a school where every day is part of the journey.",
      introEyebrow: "The Agape Journal",
      introHeading: "Stories worth",
      introAccent: "remembering.",
      introParagraphs: [
        "School life is made up of thousands of moments. A question asked in class. A goal scored. A song performed. A new friendship. A lesson in chapel.",
        "Our news and stories bring those moments together — celebrating the people, ideas and experiences that make Agape Academy International what it is.",
      ],
      emptyText: "Our first stories are on their way. Check back soon.",
    },
  }),

  "news.feature": defineSection({
    page: "News",
    label: "2. Photo break",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "linkLabel", label: "Link text", type: "text" },
      { name: "linkUrl", label: "Link", type: "url" },
      { name: "photo", label: "Photo", type: "image", aspect: "4:5" },
    ],
    defaults: {
      eyebrow: "More than news",
      heading: "Every student",
      headingAccent: "has a story.",
      description:
        "From first discoveries to defining achievements, school life is full of stories waiting to be told. Our journal gives those experiences a place to live.",
      linkLabel: "Explore student life",
      linkUrl: "/student-life",
      photo: img("/together.jpg", "Students together at Agape"),
    },
  }),

  "news.cta": defineSection({
    page: "News",
    label: "3. Closing call to action",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "buttonLabel", label: "Button text", type: "text" },
      { name: "buttonUrl", label: "Button link", type: "url" },
    ],
    defaults: {
      eyebrow: "Stay connected",
      heading: "Keep up with",
      headingAccent: "life at Agape.",
      description: "Follow the latest school news, events, achievements and stories from across our community.",
      buttonLabel: "See upcoming events",
      buttonUrl: "/events",
    },
  }),

  "events.page": defineSection({
    page: "Events",
    label: "Events page",
    description: "Events themselves are managed under Admin › Events.",
    fields: [
      { name: "eyebrow", label: "Small label", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "emptyText", label: "Text shown when nothing is scheduled", type: "text" },
      { name: "calendarUrl", label: "Link to a downloadable term calendar (optional)", type: "url" },
    ],
    defaults: {
      eyebrow: "What's on",
      heading: "Upcoming events",
      description: "Sports days, fairs, trips and celebrations across the Agape school calendar.",
      emptyText: "New dates will be published soon.",
      calendarUrl: "",
    },
  }),

  "gallery.page": defineSection({
    page: "Gallery",
    label: "Gallery page header",
    description: "Photos themselves are managed under Admin › Media › Gallery.",
    fields: [
      { name: "eyebrow", label: "Small label", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "headingAccent", label: "Heading (second line)", type: "text" },
      { name: "description", label: "Paragraph", type: "textarea" },
    ],
    defaults: {
      eyebrow: "Pantang West · Ghana",
      heading: "A place to learn.",
      headingAccent: "A place to belong.",
      description:
        "Classrooms and chapel, science labs and sports fields, quiet corners and shared ones — this is what a day at Agape looks like.",
    },
  }),

  "alumni.hero": defineSection({
    page: "Alumni",
    label: "1. Hero & intro",
    fields: [
      ...heroFields,
      { name: "buttonLabel", label: "Button text", type: "text" },
      { name: "introEyebrow", label: "Intro: small label", type: "text" },
      { name: "introHeading", label: "Intro: heading", type: "text" },
      { name: "introAccent", label: "Intro: heading (coloured part)", type: "text" },
      { name: "introText", label: "Intro: paragraph", type: "textarea" },
    ],
    defaults: {
      background: img("/grad_01.jpg", "Graduating students"),
      eyebrow: "Alumni",
      heading: "Once Agape.",
      headingAccent: "Always connected.",
      intro:
        "Graduation is not the end of the story. It is the beginning of a new chapter — and the beginning of an alumni community that continues beyond the school gates.",
      buttonLabel: "Join the alumni network",
      introEyebrow: "Our alumni community",
      introHeading: "Different paths.",
      introAccent: "Shared beginnings.",
      introText:
        "An alumni community connects past students with one another and with the school that helped shape their early journey. It creates space for stories, relationships, mentorship, celebration and continued connection.",
    },
  }),

  "alumni.stories": defineSection({
    page: "Alumni",
    label: "2. Stories (until you feature real alumni)",
    description:
      "These appear only while no alumni profile is marked “Featured” in Admin › Alumni. Once you feature real people, their stories replace these.",
    fields: [
      {
        name: "stories",
        label: "Stories",
        type: "list",
        itemLabel: "Story",
        fields: [
          { name: "eyebrow", label: "Small label (e.g. Class of 2019)", type: "text" },
          { name: "title", label: "Heading", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
          { name: "photo", label: "Photo", type: "image", aspect: "4:5" },
        ],
      },
    ],
    defaults: {
      stories: [
        {
          eyebrow: "The journey",
          title: "From Agape to the world.",
          text: "Every graduating class begins a new chapter. Alumni carry forward the academic foundation, friendships, experiences and values developed during their years at Agape.",
          photo: img("/girl_grad.jpg", "An Agape graduate"),
        },
        {
          eyebrow: "Shared roots",
          title: "Different destinations. One community.",
          text: "University, entrepreneurship, professional life, service and new opportunities can take alumni in many different directions while the Agape experience remains part of their story.",
          photo: img("/grad_01.jpg", "Agape graduates"),
        },
      ],
    },
  }),

  "alumni.directory": defineSection({
    page: "Alumni",
    label: "3. Directory & where alumni are now",
    description: "The people, numbers, universities and countries all come from approved profiles in Admin › Alumni.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "destinationsHeading", label: "Destinations heading", type: "text" },
      { name: "emptyText", label: "Text shown before any profiles are approved", type: "textarea" },
    ],
    defaults: {
      eyebrow: "Alumni directory",
      heading: "Where are they",
      headingAccent: "now?",
      description: "Meet Agape graduates studying and working in Ghana and around the world.",
      destinationsHeading: "Universities our alumni have attended",
      emptyText: "Our alumni directory is just getting started. Are you an Agape graduate? Add your profile below and be one of the first.",
    },
  }),

  "alumni.giveBack": defineSection({
    page: "Alumni",
    label: "4. Give back",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      {
        name: "ways",
        label: "Ways to get involved",
        type: "list",
        itemLabel: "Way",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Description", type: "textarea" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Give back",
      heading: "Help the next",
      headingAccent: "generation.",
      description: "Current students learn a great deal from people who sat in the same classrooms not long ago.",
      ways: [
        { title: "Mentor a student", text: "Share advice on university applications, courses and careers with senior students." },
        { title: "Speak at careers day", text: "Tell students about your field, how you got there and what you wish you had known." },
        { title: "Host a visit or placement", text: "Open your workplace for a short visit, job shadowing or an internship." },
        { title: "Come back and celebrate", text: "Join reunions, graduation and school events as part of the Agape family." },
      ],
    },
  }),

  "alumni.events": defineSection({
    page: "Alumni",
    label: "5. Alumni events",
    description: "Events in Admin › Events with the category “Alumni” appear here.",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "emptyText", label: "Text when no alumni events are scheduled", type: "text" },
    ],
    defaults: {
      heading: "Reunions & alumni events",
      emptyText: "No alumni events are scheduled right now. Join the network below and we'll let you know about the next one.",
    },
  }),

  "alumni.legacy": defineSection({
    page: "Alumni",
    label: "6. Quote",
    fields: [
      { name: "quote", label: "Quote (red band)", type: "textarea" },
      { name: "quoteBy", label: "Quote attribution", type: "text" },
    ],
    defaults: {
      quote: "The years at school become part of the story you carry into the world.",
      quoteBy: "Agape Academy International",
    },
  }),

  "alumni.connect": defineSection({
    page: "Alumni",
    label: "7. Join the alumni network (form)",
    description: "Sign-ups appear in Admin › Alumni as “Waiting for approval”. Nothing is shown publicly until staff approve it.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "thanks", label: "Message after someone signs up", type: "textarea" },
    ],
    defaults: {
      eyebrow: "Join the alumni network",
      heading: "Your Agape story",
      headingAccent: "continues.",
      description:
        "Tell us where life has taken you. We'll keep you updated about reunions and alumni events, and — if you agree — share your story with the Agape community.",
      thanks: "Thank you! We'll review your details and be in touch. If you chose to share your profile, it will appear on this page once approved.",
    },
  }),

  "legal.privacy": policy("Privacy Policy", "How Agape Academy International collects, uses and protects personal information."),
  "legal.safeguarding": policy("Safeguarding", "Our commitment to keeping every child safe, and how to raise a concern."),
  "legal.accessibility": policy("Accessibility", "Our commitment to an accessible website, and how to report a problem."),
};
