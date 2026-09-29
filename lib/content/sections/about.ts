import { defineSection, img, ImageValue } from "../fields";
import { ctaFields, headingFields, heroFields } from "./shared";

export const aboutSections = {
  "about.hero": defineSection({
    page: "About",
    label: "1. Hero",
    fields: [
      ...heroFields,
      { name: "primaryLabel", label: "Main button text", type: "text" },
      { name: "secondaryLabel", label: "Second button text", type: "text" },
      { name: "secondaryUrl", label: "Second button link", type: "url" },
    ],
    defaults: {
      background: img("/banner.jpg", "Agape Academy students on campus"),
      eyebrow: "About Agape Academy International",
      heading: "Education with",
      headingAccent: "purpose at its heart.",
      intro:
        "Agape Academy International exists to nurture young people who are intellectually curious, grounded in character and equipped to make a meaningful difference in the world.",
      primaryLabel: "Discover our story",
      secondaryLabel: "Visit our campus",
      secondaryUrl: "/admissions#book-a-visit",
    },
  }),

  "about.story": defineSection({
    page: "About",
    label: "2. Our story",
    fields: [...headingFields, { name: "paragraphs", label: "Paragraphs", type: "strings", itemLabel: "Paragraph" }],
    defaults: {
      eyebrow: "Our Story",
      heading: "More than a school.",
      headingAccent: "A place to become.",
      paragraphs: [
        "At Agape Academy International, we believe education should do more than transfer knowledge. It should help young people understand themselves, discover their gifts, develop strong character and learn how to contribute to the world around them.",
        "Our approach brings academic excellence and Christian principles together in a learning environment that is ambitious, nurturing and deeply personal. We want students to experience the joy of learning while developing the discipline and resilience required to pursue meaningful goals.",
        "Every child arrives with a unique combination of personality, ability, curiosity and potential. Our responsibility is to create the conditions in which that potential can grow. That means excellent teaching, meaningful relationships, thoughtful pastoral care and opportunities to explore life beyond the classroom.",
        "The result is a school community where achievement matters, but where achievement is understood within a bigger picture: developing confident, compassionate and capable young people who know that their lives can have purpose.",
      ],
    },
  }),

  "about.vision": defineSection({
    page: "About",
    label: "3. Vision & mission",
    fields: [
      ...headingFields,
      { name: "visionTitle", label: "Vision statement", type: "text" },
      { name: "visionBody", label: "Vision paragraph", type: "textarea" },
      { name: "missionTitle", label: "Mission statement", type: "text" },
      { name: "missionBody", label: "Mission paragraph", type: "textarea" },
    ],
    defaults: {
      eyebrow: "Vision & Mission",
      heading: "A clear direction for",
      headingAccent: "meaningful education.",
      visionTitle: "Young people equipped to live purposeful lives.",
      visionBody:
        "We envision a community where students grow into confident, principled and capable individuals who use their knowledge, character and gifts to serve others and shape the future.",
      missionTitle: "Academic excellence in Christ.",
      missionBody:
        "We provide an academically ambitious and nurturing education that develops the whole child — intellectually, socially, emotionally, physically and spiritually — within a community shaped by Christian values.",
    },
  }),

  "about.leadership": defineSection({
    page: "About",
    label: "4. Leadership & staff",
    description: "Add real leadership team members under “People” — they appear with their photos. The cards below describe your approach.",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      {
        name: "people",
        label: "People",
        type: "list",
        itemLabel: "Person",
        fields: [
          { name: "name", label: "Full name", type: "text" },
          { name: "role", label: "Role (e.g. Principal)", type: "text" },
          { name: "bio", label: "Short bio", type: "textarea" },
          { name: "photo", label: "Portrait", type: "image", aspect: "4:5" },
        ],
      },
      {
        name: "cards",
        label: "Approach cards",
        type: "list",
        itemLabel: "Card",
        fields: [
          { name: "role", label: "Label", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Leadership",
      heading: "People make",
      headingAccent: "the difference.",
      description:
        "A strong school is built by people who care deeply about the work. Our culture is shaped by educators and families who believe every student deserves to be seen, challenged and supported.",
      people: [] as { name: string; role: string; bio: string; photo: ImageValue }[],
      cards: [
        {
          role: "School Leadership",
          title: "Leading with purpose",
          description:
            "Our leadership approach brings together academic direction, pastoral care and a clear commitment to the whole child. We seek to create an environment where teachers can teach well and students can grow with confidence.",
        },
        {
          role: "Our Teachers",
          title: "Teachers who know their students",
          description:
            "Great teaching begins with knowing the learner. Our educators combine subject knowledge with patience, creativity and intentional relationships that help students discover their strengths.",
        },
        {
          role: "Our Families",
          title: "Partnership beyond the classroom",
          description:
            "Parents and guardians are essential partners in a child's education. We value open communication and meaningful collaboration between home and school.",
        },
      ],
    },
  }),

  "about.values": defineSection({
    page: "About",
    label: "5. Core values",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      {
        name: "values",
        label: "Values",
        type: "list",
        itemLabel: "Value",
        fields: [
          { name: "title", label: "Value", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Core Values",
      heading: "What shapes",
      headingAccent: "life at Agape.",
      description:
        "Our values are not simply words on a wall. They influence the way we teach, learn, lead, relate to one another and approach the opportunities and challenges of everyday school life.",
      values: [
        { title: "Love", description: "We believe children flourish when they are known, valued and encouraged. Love shapes the way we teach, lead, correct and care for every member of our community." },
        { title: "Excellence", description: "We pursue high standards in learning and character. Excellence at Agape means giving our best, developing strong habits and continually seeking to grow." },
        { title: "Integrity", description: "We encourage students to become people of honesty, responsibility and courage who do what is right even when nobody is watching." },
        { title: "Community", description: "Education is stronger when families, teachers and students work together. We nurture a community where people belong, contribute and support one another." },
        { title: "Curiosity", description: "We want students to ask thoughtful questions, explore ideas and approach the world with wonder. Curiosity turns learning from a task into a lifelong pursuit." },
        { title: "Purpose", description: "We prepare young people not simply to succeed, but to understand who they are, what they can contribute and how their gifts can serve a greater purpose." },
      ],
    },
  }),

  "about.why": defineSection({
    page: "About",
    label: "6. Why Agape",
    fields: [
      ...headingFields,
      { name: "paragraphs", label: "Paragraphs", type: "strings", itemLabel: "Paragraph" },
      { name: "linkLabel", label: "Link text", type: "text" },
      { name: "photo", label: "Photo (optional — replaces the purple quote card)", type: "image", aspect: "4:5" },
      { name: "quote", label: "Quote card text", type: "text" },
      { name: "quoteNote", label: "Quote card caption", type: "textarea" },
    ],
    defaults: {
      eyebrow: "Why Agape",
      heading: "Where ambition",
      headingAccent: "meets belonging.",
      paragraphs: [
        "Choosing a school is about more than academics. It is about finding an environment where a child can feel secure enough to explore, challenged enough to grow and supported enough to become confident in who they are.",
        "At Agape, we bring those elements together. We take learning seriously while remembering that every student is a whole person with individual hopes, questions, strengths and needs.",
      ],
      linkLabel: "Explore admissions",
      photo: img("", ""),
      quote: "Academic excellence in Christ.",
      quoteNote: "A simple idea that captures our commitment to developing capable minds, strong character and purposeful lives.",
    },
  }),

  "about.cta": defineSection({
    page: "About",
    label: "7. Closing call to action",
    fields: ctaFields,
    defaults: {
      eyebrow: "Visit Agape",
      title: "See it for yourself.",
      highlight: "Come and visit.",
      description: "The best way to understand Agape is to walk the campus, meet our teachers and see a normal school day.",
      primaryLabel: "Book a visit",
      primaryHref: "/admissions#book-a-visit",
      secondaryLabel: "Explore academics",
      secondaryHref: "/academics",
    },
  }),
};
