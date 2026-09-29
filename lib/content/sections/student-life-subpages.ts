import { defineSection, img, Field } from "../fields";

export const subpageFields: Field[] = [
  { name: "eyebrow", label: "Hero: small label", type: "text" },
  { name: "title", label: "Hero: heading", type: "text" },
  { name: "highlight", label: "Hero: heading (faded part)", type: "text" },
  { name: "description", label: "Hero: paragraph", type: "textarea" },
  { name: "hero", label: "Hero photo", type: "image", aspect: "16:9" },
  {
    name: "stats",
    label: "Hero figures",
    type: "list",
    itemLabel: "Figure",
    fields: [
      { name: "value", label: "Figure", type: "text" },
      { name: "label", label: "Label", type: "text" },
    ],
  },
  { name: "introEyebrow", label: "Intro: small label", type: "text" },
  { name: "introTitle", label: "Intro: heading", type: "text" },
  { name: "introText", label: "Intro: paragraph", type: "textarea" },
  {
    name: "features",
    label: "Feature blocks",
    type: "list",
    itemLabel: "Feature",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "photo", label: "Photo", type: "image", aspect: "4:3" },
    ],
  },
  { name: "experienceEyebrow", label: "Experience: small label", type: "text" },
  { name: "experienceTitle", label: "Experience: heading", type: "text" },
  { name: "experienceText", label: "Experience: paragraph", type: "textarea" },
  { name: "listTitle", label: "List heading", type: "text" },
  { name: "listItems", label: "List items", type: "strings", itemLabel: "Item" },
  { name: "quote", label: "Quote", type: "textarea" },
  { name: "quoteLabel", label: "Quote attribution", type: "text" },
  { name: "ctaTitle", label: "Closing: heading", type: "text" },
  { name: "ctaText", label: "Closing: paragraph", type: "textarea" },
];

export const studentLifeSubpageSections = {
  "studentLife.clubs": defineSection({
    page: "Student Life",
    label: "11. Clubs page",
    fields: subpageFields,
    defaults: {
      eyebrow: "Clubs & Societies",
      title: "Find something",
      highlight: "worth pursuing.",
      description:
        "Clubs give students room to explore interests, develop new skills, build friendships and discover passions that may stay with them for years.",
      hero: img("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2400&q=90", "Students collaborating together"),

      stats: [
        { value: "01", label: "Explore" },
        { value: "02", label: "Create" },
        { value: "03", label: "Connect" },
        { value: "04", label: "Lead" },
      ],

      introEyebrow: "A place for curiosity",
      introTitle: "Interests become experiences.",
      introText:
        "School is more than completing lessons. Clubs give students opportunities to follow questions, experiment with ideas and spend time with people who share their interests. Whether a student is drawn to academics, creativity, technology, service or leadership, there should be space to explore.",

      features: [
        {
          title: "Academic clubs",
          text:
            "Students can extend classroom learning through communities built around subjects, ideas and intellectual curiosity.",
          photo: img("https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1800&q=90", "Students learning together"),
        },
        {
          title: "Creative spaces",
          text:
            "Creative clubs provide opportunities for students to experiment, perform, design and express themselves in different ways.",
          photo: img("https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1800&q=90", "Students participating in creative activities"),
        },
        {
          title: "Student-led ideas",
          text:
            "Students can learn valuable responsibility by helping organise activities, collaborate with peers and contribute ideas.",
          photo: img("https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=90", "Students working together"),
        },
      ],

      experienceEyebrow: "Explore",
      experienceTitle: "There is room to discover.",
      experienceText:
        "The goal is not simply to fill an afternoon. Clubs should give students meaningful opportunities to practise communication, teamwork, creativity and initiative.",

      listTitle: "Club possibilities",
      listItems: [
        "Academic & subject societies",
        "STEM & technology",
        "Creative arts",
        "Music & performance",
        "Reading & communication",
        "Faith & service",
        "Leadership & community",
        "Student-led initiatives",
      ],

      quote:
        "The right club can turn an interest into a confidence, a friendship or even a future ambition.",
      quoteLabel: "The Agape student experience",

      ctaTitle: "Give curiosity somewhere to go.",
      ctaText:
        "Discover a school environment where students are encouraged to explore who they are becoming.",
    },
  }),
  "studentLife.sports": defineSection({
    page: "Student Life",
    label: "12. Sports page",
    fields: subpageFields,
    defaults: {
      eyebrow: "Sports",
      title: "Compete with",
      highlight: "purpose.",
      description:
        "Sport gives students another classroom — one where discipline, teamwork, resilience and confidence are developed through movement and competition.",
      hero: img("/games_3.jpg", "Students participating in sport at Agape Academy International"),

      stats: [
        { value: "01", label: "Teamwork" },
        { value: "02", label: "Discipline" },
        { value: "03", label: "Resilience" },
        { value: "04", label: "Confidence" },
      ],

      introEyebrow: "More than competition",
      introTitle: "Every game teaches something.",
      introText:
        "Winning is only one part of sport. Students learn how to prepare, communicate, respond to setbacks, support teammates and keep improving. These habits extend far beyond the field.",

      features: [
        {
          title: "Train together",
          text:
            "Training creates opportunities for students to build consistency, responsibility and trust while working towards shared goals.",
          photo: img("/games_3.jpg", "Students taking part in sports"),
        },
        {
          title: "Compete with character",
          text:
            "Competition teaches students how to handle pressure, celebrate others and respond constructively when things do not go their way.",
          photo: img("https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1800&q=90", "Students competing in sport"),
        },
        {
          title: "Grow beyond the field",
          text:
            "The habits developed through sport — preparation, perseverance and teamwork — become part of a student's wider development.",
          photo: img("https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1800&q=90", "Students participating in athletics"),
        },
      ],

      experienceEyebrow: "The sporting experience",
      experienceTitle: "Move. Compete. Grow.",
      experienceText:
        "Agape's sporting environment is designed to give students opportunities to participate, improve and experience the responsibility of being part of a team.",

      listTitle: "What sport develops",
      listItems: [
        "Teamwork",
        "Leadership",
        "Physical confidence",
        "Discipline",
        "Resilience",
        "Communication",
        "Healthy competition",
        "Commitment",
      ],

      quote:
        "The field teaches lessons about preparation, courage and teamwork that no textbook can fully reproduce.",
      quoteLabel: "Sport at Agape",

      ctaTitle: "Find your team.",
      ctaText:
        "Come and experience a school where students have space to learn, compete and grow together.",
    },
  }),
  "studentLife.arts": defineSection({
    page: "Student Life",
    label: "13. Arts & Music page",
    fields: subpageFields,
    defaults: {
      eyebrow: "Arts & Music",
      title: "Make something",
      highlight: "meaningful.",
      description:
        "Music, drama and visual art give students a different language for thinking, communicating and understanding the world around them.",
      hero: img("https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=2400&q=90", "Students participating in creative arts"),

      stats: [
        { value: "01", label: "Create" },
        { value: "02", label: "Express" },
        { value: "03", label: "Perform" },
        { value: "04", label: "Imagine" },
      ],

      introEyebrow: "Creative development",
      introTitle: "Creativity needs room.",
      introText:
        "Students need opportunities to make, perform, experiment and communicate ideas. Arts education develops creative confidence while teaching patience, practice, collaboration and the courage to share something personal.",

      features: [
        {
          title: "Music",
          text:
            "Music gives students opportunities to develop discipline, listening skills, expression and confidence through practice and performance.",
          photo: img("https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=90", "Student participating in music"),
        },
        {
          title: "Drama",
          text:
            "Drama creates space for storytelling, collaboration and performance while helping students become more confident communicators.",
          photo: img("https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1800&q=90", "Students performing on stage"),
        },
        {
          title: "Visual art",
          text:
            "Visual art encourages students to observe carefully, experiment with ideas and communicate through colour, shape and form.",
          photo: img("https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1800&q=90", "Creative artwork and art materials"),
        },
      ],

      experienceEyebrow: "Creative life",
      experienceTitle: "Ideas become visible.",
      experienceText:
        "Creative experiences allow students to develop a sense of authorship — the confidence to say, make and perform something that began with their own imagination.",

      listTitle: "Creative opportunities",
      listItems: [
        "Music",
        "Drama & performance",
        "Visual arts",
        "Creative projects",
        "School performances",
        "Student showcases",
        "Collaborative productions",
        "Creative clubs",
      ],

      quote:
        "Creativity teaches students that there can be more than one way to see, solve and express an idea.",
      quoteLabel: "Arts & Music at Agape",

      ctaTitle: "Give creativity a stage.",
      ctaText:
        "Discover an environment where students can explore their creative voice alongside their academic journey.",
    },
  }),
  "studentLife.leadership": defineSection({
    page: "Student Life",
    label: "14. Leadership page",
    fields: subpageFields,
    defaults: {
      eyebrow: "Student Leadership",
      title: "Learn to",
      highlight: "lead.",
      description:
        "Leadership at Agape is about more than a title. Students learn to take responsibility, serve others, communicate clearly and contribute to their community.",
      hero: img("https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=2400&q=90", "Students working and leading together"),

      stats: [
        { value: "01", label: "Serve" },
        { value: "02", label: "Listen" },
        { value: "03", label: "Act" },
        { value: "04", label: "Inspire" },
      ],

      introEyebrow: "Character in action",
      introTitle: "Leadership begins with responsibility.",
      introText:
        "Students develop leadership by being trusted with real responsibilities. They learn that leadership is not simply about being visible — it is about listening, serving, following through and helping others succeed.",

      features: [
        {
          title: "Take responsibility",
          text:
            "Students can develop confidence by taking ownership of tasks, projects, events and responsibilities within the school community.",
          photo: img("https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=90", "Students collaborating in school"),
        },
        {
          title: "Serve others",
          text:
            "Service helps students understand leadership as contribution — using their abilities to make a positive difference for people around them.",
          photo: img("https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=90", "Students involved in community service"),
        },
        {
          title: "Find your voice",
          text:
            "Leadership opportunities encourage students to communicate ideas, represent others and become confident contributors to their community.",
          photo: img("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=90", "Students communicating in a group"),
        },
      ],

      experienceEyebrow: "Leadership in practice",
      experienceTitle: "Character becomes visible.",
      experienceText:
        "Leadership experiences allow students to practise the values that sit behind the Agape educational experience: responsibility, service, confidence and purpose.",

      listTitle: "Leadership opportunities",
      listItems: [
        "Student leadership",
        "Student Union",
        "Event organisation",
        "Peer collaboration",
        "Community service",
        "School representation",
        "Team leadership",
        "Student initiatives",
      ],

      quote:
        "Leadership is not about standing above others. It is about learning how to stand with them and contribute.",
      quoteLabel: "Student leadership at Agape",

      ctaTitle: "Give responsibility a purpose.",
      ctaText:
        "Explore an education where academic growth and character development move together.",
    },
  }),
  "studentLife.trips": defineSection({
    page: "Student Life",
    label: "15. Trips & Experiences page",
    fields: subpageFields,
    defaults: {
      eyebrow: "Trips & Experiences",
      title: "Take learning",
      highlight: "outside.",
      description:
        "Some lessons become more meaningful when students experience them first-hand. Trips and experiences connect learning with people, places, culture and the world beyond the school gates.",
      hero: img("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=90", "Students exploring the world together"),

      stats: [
        { value: "01", label: "Explore" },
        { value: "02", label: "Experience" },
        { value: "03", label: "Reflect" },
        { value: "04", label: "Remember" },
      ],

      introEyebrow: "Experiential learning",
      introTitle: "The world becomes part of the classroom.",
      introText:
        "Excursions and experiences can help students connect classroom ideas with real environments. They encourage observation, independence, curiosity and reflection while creating shared memories with classmates.",

      features: [
        {
          title: "See it first-hand",
          text:
            "Students can encounter environments, organisations and experiences that make academic ideas tangible and memorable.",
          photo: img("https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1800&q=90", "Students exploring together"),
        },
        {
          title: "Learn together",
          text:
            "Travelling and experiencing new environments creates opportunities for collaboration, communication and shared discovery.",
          photo: img("https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1800&q=90", "Students travelling together"),
        },
        {
          title: "Return with perspective",
          text:
            "Experiential learning becomes more powerful when students reflect on what they saw, experienced and learned.",
          photo: img("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=90", "Travel and educational experience"),
        },
      ],

      experienceEyebrow: "Beyond the classroom",
      experienceTitle: "Go further to understand more.",
      experienceText:
        "Trips can support academic learning while also helping students become more observant, adaptable and curious about the wider world.",

      listTitle: "Experience can include",
      listItems: [
        "Educational excursions",
        "Cultural experiences",
        "Field learning",
        "Community experiences",
        "Outdoor learning",
        "Educational visits",
        "Collaborative activities",
        "Reflection & discussion",
      ],

      quote:
        "The places students visit become part of the stories they tell about what they learned.",
      quoteLabel: "Experiential learning at Agape",

      ctaTitle: "Let curiosity lead the way.",
      ctaText:
        "Discover a school experience where learning can continue far beyond the classroom.",
    },
  }),
  "studentLife.studentUnion": defineSection({
    page: "Student Life",
    label: "16. Student Union page",
    fields: subpageFields,
    defaults: {
      eyebrow: "Student Union",
      title: "Your voice",
      highlight: "matters.",
      description:
        "The Student Union creates opportunities for students to participate in school life, represent their peers, organise initiatives and practise leadership.",
      hero: img("https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=2400&q=90", "Students together in a school community"),

      stats: [
        { value: "01", label: "Voice" },
        { value: "02", label: "Service" },
        { value: "03", label: "Leadership" },
        { value: "04", label: "Community" },
      ],

      introEyebrow: "Student voice",
      introTitle: "Belonging means participating.",
      introText:
        "A strong school community gives students opportunities to contribute to the environment they share. The Student Union provides a space for ideas, representation, organisation and student-led initiatives.",

      features: [
        {
          title: "Represent",
          text:
            "Students develop communication and responsibility by representing their peers and contributing ideas to the wider school community.",
          photo: img("https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1800&q=90", "Students discussing ideas"),
        },
        {
          title: "Organise",
          text:
            "Planning events and initiatives gives students practical experience in teamwork, communication and follow-through.",
          photo: img("https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1800&q=90", "Students organising an event"),
        },
        {
          title: "Contribute",
          text:
            "Student-led ideas can strengthen community life and give learners a sense of ownership over their school experience.",
          photo: img("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=90", "Students working together"),
        },
      ],

      experienceEyebrow: "Community in action",
      experienceTitle: "Students become contributors.",
      experienceText:
        "The Student Union connects student voice with responsibility, giving young people opportunities to practise leadership in a real community.",

      listTitle: "Student Union opportunities",
      listItems: [
        "Student representation",
        "Events & activities",
        "Student initiatives",
        "Community building",
        "Peer collaboration",
        "Leadership experience",
        "Communication",
        "Service",
      ],

      quote:
        "A school community becomes stronger when students know that their ideas, effort and contribution have a place.",
      quoteLabel: "Student Union at Agape",

      ctaTitle: "Be part of the community.",
      ctaText:
        "Discover an environment where students are encouraged to participate, contribute and grow together.",
    },
  }),
};
