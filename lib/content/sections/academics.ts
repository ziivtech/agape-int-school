import { defineSection, img } from "../fields";
import { ctaFields, headingFields, heroFields } from "./shared";

export const academicsSections = {
  "academics.hero": defineSection({
    page: "Academics",
    label: "1. Hero",
    fields: [
      ...heroFields,
      { name: "buttonLabel", label: "Button text", type: "text" },
      { name: "badge", label: "Corner badge text", type: "text" },
    ],
    defaults: {
      background: img("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2200&q=90", "Students learning together"),
      eyebrow: "Academics",
      heading: "Curious minds.",
      headingAccent: "Confident learners.",
      intro:
        "A rigorous, well-rounded educational journey designed to develop knowledge, character, curiosity and the confidence to navigate a changing world.",
      buttonLabel: "Explore the journey",
      badge: "Early Years → High School",
    },
  }),

  "academics.approach": defineSection({
    page: "Academics",
    label: "2. Our approach",
    fields: [
      ...headingFields,
      { name: "paragraphs", label: "Paragraphs", type: "strings", itemLabel: "Paragraph" },
      {
        name: "stats",
        label: "Key figures (optional)",
        type: "list",
        itemLabel: "Figure",
        fields: [
          { name: "value", label: "Figure", type: "text" },
          { name: "label", label: "Label", type: "text" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Our Approach",
      heading: "Learning that goes",
      headingAccent: "beyond the classroom.",
      paragraphs: [
        "At Agape Academy International, academic excellence is not about memorising more information. It is about learning how to think, question, communicate, create and apply knowledge with purpose.",
        "Our academic journey is designed to evolve with the learner. Younger students build confidence and foundational skills. Older students develop greater independence, intellectual depth and responsibility.",
        "Throughout every stage, we seek to balance academic challenge with curiosity, creativity, character and care.",
      ],
      stats: [] as { value: string; label: string }[],
    },
  }),

  "academics.stages": defineSection({
    page: "Academics",
    label: "3. School stages",
    description: "Keep the “Anchor” values as they are — the menu links to them.",
    fields: [
      ...headingFields,
      {
        name: "stages",
        label: "Stages",
        type: "list",
        itemLabel: "Stage",
        fields: [
          { name: "anchor", label: "Anchor (e.g. primary)", type: "text" },
          { name: "age", label: "Ages", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "points", label: "Key points", type: "strings", itemLabel: "Point" },
          { name: "photo", label: "Photo", type: "image", aspect: "4:3" },
        ],
      },
    ],
    defaults: {
      eyebrow: "The Learning Journey",
      heading: "One journey.",
      headingAccent: "Four defining stages.",
      stages: [
        {
          anchor: "early-years",
          age: "Ages 3–5",
          title: "Early Years",
          subtitle: "Where curiosity begins.",
          description:
            "The earliest years of education lay the foundations for everything that follows. Our approach encourages children to explore, communicate, create and develop confidence through purposeful learning experiences.",
          points: [
            "Early literacy and communication",
            "Foundations in numeracy",
            "Creative and imaginative exploration",
            "Social and emotional development",
            "Confidence, independence and routines",
          ],
          photo: img("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1800&q=85", "Early Years students exploring and learning"),
        },
        {
          anchor: "primary",
          age: "Ages 6–10",
          title: "Primary School",
          subtitle: "Building strong foundations.",
          description:
            "Primary education is where curiosity becomes disciplined learning. Students develop essential academic skills while discovering the joy of reading, questioning, creating and solving problems.",
          points: [
            "Strong literacy and numeracy foundations",
            "Developing independent study habits",
            "Scientific and mathematical thinking",
            "Creative arts and expression",
            "Collaboration and character development",
          ],
          photo: img("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=85", "Primary school students engaged in study"),
        },
        {
          anchor: "middle",
          age: "Ages 11–13",
          title: "Middle School",
          subtitle: "Growing into independent thinkers.",
          description:
            "As students mature, learning becomes increasingly analytical and independent. Middle School provides the bridge between foundational learning and the academic depth of the senior years.",
          points: [
            "Increasing subject depth",
            "Critical thinking and analysis",
            "Research and presentation skills",
            "Growing independence",
            "Leadership and collaboration",
          ],
          photo: img("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1800&q=85", "Middle school students in discussion"),
        },
        {
          anchor: "high-school",
          age: "Ages 14–18",
          title: "High School",
          subtitle: "Preparing for what comes next.",
          description:
            "The senior years bring greater academic challenge, responsibility and direction. Students are encouraged to pursue excellence while developing the habits, confidence and perspective required for life beyond school.",
          points: [
            "Rigorous academic preparation",
            "Examination readiness",
            "Independent research and study",
            "University and career exploration",
            "Leadership and personal responsibility",
          ],
          photo: img("/grad_01.jpg", "Senior high school students"),
        },
      ],
    },
  }),

  "academics.curriculum": defineSection({
    page: "Academics",
    label: "4. Curriculum (Abeka)",
    fields: [
      ...headingFields,
      { name: "intro", label: "Intro paragraph", type: "textarea" },
      { name: "photo", label: "Feature photo", type: "image", aspect: "4:3" },
      { name: "photoBadge", label: "Photo badge", type: "text" },
      { name: "whyEyebrow", label: "Feature: small label", type: "text" },
      { name: "whyHeading", label: "Feature: heading", type: "text" },
      { name: "whyAccent", label: "Feature: heading (faded part)", type: "text" },
      { name: "whyParagraphs", label: "Feature: paragraphs", type: "strings", itemLabel: "Paragraph" },
      { name: "linkLabel", label: "Feature: button text", type: "text" },
      { name: "linkUrl", label: "Feature: button link", type: "url" },
      { name: "formatEyebrow", label: "Format: small label", type: "text" },
      { name: "formatHeading", label: "Format: heading", type: "text" },
      { name: "formatAccent", label: "Format: heading (faded part)", type: "text" },
      {
        name: "formatItems",
        label: "Format cards",
        type: "list",
        itemLabel: "Card",
        fields: [
          { name: "number", label: "Big figure", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Description", type: "textarea" },
        ],
      },
      { name: "beyondEyebrow", label: "Beyond: small label", type: "text" },
      { name: "beyondHeading", label: "Beyond: heading", type: "text" },
      { name: "beyondAccent", label: "Beyond: heading (faded part)", type: "text" },
      {
        name: "beyondCards",
        label: "Beyond cards",
        type: "list",
        itemLabel: "Card",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Description", type: "textarea" },
        ],
      },
      { name: "scopeLabel", label: "Scope box: label", type: "text" },
      { name: "scopeText", label: "Scope box: text", type: "textarea" },
      { name: "scopeLinkLabel", label: "Scope box: button text", type: "text" },
      { name: "scopeUrl", label: "Scope box: button link", type: "url" },
    ],
    defaults: {
      eyebrow: "Our Curriculum",
      heading: "Excellence in",
      headingAccent: "Christian education.",
      intro:
        "At Agape Academy International, our academic programme is built around the Abeka curriculum — combining rigorous academics with a Christian worldview and a strong foundation in character.",
      photo: img("/abek.jpg", "Abeka curriculum at Agape Academy International"),
      photoBadge: "Abeka Curriculum",
      whyEyebrow: "Why Abeka",
      whyHeading: "A curriculum grounded in",
      whyAccent: "faith and learning.",
      whyParagraphs: [
        "Abeka is a Christian American-based curriculum designed to provide a comprehensive education from the early years through Grade 12. Its approach brings together academic development, Christian values and purposeful learning.",
        "With our foundation built on Christ and our motto, “Excellence in Christ”, Abeka provides a strong fit for the academic and moral foundations we seek to build at Agape.",
      ],
      linkLabel: "Learn more about Abeka",
      linkUrl: "https://www.abeka.com/ChristianSchool/",
      formatEyebrow: "Curriculum format",
      formatHeading: "Structured for",
      formatAccent: "consistent progress.",
      formatItems: [
        { number: "170", title: "Lessons", text: "A structured programme of lessons delivered across four 9-week quarters." },
        { number: "4", title: "Quarters", text: "The academic year is organised into four focused 9-week learning periods." },
        { number: "A–F", title: "Assessment", text: "Students are assessed through exams, tests, quizzes, classwork and homework." },
        { number: "4.0", title: "High School GPA", text: "High school students are evaluated using a GPA scale out of 4.0." },
      ],
      beyondEyebrow: "Beyond Agape",
      beyondHeading: "Where the",
      beyondAccent: "journey can lead.",
      beyondCards: [
        {
          title: "Tertiary pathways",
          text: "Upon completing the Abeka curriculum, students can continue into tertiary education and explore opportunities locally and internationally.",
        },
        {
          title: "A global outlook",
          text: "Students can supplement their diploma with standardised tests such as the SAT or ACT when pursuing further education outside Ghana.",
        },
      ],
      scopeLabel: "Explore the curriculum",
      scopeText: "See Abeka's official curriculum information, course materials and scope & sequence.",
      scopeLinkLabel: "View Abeka scope & sequence",
      scopeUrl: "https://www.abeka.com/ChristianSchool/ScopeAndSequence.aspx",
    },
  }),

  "academics.support": defineSection({
    page: "Academics",
    label: "5. Learning support",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "points", label: "Points", type: "strings", itemLabel: "Point" },
      { name: "photo", label: "Photo", type: "image", aspect: "4:5" },
    ],
    defaults: {
      eyebrow: "Learning Support",
      heading: "Every learner",
      headingAccent: "deserves to be understood.",
      description:
        "Children do not all learn in exactly the same way. Our approach to learning support begins with understanding the individual learner and identifying ways to help them engage, progress and feel confident.",
      points: [
        "Individual needs considered within the learning journey",
        "Collaboration between educators and families",
        "Support that encourages independence",
        "A focus on strengths as well as areas for growth",
      ],
      photo: img("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1800&q=85", "Student receiving individual learning support"),
    },
  }),

  "academics.pathways": defineSection({
    page: "Academics",
    label: "6. University pathways",
    fields: [
      ...headingFields,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "buttonLabel", label: "Button text", type: "text" },
      { name: "buttonUrl", label: "Button link", type: "url" },
      { name: "photo", label: "Photo", type: "image", aspect: "4:5" },
      { name: "cardTitle", label: "Photo card: title", type: "text" },
      { name: "cardText", label: "Photo card: text", type: "textarea" },
    ],
    defaults: {
      eyebrow: "University Pathways",
      heading: "Preparing students",
      headingAccent: "for a wider world.",
      description:
        "The final years of school should open doors, not close them. We help students think about higher education and future opportunities with increasing clarity and confidence.",
      buttonLabel: "Explore admissions",
      buttonUrl: "/admissions",
      photo: img("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=90", "Students preparing for their future"),
      cardTitle: "Think beyond the next examination.",
      cardText: "Build the knowledge, habits and confidence that can carry forward into higher education and life beyond school.",
    },
  }),

  "academics.cta": defineSection({
    page: "Academics",
    label: "7. Closing call to action",
    fields: ctaFields,
    defaults: {
      eyebrow: "Discover Agape",
      title: "Give your child",
      highlight: "room to grow.",
      description: "Explore an education designed to develop confident, curious and grounded young people.",
      primaryLabel: "Explore admissions",
      primaryHref: "/admissions",
      secondaryLabel: "",
      secondaryHref: "",
    },
  }),
};
