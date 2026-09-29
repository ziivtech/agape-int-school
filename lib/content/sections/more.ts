import { defineSection, img } from "../fields";
import { headingFields, heroFields } from "./shared";

/* News, events, gallery, alumni and policy pages. */

export const NEWS_CATEGORIES = ["Academics", "Student Life", "Faith", "Sports", "Arts", "Community", "Achievements", "Announcements"];
export const EVENT_CATEGORIES = ["School", "Academic", "Sports", "Faith", "Arts", "Parents", "Admissions", "Trips", "Holiday"];
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
      buttonLabel: "Stay connected",
      introEyebrow: "Our alumni community",
      introHeading: "Different paths.",
      introAccent: "Shared beginnings.",
      introText:
        "An alumni community connects past students with one another and with the school that helped shape their early journey. It creates space for stories, relationships, mentorship, celebration and continued connection.",
    },
  }),

  "alumni.stories": defineSection({
    page: "Alumni",
    label: "2. Stories",
    description: "Add real alumni here — name, year and where they are now make these far more convincing.",
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
          photo: img("https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1800&q=85", "Graduates"),
        },
      ],
    },
  }),

  "alumni.legacy": defineSection({
    page: "Alumni",
    label: "3. What remains",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "values", label: "Values", type: "strings", itemLabel: "Value" },
      { name: "quote", label: "Quote (red band)", type: "textarea" },
      { name: "quoteBy", label: "Quote attribution", type: "text" },
    ],
    defaults: {
      eyebrow: "What remains",
      heading: "More than a",
      headingAccent: "school record.",
      description:
        "An Agape education is part of a longer journey. The relationships, character, confidence and experiences developed during school can continue to shape the paths students take after graduation.",
      values: ["Academic foundation", "Christian character", "Confidence to explore", "Commitment to service"],
      quote: "The years at school become part of the story you carry into the world.",
      quoteBy: "Agape Academy International",
    },
  }),

  "alumni.connect": defineSection({
    page: "Alumni",
    label: "4. Stay connected form",
    description: "Alumni who fill this in appear in Admin › Enquiries as “Alumni”.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
    ],
    defaults: {
      eyebrow: "Stay connected",
      heading: "Your Agape story",
      headingAccent: "continues.",
      description:
        "Tell us where life has taken you. We'll keep you updated about reunions, alumni events and ways to stay involved with the school.",
    },
  }),

  "legal.privacy": policy("Privacy Policy", "How Agape Academy International collects, uses and protects personal information."),
  "legal.safeguarding": policy("Safeguarding", "Our commitment to keeping every child safe, and how to raise a concern."),
  "legal.accessibility": policy("Accessibility", "Our commitment to an accessible website, and how to report a problem."),
};
