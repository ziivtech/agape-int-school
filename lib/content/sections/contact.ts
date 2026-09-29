import { defineSection, img } from "../fields";
import { ctaFields, headingFields, heroFields } from "./shared";

export const contactSections = {
  "contact.hero": defineSection({
    page: "Contact",
    label: "1. Hero",
    description: "Phone, email and address come from Site-wide › Contact details.",
    fields: heroFields,
    defaults: {
      background: img("/changed.png", "Agape Academy International campus"),
      eyebrow: "Contact Agape",
      heading: "Let's start a",
      headingAccent: "conversation.",
      intro:
        "Whether you're exploring Agape for the first time, planning a campus visit, or already part of our community, we're here to help.",
    },
  }),

  "contact.form": defineSection({
    page: "Contact",
    label: "2. Message form",
    description: "Messages sent here arrive in Admin › Enquiries.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      {
        name: "tips",
        label: "Helpful notes",
        type: "list",
        itemLabel: "Note",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "text" },
        ],
      },
      { name: "quote", label: "Quote", type: "text" },
      { name: "formEyebrow", label: "Form: small label", type: "text" },
      { name: "formTitle", label: "Form: heading", type: "text" },
      { name: "formIntro", label: "Form: intro", type: "text" },
    ],
    defaults: {
      eyebrow: "We're here to help",
      heading: "Tell us what",
      headingAccent: "you're looking for.",
      description:
        "Have a question about admissions, academics, a campus visit, or life at Agape? Send us a message and our team will get back to you.",
      tips: [
        { title: "Need a quick answer?", text: "Call the school directly for urgent enquiries." },
        { title: "Planning a visit?", text: "Choose “Book a campus visit” and we'll help you with the next step." },
      ],
      quote: "Academic excellence in Christ.",
      formEyebrow: "Send a message",
      formTitle: "How can we help?",
      formIntro: "Complete the form below and our team will follow up with you.",
    },
  }),

  "contact.visit": defineSection({
    page: "Contact",
    label: "3. Map & directions",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "buttonLabel", label: "Button text", type: "text" },
    ],
    defaults: {
      eyebrow: "Come and see us",
      heading: "Some things are",
      headingAccent: "better experienced.",
      description:
        "If you're considering Agape for your child, we would love to welcome you to campus. Come see the environment, meet our community and experience the school for yourself.",
      buttonLabel: "Get directions",
    },
  }),

  "contact.cta": defineSection({
    page: "Contact",
    label: "4. Closing call to action",
    fields: ctaFields,
    defaults: {
      eyebrow: "Your next step",
      title: "Thinking about",
      highlight: "joining Agape?",
      description: "Read about how admissions work, what to prepare and how to arrange a visit.",
      primaryLabel: "Admissions",
      primaryHref: "/admissions",
      secondaryLabel: "Book a visit",
      secondaryHref: "/admissions#book-a-visit",
    },
  }),
};
