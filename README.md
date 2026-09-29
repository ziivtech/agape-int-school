# Agape Academy International
## Official Website & Digital Platform

Agape Academy International (AAI) is a premium international school website designed to communicate the school's academic excellence, Christian foundation, student experience, global outlook, and community.

The website combines a modern editorial visual identity with smooth motion, responsive layouts, structured content, and a foundation for a future content management system (CMS).

---

# 1. Project Overview

The Agape Academy International website has been designed as more than a traditional school website.

It serves as a digital representation of the Agape Academy brand and provides prospective parents, students, current families, alumni, staff, and visitors with a clear way to discover the school's:

- Educational philosophy
- Academic programmes
- Christian education
- Student life
- Admissions process
- Campus and facilities
- News and stories
- Events
- Global opportunities
- Contact information

The visual direction is intentionally premium, editorial, warm, modern, and international while remaining aligned with Agape Academy International's Christian identity.

The experience is fully responsive and designed to work across:

- Mobile phones
- Tablets
- Laptops
- Desktop computers
- Large-screen displays

---

# 2. Technology

The website is built using modern web technologies designed for performance, scalability, maintainability, and future CMS integration.

### Core technology

- **Next.js 14**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **Next Font**
- **App Router**

### Typography

The current visual system uses:

- **DM Serif Display** — editorial/display typography
- **Manrope** — body text, navigation and interface elements

This combination provides the website with a premium editorial character while maintaining excellent readability.

---

# 3. Website Architecture

The website uses Next.js App Router.

The primary structure is:

```text
app/
├── page.tsx
├── about/
├── academics/
├── student-life/
├── faith-and-character/
├── admissions/
├── gallery/
├── news/
├── events/
├── contact/
├── privacy/
├── safeguarding/
└── accessibility/

Homepage

The homepage acts as the main introduction to Agape Academy International.

It brings together key aspects of the school including:

Hero introduction
School story
Educational journey
Academic excellence
Christian education
Global perspective
Student life
Student leadership
Wellbeing
Campus
Gallery
Global pathways
Student stories
Parent stories
News
Events
Admissions calls-to-action

The homepage is designed to guide visitors naturally toward deeper sections of the website.

About

The About section introduces the identity and philosophy of Agape Academy International.

It can contain:

School overview
Mission and vision
Educational philosophy
Leadership
School values
History
What makes Agape different
Academics

The Academics section communicates the school's educational offering.

It is structured to support information about:

Early Years
Primary
Middle School
High School
Curriculum
Learning support
University pathways
Academic expectations
Educational journey

The website can also showcase the school's use of the Abeka curriculum, including curriculum information, academic structure, and links to relevant external resources.

Student Life

Student Life is designed to communicate that education at Agape extends beyond the classroom.

The section can cover:

Clubs
Sports
Arts & Music
Student Leadership
Trips & Experiences
Student Union
Student activities
Community participation
Student development

The Student Life architecture also supports dedicated subpages for individual activities.

Example:

/student-life/clubs
/student-life/sports
/student-life/arts
/student-life/leadership
/student-life/trips
/student-life/student-union

This allows each activity to eventually have its own rich content, photography, videos, stories, schedules, and updates.

5. Faith & Character

This section communicates the Christian foundation of Agape Academy International.

It can be used for:

Christian education
Chapel
Character development
Faith formation
Service
School values
Christian community

The section is designed to communicate the school's faith-based identity alongside its academic offering.

6. Admissions

The Admissions section is designed around the parent journey.

It can eventually provide:

How to apply
Admission requirements
Application process
Required documents
Important dates
Tuition and fees
Scholarships
Frequently asked questions
Campus visits
Contacting admissions
Application CTA

The admissions content should be connected to the school's actual admission process before launch.

7. Gallery

The Gallery provides a visual representation of life at Agape Academy International.

The architecture supports categories such as:

Campus
Classrooms
Academics
Student Life
Sports
Arts
Chapel
Events
Graduation
General school photography

The gallery is designed to eventually be powered by the CMS so that authorised staff can upload and manage photographs without editing the website code.

8. News & Journal

The News section has been designed as an editorial-style school journal rather than a basic list of announcements.

It can showcase:

School news
Academic achievements
Student stories
Chapel reflections
Sports
Arts
Events
Community stories
School announcements
Perspectives from the Agape community

The visual design uses large editorial typography, photography, featured stories, categories, and motion to create a premium magazine-like experience.

Example article routes:

/news/science-fair
/news/chapel-series
/news/sports-day

The news architecture can later be connected directly to the CMS.

9. Events

The Events section can be used to communicate important school dates and activities.

Examples include:

Academic events
Sports events
School celebrations
Parent meetings
Chapel events
Open days
Graduation
Trips
Admissions events

Future CMS integration can allow authorised staff to create, edit, publish, and remove events without developer involvement.

10. Contact

The Contact page provides visitors with a direct way to communicate with Agape Academy International.

It is designed to support:

Contact form
Phone
Email
School location
Google Maps / location information
Admissions enquiries
General enquiries

The page is fully responsive and designed for easy use on mobile devices.

11. Alumni

The website architecture also supports a dedicated Alumni section.

The Alumni area can eventually include:

Alumni stories
Graduate destinations
Alumni achievements
Alumni events
Alumni network
University pathways
Alumni contributions to the school community

Example route:

/alumni
# 12. Admin: CMS & CRM

Staff manage the site at **/admin**. Everything visitors see — text, photos, news, events, the gallery, contact details — is editable there, and every form on the site feeds the enquiries CRM.

| Area | What it does | Roles |
|---|---|---|
| Dashboard | New enquiries, pipeline totals, stock photos still to replace, recent activity | all |
| Enquiries | Every contact / admissions / visit / alumni form submission. Status pipeline (New → Contacted → Visit booked → Applied → Enrolled / Closed), owner, notes timeline, CSV export | admin, admissions |
| Website content | Every section of every page, grouped by page. Save = live immediately | admin, editor |
| Photos & media | Every image on the site in one grid, stock photos flagged; the photo gallery | admin, editor |
| News | Stories with drafts, publish/unpublish, featured story, cover photo | admin, editor |
| Events | School calendar; past events drop off the site automatically | admin, editor |
| Staff accounts | Add staff, set roles, reset passwords, deactivate | admin |

### How content works

- Each editable section is declared once in `lib/content/sections/*.ts` with its fields and **default wording** (the text the site was built with).
- The database (`content_sections`) only stores sections staff have edited; anything else shows the defaults. "Reset" in the editor deletes the stored copy.
- Public pages are statically generated and cached. Saving in the admin calls `revalidateTag`, so the change is live on the next page load — no redeploy.
- To add a new editable section: add it to a file in `lib/content/sections/`, register it in `lib/content/registry.ts`, and read it in a component with `useSection("your.key")`. It appears in the admin automatically.

### Security

- Staff sign in with their own email and password (scrypt-hashed). Sessions are signed JWT cookies (`AUTH_SECRET`), 12-hour expiry.
- `middleware.ts` blocks `/admin` and `/api/admin` without a valid session; each API route also checks the role and that the account is still active.
- The public enquiry endpoint has a honeypot field and a per-IP rate limit.

# 13. Setup & deployment (Neon + Vercel)

**Stack:** Next.js 14 on Vercel · Neon Postgres via Drizzle ORM (`@neondatabase/serverless` HTTP driver) · Cloudinary for uploads · optional Resend for enquiry emails.

### First deploy

1. **Create the database.** In Vercel › Storage, add **Neon** and connect it to the project (this sets `DATABASE_URL`). Or create a project at neon.tech and copy the *pooled* connection string.
2. **Set environment variables** in Vercel (see `.env.example`): `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, and optionally the `RESEND_*` / `ENQUIRY_*` ones.
3. **Create the tables** from your machine:
   ```bash
   pnpm install
   cp .env.example .env.local   # paste the same DATABASE_URL
   pnpm db:migrate
   ```
4. **Deploy** (push to the connected Git branch).
5. **Create the first admin.** Visit `/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Because no accounts exist yet, this creates the admin account. Then change the password under your name, add other staff under *Staff accounts*, and remove `ADMIN_PASSWORD` from Vercel.

### Cloudinary

Create an **unsigned upload preset** (Settings › Upload › Upload presets) and put its name in `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Images are resized and converted to WebP in the browser before upload; delivery adds `f_auto,q_auto` automatically.

### Changing the database schema

Edit `lib/db/schema.ts`, then:

```bash
pnpm db:generate   # writes a new SQL file to drizzle/
pnpm db:migrate    # applies it to the database in .env.local
```

Commit the `drizzle/` folder. `pnpm db:studio` opens a browser view of the data.

### Local development

```bash
pnpm install
cp .env.example .env.local   # fill in values (a Neon branch works well for dev)
pnpm db:migrate
pnpm dev
```

Without `DATABASE_URL` the public site still runs using the default content; the admin shows a "database not connected" notice.
