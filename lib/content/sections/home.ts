import { defineSection, img } from "../fields";

const heading = [
  { name: "eyebrow", label: "Small label above heading", type: "text" },
  { name: "heading", label: "Heading", type: "text" },
] as const;

export const homeSections = {
  "home.hero": defineSection({
    page: "Homepage",
    label: "1. Hero (top of page)",
    fields: [
      {
        name: "slides",
        label: "Slideshow photos",
        type: "list",
        itemLabel: "Slide",
        help: "The hero fades between these photos every few seconds. Use wide, landscape photos (at least 1920px wide). Remove them all to use the single background below instead.",
        fields: [
          { name: "photo", label: "Photo", type: "image", aspect: "16:9" },
          { name: "caption", label: "Caption (optional, shown small in the corner)", type: "text" },
        ],
      },
      { name: "background", label: "Single background photo or video (used when there are no slides)", type: "image", aspect: "16:9", help: "A short muted video (MP4) also works." },
      { name: "eyebrow", label: "Small label", type: "text" },
      { name: "line1", label: "Headline line 1", type: "text" },
      { name: "line2", label: "Headline line 2", type: "text" },
      { name: "line3", label: "Headline line 3", type: "text" },
      { name: "intro", label: "Intro sentence", type: "textarea" },
      { name: "primaryLabel", label: "Main button text", type: "text" },
      { name: "primaryUrl", label: "Main button link", type: "url" },
      { name: "secondaryLabel", label: "Second button text", type: "text" },
      { name: "secondaryUrl", label: "Second button link", type: "url" },
    ],
    defaults: {
      slides: [
        { photo: img("/banner.jpg", "Agape Academy campus and students"), caption: "" },
        { photo: img("/grad_01.jpg", "Agape graduates celebrating"), caption: "" },
        { photo: img("/games_3.jpg", "Students competing on sports day"), caption: "" },
        { photo: img("/together.jpg", "Students together on campus"), caption: "" },
      ],
      background: img("/banner.jpg", "Agape Academy campus and students"),
      eyebrow: "Agape Academy International",
      line1: "Academic excellence.",
      line2: "Christian character.",
      line3: "Global purpose.",
      intro: "Preparing young people to learn deeply, lead courageously and live with purpose.",
      primaryLabel: "Explore Agape",
      primaryUrl: "#our-story",
      secondaryLabel: "Book a Visit",
      secondaryUrl: "/admissions#book-a-visit",
    },
  }),

  "home.intro": defineSection({
    page: "Homepage",
    label: "2. Our philosophy",
    fields: [
      ...heading,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "photo", label: "Photo", type: "image", aspect: "4:5" },
      {
        name: "pillars",
        label: "Pillars",
        type: "list",
        itemLabel: "Pillar",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Description", type: "textarea" },
        ],
      },
      { name: "linkLabel", label: "Link text", type: "text" },
    ],
    defaults: {
      eyebrow: "Our philosophy",
      heading: "More than an education. A foundation for life.",
      description:
        "At Agape Academy International, we prepare students not simply to pass examinations, but to become thoughtful, capable and principled young people who can contribute to Ghana and the wider world.",
      photo: img("/cover.jpg", "Teacher speaking with Agape Academy students"),
      pillars: [
        { title: "Academic Excellence", body: "A rigorous, well-rounded curriculum that stretches every learner." },
        { title: "Character Formation", body: "Integrity, discipline and compassion, built into daily school life." },
        { title: "Faith", body: "A Christ-centered foundation that shapes how students see the world." },
        { title: "Leadership", body: "Real opportunities to take responsibility, on campus and beyond it." },
        { title: "Global Perspective", body: "Confidence to participate in the wider world, rooted in Ghanaian identity." },
      ],
      linkLabel: "Discover our story",
    },
  }),

  "home.journey": defineSection({
    page: "Homepage",
    label: "3. School stages",
    fields: [
      ...heading,
      {
        name: "stages",
        label: "Stages",
        type: "list",
        itemLabel: "Stage",
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "ages", label: "Ages", type: "text" },
          { name: "body", label: "Description", type: "textarea" },
          { name: "href", label: "Link", type: "url" },
          { name: "photo", label: "Photo", type: "image", aspect: "1:1" },
        ],
      },
    ],
    defaults: {
      eyebrow: "The Agape journey",
      heading: "Every age. Every stage. One purpose.",
      stages: [
        {
          name: "Early Years",
          ages: "Ages 3–5",
          body: "Play-based foundations in literacy, numeracy and social confidence.",
          href: "/academics#early-years",
          photo: img("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80", "Early Years students at Agape Academy"),
        },
        {
          name: "Primary School",
          ages: "Ages 6–10",
          body: "Building strong academic habits alongside character and creativity.",
          href: "/academics#primary",
          photo: img("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", "Primary students at Agape Academy"),
        },
        {
          name: "Middle School",
          ages: "Ages 11–13",
          body: "Deepening subject knowledge as students grow into independent learners.",
          href: "/academics#middle",
          photo: img("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80", "Middle School students at Agape Academy"),
        },
        {
          name: "High School",
          ages: "Ages 14–18",
          body: "Rigorous preparation for examinations, university and life beyond Agape.",
          href: "/academics#high-school",
          photo: img("/grad_01.jpg", "High School students at Agape Academy"),
        },
      ],
    },
  }),

  "home.academics": defineSection({
    page: "Homepage",
    label: "4. Academics & key figures",
    fields: [
      ...heading,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "subjects", label: "Subjects", type: "strings", itemLabel: "Subject" },
      {
        name: "stats",
        label: "Key figures",
        type: "list",
        itemLabel: "Figure",
        fields: [
          { name: "value", label: "Figure (e.g. 1:12, 25+, 98%)", type: "text" },
          { name: "label", label: "What it measures", type: "text" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Academics",
      heading: "Curious minds. Confident learners.",
      description:
        "A broad, rigorous curriculum that builds real understanding across the sciences, the humanities, languages and the arts, and prepares students for what comes after Agape.",
      subjects: ["Mathematics", "Science", "English", "Humanities", "Languages", "ICT", "Creative Arts", "Bible", "University Preparation"],
      stats: [] as { value: string; label: string }[],
    },
  }),

  "home.faith": defineSection({
    page: "Homepage",
    label: "5. Faith & character",
    fields: [
      ...heading,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "values", label: "Values", type: "strings", itemLabel: "Value" },
      { name: "buttonLabel", label: "Button text", type: "text" },
      { name: "buttonUrl", label: "Button link", type: "url" },
    ],
    defaults: {
      eyebrow: "Faith & character",
      heading: "Rooted in faith. Prepared for the world.",
      description:
        "Christian education at Agape is not a single subject on the timetable. It shapes how students treat one another, how they lead, and how they understand their responsibility to others.",
      values: ["Biblical values", "Character development", "Chapel", "Prayer", "Service", "Leadership", "Integrity", "Compassion", "Responsibility"],
      buttonLabel: "Our faith & values",
      buttonUrl: "/about#values",
    },
  }),

  "home.global": defineSection({
    page: "Homepage",
    label: "6. Global perspective",
    fields: [
      ...heading,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "highlights", label: "Highlights", type: "strings", itemLabel: "Highlight" },
    ],
    defaults: {
      eyebrow: "Global perspective",
      heading: "Rooted in Ghana. Connected to the world.",
      description:
        "An Agape education prepares students to participate confidently in a global society, while staying firmly connected to their Ghanaian identity.",
      highlights: ["International curriculum", "Global university opportunities", "International perspectives", "Cross-cultural learning", "Global citizenship"],
    },
  }),

  "home.studentLife": defineSection({
    page: "Homepage",
    label: "7. Student life",
    fields: [
      ...heading,
      { name: "featureTitle", label: "Featured activity title", type: "text" },
      { name: "featureText", label: "Featured activity description", type: "text" },
      { name: "featurePhoto", label: "Featured activity photo", type: "image", aspect: "4:3" },
      { name: "activities", label: "Other activities", type: "strings", itemLabel: "Activity" },
    ],
    defaults: {
      eyebrow: "Student life",
      heading: "Learning doesn't stop at the classroom.",
      featureTitle: "Sport & Athletics",
      featureText: "Inter-house games, track, basketball and teamwork.",
      featurePhoto: img("/games_3.jpg", "Students competing on sports day"),
      activities: ["Music", "Drama", "Art", "Chess", "Dance", "Clubs", "Leadership", "Community Service", "Student Events"],
    },
  }),

  "home.leadership": defineSection({
    page: "Homepage",
    label: "8. Student leadership",
    fields: [
      ...heading,
      { name: "description", label: "Paragraph", type: "textarea" },
      {
        name: "areas",
        label: "Leadership areas",
        type: "list",
        itemLabel: "Area",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Description", type: "textarea" },
        ],
      },
      { name: "linkLabel", label: "Link text", type: "text" },
    ],
    defaults: {
      eyebrow: "Student leadership",
      heading: "Leadership starts here.",
      description: "At Agape, leadership isn't reserved for the final year. Students shape school life from the moment they arrive.",
      areas: [
        { title: "Student Union", body: "An elected body giving students a real voice in school life." },
        { title: "Student-led initiatives", body: "Projects designed and run by students, from idea to delivery." },
        { title: "Clubs", body: "Interest groups led and organised by students themselves." },
        { title: "Fundraising & community projects", body: "Practical leadership experience beyond the classroom." },
      ],
      linkLabel: "Meet our student leaders",
    },
  }),

  "home.wellbeing": defineSection({
    page: "Homepage",
    label: "9. Wellbeing",
    fields: [
      ...heading,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "photo", label: "Photo", type: "image", aspect: "4:3" },
      { name: "areas", label: "Areas of care", type: "strings", itemLabel: "Area" },
    ],
    defaults: {
      eyebrow: "Wellbeing",
      heading: "Known. Supported. Encouraged.",
      description: "Every student at Agape is known by name, not just by their teachers but by a wider community invested in their growth.",
      photo: img("/together.jpg", "Students connecting on campus"),
      areas: ["Pastoral care", "Student support", "Teacher relationships", "Safeguarding", "Mental wellbeing", "Community & belonging"],
    },
  }),

  "home.campus": defineSection({
    page: "Homepage",
    label: "10. Campus spaces",
    fields: [
      ...heading,
      {
        name: "spaces",
        label: "Spaces",
        type: "list",
        itemLabel: "Space",
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "photo", label: "Photo", type: "image", aspect: "4:5" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Campus",
      heading: "A place to learn. A place to belong.",
      spaces: [
        { name: "Classrooms", photo: img("https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=85", "Classrooms at Agape Academy") },
        { name: "Science", photo: img("https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85", "Science laboratory") },
        { name: "Library", photo: img("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=85", "School library") },
        { name: "Sport", photo: img("/games_1.jpg", "Sports field") },
        { name: "Creative Spaces", photo: img("https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85", "Art studio") },
        { name: "Chapel", photo: img("https://images.unsplash.com/photo-1548625361-195fe578b907?auto=format&fit=crop&w=800&q=85", "Chapel") },
      ],
    },
  }),

  "home.pathways": defineSection({
    page: "Homepage",
    label: "11. University pathways",
    fields: [
      ...heading,
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "destinations", label: "Destinations", type: "strings", itemLabel: "Destination" },
      { name: "linkLabel", label: "Link text", type: "text" },
    ],
    defaults: {
      eyebrow: "Beyond Agape",
      heading: "From Agape to the world.",
      description: "Our graduates go on to universities in Ghana and around the world.",
      destinations: ["Ghana", "Africa", "United Kingdom", "United States", "Canada", "Europe", "Australia"],
      linkLabel: "Explore future pathways",
    },
  }),

  "home.studentStories": defineSection({
    page: "Homepage",
    label: "12. Student stories",
    fields: [
      ...heading,
      { name: "bannerPhoto", label: "Banner photo", type: "image", aspect: "21:9" },
      { name: "bannerText", label: "Banner caption", type: "text" },
      {
        name: "students",
        label: "Students",
        type: "list",
        itemLabel: "Student",
        fields: [
          { name: "name", label: "Name", type: "text" },
          { name: "grade", label: "Grade", type: "text" },
          { name: "quote", label: "Quote", type: "textarea" },
          { name: "interests", label: "Interests", type: "text" },
          { name: "ambition", label: "Ambition", type: "text" },
          { name: "photo", label: "Portrait", type: "image", aspect: "4:5" },
        ],
      },
    ],
    defaults: {
      eyebrow: "In their words",
      heading: "Student stories",
      bannerPhoto: img("/together.jpg", "Agape Academy students together"),
      bannerText: "Every student has a story worth hearing.",
      students: [
        {
          name: "Student Name",
          grade: "Grade 11",
          quote: "I have learned that leadership isn't about being the loudest person in the room. It's about taking responsibility.",
          interests: "Debate, chess, community outreach",
          ambition: "Studying medicine",
          photo: img("/images/student-1.jpg", "Agape student"),
        },
        {
          name: "Student Name",
          grade: "Grade 9",
          quote: "Chapel taught me that character matters as much as grades. Both push me to do better.",
          interests: "Choir, basketball",
          ambition: "Studying engineering",
          photo: img("/images/student-2.jpg", "Agape student"),
        },
        {
          name: "Student Name",
          grade: "Grade 12",
          quote: "The Student Union gave me my first real chance to lead a project from start to finish.",
          interests: "Student Union, art",
          ambition: "Studying international relations",
          photo: img("/images/student-3.jpg", "Agape student"),
        },
      ],
    },
  }),

  "home.parentStories": defineSection({
    page: "Homepage",
    label: "13. Parent stories",
    fields: [
      ...heading,
      {
        name: "parents",
        label: "Testimonials",
        type: "list",
        itemLabel: "Testimonial",
        fields: [
          { name: "quote", label: "Quote", type: "textarea" },
          { name: "name", label: "Name", type: "text" },
          { name: "relation", label: "Relation (e.g. Parent of a Grade 6 student)", type: "text" },
          { name: "photo", label: "Portrait (optional)", type: "image", aspect: "1:1" },
        ],
      },
    ],
    defaults: {
      eyebrow: "From our families",
      heading: "Parent stories",
      parents: [
        {
          quote: "Our daughter has grown so much in confidence, not just in the classroom but in how she treats other people.",
          name: "Agape Parent",
          relation: "Parent of a Grade 6 student",
          photo: img("", ""),
        },
        {
          quote: "What stood out to us was how well the teachers know each child, not just their grades.",
          name: "Agape Parent",
          relation: "Parent of two Agape students",
          photo: img("", ""),
        },
      ],
    },
  }),

  "home.news": defineSection({
    page: "Homepage",
    label: "14. Latest news heading",
    description: "The stories themselves come from News. The three most recent published stories appear here.",
    fields: [...heading, { name: "linkLabel", label: "Link text", type: "text" }],
    defaults: { eyebrow: "News & stories", heading: "Life at Agape", linkLabel: "All stories" },
  }),

  "home.events": defineSection({
    page: "Homepage",
    label: "15. Upcoming events heading",
    description: "Events come from the Events list. Upcoming published events appear here.",
    fields: [...heading, { name: "emptyText", label: "Text when no events are scheduled", type: "text" }],
    defaults: { eyebrow: "What's on", heading: "Upcoming events", emptyText: "New dates will be published soon." },
  }),

  "home.principal": defineSection({
    page: "Homepage",
    label: "16. Principal's welcome",
    fields: [
      ...heading,
      { name: "photo", label: "Portrait", type: "image", aspect: "3:4" },
      { name: "message", label: "Message", type: "textarea" },
      { name: "signature", label: "Name / title", type: "text" },
      { name: "linkLabel", label: "Link text", type: "text" },
    ],
    defaults: {
      eyebrow: "From our leadership",
      heading: "Education is about who we help students become.",
      photo: img("/girl_grad.jpg", "Principal, Agape Academy International"),
      message:
        "Every student who walks through our gates carries a story still being written. Our task is not only to prepare them for examinations, but to help them become people of character, conviction and purpose, ready to serve Ghana and the world beyond it.",
      signature: "Principal, Agape Academy International",
      linkLabel: "Meet our leadership",
    },
  }),

  "home.cta": defineSection({
    page: "Homepage",
    label: "17. Admissions call to action",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "description", label: "Paragraph", type: "textarea" },
      { name: "primaryLabel", label: "Main button text", type: "text" },
      { name: "primaryUrl", label: "Main button link", type: "url" },
      { name: "secondaryLabel", label: "Second button text", type: "text" },
      { name: "secondaryUrl", label: "Second button link", type: "url" },
    ],
    defaults: {
      heading: "Could Agape be your child's next chapter?",
      description:
        "Come and experience our community, meet our teachers and discover an education built around academic excellence, character and purpose.",
      primaryLabel: "Start an Application",
      primaryUrl: "/admissions#how-to-apply",
      secondaryLabel: "Request Information",
      secondaryUrl: "/contact",
    },
  }),
};
