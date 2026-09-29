import { defineSection, img } from "../fields";

export const siteSections = {
  "site.identity": defineSection({
    page: "Site-wide",
    label: "School identity & logo",
    description: "Logo, name and tagline used in the header, footer and loading screen.",
    fields: [
      { name: "logo", label: "Logo / crest", type: "image", aspect: "1:1" },
      { name: "schoolName", label: "School name", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
    ],
    defaults: {
      logo: img("/school_logo.png", "Agape Academy International logo"),
      schoolName: "Agape Academy International",
      tagline: "Christ-centered education for a brighter future.",
    },
  }),

  "site.contact": defineSection({
    page: "Site-wide",
    label: "Contact details",
    description: "Shown in the footer and on the Contact page.",
    fields: [
      { name: "address", label: "Address", type: "textarea" },
      { name: "phone", label: "Main phone", type: "text" },
      { name: "whatsapp", label: "WhatsApp number", type: "text", help: "International format, e.g. +233201234567" },
      { name: "email", label: "General email", type: "text" },
      { name: "admissionsEmail", label: "Admissions email", type: "text" },
      { name: "officeHours", label: "Office hours", type: "textarea" },
      { name: "mapUrl", label: "Google Maps link (for “Get directions”)", type: "url" },
      { name: "mapQuery", label: "Map search text (for the embedded map)", type: "text" },
    ],
    defaults: {
      address: "PRM9+4R9\nPantang West, Ghana",
      phone: "+233 55 451 7116",
      whatsapp: "",
      email: "info@agapeacademyinternational.edu.gh",
      admissionsEmail: "info@agapeacademyinternational.edu.gh",
      officeHours: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Agape+Academy+International+Pantang+West+Ghana",
      mapQuery: "Agape Academy International, Pantang West, Ghana",
    },
  }),

  "site.social": defineSection({
    page: "Site-wide",
    label: "Social media links",
    description: "Leave a link blank to hide that icon.",
    fields: [
      { name: "facebook", label: "Facebook", type: "url" },
      { name: "instagram", label: "Instagram", type: "url" },
      { name: "youtube", label: "YouTube", type: "url" },
      { name: "linkedin", label: "LinkedIn", type: "url" },
      { name: "tiktok", label: "TikTok", type: "url" },
    ],
    defaults: { facebook: "", instagram: "", youtube: "", linkedin: "", tiktok: "" },
  }),

  "site.announcement": defineSection({
    page: "Site-wide",
    label: "Announcement bar",
    description: "A short notice across the top of every page. Leave the message blank to hide it.",
    fields: [
      { name: "message", label: "Message", type: "text" },
      { name: "linkLabel", label: "Link text", type: "text" },
      { name: "linkUrl", label: "Link URL", type: "url" },
    ],
    defaults: { message: "", linkLabel: "", linkUrl: "" },
  }),

  "site.portals": defineSection({
    page: "Site-wide",
    label: "Portal links",
    description: "Links to parent, student and staff systems in the footer.",
    fields: [
      { name: "parentPortal", label: "Parent portal URL", type: "url" },
      { name: "studentPortal", label: "Student portal URL", type: "url" },
      { name: "staffPortal", label: "Staff portal URL", type: "url" },
    ],
    defaults: { parentPortal: "", studentPortal: "", staffPortal: "" },
  }),
};
