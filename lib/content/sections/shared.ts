import type { Field } from "../fields";

// Field sets reused across pages.

export const headingFields: Field[] = [
  { name: "eyebrow", label: "Small label above heading", type: "text" },
  { name: "heading", label: "Heading", type: "text" },
  { name: "headingAccent", label: "Heading (coloured second part)", type: "text" },
];

export const heroFields: Field[] = [
  { name: "background", label: "Background photo", type: "image", aspect: "16:9" },
  { name: "eyebrow", label: "Small label", type: "text" },
  { name: "heading", label: "Heading", type: "text" },
  { name: "headingAccent", label: "Heading (second line)", type: "text" },
  { name: "intro", label: "Intro paragraph", type: "textarea" },
];

export const ctaFields: Field[] = [
  { name: "eyebrow", label: "Small label", type: "text" },
  { name: "title", label: "Heading", type: "text" },
  { name: "highlight", label: "Heading (coloured part)", type: "text" },
  { name: "description", label: "Paragraph", type: "textarea" },
  { name: "primaryLabel", label: "Main button text", type: "text" },
  { name: "primaryHref", label: "Main button link", type: "url" },
  { name: "secondaryLabel", label: "Second button text", type: "text" },
  { name: "secondaryHref", label: "Second button link", type: "url" },
];

export const faqFields: Field[] = [
  {
    name: "items",
    label: "Questions",
    type: "list",
    itemLabel: "Question",
    fields: [
      { name: "question", label: "Question", type: "text" },
      { name: "answer", label: "Answer", type: "textarea" },
    ],
  },
];
