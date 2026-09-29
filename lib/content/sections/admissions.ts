import { defineSection, img, ListField } from "../fields";
import { faqFields, headingFields, heroFields } from "./shared";

const titled = (itemLabel: string): Omit<ListField, "name" | "label"> => ({
  type: "list",
  itemLabel,
  fields: [
    { name: "title", label: "Title", type: "text" },
    { name: "text", label: "Description", type: "textarea" },
  ],
});

export const admissionsSections = {
  "admissions.hero": defineSection({
    page: "Admissions",
    label: "1. Hero",
    fields: [
      ...heroFields,
      { name: "primaryLabel", label: "Main button text", type: "text" },
      { name: "secondaryLabel", label: "Second button text", type: "text" },
    ],
    defaults: {
      background: img("https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=2400&q=90", "Students learning and connecting together"),
      eyebrow: "Admissions",
      heading: "Begin something",
      headingAccent: "meaningful.",
      intro:
        "Come and experience our community, meet our teachers and discover an education built around academic excellence, character and purpose.",
      primaryLabel: "How to apply",
      secondaryLabel: "Book a visit",
    },
  }),

  "admissions.intro": defineSection({
    page: "Admissions",
    label: "2. Choosing Agape",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "pillars", label: "Cards", ...titled("Card") },
    ],
    defaults: {
      eyebrow: "Choosing Agape",
      heading: "The right school is a",
      headingAccent: "big decision.",
      description:
        "We want families to have the opportunity to understand Agape before making that decision. Our admissions journey is designed to give you clear information, meaningful conversations and a chance to experience our school community.",
      pillars: [
        { title: "Discover", text: "Understand our school and educational approach." },
        { title: "Connect", text: "Meet the people who make Agape what it is." },
        { title: "Belong", text: "Discover whether Agape feels right for your family." },
      ],
    },
  }),

  "admissions.apply": defineSection({
    page: "Admissions",
    label: "3. How to apply",
    description: "Applications sent from this form arrive in Admin › Enquiries.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "steps", label: "Steps", ...titled("Step") },
      {
        name: "keyDates",
        label: "Key dates (optional)",
        type: "list",
        itemLabel: "Date",
        fields: [
          { name: "label", label: "What", type: "text" },
          { name: "date", label: "When", type: "text" },
        ],
      },
      { name: "formEyebrow", label: "Form: small label", type: "text" },
      { name: "formTitle", label: "Form: heading", type: "text" },
      { name: "formIntro", label: "Form: intro", type: "textarea" },
    ],
    defaults: {
      eyebrow: "How to apply",
      heading: "A clear path from",
      headingAccent: "interest to enrolment.",
      description:
        "Every family is different. Our admissions team is here to guide you through the process and answer your questions along the way.",
      steps: [
        { title: "Start a conversation", text: "Tell us about your child and what you are looking for in their next school." },
        { title: "Submit an application", text: "Complete the application process and provide the information requested by the school." },
        { title: "Meet the school", text: "Connect with our team and, where applicable, take part in the relevant assessment or admissions conversation." },
        { title: "Receive next steps", text: "Our admissions team will guide your family through the next stage of the process." },
      ],
      keyDates: [] as { label: string; date: string }[],
      formEyebrow: "Ready to begin?",
      formTitle: "Start a conversation with admissions.",
      formIntro: "Tell us a little about your child and we'll be in touch about the next steps.",
    },
  }),

  "admissions.requirements": defineSection({
    page: "Admissions",
    label: "4. Requirements",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "items", label: "Documents / requirements", type: "strings", itemLabel: "Item" },
      { name: "note", label: "Small print", type: "textarea" },
      { name: "photo", label: "Photo", type: "image", aspect: "4:3" },
      { name: "photoCaption", label: "Photo caption", type: "text" },
    ],
    defaults: {
      eyebrow: "Requirements",
      heading: "Know what to",
      headingAccent: "prepare.",
      description:
        "Admission requirements can vary by year group and individual circumstances. Families should confirm the current requirements directly with the school before submitting an application.",
      items: [
        "Student and family information",
        "Previous school information",
        "Relevant academic records",
        "Required admissions documentation",
        "Any additional information requested by the school",
      ],
      note: "The list above is a general guide, not a substitute for the school's current admissions requirements.",
      photo: img("https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1800&q=90", "Students in class"),
      photoCaption: "Information made simple.",
    },
  }),

  "admissions.fees": defineSection({
    page: "Admissions",
    label: "5. Fees",
    description: "Add rows to the fee table to publish fees. Leave it empty to show the “ask admissions” cards instead.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "academicYear", label: "Academic year shown on the fee table", type: "text" },
      {
        name: "feeRows",
        label: "Fee table",
        type: "list",
        itemLabel: "Row",
        fields: [
          { name: "level", label: "Level / grade", type: "text" },
          { name: "amount", label: "Amount (e.g. GH₵ 12,500 per term)", type: "text" },
          { name: "note", label: "Note", type: "text" },
        ],
      },
      { name: "feeNotes", label: "Notes under the fee table", type: "strings", itemLabel: "Note" },
      { name: "cards", label: "Cards (shown when there's no fee table)", ...titled("Card") },
      { name: "boxLabel", label: "Help box: small label", type: "text" },
      { name: "boxTitle", label: "Help box: heading", type: "text" },
      { name: "buttonLabel", label: "Help box: button text", type: "text" },
    ],
    defaults: {
      eyebrow: "Fees",
      heading: "Plan with",
      headingAccent: "clarity.",
      description:
        "We believe families should have clear information when planning for school. Current fees should always be confirmed directly with Agape Academy International.",
      academicYear: "",
      feeRows: [] as { level: string; amount: string; note: string }[],
      feeNotes: [] as string[],
      cards: [
        { title: "Year group", text: "Fees and related costs may depend on the student's year group." },
        { title: "School year", text: "Confirm the current fee schedule for the applicable academic year." },
        { title: "Additional costs", text: "Ask admissions about any additional school-related costs that may apply." },
      ],
      boxLabel: "Need current information?",
      boxTitle: "Speak directly with admissions.",
      buttonLabel: "Ask about fees",
    },
  }),

  "admissions.scholarships": defineSection({
    page: "Admissions",
    label: "6. Scholarships",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "cardTitle", label: "Card heading", type: "text" },
      { name: "cardText", label: "Card text", type: "textarea" },
      { name: "linkLabel", label: "Link text", type: "text" },
    ],
    defaults: {
      eyebrow: "Scholarships",
      heading: "Supporting",
      headingAccent: "opportunity.",
      description:
        "If your family would like to understand whether scholarship or financial assistance opportunities are available, our admissions team can provide the current information and eligibility details.",
      cardTitle: "Ask about available support.",
      cardText: "Scholarship availability, eligibility and application arrangements should be confirmed with the school directly.",
      linkLabel: "Contact admissions",
    },
  }),

  "admissions.international": defineSection({
    page: "Admissions",
    label: "7. International students",
    fields: [
      { name: "eyebrow", label: "Small label", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "items", label: "Points", ...titled("Point") },
      { name: "buttonLabel", label: "Button text", type: "text" },
      { name: "photo", label: "Photo", type: "image", aspect: "4:5" },
      { name: "badge", label: "Photo badge", type: "text" },
    ],
    defaults: {
      eyebrow: "International students",
      heading: "Moving to Ghana?",
      description:
        "Relocating a family involves more than choosing a school. Our admissions team can help families understand the school experience and the steps involved in joining Agape.",
      items: [
        { title: "Relocation conversations", text: "Talk through your family's situation and school expectations." },
        { title: "School transition", text: "Understand how your child's transition into Agape can be approached." },
        { title: "Experience the campus", text: "Arrange a visit when possible and see the community first-hand." },
      ],
      buttonLabel: "Talk to admissions",
      photo: img("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=90", "Students from different backgrounds"),
      badge: "A global outlook",
    },
  }),

  "admissions.visit": defineSection({
    page: "Admissions",
    label: "8. Book a visit",
    description: "Visit requests arrive in Admin › Enquiries.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "formTitle", label: "Form heading", type: "text" },
    ],
    defaults: {
      eyebrow: "Book a visit",
      heading: "Don't just imagine Agape.",
      headingAccent: "Experience it.",
      description: "Come onto campus, see the learning environment, meet our team and ask the questions that matter to your family.",
      formTitle: "Request a campus visit",
    },
  }),

  "admissions.faq": defineSection({
    page: "Admissions",
    label: "9. Questions families ask",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "description", label: "Paragraph", type: "textarea" },
      ...faqFields,
    ],
    defaults: {
      heading: "Questions families ask.",
      description: "If you cannot find the information you need, our admissions team can help.",
      items: [
        {
          question: "Can we visit the school before applying?",
          answer:
            "Yes. A campus visit is a valuable way for families to experience the environment, ask questions and understand the Agape community before making an application.",
        },
        {
          question: "Do you accept families relocating to Ghana?",
          answer: "Our admissions team can guide relocating families through the information and next steps relevant to joining Agape.",
        },
        {
          question: "Where can I find current fees?",
          answer:
            "Fees should be confirmed directly with the school so families receive the most current and accurate information for the relevant year group.",
        },
        {
          question: "What happens after an application is submitted?",
          answer: "The admissions team will review the submitted information and communicate the next steps relevant to the student's application.",
        },
      ],
    },
  }),

  "admissions.cta": defineSection({
    page: "Admissions",
    label: "10. Closing call to action",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "primaryLabel", label: "Main button text", type: "text" },
      { name: "primaryUrl", label: "Main button link", type: "url" },
      { name: "secondaryLabel", label: "Second button text", type: "text" },
      { name: "secondaryUrl", label: "Second button link", type: "url" },
    ],
    defaults: {
      eyebrow: "Your next chapter",
      heading: "Let's take the",
      headingAccent: "first step.",
      description: "Speak with our admissions team, arrange a visit and discover whether Agape is the right next chapter for your family.",
      primaryLabel: "Contact admissions",
      primaryUrl: "/contact",
      secondaryLabel: "Explore academics",
      secondaryUrl: "/academics",
    },
  }),
};
